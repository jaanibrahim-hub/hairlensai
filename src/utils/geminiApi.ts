import { toast } from "sonner";

// Client no longer stores API keys. All Gemini calls go through Cloudflare Pages Functions.
export const API_KEYS: string[] = [];

// Model configuration for reference (server uses these)
const MODEL_CONFIG = {
  PRIMARY_MODEL: 'gemini-2.5-flash',
  FALLBACK_MODEL: 'gemini-1.5-flash',
  BASE_URL: 'https://generativelanguage.googleapis.com/v1beta/models',
  MAX_RETRIES: 3,
  RETRY_DELAY: 2000,
} as const;

// Enhanced error types for better error handling
export enum AnalysisErrorType {
  INVALID_IMAGE = 'INVALID_IMAGE',
  API_QUOTA_EXCEEDED = 'API_QUOTA_EXCEEDED',
  MODEL_UNAVAILABLE = 'MODEL_UNAVAILABLE',
  NETWORK_ERROR = 'NETWORK_ERROR',
  PARSING_ERROR = 'PARSING_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export class AnalysisError extends Error {
  constructor(
    public type: AnalysisErrorType,
    message: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'AnalysisError';
  }
}

// Enhanced prompt for advanced AI analysis with specialized hair analysis capabilities
const ENHANCED_ANALYSIS_PROMPT = `As an AI trichologist with advanced computer vision capabilities trained on 100,000+ clinical hair analysis images, perform a comprehensive hair and scalp analysis of this image. Utilize advanced neural networks and pattern recognition trained on dermatological datasets to provide detailed, clinical-grade assessment.

ANALYSIS FOCUS AREAS:

🔬 ADVANCED SCALP ASSESSMENT:
- Regional density mapping (crown, temples, vertex, hairline with specific density values)
- Follicular unit analysis and miniaturization detection
- Sebum production levels and oil distribution patterns
- Inflammatory markers and redness indicators
- Vascular visibility and microcirculation signs
- Scalp pH indicators from visual texture and shine cues

🧬 DETAILED HAIR STRUCTURE:
- Hair diameter variations with root-to-tip measurements
- Cuticle integrity and lifting patterns
- Medulla continuity assessment
- Cross-sectional uniformity analysis
- Growth phase distribution with clinical accuracy
- Hormonal pattern indicators (DHT sensitivity markers)

🎯 ENVIRONMENTAL & DAMAGE ANALYSIS:
- UV damage indicators and color fade patterns
- Chemical treatment effects and structural integrity
- Mechanical damage from styling and heat
- Seasonal adaptation signs
- Nutritional deficiency visual markers
- Age-related changes assessment

Return comprehensive analysis in this enhanced JSON format:

{
  "modelVersion": "gemini-2.5-flash",
  "analysisTimestamp": "ISO timestamp",
  "confidenceScore": "Overall analysis confidence 0-100",
  "metrics": {
    "hairType": "Detailed classification (e.g., 2B-C Mixed, Fine-Medium)",
    "healthStatus": "Comprehensive health assessment with specific indicators",
    "porosity": "Detailed porosity assessment with visual evidence",
    "density": "Precise density with hairs per cm² estimate",
    "elasticity": "Elasticity assessment with stretching indicators",
    "scalpCondition": "Detailed scalp health with inflammation markers",
    "hairLength": "Precise length measurement in inches/cm",
    "chemicalTreatment": "Specific treatment history indicators",
    "protectionLevel": "UV and heat protection assessment",
    "breakageRate": "Precise damage percentage with location mapping",
    "strandThickness": "Detailed thickness with micrometer estimates",
    "follicleDensity": "Regional follicle mapping",
    "hairDiameter": {
      "root": "Root diameter in micrometers",
      "mid": "Mid-shaft diameter",
      "tip": "Tip diameter with taper analysis"
    },
    "growthPhase": "Detailed growth phase distribution",
    "damageAnalysis": "Comprehensive damage mapping"
  },
  "regionalAnalysis": {
    "crown": {
      "density": "Specific density value",
      "healthScore": "0-100",
      "concerns": "Array of specific concerns"
    },
    "temples": {
      "left": {"density": "value", "recession": "assessment"},
      "right": {"density": "value", "recession": "assessment"}
    },
    "vertex": {
      "density": "Vertex density assessment",
      "thinning": "Thinning pattern analysis"
    },
    "hairline": {
      "shape": "Hairline shape and integrity",
      "recession": "Recession pattern if present"
    }
  },
  "overallHealthScore": "Enhanced score 0-100 with detailed breakdown",
  "structuralAnalysis": {
    "hairGrowthCycle": "6-month projection array",
    "curlPatternDistribution": [
      {"Type1_Straight": "numeric percentage (e.g., 25.5)"},
      {"Type2_Wavy": "numeric percentage (e.g., 35.2)"},
      {"Type3_Curly": "numeric percentage (e.g., 30.1)"},
      {"Type4_Coily": "numeric percentage (e.g., 9.2)"}
    ],
    "growthPhaseDistribution": [
      {"Anagen": "numeric percentage (e.g., 85.3)"},
      {"Catagen": "numeric percentage (e.g., 4.2)"},
      {"Telogen": "numeric percentage (e.g., 10.5)"}
    ]
  },
  "microscopicAnalysis": {
    "cuticleLayerScore": "Detailed cuticle assessment 0-100",
    "shaftStructure": {
      "integrity": "Structural integrity 0-100",
      "pattern": "Detailed pattern analysis",
      "uniformity": "Shaft uniformity assessment"
    },
    "medullaAnalysis": {
      "continuity": "Medulla continuity 0-100",
      "thickness": "Medulla thickness relative to shaft"
    },
    "crossSection": {
      "uniformity": "Cross-sectional uniformity 0-100",
      "shape": "Cross-sectional shape analysis"
    },
    "surfaceMapping": {
      "texture": "Surface texture detailed analysis",
      "damage": "Damage pattern mapping",
      "sebumDistribution": "Oil distribution assessment"
    }
  },
  "clinicalCorrelations": {
    "hormonalIndicators": "DHT sensitivity and hormonal pattern signs",
    "nutritionalMarkers": "Vitamin/mineral deficiency indicators",
    "stressIndicators": "Stress-related hair changes",
    "ageFactors": "Age-related changes assessment",
    "geneticPatterns": "Hereditary pattern identification"
  },
  "quickSummary": "Enhanced clinical summary with key findings and confidence levels",
  "hairInformation": {
    "diagnosticAnalysis": "Clinical-grade diagnostic findings with medical terminology",
    "careTips": [
      "Evidence-based care recommendation 1",
      "Clinical care recommendation 2",
      "Professional treatment suggestion 3",
      "Lifestyle modification 4",
      "Product recommendation 5"
    ]
  },
  "recommendedTreatments": {
    "primary": {
      "name": "Primary evidence-based treatment (select from comprehensive database below)",
      "description": "Detailed treatment description with mechanism of action",
      "match": "Precision match percentage (85-98%)",
      "timeline": "Expected results timeline with milestones",
      "contraindications": "Important contraindications and warnings",
      "cost": "Estimated cost range",
      "invasiveness": "Non-invasive/Minimally invasive/Surgical"
    },
    "secondary": {
      "name": "Secondary treatment option (select from database)",
      "description": "Alternative treatment approach with scientific basis",
      "match": "Match percentage (70-95%)",
      "synergy": "Combination potential with primary treatment",
      "timeline": "Expected results timeline"
    },
    "supporting": {
      "name": "Supporting therapy (select from database)",
      "description": "Adjunct treatment description",
      "match": "Support treatment match (60-85%)",
      "frequency": "Recommended frequency and duration"
    },
    "categories": {
      "surgical": [
        "List 3-5 most relevant surgical options from: FUE Hair Transplant, FUT Hair Transplant, DHI (Direct Hair Implantation), Micro FUE, Mega Sessions FUE, Body Hair Transplant, Eyebrow Transplant, Scalp Micropigmentation (SMP), Scalp Reduction Surgery, Hair Flap Surgery, Tissue Expansion, Robotic Hair Transplant (ARTAS), Sapphire FUE, Percutaneous FUE, Strip Harvesting, Follicular Unit Grafting"
      ],
      "medical": [
        "List 5-8 most relevant medical treatments from: Finasteride (Propecia), Dutasteride (Avodart), Minoxidil 2%, Minoxidil 5%, Minoxidil 10%, Topical Finasteride, RU58841, Ketoconazole Shampoo, Nizoral, Spironolactone, Flutamide, Cyproterone Acetate, Estrogen Therapy, Biotin Supplements, Saw Palmetto, Pumpkin Seed Oil, Rosemary Oil, Adenosine, Copper Peptides, Aminexil, Stemoxydine, Procyanidin B-2, Caffeine Solutions, Tretinoin, Azelaic Acid"
      ],
      "procedural": [
        "List 6-10 most relevant procedures from: PRP (Platelet Rich Plasma), PRF (Platelet Rich Fibrin), Stem Cell Therapy, Exosome Therapy, Microneedling, Dermaroller Treatment, Dermapen, LLLT (Low Level Laser Therapy), LED Light Therapy, Scalp Massage Therapy, Ozone Therapy, Mesotherapy, Hair Growth Injections, Scalp Acupuncture, Carboxytherapy, Radiofrequency Treatment, Ultrasound Therapy, Electromagnetic Field Therapy, Cryotherapy, Photobiomodulation"
      ],
      "topical": [
        "List 8-12 most relevant topical treatments from: Minoxidil Foam, Minoxidil Solution, Nanoxidil, Redensyl, Procapil, Capixyl, Baicapil, Follicusan, Trichogen, Sympeptide XLASH, Peptide Complex, Growth Factors, Adenosine Serum, Copper Peptide Serum, Niacinamide, Caffeine Shampoo, Biotin Shampoo, Keratin Treatment, Argan Oil, Castor Oil, Jojoba Oil, Essential Oils Blend, Scalp Serums, Leave-in Treatments, Hair Masks, Protein Treatments"
      ],
      "natural": [
        "List 6-8 most relevant natural treatments from: Rosemary Essential Oil, Peppermint Oil, Lavender Oil, Cedarwood Oil, Thyme Oil, Saw Palmetto Extract, Pumpkin Seed Oil, Green Tea Extract, Ginseng, Bhringraj Oil, Amla Oil, Onion Juice, Aloe Vera, Fenugreek Seeds, Hibiscus, Curry Leaves, Coconut Oil, Olive Oil, Egg Masks, Scalp Massage, Yoga, Meditation, Dietary Changes, Iron Supplements, Vitamin D, Zinc, Omega-3"
      ],
      "lifestyle": [
        "List 5-7 most relevant lifestyle modifications from: Stress Management, Sleep Optimization, Exercise Routine, Nutritional Diet, Hydration, Avoiding Heat Styling, Gentle Hair Handling, Silk Pillowcases, Regular Scalp Cleansing, UV Protection, Smoking Cessation, Alcohol Reduction, Hormone Balance, Weight Management, Blood Sugar Control"
      ]
    },
    "comprehensive_analysis": "Based on the specific hair analysis findings, select the most appropriate treatments from each category above. Provide match percentages based on: hair type compatibility, scalp condition suitability, damage level appropriateness, lifestyle factors, age considerations, and expected effectiveness. Rank treatments by evidence level (clinical studies, peer-reviewed research, case studies).",
    "combination_protocols": [
      "Recommend 3-5 evidence-based treatment combinations with synergistic effects",
      "Include timing, sequencing, and monitoring protocols for combinations",
      "Specify which treatments should not be combined and why"
    ],
    "timeline_expectations": {
      "immediate": "0-4 weeks: What to expect",
      "short_term": "1-3 months: Early results", 
      "medium_term": "3-6 months: Significant changes",
      "long_term": "6-12 months: Full results",
      "maintenance": "12+ months: Ongoing care protocol"
    }
  }
}

CRITICAL ANALYSIS GUIDELINES:
1. Use Gemini 2.5 Flash advanced reasoning for clinical correlations
2. Provide precise numerical values with confidence intervals
3. Correlate visual findings with clinical knowledge
4. Consider demographic factors in analysis (age, gender, ethnicity)
5. Map regional variations across scalp areas
6. Assess both immediate and long-term hair health indicators
7. Integrate environmental and lifestyle factor analysis
8. **COMPREHENSIVE TREATMENT SELECTION: From the 60+ treatments listed above, select the most relevant options for each category based on the specific analysis findings**
9. **EVIDENCE-BASED RANKING: Rank all recommended treatments by scientific evidence level and expected effectiveness for this specific case**
10. Include contraindications and safety considerations for each treatment
11. Offer realistic timeline expectations with milestone markers
12. **PERSONALIZATION: Customize treatment recommendations based on lifestyle, budget considerations, and invasiveness preferences**
13. **COMBINATION THERAPY: Suggest evidence-based treatment combinations with synergistic effects**
14. **PROGRESSIVE PROTOCOL: Design a step-by-step treatment escalation plan from conservative to advanced options**
15. Provide alternative options for different budget ranges and time commitments

**TREATMENT SELECTION MANDATE: You must select from the comprehensive treatment database above to provide users with the best possible recommendations. Choose treatments based on:**

- **Specific hair analysis findings** (density, miniaturization, inflammation)
- **Scalp condition compatibility** (sensitive, oily, dry, inflamed)
- **Severity level appropriateness** (mild, moderate, severe hair loss)
- **Patient demographic factors** (age, gender, lifestyle)
- **Evidence strength** (FDA-approved, clinical trials, case studies)
- **Safety profile** (minimal side effects, contraindications)
- **Cost-effectiveness** (budget-friendly to premium options)
- **Treatment accessibility** (widely available vs specialized clinics)

**COMPREHENSIVE COVERAGE REQUIREMENT: Provide minimum 15-20 treatment recommendations across all categories, with detailed match percentages, timelines, and combination possibilities.**

Ensure all assessments are based on visible evidence with appropriate confidence levels and scientific backing.`;

