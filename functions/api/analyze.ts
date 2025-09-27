export const onRequestPost: PagesFunction<{ GEMINI_API_KEY: string }> = async (ctx) => {
  try {
    const { request, env } = ctx;
    const body = await request.json().catch(() => null) as { imageBase64?: string } | null;

    if (!body?.imageBase64) {
      return new Response(JSON.stringify({ error: 'Missing imageBase64' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const apiKey = env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Server not configured: GEMINI_API_KEY missing' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    // Basic validation/strip prefix
    const data = body.imageBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
    if (data.length < 100) {
      return new Response(JSON.stringify({ error: 'Invalid image data' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const MODEL = 'gemini-2.5-flash';
    const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

    const prompt = `Return a concise JSON with these sections and numeric fields when applicable:
{
  "overallHealthScore": number (0-100),
  "structuralAnalysis": {
    "hairGrowthCycle": number[6],
    "curlPatternDistribution": [{"Straight": number}, {"Wavy": number}, {"Curly": number}, {"Coily": number}],
    "growthPhaseDistribution": [{"Anagen": number}, {"Catagen": number}, {"Telogen": number}]
  },
  "microscopicAnalysis": {
    "cuticleLayerScore": number,
    "shaftStructure": { "integrity": number, "pattern": string },
    "medullaAnalysis": { "continuity": number },
    "surfaceMapping": { "texture": string, "damage": string, "textureScore"?: number, "damageScore"?: number, "protectionLevel"?: number }
  },
  "metrics": { "hairType"?: string, "scalpCondition"?: string, "porosity"?: string }
}`;

    const reqBody = {
      contents: [
        {
          parts: [
            { text: prompt },
            { inline_data: { mime_type: 'image/jpeg', data } },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        topK: 32,
        topP: 0.85,
        maxOutputTokens: 8192,
        responseMimeType: 'application/json',
      },
    };

    const res = await fetch(`${BASE_URL}/${MODEL}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqBody),
    });

    if (!res.ok) {
      const msg = await res.text().catch(() => '');
      return new Response(JSON.stringify({ error: `Gemini request failed: ${res.status} ${res.statusText}`, details: msg }), { status: 502, headers: { 'Content-Type': 'application/json' } });
    }

    const dataResp = await res.json();

    // Gemini 2.5 with responseMimeType returns JSON in parts[0].text as stringified JSON
    let parsed: any = null;
    try {
      const text = dataResp.candidates?.[0]?.content?.parts?.[0]?.text;
      parsed = typeof text === 'string' ? JSON.parse(text) : dataResp;
    } catch (_) {
      parsed = dataResp;
    }

    // Stamp minimal metadata
    parsed._modelUsed = MODEL;
    parsed._analysisTimestamp = new Date().toISOString();

    return new Response(JSON.stringify(parsed), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Unexpected error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
