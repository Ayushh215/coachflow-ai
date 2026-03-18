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
If the user's message is gibberish, vague, or does not answer the question (e.g., "idk", "nothing", "what", random letters), output ONLY the word UNCLEAR.
Current step: ${currentStep}
- 'awaiting_name': extract the person's name (e.g., "Rahul", "my name is Rahul" -> "Rahul")
- 'awaiting_course': extract the subject/course interest. If it doesn't sound like a real subject/course, output UNCLEAR. (e.g., "Mera course BCA hai" -> "BCA")
- 'awaiting_budget': extract the budget and format strictly as '₹X,XXX' or '₹X,XXX-₹Y,YYY'. If no clear number is found, output UNCLEAR. (e.g., "5k", "5000" -> "₹5,000")
- 'awaiting_timeline': extract the timeline and normalize strictly to one of: "This month", "Next month", or "Just exploring". If unclear, output UNCLEAR.
Respond with ONLY the exact, cleaned extracted value or UNCLEAR. Do not explain.`,
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
        
        if (!result || result === 'UNCLEAR' || result.toLowerCase() === 'null') {
            return 'UNCLEAR';
        }

        return result;
    } catch (error) {
        console.error('❌ [OpenAI ERROR] Failed to extract intent:', error);
        return null;
    }
}