// Frontend calls serverless function to keep API keys hidden
export const analyzeHairImage = async (imageBase64: string): Promise<any> => {
  if (!validateImage(imageBase64)) {
    throw new AnalysisError(
      AnalysisErrorType.INVALID_IMAGE,
      "Invalid image format or size. Please upload a high-quality JPEG image under 20MB."
    );
  }

  try {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64 })
    });
    if (!res.ok) {
      const msg = await res.text().catch(() => '');
      throw new Error(`Analyze API failed: ${res.status} ${res.statusText} ${msg}`);
    }
    const result = await res.json();
    return result;
  } catch (error) {
    const errorType = determineErrorType(error);
    const errorMessage = getErrorMessage(errorType, error);
    throw new AnalysisError(errorType, errorMessage, error);
  }
};

const validateImage = (imageBase64: string): boolean => {
  try {
    // Basic validation
    if (!imageBase64 || typeof imageBase64 !== 'string') {
      console.warn('Invalid image data: Empty or non-string');
      return false;
    }

    // Remove data URL prefix if present
    const base64Data = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
    
    // Validate base64 format
    if (!/^[A-Za-z0-9+/=]+$/.test(base64Data)) {
      console.warn('Invalid base64 format');
      return false;
    }

    // Check minimum size (must be at least a tiny image)
    if (base64Data.length < 100) {
      console.warn('Image data too small');
      return false;
    }

    // Check file size (max 20MB for Gemini API)
    const sizeInBytes = (base64Data.length * 3) / 4;
    const maxSize = 20 * 1024 * 1024; // 20MB
    
    if (sizeInBytes > maxSize) {
      console.warn(`Image size ${(sizeInBytes / (1024 * 1024)).toFixed(2)}MB exceeds ${maxSize / (1024 * 1024)}MB limit`);
      return false;
    }

    // Optimal size check (warn if very large)
    const optimalSize = 4 * 1024 * 1024; // 4MB
    if (sizeInBytes > optimalSize) {
      console.info(`Image size ${(sizeInBytes / (1024 * 1024)).toFixed(2)}MB is large. Consider compressing for faster analysis.`);
    }

    return true;
  } catch (error) {
    console.warn('Image validation error:', error);
    return false;
  }
};

