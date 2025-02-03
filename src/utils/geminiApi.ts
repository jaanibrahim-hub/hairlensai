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

const ANALYSIS_PROMPT = `Analyze this hair/scalp image and provide a detailed assessment focusing on these key areas:

1. Microscopic Analysis:
- Cuticle layer condition (0-100 score)
- Shaft structure integrity (0-100)
- Cross-section uniformity (0-100)
- Surface texture mapping
- Medulla analysis
- Damage patterns

2. Scalp Health:
- Sebum levels (0-100)
- Hydration levels (0-100)
- Inflammation indicators
- Follicle condition
- Scalp pH balance
- Microbial balance

3. Growth Cycle Analysis:
- Anagen/Catagen/Telogen distribution
- Growth rate indicators
- Follicle density
- Growth pattern uniformity
- Miniaturization assessment
- Growth phase transitions

4. Chemical Analysis:
- Treatment residue levels
- Chemical damage indicators
- Protein loss assessment
- Mineral buildup
- pH levels
- Chemical bond status

5. Environmental Impact:
- UV damage markers
- Pollution particle presence
- Moisture retention
- Environmental stress indicators
- Protective barrier status
- Climate adaptation signs

6. Treatment Requirements:
- Primary treatment needs
- Secondary interventions
- Supporting treatments
- Treatment compatibility
- Expected efficacy rates
- Treatment timeline

Return the analysis in this JSON format:

{
  "microscopicAnalysis": {
    "cuticleLayerScore": number,
    "shaftStructure": {
      "integrity": number,
      "pattern": string
    },
    "medullaAnalysis": {
      "continuity": number,
      "pattern": string
    },
    "crossSection": {
      "uniformity": number
    },
    "surfaceMapping": {
      "texture": string,
      "damage": string
    }
  },
  "scalpHealth": {
    "sebumLevel": number,
    "hydrationLevel": number,
    "inflammation": string,
    "follicleCondition": string,
    "pHBalance": number,
    "microbialBalance": string
  },
  "growthCycleAnalysis": {
    "distribution": {
      "anagen": number,
      "catagen": number,
      "telogen": number
    },
    "growthRate": number,
    "follicleDensity": number,
    "uniformity": number,
    "miniaturization": string
  },
  "chemicalAnalysis": {
    "treatmentResidueLevel": number,
    "damageLevel": number,
    "proteinLoss": number,
    "mineralBuildup": string,
    "pHLevel": number
  },
  "environmentalImpact": {
    "uvDamage": number,
    "pollutionLevel": number,
    "moistureRetention": number,
    "stressIndicators": string,
    "protectiveBarrier": number
  },
  "treatmentPlan": {
    "primary": {
      "name": string,
      "description": string,
      "efficacy": number,
      "timeline": string
    },
    "secondary": {
      "name": string,
      "description": string,
      "efficacy": number
    },
    "supporting": {
      "name": string,
      "description": string,
      "efficacy": number
    }
  }
}

Provide specific numerical values (0-100) for all metrics where applicable. Make reasonable estimates based on visible indicators rather than marking as "Unable to assess".`;

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

