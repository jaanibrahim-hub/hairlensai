import { toast } from "sonner";

export const API_KEYS = [
  'AIzaSyCbiokMrXsfZyXHi_OFwFwM5bG9QXazCPA',
  'AIzaSyBrUoI6e9BCAarqbXQf3NfTe3wyZ_4O-Mo',
  'AIzaSyDP-5zEsfl0SkNAdfB2Hx70MOgC3j6QvHk',
  'AIzaSyBZJ7jynPsUbw8310LtVgx9dhB_sQK6hx4',
  'AIzaSyC6G-t916odkj3tkx4lO0S9FMK3NhwpuUo',
  'AIzaSyA3DkGlAi-vRDUq0af-zFywV9K6e8TwFG4',
  'AIzaSyAaL_-PTwt5TDjt5QnNQ31kZWCapKJRrmU',
  'AIzaSyCKmqEfpww0HcbgBKjVCOQwZIONmsWZHGQ',
  'AIzaSyBcyEA5uAB0RXlLy1LKvREzlymz-DVk9SI'
];

const ANALYSIS_PROMPT = `Analyze this hair/scalp image and provide a detailed assessment. Focus on visible features and provide specific values where possible. Return the analysis in this JSON format:

{
  "metrics": {
    "hairType": "Describe the hair type (e.g., 1A-4C)",
    "healthStatus": "Overall health assessment",
    "porosity": "Low/Medium/High based on shine and texture",
    "density": "Assessment of hair density",
    "elasticity": "Based on visible hair pattern",
    "scalpCondition": "Visible scalp health indicators",
    "hairLength": "Approximate length in inches",
    "chemicalTreatment": "Signs of chemical processing",
    "protectionLevel": "Assessment of hair protection",
    "breakageRate": "Visible damage percentage",
    "strandThickness": "Fine/Medium/Coarse assessment",
    "follicleDensity": "Visible density pattern",
    "hairDiameter": {
      "root": "Estimated root diameter",
      "tip": "Estimated tip diameter"
    },
    "growthPhase": "Dominant growth phase estimate",
    "damageAnalysis": "Visible damage assessment"
  },
  "overallHealthScore": "Numerical score 0-100",
  "structuralAnalysis": {
    "hairGrowthCycle": [65, 70, 75, 80, 85, 90],
    "curlPatternDistribution": [
      {"Straight": 30},
      {"Wavy": 40},
      {"Curly": 20},
      {"Coily": 10}
    ],
    "growthPhaseDistribution": [
      {"Anagen": 85},
      {"Catagen": 5},
      {"Telogen": 10}
    ]
  },
  "microscopicAnalysis": {
    "cuticleLayerScore": 75,
    "shaftStructure": {
      "integrity": 80,
      "pattern": "Regular/Irregular pattern description"
    },
    "medullaAnalysis": {
      "continuity": 85
    },
    "crossSection": {
      "uniformity": 90
    },
    "surfaceMapping": {
      "texture": "Detailed texture description",
      "damage": "Specific damage patterns"
    }
  },
  "quickSummary": "Brief analysis summary highlighting key findings",
  "hairInformation": {
    "diagnosticAnalysis": "Detailed diagnostic findings",
    "careTips": [
      "Specific care recommendation 1",
      "Specific care recommendation 2",
      "Specific care recommendation 3"
    ]
  },
  "recommendedTreatments": {
    "primary": {
      "name": "Primary treatment name",
      "description": "Treatment description",
      "match": 95
    },
    "secondary": {
      "name": "Secondary treatment name",
      "description": "Treatment description",
      "match": 85
    },
    "supporting": {
      "name": "Supporting treatment name",
      "description": "Treatment description",
      "match": 75
    },
    "other": [
      {
        "name": "Alternative treatment 1",
        "match": 65
      },
      {
        "name": "Alternative treatment 2",
        "match": 55
      }
    ]
  }
}

Important guidelines for analysis:
1. Provide specific numerical values whenever possible
2. Focus on visible characteristics in the image
3. Make reasonable estimates based on visible features
4. Use comparative analysis with standard hair types
5. Consider both close-up details and overall appearance
6. Assess multiple areas of the image for comprehensive analysis
7. Note any distinct patterns or variations
8. Include specific measurements where visible indicators allow estimation
`;

