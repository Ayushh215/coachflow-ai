import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { extractIntent } from '@/lib/ai';
import { sendMessage } from '@/lib/whatsapp';

// ─── Class Parsing ───────────────────────────────────────────────────────────

const CLASS_OPTIONS = [
    { label: 'Class 9', optionNum: '1', classNum: '9', words: ['nine', 'ninth', '9th'] },
    { label: 'Class 10', optionNum: '2', classNum: '10', words: ['ten', 'tenth', '10th'] },
    { label: 'Class 11', optionNum: '3', classNum: '11', words: ['eleven', 'eleventh', '11th'] },
    { label: 'Class 12', optionNum: '4', classNum: '12', words: ['twelve', 'twelfth', '12th'] },
];

function parseClassInput(raw: string): string | null {
    const text = raw.toLowerCase().trim();

    // 1. Exact option number (single digit)
    for (const opt of CLASS_OPTIONS) {
        if (text === opt.optionNum) return opt.label;
    }

    // 2. Exact class number
    for (const opt of CLASS_OPTIONS) {
        if (text === opt.classNum) return opt.label;
    }

    // 3. Pattern: "class 10", "class10", "10th", "10th class", etc.
    const stripped = text.replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
    for (const opt of CLASS_OPTIONS) {
        const patterns = [
            `class${opt.classNum}`,
            `${opt.classNum}thclass`,
            `${opt.classNum}th`,
            ...opt.words,
        ];
        if (patterns.includes(stripped)) return opt.label;
    }

    // 4. Loose word match (e.g. "I want class ten")
    for (const opt of CLASS_OPTIONS) {
        for (const word of opt.words) {
            if (text.includes(word)) return opt.label;
        }
    }

    return null;
}

// ─── Phone Validation ────────────────────────────────────────────────────────

function isValidPhone(phone: string): boolean {
    return /^[\d+\-\s()]{7,20}$/.test(phone.trim());
}

// ─── Messages ────────────────────────────────────────────────────────────────

const MESSAGES = {
    welcome: (instituteName: string) =>
        `🎓 Welcome to ${instituteName}!\n\nWhich class are you interested in?\n\n1️⃣ Class 9\n2️⃣ Class 10\n3️⃣ Class 11\n4️⃣ Class 12\n\nPlease reply with a number (1-4) or the class name.`,

    invalidClass: `I'm sorry, I didn't understand that. Please choose one of the options:\n\n1️⃣ Class 9\n2️⃣ Class 10\n3️⃣ Class 11\n4️⃣ Class 12\n\nReply with a number (1-4) or type the class (e.g. "Class 10").`,

    askName: `📝 What is the student's name?`,

    invalidName: `Please enter a valid name (at least 2 characters).\n\n📝 What is the student's name?`,

    askCourse: `📚 Which subject or course are you interested in?\n\n(e.g. Mathematics, Science, Full Course, JEE/NEET Prep)`,

    invalidCourse: `Please enter a valid course or subject name.\n\n📚 Which subject or course are you interested in?`,

    alreadyRegistered: `👋 Welcome back!\n\nYour inquiry is already registered with us. Our team will contact you shortly.\n\nIf you'd like to register another student, reply with "new".`,

    classSelected: (cls: string) =>
        `✅ Great choice — *${cls}*!\n\n📝 What is the student's name?`,

    nameReceived: (name: string) =>
        `👋 Nice to meet you, *${name}*!\n\n📚 Which subject or course are you interested in?\n\n(e.g. Mathematics, Science, Full Course, JEE/NEET Prep)`,

    confirmation: (name: string, cls: string, course: string, phone: string) =>
        `✅ Thank you, *${name}*!\n\nYour inquiry has been registered:\n📋 Class: ${cls}\n📚 Course: ${course}\n📞 Phone: ${phone}\n\n🙏 Our team will contact you shortly!`,

    adminNotification: (name: string, cls: string, course: string, phone: string) =>
        `🎉 New Lead!\nName: ${name}\nClass: ${cls}\nCourse: ${course}\nPhone: ${phone}`,
};

