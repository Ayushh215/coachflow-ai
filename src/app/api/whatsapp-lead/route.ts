import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { extractIntent } from '@/lib/ai';
import { sendMessage } from '@/lib/whatsapp';

// ─── Phone Validation ────────────────────────────────────────────────────────

function isValidPhone(phone: string): boolean {
    return /^[\d+\-\s()]{7,20}$/.test(phone.trim());
}

// ─── Messages ────────────────────────────────────────────────────────────────

const MESSAGES = {
    welcome: `Hi! 👋 I'm here to help you find the right course. What's your name?`,
    askCourse: (name: string) => `Nice to meet you, ${name}! Which course are you interested in?`,
    askBudget: `What is your approximate budget for this course?\n1️⃣ Under ₹10,000\n2️⃣ ₹10,000 - ₹20,000\n3️⃣ Above ₹20,000`,
    askTimeline: `When are you planning to start?\n1️⃣ Immediately\n2️⃣ Within 1 month\n3️⃣ Just browsing`,
    askPhone: `Could you please share your 10-digit mobile number so our counselor can call you?`,
    confirmation: `Thanks! Our team will contact you shortly. 🙏`,
    invalidInput: `Sorry, I didn't quite catch that. Could you please specify again?`,
    invalidName: `Please enter your full name (First & Last name).`,
    invalidPhone: `Please enter a valid 10-digit mobile number.`,
    clarifyCourse: `Could you clarify which subject or course you're looking for? E.g. JEE, NEET, Math, English, etc.`,
    clarifyBudget: `Could you specify a clear budget amount? E.g. "1", "Under 10k", etc.`,
    clarifyTimeline: `Could you specify when you want to start? E.g. "1", "Immediately", etc.`,
    alreadyRegistered: `👋 Welcome back!\n\nYour inquiry is already registered. Our team will contact you shortly.\n\nType "restart" to start over.`,
    adminNotification: (name: string, course: string, budget: string, timeline: string, phone: string, altPhone?: string) =>
        `🎉 New Lead!\nName: ${name}\nCourse: ${course}\nBudget: ${budget}\nTimeline: ${timeline}\nWhatsApp: ${phone}${altPhone ? `\nAlt Phone: ${altPhone}` : ''}`,
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
        let step: string = conversation.step;
        let data: Record<string, string> = conversation.data || {};

        // ── Check inactive timeout (> 24 hours) ───────────────────────────────
        const lastUpdated = new Date(conversation.updated_at).getTime();
        const now = new Date().getTime();
        if (now - lastUpdated > 24 * 60 * 60 * 1000) {
            console.log(`⏱️ [TIMEOUT] Resetting inactive conversation for ${phone}`);
            step = 'welcome';
            data = {};
        }

        // ── Global Restart Command ────────────────────────────────────────────
        if (['restart', 'start over', 'reset', 'new'].includes(text.toLowerCase())) {
            step = 'welcome';
            data = {};
        }

        console.log(`📊 [STATE]    Phone: ${phone} | Step: ${step} | Data: ${JSON.stringify(data)}`);

        let reply = '';
        let newStep = step;
        let newData = { ...data };

        // ── State machine ─────────────────────────────────────────────────────
        switch (step) {
            // ·· WELCOME ·····················································
            case 'welcome': {
                reply = MESSAGES.welcome;
                newStep = 'awaiting_name';
                break;
            }

            // ·· AWAITING NAME ···············································
            case 'awaiting_name': {
                const intent = await extractIntent(text, 'awaiting_name');
                const finalName = intent || text;
                
                // Name validation expects at least 2 words
                if (finalName === 'UNCLEAR' || finalName.trim().split(/\s+/).length < 2) {
                    reply = MESSAGES.invalidName;
                    break;
                }
                newData.student_name = finalName;
                reply = MESSAGES.askCourse(finalName);
                newStep = 'awaiting_course';
                break;
            }

            // ·· AWAITING COURSE ·············································
            case 'awaiting_course': {
                const intent = await extractIntent(text, 'awaiting_course');
                const finalCourse = intent || text;
                
                if (finalCourse === 'UNCLEAR') {
                    reply = MESSAGES.clarifyCourse;
                    break;
                }
                if (finalCourse.length < 2) {
                    reply = MESSAGES.invalidInput;
                    break;
                }
                newData.course_interest = finalCourse;
                reply = MESSAGES.askBudget;
                newStep = 'awaiting_budget';
                break;
            }

            // ·· AWAITING BUDGET ·············································
            case 'awaiting_budget': {
                const intent = await extractIntent(text, 'awaiting_budget');
                const finalBudget = intent || text;
                
                if (finalBudget === 'UNCLEAR') {
                    reply = MESSAGES.clarifyBudget;
                    break;
                }
                if (finalBudget.length < 2) {
                    reply = MESSAGES.invalidInput;
                    break;
                }
                newData.budget = finalBudget;
                reply = MESSAGES.askTimeline;
                newStep = 'awaiting_timeline';
                break;
            }

            // ·· AWAITING TIMELINE ···········································
            case 'awaiting_timeline': {
                const intent = await extractIntent(text, 'awaiting_timeline');
                const finalTimeline = intent || text;
                
                if (finalTimeline === 'UNCLEAR') {
                    reply = MESSAGES.clarifyTimeline;
                    break;
                }
                if (finalTimeline.length < 1) {
                    reply = MESSAGES.invalidInput;
                    break;
                }
                newData.timeline = finalTimeline;
                reply = MESSAGES.askPhone;
                newStep = 'awaiting_phone';
                break;
            }

            // ·· AWAITING PHONE ·············································
            case 'awaiting_phone': {
                const cleanedPhone = text.replace(/\D/g, '');
                if (cleanedPhone.length !== 10) {
                    reply = MESSAGES.invalidPhone;
                    break;
                }
                newData.alt_phone = cleanedPhone;

                // Create / update lead (UPSERT prevents duplicates)
                try {
                    await query(
                        `INSERT INTO leads (owner_id, student_name, parent_phone, course_interest, budget, timeline, status)
             VALUES ($1, $2, $3, $4, $5, $6, 'new')
             ON CONFLICT (owner_id, parent_phone) DO UPDATE SET
               student_name   = EXCLUDED.student_name,
               course_interest = EXCLUDED.course_interest,
               budget         = EXCLUDED.budget,
               timeline       = EXCLUDED.timeline,
               status         = 'new'
             RETURNING *`,
                        [owner_id, newData.student_name, phone, newData.course_interest, newData.budget, newData.timeline]
                    );
                    console.log(`✅ Lead captured: ${newData.student_name} - ${newData.course_interest}`);

                    // Notify admin if admin_phone is configured
                    if (adminPhone) {
                        const notification = MESSAGES.adminNotification(
                            newData.student_name, newData.course_interest, newData.budget, newData.timeline, phone, newData.alt_phone
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

                reply = MESSAGES.confirmation;
                newStep = 'complete';
                newData = {};
                break;
            }

            // ·· COMPLETE (returning user) ····································
            case 'complete': {
                // Restart logic handled globally at the top
                reply = MESSAGES.alreadyRegistered;
                break;
            }

            // ·· UNKNOWN STATE → reset ·······································
            default: {
                reply = MESSAGES.welcome;
                newStep = 'awaiting_name';
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
