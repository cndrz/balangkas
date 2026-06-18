const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

export async function generateTitles(keywords) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!apiKey || apiKey === 'your_groq_api_key_here') {
    throw new Error('GROQ API key not configured. Add VITE_GROQ_API_KEY to your .env file.');
  }

  const prompt = `You are a thesis advisor generating research titles. Given these keywords/topic: "${keywords}"

Generate exactly 3 distinct, professional, and research-worthy thesis titles. For each, provide a feasibility summary covering scope, complexity, and potential challenges.

Respond ONLY with valid JSON. No markdown, no code fences, no preamble. Use this exact structure:
{
  "titles": [
    {
      "title": "Full thesis title here",
      "feasibility": "Brief 2-3 sentence feasibility summary covering scope, complexity, and key challenges.",
      "level": "Feasible" | "Moderately Complex" | "Highly Ambitious"
    }
  ]
}`;

  const res = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      temperature: 0.8,
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Groq API error: ${res.status}`);
  }

  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content || '';

  try {
    const clean = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch {
    throw new Error('Failed to parse AI response. Please try again.');
  }
}