export const analyzeHairImage = async (imageBase64: string): Promise<any> => {
  if (!validateImage(imageBase64)) {
    throw new Error("Invalid image format or size");
  }

  // Try each API key until one works
  for (const apiKey of API_KEYS) {
    try {
      console.log('Attempting analysis with API key:', apiKey.substring(0, 5) + '...');
      const result = await makeApiCall(imageBase64, apiKey);
      if (result) {
        console.log('Analysis successful:', result);
        return result;
      }
    } catch (error) {
      console.error(`Error with API key ${apiKey.substring(0, 5)}...`, error);
      continue; // Try next API key
    }
  }

  throw new Error("All API keys failed. Please try again later.");
};

const validateImage = (imageBase64: string): boolean => {
  try {
    // Check if the string is a valid base64
    if (!imageBase64 || !/^[A-Za-z0-9+/=]+$/.test(imageBase64)) {
      console.warn('Invalid base64 string');
      return false;
    }

    // Check file size (max 20MB)
    const sizeInBytes = (imageBase64.length * 3) / 4;
    if (sizeInBytes > 20 * 1024 * 1024) {
      console.warn('Image size exceeds 20MB limit');
      return false;
    }

    return true;
  } catch (error) {
    console.warn('Image validation error:', error);
    return false;
  }
};

async function makeApiCall(imageBase64: string, apiKey: string) {
  if (!validateImage(imageBase64)) {
    throw new Error("Invalid image format or size");
  }

  try {
    console.log('Making API call with key:', apiKey.substring(0, 5) + '...');
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: ANALYSIS_PROMPT },
                {
                  inline_data: {
                    mime_type: "image/jpeg",
                    data: imageBase64,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            topK: 40,
            topP: 0.8,
            maxOutputTokens: 8192,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Raw API response:', data);
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.warn('Invalid response format from API');
      return null;
    }

    const responseText = data.candidates[0].content.parts[0].text;
    console.log('Response text:', responseText);
    
    // Extract JSON from markdown if present
    let jsonText = responseText;
    if (responseText.includes('```json')) {
      jsonText = responseText.split('```json')[1].split('```')[0].trim();
    }
    
    try {
      const parsedData = JSON.parse(jsonText);
      console.log('Successfully parsed JSON:', parsedData);
      return parsedData;
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      console.log('Attempted to parse text:', jsonText);
      return null;
    }
  } catch (error) {
    console.error(`Error with API key ${apiKey.substring(0, 5)}...`, error);
    return null;
  }
}

const SECOND_ANALYSIS_PROMPT = `As a friendly hair care expert, please provide a warm, conversational assessment of this hair analysis data. Please structure your response in the following sections, writing in a natural, friendly tone as if you're chatting with a friend:

1. Warm Welcome & Overview
Start with a friendly greeting and share your initial impressions of their hair analysis results.

2. Current Hair Status
Break down what you see in their hair health, texture, and condition in simple, everyday language.

3. Growth Phase Understanding
Explain their hair's growth phases in an easy-to-understand way, focusing on what's most important for them to know.

4. Personalized Care Routine
- Morning care steps
- Evening care steps
- Weekly special treatments
- Product types that would work well

5. Lifestyle & Environmental Tips
- Diet suggestions for better hair health
- Exercise benefits for hair growth
- Environmental protection advice
- Stress management for hair health

6. Seasonal Care Guide
- Current season recommendations
- Preparing for upcoming weather changes
- Humidity and temperature management
- Special occasion preparation tips

7. Treatment Recommendations
- At-home care suggestions
- Professional treatments to consider
- Natural remedy options
- Treatment timing recommendations

8. Progress Goals & Milestones
- Short-term improvements to look for
- Medium-term goals
- Long-term expectations
- Success indicators

9. Emergency Care Tips
- Quick fixes for bad hair days
- DIY emergency treatments
- Warning signs to watch for
- When to seek professional help

10. Product Guide
- Ingredients that would benefit your hair
- What to avoid
- Application techniques
- Shopping tips

Please write this in a conversational, encouraging tone. Avoid technical jargon and explain everything as if you're having a friendly chat. Focus on practical, actionable advice that feels personal and supportive.`;

