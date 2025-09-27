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
    const analysisData = body?.analysisData;

    if (!analysisData) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing analysisData' }),
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

    const prompt = `You are an AI trichologist. Create a friendly, professional multi-section report based on this JSON analysis data. Use clear bullet points with dashes and blank lines between sections. Sections: Welcome & Overview; Hair Status; Growth Phase; Care Routine; Lifestyle Tips; Seasonal Care; Treatments; Progress Goals; Emergency Care; Product Guide. Input JSON: ${JSON.stringify(analysisData).slice(0, 6000)}`;

    const reqBody = {
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.15, topK: 32, topP: 0.9, maxOutputTokens: 8192 },
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

    const data = await res.json();
    const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    const cleaned = text
      .replace(/[#*`]/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    const sections = cleaned.split(/\n\s*\d+\.\s+/).filter(Boolean);

    const structured = {
      _modelUsed: MODEL,
      _analysisTimestamp: new Date().toISOString(),
      welcome: sections[0]?.trim() || '',
      hairStatus: sections[1]?.trim() || '',
      growthPhase: sections[2]?.trim() || '',
      careRoutine: sections[3]?.trim() || '',
      lifestyleTips: sections[4]?.trim() || '',
      seasonalCare: sections[5]?.trim() || '',
      treatments: sections[6]?.trim() || '',
      progressGoals: sections[7]?.trim() || '',
      emergencyCare: sections[8]?.trim() || '',
      productGuide: sections[9]?.trim() || ''
    };

    return {
      statusCode: 200,
      body: JSON.stringify(structured),
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
