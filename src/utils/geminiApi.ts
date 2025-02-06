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

const ANALYSIS_PROMPT = `Analyze this hair/scalp image and first determine if it's a scalp view or face-forward view. Then provide a detailed assessment based on the view type. Return the analysis in this JSON format:

{
  "imageType": "scalp-view" or "face-forward",
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
  "regionalDensity": {
    "imageType": "scalp-view" or "face-forward",
    "analyzableRegions": {
      "crown": {
        "density": "Density in hairs/cm²",
        "status": "optimal/normal/thinning",
        "comparison": "Percentage comparison with average"
      },
      "temples": {
        "left": {
          "density": "Density in hairs/cm²",
          "status": "optimal/normal/thinning",
          "comparison": "Percentage comparison with average"
        },
        "right": {
          "density": "Density in hairs/cm²",
          "status": "optimal/normal/thinning",
          "comparison": "Percentage comparison with average"
        }
      },
      "hairline": {
        "density": "Density in hairs/cm²",
        "status": "optimal/normal/thinning",
        "comparison": "Percentage comparison with average"
      },
      "vertex": {
        "density": "Density in hairs/cm²",
        "status": "optimal/normal/thinning",
        "comparison": "Percentage comparison with average"
      }
    },
    "nonVisibleRegions": ["List of regions not visible in image"],
    "recommendedViews": ["List of recommended additional views needed"]
  },
  "structuralAnalysis": {
    "hairGrowthCycle": [Array of 6 monthly growth values],
    "curlPatternDistribution": [
      {"Straight": percentage},
      {"Wavy": percentage},
      {"Curly": percentage},
      {"Coily": percentage}
    ],
    "growthPhaseDistribution": [
      {"Anagen": percentage},
      {"Catagen": percentage},
      {"Telogen": percentage}
    ]
  },
  "microscopicAnalysis": {
    "cuticleLayerScore": "0-100",
    "shaftStructure": {
      "integrity": "0-100",
      "pattern": "Description"
    },
    "medullaAnalysis": {
      "continuity": "0-100"
    },
    "crossSection": {
      "uniformity": "0-100"
    },
    "surfaceMapping": {
      "texture": "Description",
      "damage": "Description"
    }
  },
  "quickSummary": "Brief analysis summary highlighting key findings",
  "hairInformation": {
    "diagnosticAnalysis": "Detailed diagnostic findings",
    "careTips": ["Array of care recommendations"]
  },
  "recommendedTreatments": {
    "primary": {
      "name": "Primary treatment name",
      "description": "Treatment description",
      "match": "0-100"
    },
    "secondary": {
      "name": "Secondary treatment name",
      "description": "Treatment description",
      "match": "0-100"
    },
    "supporting": {
      "name": "Supporting treatment name",
      "description": "Treatment description",
      "match": "0-100"
    },
    "other": [
      {
        "name": "Alternative treatment name",
        "match": "0-100"
      }
    ]
  }
}

Important guidelines for analysis:
1. First determine if the image is a scalp view or face-forward view
2. For face-forward views:
   - Only analyze visible regions (hairline, temples)
   - Mark non-visible regions in nonVisibleRegions array
   - Provide specific recommendations for additional views needed
3. For scalp views:
   - Analyze all visible regions
   - Provide detailed density measurements
4. Provide specific numerical values whenever possible
5. Focus on visible characteristics in the image
6. Make reasonable estimates based on visible features
7. Use comparative analysis with standard hair types
8. Consider both close-up details and overall appearance
9. Assess multiple areas of the image for comprehensive analysis
10. Note any distinct patterns or variations
11. Include specific measurements where visible indicators allow estimation`;

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

const SECOND_ANALYSIS_PROMPT = `As a trichology expert, analyze this hair health data and provide a comprehensive medical assessment. Format your response as structured JSON with the following schema:
{
  "diagnostic_summary": "Brief overview of key findings",
  "detailed_analysis": "In-depth examination of all metrics",
  "treatment_plan": [
    {
      "category": "treatment category",
      "recommendations": ["specific recommendations"]
    }
  ]
}`;

export const performSecondaryAnalysis = async (analysisData: any, apiKey: string) => {
  console.log('Starting secondary analysis with data:', analysisData);
  
  // Normalize metric labels for case-insensitive comparison
  const requiredMetrics = ['hair type', 'scalp condition', 'porosity'];
  const availableMetrics = analysisData.metrics.map((metric: any) => metric.label.toLowerCase());
  
  console.log('Available metrics:', availableMetrics);
  console.log('Required metrics:', requiredMetrics);
  
  const missingMetrics = requiredMetrics.filter(
    required => !availableMetrics.includes(required)
  );

  if (missingMetrics.length > 0) {
    console.error('Missing required metrics:', missingMetrics);
    throw new Error(`Incomplete analysis data. Missing metrics: ${missingMetrics.join(', ')}`);
  }

  // Prepare the prompt with the analysis data
  const geminiPrompt = `
    Analysis Data:
    Health Score: ${analysisData.healthScore}
    Metrics: ${JSON.stringify(analysisData.metrics)}
    
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

    // Extract and parse JSON from the response
    const responseText = data.candidates[0].content.parts[0].text;
    let jsonResponse;
    try {
      // Handle potential markdown formatting
      const jsonString = responseText.includes('```json') 
        ? responseText.split('```json')[1].split('```')[0].trim()
        : responseText;
      jsonResponse = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      throw new Error('Failed to parse API response');
    }

    return jsonResponse;
  } catch (error) {
    console.error('Secondary analysis error:', error);
    throw error;
  }
}

