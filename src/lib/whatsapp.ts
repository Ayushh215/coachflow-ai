const WHATSAPP_API_URL = 'https://graph.facebook.com/v22.0';

export async function sendMessage(phone: string, text: string) {
    // 1. Force the IDs to be clean strings
    const phoneNumberId = '1049827054879399';
    const token = (process.env.WHATSAPP_TOKEN || '').trim().replace(/^['"]|['"]$/g, '');

    // 2. DEBUG LOG (Check your Vercel logs for these)
    console.log(`[WhatsApp Debug] Target Phone: ${phone}`);
    console.log(`[WhatsApp Debug] Token Length: ${token.length}, First 5 chars: ${token.substring(0, 5)}`); // To verify Vercel is reading it correctly

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
                type: 'template',
                template: {
                    name: 'hello_world',
                    language: { code: 'en_US' }
                }
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