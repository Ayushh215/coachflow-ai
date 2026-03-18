const WHATSAPP_API_URL = 'https://graph.facebook.com/v22.0';

export async function sendMessage(phone: string, text: string) {
    // 1. Force the IDs to be clean strings
    const phoneNumberId = '1049827054879399';
    const token = (process.env.WHATSAPP_TOKEN || '').trim().replace(/^['"]|['"]$/g, '');

    if (!token) {
        console.error("[WhatsApp] ❌ CRITICAL: WHATSAPP_TOKEN is empty in Vercel environment!");
        return { success: false, error: "Missing Token" };
    }

    try {
        const url = `${WHATSAPP_API_URL}/${phoneNumberId}/messages`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messaging_product: 'whatsapp',
                to: phone.replace(/\D/g, ''), // Removes any '+' or spaces
                type: 'text',
                text: { body: text }
            }),
        });

        const data = await response.json();

        if (response.ok) {
            console.log(`[WhatsApp] ✅ Success! ID: ${data.messages[0].id}`);
            return { success: true, data };
        } else {
            console.error(`[WhatsApp] ❌ API Failure:`, JSON.stringify(data));
            return { success: false, error: data };
        }
    } catch (error) {
        console.error('[WhatsApp] ❌ Network Error:', error);
        return { success: false, error };
    }
}