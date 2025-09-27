export const onRequestPost: PagesFunction<{ GEMINI_API_KEY: string }> = async (ctx) => {
  try {
    const { request, env } = ctx;
    const body = await request.json().catch(() => null) as { analysisData?: any } | null;

    if (!body?.analysisData) {
      return new Response(JSON.stringify({ error: 'Missing analysisData' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const apiKey = env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Server not configured: GEMINI_API_KEY missing' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    const MODEL = 'gemini-2.5-flash';
    const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

    const prompt = `You are an AI trichologist. Create a friendly, professional multi-section report based on this JSON analysis data. Use clear bullet points with dashes and blank lines between sections. Sections: Welcome & Overview; Hair Status; Growth Phase; Care Routine; Lifestyle Tips; Seasonal Care; Treatments; Progress Goals; Emergency Care; Product Guide. Input JSON: ${JSON.stringify(body.analysisData).slice(0, 6000)}`;

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
      return new Response(JSON.stringify({ error: `Gemini request failed: ${res.status} ${res.statusText}`, details: msg }), { status: 502, headers: { 'Content-Type': 'application/json' } });
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

    return new Response(JSON.stringify(structured), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Unexpected error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
