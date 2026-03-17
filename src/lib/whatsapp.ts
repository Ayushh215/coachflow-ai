const WHATSAPP_API_URL = 'https://graph.facebook.com/v22.0';

export async function sendMessage(phone: string, text: string) {
    const rawPhoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || '1049827054879399';
    const phoneNumberId = rawPhoneNumberId.trim().replace(/^['"]|['"]$/g, '');
    
    // Support both env var names for compatibility, and strip accidental whitespace/quotes
    const rawToken = process.env.WHATSAPP_TOKEN || process.env.WHATSAPP_API_TOKEN || '';
    const token = rawToken.trim().replace(/^['"]|['"]$/g, '');

    if (!phoneNumberId || !token) {
        console.warn(`[WhatsApp] Missing config — WHATSAPP_PHONE_NUMBER_ID: ${phoneNumberId ? '✅' : '❌'}, WHATSAPP_TOKEN: ${token ? '✅' : '❌'}`);
        console.log('[WhatsApp Mock] To:', phone, 'Message:', text);
        return { success: true, mock: true };
    }

    try {
        const url = `${WHATSAPP_API_URL}/${phoneNumberId}/messages`;
        console.log(`[WhatsApp] Sending real message to ${phone} via ${url}`);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messaging_product: 'whatsapp',
                to: phone,
                type: 'text',
                text: { body: text },
            }),
        });

        const data = await response.json();

        if (response.ok) {
            console.log(`[WhatsApp] ✅ Message sent successfully to ${phone}`);
            return { success: true, data };
        } else {
            console.error(`[WhatsApp] ❌ API error (${response.status}):`, JSON.stringify(data));
            return { success: false, error: data };
        }
    } catch (error) {
        console.error('[WhatsApp] ❌ Send error:', error);
        return { success: false, error };
    }
}
