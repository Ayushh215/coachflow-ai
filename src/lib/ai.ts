import OpenAI from 'openai';

const openai = process.env.OPENAI_API_KEY
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : null;

/**
 * Extracts the user intent/data based on the current conversational step using OpenAI.
 * Gracefully falls back to returning null if the API key is missing or the call fails.
 */
export async function extractIntent(userMessage: string, currentStep: string): Promise<string | null> {
    if (!openai) {
        return null;
    }

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: `You are a data extractor for a WhatsApp bot handling conversations in English and Indian languages (Hinglish/Hindi). 
Extract only the requested data point from the user's message, cleaning it up if necessary.
Current step: ${currentStep}
- 'awaiting_name': extract the person's name (e.g., "Rahul", "my name is Rahul" -> "Rahul")
- 'awaiting_course': extract the subject/course interest (e.g., "Mera course BCA hai" -> "BCA")
- 'awaiting_budget': extract the budget (e.g., "5 thousand", "5k-10k", "approx ₹5,000" -> "5k-10k")
- 'awaiting_timeline': extract the timeline (e.g., "next month", "abhi krna hai" -> "This month")
Respond with ONLY the exact, cleaned extracted value. Do not explain. If no valid data is found, output the word null.`,
                },
                {
                    role: 'user',
                    content: userMessage,
                },
            ],
            temperature: 0,
            max_tokens: 50,
        });

        const result = response.choices[0]?.message?.content?.trim();
        
        if (!result || result.toLowerCase() === 'null') {
            return null;
        }

        return result;
    } catch (error) {
        console.error('❌ [OpenAI ERROR] Failed to extract intent:', error);
        return null;
    }
}
