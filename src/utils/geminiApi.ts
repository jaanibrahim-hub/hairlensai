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

const ANALYSIS_PROMPT = `Analyze this hair/scalp image and provide a comprehensive analysis in JSON format with the following structure:

{
  "structuralAnalysis": {
    "hairGrowthCycle": [numbers representing 6-month cycle],
    "curlPatternDistribution": [distribution percentages],
    "growthPhaseDistribution": [phase percentages]
  },
  "quickSummary": "Detailed summary including sebum levels, pore condition, inflammation markers, follicular activity, etc.",
  "metrics": {
    "hairType": "Specific hair type (e.g., Type 2B Wavy)",
    "healthStatus": "Overall health status",
    "porosity": "Porosity level",
    "density": "Hair density measurement",
    "elasticity": "Elasticity assessment",
    "scalpCondition": "Detailed scalp condition",
    "hairLength": "Length measurement",
    "chemicalTreatment": "Chemical treatment assessment",
    "protectionLevel": "Protection level assessment",
    "breakageRate": "Breakage rate percentage",
    "strandThickness": "Thickness measurement",
    "follicleDensity": "Follicle density measurement",
    "hairDiameter": {
      "root": "Root diameter measurement",
      "tip": "Tip diameter measurement"
    },
    "growthPhase": "Growth phase percentage",
    "damageAnalysis": "Damage assessment"
  },
  "overallHealthScore": "Score as number between 0-100",
  "hairInformation": {
    "diagnosticAnalysis": "Detailed diagnostic analysis including conditions like androgenetic alopecia, telogen effluvium, etc.",
    "careTips": ["Array of specific care recommendations"]
  },
  "recommendedTreatments": {
    "primary": {
      "name": "Primary treatment name",
      "description": "Treatment description",
      "match": "Match percentage as number"
    },
    "secondary": {
      "name": "Secondary treatment name",
      "description": "Treatment description",
      "match": "Match percentage as number"
    },
    "supporting": {
      "name": "Supporting treatment name",
      "description": "Treatment description",
      "match": "Match percentage as number"
    },
    "other": [
      {
        "name": "Treatment name",
        "match": "Match percentage as number"
      }
    ]
  }
}

Please ensure all measurements, percentages, and assessments are based on visible evidence in the image. Include specific numerical values where possible.`;

export const analyzeHairImage = async (imageBase64: string): Promise<HairAnalysisResponse> => {
  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
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
      throw new Error("Failed to analyze image");
    }

    const data = await response.json();
    return JSON.parse(data.candidates[0].content.parts[0].text);
  } catch (error) {
    toast.error("Failed to analyze image. Please try again.");
    throw error;
  }
};