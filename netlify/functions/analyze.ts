import type { Handler } from "@netlify/functions";

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method Not Allowed' }),
        headers: { 'Content-Type': 'application/json' }
      };
    }

    const body = event.body ? JSON.parse(event.body) : null;
    const imageBase64: string | undefined = body?.imageBase64;

    if (!imageBase64) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing imageBase64' }),
        headers: { 'Content-Type': 'application/json' }
      };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Server not configured: GEMINI_API_KEY missing' }),
        headers: { 'Content-Type': 'application/json' }
      };
    }

    const MODEL = 'gemini-2.5-flash';
    const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

    const prompt = `Return a concise JSON with these sections and numeric fields when applicable:\n{\n  "overallHealthScore": number (0-100),\n  "structuralAnalysis": {\n    "hairGrowthCycle": number[6],\n    "curlPatternDistribution": [{"Straight": number}, {"Wavy": number}, {"Curly": number}, {"Coily": number}],\n    "growthPhaseDistribution": [{"Anagen": number}, {"Catagen": number}, {"Telogen": number}]\n  },\n  "microscopicAnalysis": {\n    "cuticleLayerScore": number,\n    "shaftStructure": { "integrity": number, "pattern": string },\n    "medullaAnalysis": { "continuity": number },\n    "surfaceMapping": { "texture": string, "damage": string, "textureScore"?: number, "damageScore"?: number, "protectionLevel"?: number }\n  },\n  "metrics": { "hairType"?: string, "scalpCondition"?: string, "porosity"?: string }\n}`;

    const data = imageBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, '');

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
      return {
        statusCode: 502,
        body: JSON.stringify({ error: `Gemini request failed: ${res.status} ${res.statusText}`, details: msg }),
        headers: { 'Content-Type': 'application/json' }
      };
    }

    const dataResp = await res.json();

    let parsed: any = null;
    try {
      const text = dataResp.candidates?.[0]?.content?.parts?.[0]?.text;
      parsed = typeof text === 'string' ? JSON.parse(text) : dataResp;
    } catch {
      parsed = dataResp;
    }

    parsed._modelUsed = MODEL;
    parsed._analysisTimestamp = new Date().toISOString();

    return {
      statusCode: 200,
      body: JSON.stringify(parsed),
      headers: { 'Content-Type': 'application/json' }
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err?.message || 'Unexpected error' }),
      headers: { 'Content-Type': 'application/json' }
    };
  }
};
