// This runs on Vercel's server, never in the visitor's browser.
// Your real Gemini API key lives only in an environment variable here —
// it is never sent to, or visible from, the page itself.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'Server is missing GEMINI_API_KEY. Set it in Vercel project settings.' });
    return;
  }

  const { system, messages, responseSchema } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'Request must include a non-empty messages array.' });
    return;
  }

  const contents = messages.map(function (m) {
    return {
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    };
  });

  const model = 'gemini-3.5-flash';
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent';

  const requestBody = {
    contents: contents,
    generationConfig: { maxOutputTokens: 1500 }
  };
  if (system) {
    requestBody.systemInstruction = { parts: [{ text: system }] };
  }
  if (responseSchema) {
    requestBody.generationConfig.responseMimeType = 'application/json';
    requestBody.generationConfig.responseSchema = responseSchema;
  }

  try {
    const upstream = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      body: JSON.stringify(requestBody)
    });

    const data = await upstream.json();

    if (!upstream.ok) {
      const message = (data.error && data.error.message) ? data.error.message : 'Gemini API error';
      res.status(upstream.status).json({ error: message });
      return;
    }

    const parts = (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) || [];
    const text = parts.map(function (p) { return p.text || ''; }).join('\n').trim();

    res.status(200).json({ content: [{ type: 'text', text: text }] });
  } catch (err) {
    res.status(500).json({ error: 'Upstream request failed: ' + err.message });
  }
}
