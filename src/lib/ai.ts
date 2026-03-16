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
                    content: `You are a WhatsApp bot assistant for an Indian coaching institute. 
Extract the relevant value from the user's message.
Current step: ${currentStep}
- If step is 'awaiting_class': return only the class number (9/10/11/12) or null
- If step is 'awaiting_name': return the student name or null  
- If step is 'awaiting_course': return the subject/course or null
Respond with ONLY the extracted value or the word null. No explanation.`,
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
