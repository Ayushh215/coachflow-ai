import { NextRequest, NextResponse } from 'next/server';
import { sendMessage } from '@/lib/whatsapp';
import { query } from '@/lib/db';

// WhatsApp webhook verification
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

    if (mode === 'subscribe' && token === verifyToken) {
        return new NextResponse(challenge, { status: 200 });
    }

    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}

// Handle incoming WhatsApp messages from Meta Cloud API
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // 1. Verify this is a WhatsApp API webhook event
        if (body.object !== 'whatsapp_business_account') {
            return NextResponse.json({ status: 'ignored' }, { status: 200 });
        }

        // 2. Parse Meta's payload structure
        const entry = body.entry?.[0];
        const changes = entry?.changes?.[0];
        const value = changes?.value;
        const messages = value?.messages;

        // Meta sends status updates (delivered, read, sent) that we want to acknowledge but ignore
        if (!messages || messages.length === 0) {
            return NextResponse.json({ status: 'ok' });
        }

        const message = messages[0];
        
        // We only support text messages for this automation
        if (message.type !== 'text') {
            return NextResponse.json({ status: 'ignored_non_text' });
        }

        const phone = message.from;
        const text = message.text?.body?.trim() || '';

        if (!text) {
             return NextResponse.json({ status: 'empty_text' });
        }

        // 3. Resolve owner from phone_number_id (multi-tenant)
        const phoneNumberId = value?.metadata?.phone_number_id;
        if (!phoneNumberId) {
            console.error('❌ No phone_number_id in webhook payload');
            return NextResponse.json({ status: 'ok' });
        }

        const ownerResult = await query(
            'SELECT * FROM owners WHERE whatsapp_phone_number_id = $1',
            [phoneNumberId]
        );

        if (ownerResult.rows.length === 0) {
            console.warn(`⚠️ No owner found for phone_number_id: ${phoneNumberId}`);
            return NextResponse.json({ status: 'ok' });
        }

        const owner = ownerResult.rows[0];

        // 4. Forward the message to our existing state machine
        const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        
        const stateMachineResponse = await fetch(`${base}/api/whatsapp-lead`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone, message: text, owner_id: owner.id })
        });

        if (!stateMachineResponse.ok) {
            const errorText = await stateMachineResponse.text();
            console.error('❌ Failed to process state machine:', errorText);
            return NextResponse.json({ status: 'error', reason: 'state_machine_failed' }, { status: 500 });
        }

        const data = await stateMachineResponse.json();
        const replyText = data.reply;

        // 5. Send the reply using Meta Graph API if the state machine provided one
        if (replyText) {
             const result = await sendMessage(phone, replyText);
             if (!result.success) {
                 console.error('❌ Failed to send WhatsApp message via Meta API', result.error);
             }
        }

        return NextResponse.json({ status: 'ok' });
    } catch (error) {
        console.error('Webhook payload processing error:', error);
        return NextResponse.json({ status: 'error' }, { status: 500 });
    }
}
