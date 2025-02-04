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

const API_KEYS = [
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
  "regionalAnalysis": {
    "crown": {
      "density": "Numerical density value",
      "health": "Health score 0-100",
      "concerns": ["Issue 1", "Issue 2"]
    },
    "temples": {
      "density": "Numerical density value",
      "health": "Health score 0-100",
      "concerns": ["Issue 1", "Issue 2"]
    },
    "nape": {
      "density": "Numerical density value",
      "health": "Health score 0-100",
      "concerns": ["Issue 1", "Issue 2"]
    }
  },
  "compositionAnalysis": {
    "proteinContent": {
      "score": "0-100",
      "distribution": ["Area 1", "Area 2"]
    },
    "lipidLevels": {
      "score": "0-100",
      "balance": "Description"
    },
    "mineralContent": {
      "levels": ["Mineral 1", "Mineral 2"],
      "deficiencies": ["Deficiency 1"]
    }
  },
  "growthAnalysis": {
    "direction": "Growth direction pattern",
    "consistency": "0-100",
    "whorlPattern": "Description",
    "growthZones": {
      "strong": ["Zone 1", "Zone 2"],
      "weak": ["Zone 1", "Zone 2"]
    }
  },
  "scalpHealth": {
    "hydrationLevel": "0-100",
    "sebumProduction": "Low/Medium/High",
    "microbialBalance": "0-100",
    "inflammationZones": {
      "locations": ["Location 1", "Location 2"],
      "severity": "0-100"
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
}`;

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
      console.warn(`API error with key ${apiKey.substring(0, 5)}...`, errorData);
      return null;
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
    console.warn(`Error with API key ${apiKey.substring(0, 5)}...`, error);
    return null;
  }
}

export const analyzeHairImage = async (imageBase64: string): Promise<HairAnalysisResponse> => {
  let lastError: Error | null = null;

  for (const apiKey of API_KEYS) {
    try {
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
