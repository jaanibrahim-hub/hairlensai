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

// API keys array for fallback mechanism
const API_KEYS = [
  'AIzaSyCbiokMrXsfZyXHi_OFwFwM5bG9QXazCPA',
  'AIzaSyBrUoI6e9BCAarqbXQf3NfTe3wyZ_4O-Mo',
  'AIzaSyDP-5zEsfl0SkNAdfB2Hx70MOgC3j6QvHk',
  'AIzaSyBcyEA5uAB0RXlLy1LKvREzlymz-DVk9SI'
];

const ANALYSIS_PROMPT = `Analyze this hair/scalp image and provide a comprehensive analysis in JSON format with the following structure:

{
  "structuralAnalysis": {
    "hairGrowthCycle": [numbers for 6 months showing growth progression],
    "curlPatternDistribution": [percentages of different curl patterns],
    "growthPhaseDistribution": [percentages in anagen, catagen, telogen phases]
  },
  "quickSummary": "Detailed analysis of sebum levels, pore condition, inflammation markers, etc.",
  "metrics": {
    "hairType": "Specific hair type classification",
    "healthStatus": "Overall health assessment",
    "porosity": "Low/Medium/High with percentage",
    "density": "Hairs per square cm",
    "elasticity": "Measurement of stretch and return",
    "scalpCondition": "Detailed scalp health analysis",
    "hairLength": "Average length in inches/cm",
    "chemicalTreatment": "Assessment of chemical exposure",
    "protectionLevel": "Current protection status",
    "breakageRate": "Percentage of broken strands",
    "strandThickness": "Measurement in millimeters",
    "follicleDensity": "Follicles per square cm",
    "hairDiameter": {
      "root": "Diameter at root in mm",
      "tip": "Diameter at tip in mm"
    },
    "growthPhase": "Current growth phase percentage",
    "damageAnalysis": "Detailed damage assessment"
  },
  "overallHealthScore": "Score between 0-100",
  "hairInformation": {
    "diagnosticAnalysis": "Comprehensive diagnostic findings",
    "careTips": ["Array of specific care recommendations"]
  },
  "recommendedTreatments": {
    "primary": {
      "name": "Primary treatment recommendation",
      "description": "Detailed treatment description",
      "match": "Match percentage (0-100)"
    },
    "secondary": {
      "name": "Secondary treatment option",
      "description": "Treatment description",
      "match": "Match percentage (0-100)"
    },
    "supporting": {
      "name": "Supporting treatment",
      "description": "Treatment description",
      "match": "Match percentage (0-100)"
    },
    "other": [
      {
        "name": "Alternative treatment name",
        "match": "Match percentage (0-100)"
      }
    ]
  }
}

Please ensure all measurements are precise and include specific numerical values where possible. Base all assessments on visible evidence in the image.`;

async function makeApiCall(imageBase64: string, apiKey: string): Promise<HairAnalysisResponse | null> {
  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: ANALYSIS_PROMPT },
                {
                  inlineData: {
                    mimeType: "image/jpeg",
                    data: imageBase64,
                  },
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      console.warn(`API call failed with key ${apiKey.substring(0, 5)}...`);
      return null;
    }

    const data = await response.json();
    return JSON.parse(data.candidates[0].content.parts[0].text);
  } catch (error) {
    console.warn(`Error with API key ${apiKey.substring(0, 5)}...`, error);
    return null;
  }
}

export const analyzeHairImage = async (imageBase64: string): Promise<HairAnalysisResponse> => {
  for (const apiKey of API_KEYS) {
    try {
      const result = await makeApiCall(imageBase64, apiKey);
      if (result) {
        console.log('Successfully analyzed image with API key:', apiKey.substring(0, 5) + '...');
        return result;
      }
    } catch (error) {
      console.warn(`Failed with API key ${apiKey.substring(0, 5)}...`, error);
      continue;
    }
  }

  // If all API keys fail
  toast.error("Failed to analyze image. Please try again.");
  throw new Error("All API attempts failed");
};