// Enhanced error handling utilities
const isQuotaError = (error: unknown): boolean => {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return message.includes('quota') || 
           message.includes('rate limit') || 
           message.includes('exceeded') ||
           message.includes('429');
  }
  return false;
};

const determineErrorType = (error: unknown): AnalysisErrorType => {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    
    if (message.includes('quota') || message.includes('rate limit')) {
      return AnalysisErrorType.API_QUOTA_EXCEEDED;
    }
    
    if (message.includes('model') || message.includes('unavailable')) {
      return AnalysisErrorType.MODEL_UNAVAILABLE;
    }
    
    if (message.includes('network') || message.includes('fetch')) {
      return AnalysisErrorType.NETWORK_ERROR;
    }
    
    if (message.includes('json') || message.includes('parse')) {
      return AnalysisErrorType.PARSING_ERROR;
    }
  }
  
  return AnalysisErrorType.UNKNOWN_ERROR;
};

const getErrorMessage = (errorType: AnalysisErrorType, originalError: unknown): string => {
  switch (errorType) {
    case AnalysisErrorType.INVALID_IMAGE:
      return 'Please upload a valid image file (JPEG/PNG) under 20MB in size.';
    
    case AnalysisErrorType.API_QUOTA_EXCEEDED:
      return 'API usage limit reached. Please try again in a few minutes or contact support.';
    
    case AnalysisErrorType.MODEL_UNAVAILABLE:
      return 'AI analysis service is temporarily unavailable. Please try again later.';
    
    case AnalysisErrorType.NETWORK_ERROR:
      return 'Network connection issue. Please check your internet connection and try again.';
    
    case AnalysisErrorType.PARSING_ERROR:
      return 'Analysis completed but results could not be processed. Please try again.';
    
    case AnalysisErrorType.UNKNOWN_ERROR:
    default:
      return `Analysis failed: ${originalError instanceof Error ? originalError.message : 'Unknown error occurred'}`;
  }
};

