import { toast } from "sonner";

interface HairAnalysisResponse {
  structuralAnalysis: {
    hairGrowthCycle: number[];
    curlPatternDistribution: number[];
    growthPhaseDistribution: number[];
  };
  quickSummary: string;
  metrics: {
    hairType: string;
    healthStatus: string;
    porosity: string;
    density: string;
    elasticity: string;
    scalpCondition: string;
    hairLength: string;
    chemicalTreatment: string;
    protectionLevel: string;
    breakageRate: string;
    strandThickness: string;
    follicleDensity: string;
    hairDiameter: {
      root: string;
      tip: string;
    };
    growthPhase: string;
    damageAnalysis: string;
  };
  overallHealthScore: number;
  hairInformation: {
    diagnosticAnalysis: string;
    careTips: string[];
  };
  recommendedTreatments: {
    primary: {
      name: string;
      description: string;
      match: number;
    };
    secondary: {
      name: string;
      description: string;
      match: number;
    };
    supporting: {
      name: string;
      description: string;
      match: number;
    };
    other: Array<{
      name: string;
      match: number;
    }>;
  };
}

export const API_KEYS = [
  'AIzaSyCbiokMrXsfZyXHi_OFwFwM5bG9QXazCPA',
  'AIzaSyBrUoI6e9BCAarqbXQf3NfTe3wyZ_4O-Mo',
  'AIzaSyDP-5zEsfl0SkNAdfB2Hx70MOgC3j6QvHk',
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
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${apiKey}`,
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

export const analyzeHairImage = async (imageBase64: string): Promise<HairAnalysisResponse> => {
  let lastError: Error | null = null;

  for (const apiKey of API_KEYS) {
    try {
      console.log('Attempting analysis with API key:', apiKey.substring(0, 5) + '...');
      const result = await makeApiCall(imageBase64, apiKey);
      if (result) {
        console.log('Successfully analyzed image with API key:', apiKey.substring(0, 5) + '...');
        return result;
      }
    } catch (error) {
      console.warn(`Failed with API key ${apiKey.substring(0, 5)}...`, error);
      lastError = error as Error;
      continue;
    }
  }

  // If all API keys fail
  toast.error("Failed to analyze image. Please try again.");
  throw lastError || new Error("All API attempts failed");
};
