export async function generateIdeas(niche: string, platform: string) {
    const prompt = `
You are a viral social media strategist.

Generate 10 short-form video ideas for:
Niche: ${niche}
Platform: ${platform}
Audience: Indian creators

Each idea must include:
1. Scroll-stopping hook
2. Content angle
3. CTA

Keep language simple, conversational, and India-friendly.
Return the result as a JSON array of objects with keys: hook, angle, cta.
Do NOT output anything else besides the JSON.
`

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "HTTP-Referer": "https://tapryt.com", // Placeholder
                "X-Title": "Tapryt",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "tngtech/deepseek-r1t2-chimera:free",
                "messages": [
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`OpenRouter API error: ${response.statusText}`);
        }

        const data = await response.json();
        const content = data.choices[0]?.message?.content;

        // Simple parsing to extract JSON if model adds markdown blocks
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        return JSON.parse(content);
    } catch (error) {
        console.error("Error generating ideas:", error);
        return [];
    }
}
