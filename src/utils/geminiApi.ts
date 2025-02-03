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

const ANALYSIS_PROMPT = `Analyze this hair/scalp image and provide a comprehensive analysis in the following JSON format:

{
  "microscopicAnalysis": {
    "cuticleLayerScore": "0-100 score with detailed integrity assessment",
    "shaftStructure": {
      "integrity": "0-100",
      "pattern": "detailed pattern description",
      "abnormalities": ["list of any structural issues"]
    },
    "medullaAnalysis": {
      "presence": "percentage",
      "continuity": "0-100",
      "healthMetrics": ["detailed health indicators"]
    },
    "crossSection": {
      "shape": "detailed shape analysis",
      "diameter": "measurements in micrometers",
      "uniformity": "0-100"
    },
    "surfaceMapping": {
      "texture": "detailed texture analysis",
      "damage": "damage patterns and severity",
      "scales": "condition of cuticle scales"
    }
  },
  "scalpHealth": {
    "follicleDensity": {
      "average": "follicles per cm²",
      "distribution": "pattern description",
      "mapping": ["density zones"]
    },
    "phLevels": {
      "current": "numerical pH value",
      "optimal": "target pH range",
      "variations": ["pH patterns"]
    },
    "sebumProduction": {
      "rate": "production level",
      "distribution": "pattern analysis",
      "quality": "composition assessment"
    },
    "microcirculation": {
      "bloodFlow": "0-100",
      "oxygenation": "percentage",
      "inflammation": "presence and severity"
    }
  },
  "growthCycle": {
    "anagenTelogenRatio": {
      "current": "ratio value",
      "optimal": "target ratio",
      "distribution": ["area-specific ratios"]
    },
    "growthRate": {
      "velocity": "mm per month",
      "consistency": "0-100",
      "patterns": ["growth patterns"]
    },
    "sheddingMetrics": {
      "daily": "average count",
      "pattern": "shedding pattern analysis",
      "severity": "0-100"
    },
    "miniaturization": {
      "score": "0-100",
      "affected": "percentage of affected follicles",
      "progression": "rate of change"
    }
  },
  "chemicalComposition": {
    "proteinContent": {
      "level": "percentage",
      "quality": "protein structure assessment",
      "deficiencies": ["specific deficiencies"]
    },
    "hydrationLevels": {
      "surface": "percentage",
      "cortex": "percentage",
      "retention": "0-100"
    },
    "lipidProfile": {
      "surface": "lipid content analysis",
      "internal": "structural lipids assessment",
      "balance": "0-100"
    },
    "mineralContent": {
      "present": ["detected minerals"],
      "deficient": ["deficient minerals"],
      "excess": ["excess minerals"]
    }
  },
  "environmentalImpact": {
    "uvDamage": {
      "severity": "0-100",
      "type": "damage pattern",
      "depth": "affected layers"
    },
    "pollutionEffects": {
      "exposure": "0-100",
      "particleMatter": "concentration",
      "oxidativeStress": "severity"
    },
    "heatDamage": {
      "current": "damage assessment",
      "cumulative": "long-term impact",
      "recovery": "potential"
    }
  },
  "treatmentPredictions": {
    "successProbability": {
      "overall": "percentage",
      "byTreatment": ["treatment-specific probabilities"]
    },
    "timeline": {
      "expected": "weeks to visible results",
      "milestones": ["expected progress points"]
    },
    "combinations": {
      "recommended": ["optimal treatment combinations"],
      "contraindications": ["treatments to avoid"]
    }
  }
}

Base your analysis on visible evidence in the image, considering:
1. Microscopic details visible in high-resolution areas
2. Color patterns and variations
3. Surface texture and reflectivity
4. Scalp visibility and condition
5. Hair density and distribution
6. Signs of damage or stress
7. Growth patterns and variations
8. Environmental exposure indicators

Provide specific numerical values where possible and detailed descriptions for qualitative assessments.`;

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
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.warn('Invalid response format from API');
      return null;
    }

    const responseText = data.candidates[0].content.parts[0].text;
    
    // Clean up any markdown formatting that might be present
    const cleanedText = responseText.replace(/```json\n|\n```/g, '').trim();
    
    try {
      return JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      console.log('Response text:', responseText);
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