export const performSecondaryAnalysis = async (analysisData: any, apiKey: string) => {
  console.log('Starting secondary analysis with data:', analysisData);
  
  if (!analysisData || !analysisData.rawMetrics) {
    console.error('Invalid analysis data structure:', analysisData);
    throw new Error('Invalid analysis data structure. Missing raw metrics data.');
  }

  // Validate required metrics from rawMetrics
  const requiredMetrics = ['hairType', 'scalpCondition', 'porosity'];
  const availableMetrics = Object.keys(analysisData.rawMetrics);
  
  console.log('Available raw metrics:', availableMetrics);
  console.log('Required metrics:', requiredMetrics);
  
  const missingMetrics = requiredMetrics.filter(
    required => !availableMetrics.includes(required)
  );

  if (missingMetrics.length > 0) {
    console.warn('Missing some metrics, using fallback values:', missingMetrics);
  }

  // Prepare the prompt with proper data structure and fallback values
  const geminiPrompt = `
    Analysis Data:
    Health Score: ${analysisData.overallHealthScore || analysisData.healthScore || 'N/A'}
    
    Hair Metrics:
    Hair Type: ${analysisData.rawMetrics.hairType || 'Type 2A (Default)'}
    Scalp Condition: ${analysisData.rawMetrics.scalpCondition || 'Normal (Default)'}
    Porosity: ${analysisData.rawMetrics.porosity || 'Medium (Default)'}
    
    Additional Metrics:
    ${Object.entries(analysisData.rawMetrics)
      .filter(([key]) => !requiredMetrics.includes(key))
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n    ')}
    
    ${SECOND_ANALYSIS_PROMPT}
  `;

  // Token count validation
  const inputTokens = JSON.stringify(geminiPrompt).length / 4;
  if (inputTokens > 1000000) {
    throw new Error('Context window overflow');
  }

  const requestBody = {
    contents: [{
      role: "user",
      parts: [{ text: geminiPrompt }]
    }],
    generationConfig: {
      temperature: 0.2,
      topK: 40,
      topP: 0.8,
      maxOutputTokens: 8192
    }
  };

  try {
    console.log('Making secondary analysis API call...');
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Secondary analysis API error:', errorData);
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Secondary analysis response:', data);

    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Malformed API response structure');
    }

    // Get the response text
    const responseText = data.candidates[0].content.parts[0].text;
    console.log('Raw response text:', responseText);

    // Parse the sections based on numbered headings
    const sections = responseText.split(/\d+\.\s+/).filter(Boolean);
    
    // Create a structured response
    const structuredResponse = {
      welcome: sections[0]?.trim() || "Welcome section not found",
      hairStatus: sections[1]?.trim() || "Hair status section not found",
      growthPhase: sections[2]?.trim() || "Growth phase section not found",
      careRoutine: sections[3]?.trim() || "Care routine section not found",
      lifestyleTips: sections[4]?.trim() || "Lifestyle tips section not found",
      seasonalCare: sections[5]?.trim() || "Seasonal care section not found",
      treatments: sections[6]?.trim() || "Treatments section not found",
      progressGoals: sections[7]?.trim() || "Progress goals section not found",
      emergencyCare: sections[8]?.trim() || "Emergency care section not found",
      productGuide: sections[9]?.trim() || "Product guide section not found"
    };

    console.log('Structured response:', structuredResponse);
    return structuredResponse;

  } catch (error) {
    console.error('Secondary analysis error:', error);
    toast.error('Secondary analysis failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    throw error;
  }
};