// ─── POST /api/whatsapp-lead ─────────────────────────────────────────────────

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { phone, message, owner_id } = body;

        // ── Input validation ──────────────────────────────────────────────────
        if (!phone || typeof phone !== 'string') {
            return NextResponse.json({ error: 'phone is required' }, { status: 400 });
        }
        if (!message || typeof message !== 'string') {
            return NextResponse.json({ error: 'message is required' }, { status: 400 });
        }
        if (!owner_id) {
            return NextResponse.json({ error: 'owner_id is required' }, { status: 400 });
        }
        if (!isValidPhone(phone)) {
            return NextResponse.json({ error: 'Invalid phone number format' }, { status: 400 });
        }

        const text = message.trim();
        console.log(`\n📱 [INCOMING] Phone: ${phone} | Owner: ${owner_id} | Message: "${text}"`);

        // ── Fetch owner details ───────────────────────────────────────────────
        const ownerResult = await query('SELECT institute_name, admin_phone FROM owners WHERE id = $1', [owner_id]);
        if (ownerResult.rows.length === 0) {
            console.error(`❌ [ERROR] Owner not found: ${owner_id}`);
            return NextResponse.json(
                { error: 'Owner not found' },
                { status: 404 }
            );
        }
        const instituteName: string = ownerResult.rows[0].institute_name || 'Coaching Institute';
        const adminPhone: string | null = ownerResult.rows[0].admin_phone || null;

        // ── Get or create conversation ────────────────────────────────────────
        const convResult = await query(
            `INSERT INTO conversations (owner_id, phone, step, data)
       VALUES ($1, $2, 'welcome', '{}')
       ON CONFLICT (owner_id, phone) DO UPDATE SET updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
            [owner_id, phone]
        );

        const conversation = convResult.rows[0];
        const step: string = conversation.step;
        const data: Record<string, string> = conversation.data || {};

        console.log(`📊 [STATE]    Phone: ${phone} | Step: ${step} | Data: ${JSON.stringify(data)}`);

        let reply = '';
        let newStep = step;
        let newData = { ...data };

        // ── State machine ─────────────────────────────────────────────────────
        switch (step) {
            // ·· WELCOME ·····················································
            case 'welcome': {
                reply = MESSAGES.welcome(instituteName);
                newStep = 'awaiting_class';
                break;
            }

            // ·· AWAITING CLASS ··············································
            case 'awaiting_class': {
                const intent = await extractIntent(text, 'awaiting_class');
                // Use parseClassInput to strictly validate the final text (AI output or raw user text)
                const selectedClass = parseClassInput(intent || text);
                
                if (!selectedClass) {
                    reply = MESSAGES.invalidClass;
                    // stay in awaiting_class
                    break;
                }
                newData.class = selectedClass;
                reply = MESSAGES.classSelected(selectedClass);
                newStep = 'awaiting_name';
                break;
            }

            // ·· AWAITING NAME ···············································
            case 'awaiting_name': {
                const intent = await extractIntent(text, 'awaiting_name');
                const finalName = intent || text;
                
                if (finalName.length < 2) {
                    reply = MESSAGES.invalidName;
                    break;
                }
                newData.student_name = finalName;
                reply = MESSAGES.nameReceived(finalName);
                newStep = 'awaiting_course';
                break;
            }

            // ·· AWAITING COURSE ·············································
            case 'awaiting_course': {
                const intent = await extractIntent(text, 'awaiting_course');
                const finalCourse = intent || text;
                
                if (finalCourse.length < 2) {
                    reply = MESSAGES.invalidCourse;
                    break;
                }
                newData.course_interest = finalCourse;

                // Create / update lead (UPSERT prevents duplicates)
                try {
                    await query(
                        `INSERT INTO leads (owner_id, student_name, parent_phone, class, course_interest, status)
             VALUES ($1, $2, $3, $4, $5, 'new')
             ON CONFLICT (owner_id, parent_phone) DO UPDATE SET
               student_name   = EXCLUDED.student_name,
               class          = EXCLUDED.class,
               course_interest = EXCLUDED.course_interest,
               status         = 'new'
             RETURNING *`,
                        [owner_id, newData.student_name, phone, newData.class, newData.course_interest]
                    );
                    console.log(`🎉 [LEAD CREATED] Name: ${newData.student_name} | Class: ${newData.class} | Course: ${newData.course_interest} | Phone: ${phone}`);

                    // Notify admin if admin_phone is configured
                    if (adminPhone) {
                        const notification = MESSAGES.adminNotification(
                            newData.student_name, newData.class, newData.course_interest, phone
                        );
                        const notifyResult = await sendMessage(adminPhone, notification);
                        if (!notifyResult.success) {
                            console.error('⚠️ [NOTIFY] Failed to send admin notification:', notifyResult.error);
                        } else {
                            console.log(`📲 [NOTIFY] Admin notified at ${adminPhone}`);
                        }
                    }
                } catch (dbError) {
                    console.error('❌ [DB ERROR] Failed to create lead:', dbError);
                    reply = 'Sorry, something went wrong while saving your information. Please try again later.';
                    break;
                }

                reply = MESSAGES.confirmation(newData.student_name, newData.class, newData.course_interest, phone);
                newStep = 'complete';
                newData = {};
                break;
            }

            // ·· COMPLETE (returning user) ····································
            case 'complete': {
                const restart = ['new', 'restart', 'start', 'reset', 'hi', 'hello'].includes(text.toLowerCase());
                if (restart) {
                    reply = MESSAGES.welcome(instituteName);
                    newStep = 'awaiting_class';
                    newData = {};
                    break;
                }
                reply = MESSAGES.alreadyRegistered;
                break;
            }

            // ·· UNKNOWN STATE → reset ·······································
            default: {
                reply = MESSAGES.welcome(instituteName);
                newStep = 'awaiting_class';
                newData = {};
            }
        }

        // ── Persist state ─────────────────────────────────────────────────────
        if (newStep !== step || JSON.stringify(newData) !== JSON.stringify(data)) {
            await query(
                `UPDATE conversations SET step = $1, data = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3`,
                [newStep, JSON.stringify(newData), conversation.id]
            );
        }

        console.log(`💬 [REPLY]    Phone: ${phone} | New Step: ${newStep}`);

        return NextResponse.json({ reply, state: newStep });
    } catch (error) {
        console.error('❌ [API ERROR] /api/whatsapp-lead:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
