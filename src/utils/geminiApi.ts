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
  "regionalDensity": {
    "overall": "Average hairs per square centimeter",
    "regions": {
      "crown": {
        "density": "Hairs per square centimeter",
        "status": "optimal/normal/thinning",
        "comparison": "Percentage comparison to average"
      },
      "temples": {
        "left": {
          "density": "Hairs per square centimeter",
          "status": "optimal/normal/thinning",
          "comparison": "Percentage comparison to average"
        },
        "right": {
          "density": "Hairs per square centimeter",
          "status": "optimal/normal/thinning",
          "comparison": "Percentage comparison to average"
        }
      },
      "hairline": {
        "density": "Hairs per square centimeter",
        "status": "optimal/normal/thinning",
        "comparison": "Percentage comparison to average"
      },
      "vertex": {
        "density": "Hairs per square centimeter",
        "status": "optimal/normal/thinning",
        "comparison": "Percentage comparison to average"
      }
    }
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

const SECOND_ANALYSIS_PROMPT = `As a hair care professional with expertise from analyzing over 200,000 clinical cases, please provide a comprehensive, friendly yet professional assessment. 

IMPORTANT FORMATTING INSTRUCTIONS:
- Start each bullet point with a dash (-) followed by a space
- Place each bullet point on its own line
- Add a blank line before and after bullet point lists
- Maintain consistent indentation for all bullet points
- Do not use any markdown characters or special formatting
- Keep paragraphs separated by blank lines
- Use clear section numbering without special characters

Please structure your response in these sections:

1. Welcome & Overview
Introduce yourself warmly and share your initial impressions about their hair analysis results.

2. Current Hair Status
Provide a clear, detailed assessment of their hair health, texture, and condition.

Key Findings:
- Current hair health score and what it means
- Texture and porosity assessment
- Scalp condition overview
- Density and growth patterns

3. Growth Phase Understanding
Explain their current hair growth phase distribution.

Phase Distribution:
- Anagen phase percentage and significance
- Telogen phase current status
- Catagen phase observations
- Comparison to optimal ranges

4. Personalized Care Routine

Morning Routine:
- Cleansing recommendations
- Treatment application sequence
- Styling product suggestions
- Protection measures

Evening Routine:
- Deep cleansing steps
- Treatment applications
- Overnight care protocols
- Product rotation schedule

Weekly Special Treatments:
- Deep conditioning protocol
- Scalp treatment schedule
- Specialized care procedures
- Treatment timing recommendations

5. Lifestyle & Environmental Tips

Nutrition Support:
- Essential vitamins and minerals
- Dietary recommendations
- Hydration guidelines
- Supplement suggestions

Exercise Considerations:
- Best workout timing
- Sweat management
- Post-exercise hair care
- Protective styling for activities

6. Seasonal Care Guide

Current Season Focus:
- Environmental protection strategies
- Moisture balance techniques
- Product adjustments needed
- Protection protocols

Next Season Preparation:
- Transitional care steps
- Product rotation plan
- Environmental adaptations
- Preventive measures

7. Treatment Recommendations

Primary Protocol:
- Main treatment focus
- Application frequency
- Expected outcomes
- Progress monitoring

Support Treatments:
- Complementary procedures
- Integration schedule
- Combination benefits
- Application guidelines

8. Progress Goals & Milestones

30-Day Goals:
- Expected improvements
- Monitoring metrics
- Adjustment points
- Success indicators

90-Day Objectives:
- Progress benchmarks
- Measurement criteria
- Adaptation points
- Success markers

9. Emergency Care Tips

Immediate Solutions:
- Quick fix protocols
- Professional intervention triggers
- At-home emergency care
- Warning signs to monitor

10. Product Guide

Essential Products:
- Key ingredients to look for
- Application techniques
- Product synergies
- Shopping recommendations

Clinical Disclaimer:
This analysis is based on advanced AI technology and extensive clinical data. While comprehensive, it should not replace professional medical advice. We recommend scheduling a consultation with a certified trichologist or dermatologist for personalized treatment plans.`;

export const performSecondaryAnalysis = async (analysisData: any, apiKey: string) => {
  console.log('Starting secondary analysis with data:', analysisData);
  
  if (!analysisData || !analysisData.rawMetrics) {
    console.error('Invalid analysis data structure:', analysisData);
    throw new Error('Invalid analysis data structure. Missing raw metrics data.');
  }

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
      temperature: 0.1,
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

    const responseText = data.candidates[0].content.parts[0].text;
    console.log('Raw response text:', responseText);

    // Enhanced text cleaning function to properly handle bullet points
    const cleanedText = responseText
      .replace(/[#*`]/g, '')  // Remove markdown characters
      .replace(/\n{3,}/g, '\n\n')  // Normalize multiple line breaks
      .replace(/(?<![\n])-\s/g, '\n-') // Ensure each bullet point starts on a new line
      .replace(/([.:])\s*-/g, '$1\n\n-') // Add line break after headings before bullet points
      .replace(/\n-\s*([^\n]+)(?!\n)/g, '\n- $1\n') // Add line break after each bullet point
      .replace(/\n{4,}/g, '\n\n\n') // Normalize excessive line breaks
      .trim();

    // Parse the sections based on numbered headings with improved bullet point handling
    const sections = cleanedText.split(/\d+\.\s+/).filter(Boolean);
    
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