const transformApiResponse = (apiResponse: any): HairAnalysisResponse => {
  console.log('Transforming API response:', apiResponse);

  // Map metrics from the API response
  const metricsArray = [
    { icon: "microscope", label: "Cuticle Layer Score", value: `${apiResponse.microscopicAnalysis?.cuticleLayerScore || 0}%` },
    { icon: "heart", label: "Scalp Health", value: `${apiResponse.scalpHealth?.hydrationLevel || 0}% Hydration` },
    { icon: "seedling", label: "Growth Rate", value: `${apiResponse.growthCycleAnalysis?.growthRate || 0}mm/day` },
    { icon: "flask", label: "Chemical Status", value: `${apiResponse.chemicalAnalysis?.damageLevel || 0}% Damage` },
    { icon: "sun", label: "Environmental Impact", value: `${apiResponse.environmentalImpact?.uvDamage || 0}% UV Exposure` },
    { icon: "shield-alt", label: "Treatment Efficacy", value: `${apiResponse.treatmentPlan?.primary?.efficacy || 0}% Expected` },
  ];

  // Calculate overall health score based on multiple factors
  const healthScore = Math.round(
    (
      (apiResponse.microscopicAnalysis?.cuticleLayerScore || 0) +
      (apiResponse.scalpHealth?.hydrationLevel || 0) +
      (apiResponse.growthCycleAnalysis?.follicleDensity || 0) +
      (100 - (apiResponse.chemicalAnalysis?.damageLevel || 0)) +
      (apiResponse.environmentalImpact?.protectiveBarrier || 0)
    ) / 5
  );

  // Create health data trend
  const healthData = {
    labels: ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'],
    datasets: [{
      label: 'Hair Growth Cycle',
      data: apiResponse.growthCycleAnalysis?.distribution ? [
        apiResponse.growthCycleAnalysis.distribution.anagen,
        apiResponse.growthCycleAnalysis.distribution.catagen,
        apiResponse.growthCycleAnalysis.distribution.telogen,
        apiResponse.growthCycleAnalysis.follicleDensity,
        apiResponse.growthCycleAnalysis.uniformity,
        healthScore
      ] : [65, 70, 68, 72, 75, 76],
      borderColor: '#9b87f5',
      backgroundColor: 'rgba(155, 135, 245, 0.1)',
      fill: true,
    }]
  };

  // Map curl pattern distribution
  const curlPatternData = {
    labels: ['Type 1 (Straight)', 'Type 2 (Wavy)', 'Type 3 (Curly)', 'Type 4 (Coily)'],
    datasets: [{
      label: 'Hair Type Distribution',
      data: [25, 35, 25, 15], // Default distribution if not provided
      borderColor: '#9b87f5',
      backgroundColor: 'rgba(155, 135, 245, 0.1)',
      fill: true,
    }]
  };

  // Map growth phase distribution
  const growthPhaseData = {
    labels: ['Anagen', 'Catagen', 'Telogen'],
    datasets: [{
      label: 'Growth Phase Distribution',
      data: [
        apiResponse.growthCycleAnalysis?.distribution?.anagen || 85,
        apiResponse.growthCycleAnalysis?.distribution?.catagen || 5,
        apiResponse.growthCycleAnalysis?.distribution?.telogen || 10
      ],
      borderColor: '#9b87f5',
      backgroundColor: 'rgba(155, 135, 245, 0.1)',
      fill: true,
    }]
  };

  // Create quick summary from analysis
  const quickSummary = `Based on the analysis: Cuticle layer score is ${apiResponse.microscopicAnalysis?.cuticleLayerScore || 0}%, 
    scalp hydration at ${apiResponse.scalpHealth?.hydrationLevel || 0}%, 
    with ${apiResponse.growthCycleAnalysis?.distribution?.anagen || 0}% of hair in growth phase. 
    ${apiResponse.treatmentPlan?.primary?.name || 'Treatment'} is recommended.`;

  // Map hair information
  const hairInformation = {
    diagnosticAnalysis: apiResponse.microscopicAnalysis?.shaftStructure?.pattern || 
      "Analysis shows typical hair structure patterns",
    careTips: [
      `Maintain pH level of ${apiResponse.scalpHealth?.pHBalance || 5.5}`,
      `Focus on ${apiResponse.treatmentPlan?.primary?.name || 'recommended treatment'}`,
      `Monitor ${apiResponse.environmentalImpact?.stressIndicators || 'environmental factors'}`,
      "Regular scalp care routine",
      "Gentle styling practices"
    ]
  };

  // Map recommended treatments
  const recommendedTreatments = {
    primary: {
      name: apiResponse.treatmentPlan?.primary?.name || "Custom Treatment Plan",
      description: apiResponse.treatmentPlan?.primary?.description || 
        "Personalized treatment based on analysis results",
      match: apiResponse.treatmentPlan?.primary?.efficacy || 85
    },
    secondary: {
      name: apiResponse.treatmentPlan?.secondary?.name || "Supplementary Care",
      description: apiResponse.treatmentPlan?.secondary?.description || 
        "Supporting treatment protocol",
      match: apiResponse.treatmentPlan?.secondary?.efficacy || 75
    },
    supporting: {
      name: apiResponse.treatmentPlan?.supporting?.name || "Maintenance Routine",
      description: apiResponse.treatmentPlan?.supporting?.description || 
        "Daily care routine",
      match: apiResponse.treatmentPlan?.supporting?.efficacy || 65
    },
    other: [
      { name: "Scalp Treatment", match: 60 },
      { name: "Protein Treatment", match: 55 },
      { name: "Deep Conditioning", match: 50 },
      { name: "Heat Protection", match: 45 }
    ]
  };

  return {
    metrics: metricsArray,
    healthScore,
    healthData,
    curlPatternData,
    growthPhaseData,
    structuralAnalysis: {
      hairGrowthCycle: apiResponse.growthCycleAnalysis?.distribution ? 
        Object.values(apiResponse.growthCycleAnalysis.distribution) : [85, 5, 10],
      curlPatternDistribution: [
        { "Type 1": 25 },
        { "Type 2": 35 },
        { "Type 3": 25 },
        { "Type 4": 15 }
      ],
      growthPhaseDistribution: [
        { "Anagen": apiResponse.growthCycleAnalysis?.distribution?.anagen || 85 },
        { "Catagen": apiResponse.growthCycleAnalysis?.distribution?.catagen || 5 },
        { "Telogen": apiResponse.growthCycleAnalysis?.distribution?.telogen || 10 }
      ]
    },
    quickSummary,
    hairInformation,
    recommendedTreatments
  };
};

export const analyzeHairImage = async (imageBase64: string): Promise<HairAnalysisResponse> => {
  let lastError: Error | null = null;

  for (const apiKey of API_KEYS) {
    try {
      const result = await makeApiCall(imageBase64, apiKey);
      if (result) {
        console.log('Successfully analyzed image with API key:', apiKey.substring(0, 5) + '...');
        return transformApiResponse(result);
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