// Delay utility for retries
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Enhanced API call with retry logic and model fallback
// The client no longer calls Gemini directly. Kept for reference but unused.
async function makeApiCallWithRetry(
  imageBase64: string, 
  apiKey: string, 
  modelName: string,
  retryCount = 0
): Promise<any> {
  if (!validateImage(imageBase64)) {
    throw new AnalysisError(
      AnalysisErrorType.INVALID_IMAGE,
      "Invalid image format or size"
    );
  }

  try {
    console.log(`🔄 API call attempt ${retryCount + 1}/${MODEL_CONFIG.MAX_RETRIES + 1} with ${modelName}`);
    
    // Adjust config based on model
    const isGemini25 = modelName === MODEL_CONFIG.PRIMARY_MODEL;
    const maxTokens = isGemini25 ? 65536 : 8192;
    
    const requestBody = {
      contents: [
        {
          parts: [
            { text: ENHANCED_ANALYSIS_PROMPT },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: imageBase64.replace(/^data:image\/[a-z]+;base64,/, ''),
              },
            },
          ],
        },
      ],
      generationConfig: {
        temperature: isGemini25 ? 0.2 : 0.3,
        topK: 32,
        topP: isGemini25 ? 0.85 : 0.8,
        maxOutputTokens: maxTokens,
        candidateCount: 1,
        ...(isGemini25 && { responseMimeType: "application/json" })
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
    };
    
    const response = await fetch(
      `${MODEL_CONFIG.BASE_URL}/${modelName}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      
      console.error('API Error:', {
        model: modelName,
        status: response.status,
        statusText: response.statusText,
        errorData
      });

      // Handle specific error cases
      if (response.status === 429 && retryCount < MODEL_CONFIG.MAX_RETRIES) {
        console.log(`⏳ Rate limited, retrying in ${MODEL_CONFIG.RETRY_DELAY}ms...`);
        await delay(MODEL_CONFIG.RETRY_DELAY * (retryCount + 1));
        return makeApiCallWithRetry(imageBase64, apiKey, modelName, retryCount + 1);
      }

      if (response.status === 429) {
        throw new AnalysisError(
          AnalysisErrorType.API_QUOTA_EXCEEDED,
          'API rate limit exceeded. Please try again later.'
        );
      }

      if (response.status >= 500 && retryCount < MODEL_CONFIG.MAX_RETRIES) {
        console.log(`🔄 Server error, retrying in ${MODEL_CONFIG.RETRY_DELAY}ms...`);
        await delay(MODEL_CONFIG.RETRY_DELAY * (retryCount + 1));
        return makeApiCallWithRetry(imageBase64, apiKey, modelName, retryCount + 1);
      }

      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`✅ Raw API response from ${modelName}:`, data);
    
    // Enhanced logging for response content analysis
    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      const responseText = data.candidates[0].content.parts[0].text;
      console.log('🔍 Response text preview:', responseText.substring(0, 1000));
      console.log('🔍 Looking for structuralAnalysis in response...');
      
      // Check if response contains growth phase or curl pattern data
      if (responseText.includes('growthPhaseDistribution')) {
        console.log('✅ Found growthPhaseDistribution in response');
      } else {
        console.log('❌ growthPhaseDistribution NOT found in response');
      }
      
      if (responseText.includes('curlPatternDistribution')) {
        console.log('✅ Found curlPatternDistribution in response');
      } else {
        console.log('❌ curlPatternDistribution NOT found in response');
      }
    }
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.warn('Invalid response format from API');
      throw new AnalysisError(
        AnalysisErrorType.PARSING_ERROR,
        'Invalid response format from AI service'
      );
    }

    const responseText = data.candidates[0].content.parts[0].text;
    console.log('Response text length:', responseText.length);
    
    return parseAnalysisResponse(responseText, modelName);
    
  } catch (error) {
    console.error(`❌ Error with ${modelName} and key ${apiKey.substring(0, 5)}...`, error);
    
    if (error instanceof AnalysisError) {
      throw error;
    }
    
    if (retryCount < MODEL_CONFIG.MAX_RETRIES && !isQuotaError(error)) {
      console.log(`🔄 Retrying API call in ${MODEL_CONFIG.RETRY_DELAY}ms...`);
      await delay(MODEL_CONFIG.RETRY_DELAY * (retryCount + 1));
      return makeApiCallWithRetry(imageBase64, apiKey, modelName, retryCount + 1);
    }
    
    throw error;
  }
}

// Enhanced response parsing with better error handling
function parseAnalysisResponse(responseText: string, modelName: string): any {
  try {
    // First try to parse as direct JSON (Gemini 2.5 with responseMimeType)
    if (modelName === MODEL_CONFIG.PRIMARY_MODEL) {
      try {
        const directJson = JSON.parse(responseText);
        console.log('✅ Parsed direct JSON response from Gemini 2.5');
        return directJson;
      } catch (e) {
        // Fall through to markdown parsing
        console.log('Direct JSON parse failed, trying markdown extraction...');
      }
    }
    
    // Extract JSON from markdown formatting
    let jsonText = responseText;
    
    if (responseText.includes('```json')) {
      const jsonMatch = responseText.match(/```json\s*\n([\s\S]*?)\n\s*```/);
      if (jsonMatch) {
        jsonText = jsonMatch[1].trim();
      } else {
        jsonText = responseText.split('```json')[1]?.split('```')[0]?.trim() || responseText;
      }
    } else if (responseText.includes('```')) {
      // Handle generic code blocks
      const codeMatch = responseText.match(/```[a-zA-Z]*\s*\n([\s\S]*?)\n\s*```/);
      if (codeMatch) {
        jsonText = codeMatch[1].trim();
      }
    }
    
    // Clean up common JSON formatting issues
    jsonText = jsonText
      .replace(/^\s*```json\s*/, '')
      .replace(/\s*```\s*$/, '')
      .replace(/,\s*}/g, '}')
      .replace(/,\s*]/g, ']')
      .trim();
    
    const parsedData = JSON.parse(jsonText);
    console.log('✅ Successfully parsed analysis response');
    
    // Enhanced debugging for structural analysis data
    if (parsedData.structuralAnalysis) {
      console.log('🔍 PARSED structuralAnalysis:', parsedData.structuralAnalysis);
      
      if (parsedData.structuralAnalysis.growthPhaseDistribution) {
        console.log('🔍 PARSED growthPhaseDistribution:', parsedData.structuralAnalysis.growthPhaseDistribution);
        console.log('🔍 Growth phase data type:', typeof parsedData.structuralAnalysis.growthPhaseDistribution);
        console.log('🔍 Growth phase array length:', Array.isArray(parsedData.structuralAnalysis.growthPhaseDistribution) ? parsedData.structuralAnalysis.growthPhaseDistribution.length : 'Not an array');
      } else {
        console.log('❌ No growthPhaseDistribution in parsed data');
      }
      
      if (parsedData.structuralAnalysis.curlPatternDistribution) {
        console.log('🔍 PARSED curlPatternDistribution:', parsedData.structuralAnalysis.curlPatternDistribution);
        console.log('🔍 Curl pattern data type:', typeof parsedData.structuralAnalysis.curlPatternDistribution);
        console.log('🔍 Curl pattern array length:', Array.isArray(parsedData.structuralAnalysis.curlPatternDistribution) ? parsedData.structuralAnalysis.curlPatternDistribution.length : 'Not an array');
      } else {
        console.log('❌ No curlPatternDistribution in parsed data');
      }
    } else {
      console.log('❌ No structuralAnalysis in parsed data');
    }
    
    // Add metadata
    parsedData._modelUsed = modelName;
    parsedData._responseLength = responseText.length;
    
    return parsedData;
    
  } catch (parseError) {
    console.error('❌ JSON parsing failed:', {
      error: parseError,
      responseLength: responseText.length,
      responsePreview: responseText.substring(0, 500)
    });
    
    throw new AnalysisError(
      AnalysisErrorType.PARSING_ERROR,
      `Failed to parse AI response: ${parseError instanceof Error ? parseError.message : 'Unknown parsing error'}`
    );
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

export const performSecondaryAnalysis = async (analysisData: any) => {
  console.log('🚀 Starting enhanced secondary analysis with Gemini 2.5 Flash');
  
  if (!analysisData || !analysisData.rawMetrics) {
    console.error('Invalid analysis data structure:', analysisData);
    throw new AnalysisError(
      AnalysisErrorType.INVALID_IMAGE,
      'Invalid analysis data structure. Missing raw metrics data.'
    );
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

  // Enhanced prompt with Gemini 2.5 Flash context
  const enhancedSecondaryPrompt = `
    You are an advanced AI trichologist using Gemini 2.5 Flash capabilities. Provide comprehensive, personalized hair care analysis based on this data:
    
    ANALYSIS INPUT DATA:
    Model Used: ${analysisData._modelUsed || 'gemini-2.5-flash'}
    Health Score: ${analysisData.overallHealthScore || analysisData.healthScore || 'N/A'}
    Confidence Score: ${analysisData.confidenceScore || 'N/A'}
    
    PRIMARY HAIR METRICS:
    Hair Type: ${analysisData.rawMetrics.hairType || 'Type 2A (Default)'}
    Scalp Condition: ${analysisData.rawMetrics.scalpCondition || 'Normal (Default)'}
    Porosity: ${analysisData.rawMetrics.porosity || 'Medium (Default)'}
    
    COMPREHENSIVE METRICS:
    ${Object.entries(analysisData.rawMetrics)
      .filter(([key]) => !requiredMetrics.includes(key))
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n    ')}
    
    REGIONAL ANALYSIS:
    ${analysisData.regionalAnalysis ? 
      Object.entries(analysisData.regionalAnalysis)
        .map(([region, data]) => `${region}: ${JSON.stringify(data)}`)
        .join('\n    ') 
      : 'No regional data available'
    }
    
    CLINICAL CORRELATIONS:
    ${analysisData.clinicalCorrelations ? 
      Object.entries(analysisData.clinicalCorrelations)
        .map(([factor, assessment]) => `${factor}: ${assessment}`)
        .join('\n    ')
      : 'No clinical correlations available'
    }
    
    ${SECOND_ANALYSIS_PROMPT}
  `;

  // Check token limits for Gemini 2.5 Flash
  const estimatedTokens = enhancedSecondaryPrompt.length / 4;
  if (estimatedTokens > 1000000) {
    throw new AnalysisError(
      AnalysisErrorType.PARSING_ERROR,
      'Analysis data too large for processing'
    );
  }

  const requestBody = {
    contents: [{
      role: "user",
      parts: [{ text: enhancedSecondaryPrompt }]
    }],
    generationConfig: {
      temperature: 0.15, // Optimized for Gemini 2.5 Flash thinking
      topK: 32,
      topP: 0.9,
      maxOutputTokens: 65536, // Full Gemini 2.5 Flash capacity
      candidateCount: 1
    }
  };

  let lastError: unknown;
  
  // Try primary model first, then fallback
  // Offload to serverless function to keep keys secret
  try {
    const res = await fetch('/api/secondary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ analysisData })
    });
    if (!res.ok) {
      const msg = await res.text().catch(() => '');
      throw new Error(`Secondary API failed: ${res.status} ${res.statusText} ${msg}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    throw new AnalysisError(determineErrorType(error), getErrorMessage(determineErrorType(error), error), error);
  }

  // Legacy client-side path (not used anymore)
  for (const model of [MODEL_CONFIG.PRIMARY_MODEL, MODEL_CONFIG.FALLBACK_MODEL]) {
    try {
      console.log(`🔄 Secondary analysis attempt with ${model}`);
      
      const response = await fetch(
        `${MODEL_CONFIG.BASE_URL}/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error(`Secondary analysis API error with ${model}:`, errorData);
        
        if (response.status === 429) {
          lastError = new AnalysisError(
            AnalysisErrorType.API_QUOTA_EXCEEDED,
            'Secondary analysis quota exceeded'
          );
        } else {
          lastError = new Error(`API request failed: ${response.statusText}`);
        }
        
        // Try fallback model if primary fails
        if (model === MODEL_CONFIG.PRIMARY_MODEL) {
          continue;
        } else {
          throw lastError;
        }
      }

      const data = await response.json();
      console.log(`✅ Secondary analysis response from ${model}:`, data);

      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new AnalysisError(
          AnalysisErrorType.PARSING_ERROR,
          'Malformed secondary analysis response'
        );
      }

      const responseText = data.candidates[0].content.parts[0].text;
      console.log('Secondary analysis response text length:', responseText.length);

      // Enhanced text cleaning function for Gemini 2.5 Flash outputs
      const cleanedText = responseText
        .replace(/[#*`]/g, '')  // Remove markdown characters
        .replace(/\n{3,}/g, '\n\n')  // Normalize multiple line breaks
        .replace(/(?<![\n])-\s/g, '\n-') // Ensure each bullet point starts on a new line
        .replace(/([.:])\s*-/g, '$1\n\n-') // Add line break after headings before bullet points
        .replace(/\n-\s*([^\n]+)(?!\n)/g, '\n- $1\n') // Add line break after each bullet point
        .replace(/\n{4,}/g, '\n\n\n') // Normalize excessive line breaks
        .trim();

      // Parse sections with enhanced handling for Gemini 2.5 outputs
      const sections = cleanedText.split(/\d+\.\s+/).filter(Boolean);
      
      // Create enhanced structured response
      const structuredResponse = {
        _modelUsed: model,
        _analysisTimestamp: new Date().toISOString(),
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

      console.log(`✅ Secondary analysis completed successfully with ${model}`);
      return structuredResponse;
      
    } catch (error) {
      lastError = error;
      console.error(`❌ Secondary analysis failed with ${model}:`, error);
      
      // Continue to fallback model if primary fails
      if (model === MODEL_CONFIG.PRIMARY_MODEL) {
        continue;
      } else {
        break;
      }
    }
  }

  // All models failed
  console.error('❌ All secondary analysis attempts failed');
  const errorType = determineErrorType(lastError);
  const errorMessage = getErrorMessage(errorType, lastError);
  
  toast.error(`Secondary analysis failed: ${errorMessage}`);
  throw new AnalysisError(errorType, errorMessage, lastError);
};
