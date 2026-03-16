const WHATSAPP_API_URL = 'https://graph.facebook.com/v18.0';

export async function sendMessage(phone: string, text: string) {
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const token = process.env.WHATSAPP_API_TOKEN;

    if (!phoneNumberId || !token) {
        console.log('[WhatsApp Mock] To:', phone, 'Message:', text);
        return { success: true, mock: true };
    }

    try {
        const response = await fetch(
            `${WHATSAPP_API_URL}/${phoneNumberId}/messages`,
            {
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
            }
        );

        const data = await response.json();
        return { success: response.ok, data };
    } catch (error) {
        console.error('WhatsApp send error:', error);
        return { success: false, error };
    }
}
