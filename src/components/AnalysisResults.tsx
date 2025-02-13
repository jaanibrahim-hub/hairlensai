import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Brain, Activity, Heart, Droplet, Wind, Microscope, Ruler, Leaf, ShieldCheck, MapPin, Clipboard, Pill } from "lucide-react";
import { API_KEYS } from "@/utils/geminiApi";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  RadialLinearScale,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import AdvancedAnalysis from "./AdvancedAnalysis";
import { performSecondaryAnalysis } from "@/utils/geminiApi";
import { SecondaryAnalysisResponse } from "@/types/analysis";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  RadialLinearScale
);

interface HairDiameter {
  root: string;
  tip: string;
}

interface AnalysisResult {
  metrics: {
    icon: string;
    label: string;
    value: string;
    color?: string;
  }[];
  rawMetrics: {
    hairType?: string;
    healthStatus?: string;
    porosity?: string;
    density?: string;
    elasticity?: string;
    scalpCondition?: string;
    hairLength?: string;
    chemicalTreatment?: string;
    protectionLevel?: string;
    breakageRate?: string;
    strandThickness?: string;
    follicleDensity?: string;
    hairDiameter?: {
      root: string;
      tip: string;
    };
    growthPhase?: string;
    damageAnalysis?: string;
  };
  healthScore: number;
  healthData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      fill: boolean;
    }[];
  };
  curlPatternData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      fill: boolean;
    }[];
  };
  growthPhaseData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      fill: boolean;
    }[];
  };
  structuralAnalysis?: {
    hairGrowthCycle: number[];
    curlPatternDistribution: Array<Record<string, number>>;
    growthPhaseDistribution: Array<Record<string, number>>;
  };
  microscopicAnalysis?: {
    cuticleLayerScore: number;
    shaftStructure: {
      integrity: number;
      pattern: string;
    };
    medullaAnalysis: {
      continuity: number;
    };
    crossSection: {
      uniformity: number;
    };
    surfaceMapping: {
      texture: string;
      damage: string;
    };
  };
  quickSummary?: string;
  hairInformation?: {
    diagnosticAnalysis: string;
    careTips: string[];
  };
  recommendedTreatments?: {
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

const defaultHealthData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Hair Health',
      data: [65, 70, 68, 72, 75, 76],
      borderColor: '#9b87f5',
      backgroundColor: 'rgba(155, 135, 245, 0.1)',
      fill: true,
    }
  ]
};

const defaultMetrics = [
  { icon: "cut", label: "Hair Type", value: "Type 2B Wavy" },
  { icon: "heart", label: "Health Status", value: "Requires Attention", color: "text-yellow-400" },
  { icon: "seedling", label: "Porosity", value: "Medium" },
  { icon: "temperature-high", label: "Density", value: "Medium-High" },
  { icon: "tint", label: "Elasticity", value: "Good" },
  { icon: "sun", label: "Scalp Condition", value: "Mild Inflammation" },
  { icon: "ruler-vertical", label: "Hair Length", value: "Medium (12-16 inches)" },
  { icon: "flask", label: "Chemical Treatment", value: "Minimal" },
  { icon: "shield-alt", label: "Protection Level", value: "Moderate" },
  { icon: "scissors", label: "Breakage Rate", value: "7% (Low)" },
  { icon: "microscope", label: "Strand Thickness", value: "0.08mm (Medium)" },
  { icon: "grip-lines", label: "Follicle Density", value: "165 hairs/cm²" },
  { icon: "ruler", label: "Hair Diameter", value: "Root: 0.09mm, Tip: 0.06mm" },
  { icon: "percent", label: "Growth Phase", value: "85% Anagen" },
  { icon: "exclamation-triangle", label: "Damage Analysis", value: "Minimal" },
];

const defaultRawMetrics = {
  hairType: "Type 2B Wavy",
  healthStatus: "Requires Attention",
  porosity: "Medium",
  density: "Medium-High",
  elasticity: "Good",
  scalpCondition: "Mild Inflammation",
  hairLength: "Medium (12-16 inches)",
  chemicalTreatment: "Minimal",
  protectionLevel: "Moderate",
  breakageRate: "7% (Low)",
  strandThickness: "0.08mm (Medium)",
  follicleDensity: "165 hairs/cm²",
  hairDiameter: {
    root: "0.09mm",
    tip: "0.06mm"
  },
  growthPhase: "85% Anagen",
  damageAnalysis: "Minimal"
};

const defaultRecommendedTreatments = {
  primary: {
    name: "FUE Treatment",
    description: "Follicular Unit Extraction for natural-looking results",
    match: 98
  },
  secondary: {
    name: "PRP Treatment",
    description: "Platelet-Rich Plasma therapy for enhanced growth",
    match: 85
  },
  supporting: {
    name: "Scalp Treatment",
    description: "Deep conditioning and scalp therapy",
    match: 75
  },
  other: [
    { name: "Hair Transplant", match: 65 },
    { name: "FUT", match: 45 },
    { name: "SMP", match: 40 },
    { name: "Micro FUE", match: 55 }
  ]
};

const transformApiResponse = (apiResponse: any): AnalysisResult => {
  const rawMetrics = apiResponse.metrics || {};

  const metricsArray = Object.entries(apiResponse.metrics || {}).map(([key, value]) => {
    const getIcon = (key: string) => {
      const iconMap: { [key: string]: string } = {
        hairType: "cut",
        healthStatus: "heart",
        porosity: "seedling",
        density: "temperature-high",
        elasticity: "tint",
        scalpCondition: "sun",
        hairLength: "ruler-vertical",
        chemicalTreatment: "flask",
        protectionLevel: "shield-alt",
        breakageRate: "scissors",
        strandThickness: "microscope",
        follicleDensity: "grip-lines",
        hairDiameter: "ruler",
        growthPhase: "percent",
        damageAnalysis: "exclamation-triangle"
      };
      return iconMap[key] || "info";
    };

    let displayValue: string;
    if (typeof value === 'object' && value !== null && 'root' in value && 'tip' in value) {
      const hairDiameter = value as { root: string; tip: string };
      displayValue = `Root: ${hairDiameter.root}, Tip: ${hairDiameter.tip}`;
    } else if (typeof value === 'object' && value !== null) {
      displayValue = Object.entries(value)
        .map(([k, v]) => `${k}: ${v}%`)
        .join(', ');
    } else {
      displayValue = String(value);
    }

    return {
      icon: getIcon(key),
      label: key.split(/(?=[A-Z])/).join(" "),
      value: displayValue,
      color: key === 'healthStatus' && value !== 'Good' ? 'text-yellow-400' : undefined
    };
  });

  const healthData = {
    labels: ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'],
    datasets: [{
      label: 'Hair Growth Cycle',
      data: apiResponse.structuralAnalysis?.hairGrowthCycle || [65, 70, 68, 72, 75, 76],
      borderColor: '#9b87f5',
      backgroundColor: 'rgba(155, 135, 245, 0.1)',
      fill: true,
    }]
  };

  const curlPatternData = {
    labels: [],
    datasets: [{
      label: 'Curl Pattern',
      data: [],
      borderColor: '#9b87f5',
      backgroundColor: 'rgba(155, 135, 245, 0.1)',
      fill: true,
    }]
  };

  if (apiResponse.structuralAnalysis?.curlPatternDistribution) {
    const distribution = apiResponse.structuralAnalysis.curlPatternDistribution;
    console.log("Curl Pattern Distribution:", distribution);
    
    if (Array.isArray(distribution)) {
      distribution.forEach(item => {
        const [key, value] = Object.entries(item)[0];
        curlPatternData.labels.push(key);
        curlPatternData.datasets[0].data.push(value);
      });
    }
  } else {
    curlPatternData.labels = ['Straight', 'Wavy', 'Curly', 'Coily'];
    curlPatternData.datasets[0].data = [30, 40, 20, 10];
  }

  const growthPhaseData = {
    labels: [],
    datasets: [{
      label: 'Growth Phase',
      data: [],
      borderColor: '#9b87f5',
      backgroundColor: 'rgba(153, 102, 255, 0.1)',
      fill: true,
    }]
  };

  if (apiResponse.structuralAnalysis?.growthPhaseDistribution) {
    const distribution = apiResponse.structuralAnalysis.growthPhaseDistribution;
    console.log("Growth Phase Distribution:", distribution);
    
    if (Array.isArray(distribution)) {
      distribution.forEach(item => {
        const [key, value] = Object.entries(item)[0];
        growthPhaseData.labels.push(key);
        growthPhaseData.datasets[0].data.push(value);
      });
    }
  } else {
    growthPhaseData.labels = ['Anagen', 'Catagen', 'Telogen'];
    growthPhaseData.datasets[0].data = [85, 5, 10];
  }

  return {
    metrics: metricsArray,
    rawMetrics: rawMetrics,
    healthScore: Number(apiResponse.overallHealthScore) || 76,
    healthData,
    curlPatternData,
    growthPhaseData,
    structuralAnalysis: apiResponse.structuralAnalysis,
    quickSummary: apiResponse.quickSummary,
    hairInformation: apiResponse.hairInformation,
    recommendedTreatments: apiResponse.recommendedTreatments,
  };
};

interface AnalysisResultsProps {
  apiKey: string | null;
}

const AnalysisResults = ({ apiKey }: AnalysisResultsProps) => {
  const [analysisData, setAnalysisData] = useState<AnalysisResult>({
    metrics: defaultMetrics,
    rawMetrics: defaultRawMetrics,
    healthScore: 80,
    healthData: defaultHealthData,
    curlPatternData: {
      labels: ['Straight', 'Wavy', 'Curly'],
      datasets: [{
        label: 'Curl Pattern',
        data: [30, 40, 30],
        borderColor: '#9b87f5',
        backgroundColor: 'rgba(155, 135, 245, 0.1)',
        fill: true,
      }]
    },
    growthPhaseData: {
      labels: ['Anagen', 'Catagen', 'Telogen'],
      datasets: [{
        label: 'Growth Phase',
        data: [85, 5, 10],
        borderColor: '#9b87f5',
        backgroundColor: 'rgba(155, 135, 245, 0.1)',
        fill: true,
      }]
    },
    recommendedTreatments: defaultRecommendedTreatments
  });
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();
  const [hasResults, setHasResults] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [isGeminiLoading, setIsGeminiLoading] = useState(false);
  const [geminiAnalysis, setGeminiAnalysis] = useState<SecondaryAnalysisResponse | null>(null);
  const [showGeminiDialog, setShowGeminiDialog] = useState(false);

  useEffect(() => {
    const handleAnalysisComplete = (event: CustomEvent<any>) => {
      console.log('Analysis results received:', event.detail);
      if (event.detail) {
        const transformedData = transformApiResponse(event.detail);
        setAnalysisData(transformedData);
        setHasResults(true);
      }
    };

    window.addEventListener('hairAnalysisComplete', handleAnalysisComplete as EventListener);

    return () => {
      window.removeEventListener('hairAnalysisComplete', handleAnalysisComplete as EventListener);
    };
  }, []);

  const handleAIDoctorClick = async () => {
    if (!apiKey) {
      toast({
        title: "Premium Feature",
        description: "Please activate premium access to use the AI Doctor feature.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setShowAIDialog(true);
    setIsLoadingAI(true);

    try {
      console.log("Making Perplexity API call with data:", {
        healthScore: analysisData.healthScore,
        metrics: analysisData.metrics,
      });

      const requestBody = {
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: 'You are an AI Hair Doctor analyzing hair and scalp conditions. Provide detailed, professional analysis.'
          },
          {
            role: 'user',
            content: `Analyze this hair data: 
              Health Score: ${analysisData.healthScore}
              Quick Summary: ${analysisData.quickSummary}
              Metrics: ${JSON.stringify(analysisData.metrics)}
              Please provide a detailed analysis, recommendations, and treatment plan.`
          }
        ],
        temperature: 0.2,
        max_tokens: 2000,
      };

      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        mode: 'cors',
        credentials: 'omit',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log("API Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("Perplexity API error response:", {
          status: response.status,
          statusText: response.statusText,
          errorData
        });
        throw new Error(errorData?.error?.message || `API request failed: ${response.statusText}`);
      }

      console.log("Perplexity API response received");
      const data = await response.json();
      console.log("Perplexity API response data:", data);
      
      if (!data.choices?.[0]?.message?.content) {
        throw new Error('Invalid response format from API');
      }
      
      setAiAnalysis(data.choices[0].message.content);
    } catch (error) {
      console.error("Error calling Perplexity API:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get AI analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingAI(false);
      setIsAnalyzing(false);
    }
  };

  const handleGeminiAnalysis = async () => {
    setIsGeminiLoading(true);
    setShowGeminiDialog(true);

    try {
      toast({
        title: "Analysis Started",
        description: "Processing your hair analysis data...",
      });

      const secondaryAnalysis = await performSecondaryAnalysis(analysisData, API_KEYS[0]);

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
      productGuide: sections[9]?.trim() || "Product guide section not found",
      professionalConsultation: sections[10]?.trim() || "Professional consultation section not found"
    };

    console.log('Structured response:', structuredResponse);
    return structuredResponse;
      setGeminiAnalysis(secondaryAnalysis);
      
      toast({
        title: "Analysis Complete",
        description: "Your detailed hair analysis is ready!",
      });
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get AI analysis",
        variant: "destructive",
      });
    } finally {
      setIsGeminiLoading(false);
    }
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#9b87f5',
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        padding: 12,
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleFont: {
          size: 14
        },
        bodyFont: {
          size: 13
        }
      },
    },
  };

  const growthPhaseData = {
    labels: analysisData.growthPhaseData.labels,
    datasets: [{
      label: 'Growth Phase',
      data: analysisData.growthPhaseData.datasets[0].data,
      backgroundColor: [
        '#0EA5E9', // Ocean Blue for Anagen
        '#9b87f5', // Purple for Catagen
        '#F97316'  // Orange for Telogen
      ],
      borderColor: 'transparent'
    }]
  };

  const curlPatternData = {
    labels: analysisData.curlPatternData.labels,
    datasets: [{
      label: 'Curl Pattern',
      data: analysisData.curlPatternData.datasets[0].data,
      backgroundColor: [
        '#9b87f5', // Primary Purple
        '#F97316', // Bright Orange
        '#0EA5E9', // Ocean Blue
        '#D946EF'  // Magenta Pink
      ],
      borderColor: 'transparent'
    }]
  };

  interface RegionalDensity {
    overall: string;
    regions: {
      crown: {
        density: string;
        status: string;
        comparison: string;
      };
      temples: {
        left: {
          density: string;
          status: string;
          comparison: string;
        };
        right: {
          density: string;
          status: string;
          comparison: string;
        };
      };
      hairline: {
        density: string;
        status: string;
        comparison: string;
      };
      vertex: {
        density: string;
        status: string;
        comparison: string;
      };
    };
  }

  const renderHealthScoreCard = () => {
    const hydrationScore = analysisData.microscopicAnalysis?.cuticleLayerScore || 0;
    const growthScore = analysisData.structuralAnalysis?.growthPhaseDistribution?.find(
      phase => 'Anagen' in phase
    )?.['Anagen'] || 0;
    const shaftIntegrityScore = analysisData.microscopicAnalysis?.shaftStructure?.integrity || 0;
    const medullaScore = analysisData.microscopicAnalysis?.medullaAnalysis?.continuity || 0;
    const surfaceScore = analysisData.microscopicAnalysis?.surfaceMapping?.texture ? 85 : 0;
    const protectionScore = analysisData.recommendedTreatments?.primary?.match || 0;

    // Default regional density data if not provided by API
    const regionalDensity: RegionalDensity = {
      overall: "170 hairs/cm²",
      regions: {
        crown: {
          density: "180 hairs/cm²",
          status: "optimal",
          comparison: "+5% above average"
        },
        temples: {
          left: {
            density: "165 hairs/cm²",
            status: "normal",
            comparison: "-3% below average"
          },
          right: {
            density: "162 hairs/cm²",
            status: "normal",
            comparison: "-5% below average"
          }
        },
        hairline: {
          density: "155 hairs/cm²",
          status: "thinning",
          comparison: "-10% below average"
        },
        vertex: {
          density: "175 hairs/cm²",
          status: "optimal",
          comparison: "+2% above average"
        }
      }
    };

    const getStatusColor = (status: string) => {
      switch (status.toLowerCase()) {
        case 'optimal':
          return 'text-green-400';
        case 'normal':
          return 'text-blue-400';
        case 'thinning':
          return 'text-yellow-400';
        default:
          return 'text-gray-400';
      }
    };

    return (
      <div className="bg-gray-800/80 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <Heart className="w-5 h-5 text-purple-400" />
            Overall Health Score
          </h3>
          <div className="text-3xl font-bold text-purple-400">
            {analysisData.healthScore}%
          </div>
        </div>
        
        <Progress 
          value={analysisData.healthScore} 
          className="h-3 mb-4"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          <div className="bg-gray-700/50 rounded-lg p-4 flex items-center gap-3">
            <Droplet className="w-5 h-5 text-blue-400" />
            <div>
              <div className="text-sm text-gray-300">Hydration</div>
              <div className="text-lg font-semibold text-white">{hydrationScore}%</div>
            </div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4 flex items-center gap-3">
            <Activity className="w-5 h-5 text-green-400" />
            <div>
              <div className="text-sm text-gray-300">Growth Rate</div>
              <div className="text-lg font-semibold text-white">{growthScore}%</div>
            </div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4 flex items-center gap-3">
            <Microscope className="w-5 h-5 text-yellow-400" />
            <div>
              <div className="text-sm text-gray-300">Shaft Integrity</div>
              <div className="text-lg font-semibold text-white">{shaftIntegrityScore}%</div>
            </div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4 flex items-center gap-3">
            <Ruler className="w-5 h-5 text-pink-400" />
            <div>
              <div className="text-sm text-gray-300">Medulla Score</div>
              <div className="text-lg font-semibold text-white">{medullaScore}%</div>
            </div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4 flex items-center gap-3">
            <Leaf className="w-5 h-5 text-emerald-400" />
            <div>
              <div className="text-sm text-gray-300">Surface Quality</div>
              <div className="text-lg font-semibold text-white">{surfaceScore}%</div>
            </div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <div>
              <div className="text-sm text-gray-300">Protection Level</div>
              <div className="text-lg font-semibold text-white">{protectionScore}%</div>
            </div>
          </div>
        </div>

        {/* New Regional Density Analysis Card */}
        <div className="col-span-full bg-gray-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-semibold">Regional Density Analysis</h3>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-300">Overall Density</div>
              <div className="text-lg font-semibold text-purple-400">{regionalDensity.overall}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Crown Region */}
            <div className="bg-gray-800/50 rounded-lg p-3">
              <div className="text-sm text-gray-300">Crown</div>
              <div className="text-lg font-semibold">{regionalDensity.regions.crown.density}</div>
              <div className={`text-xs ${getStatusColor(regionalDensity.regions.crown.status)}`}>
                {regionalDensity.regions.crown.comparison}
              </div>
            </div>

            {/* Temples (Left) */}
            <div className="bg-gray-800/50 rounded-lg p-3">
              <div className="text-sm text-gray-300">Left Temple</div>
              <div className="text-lg font-semibold">{regionalDensity.regions.temples.left.density}</div>
              <div className={`text-xs ${getStatusColor(regionalDensity.regions.temples.left.status)}`}>
                {regionalDensity.regions.temples.left.comparison}
              </div>
            </div>

            {/* Temples (Right) */}
            <div className="bg-gray-800/50 rounded-lg p-3">
              <div className="text-sm text-gray-300">Right Temple</div>
              <div className="text-lg font-semibold">{regionalDensity.regions.temples.right.density}</div>
              <div className={`text-xs ${getStatusColor(regionalDensity.regions.temples.right.status)}`}>
                {regionalDensity.regions.temples.right.comparison}
              </div>
            </div>

            {/* Vertex */}
            <div className="bg-gray-800/50 rounded-lg p-3">
              <div className="text-sm text-gray-300">Vertex</div>
              <div className="text-lg font-semibold">{regionalDensity.regions.vertex.density}</div>
              <div className={`text-xs ${getStatusColor(regionalDensity.regions.vertex.status)}`}>
                {regionalDensity.regions.vertex.comparison}
              </div>
            </div>

            {/* Hairline (Full Width) */}
            <div className="col-span-full bg-gray-800/50 rounded-lg p-3">
              <div className="text-sm text-gray-300">Hairline</div>
              <div className="text-lg font-semibold">{regionalDensity.regions.hairline.density}</div>
              <div className={`text-xs ${getStatusColor(regionalDensity.regions.hairline.status)}`}>
                {regionalDensity.regions.hairline.comparison}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAnalysisCard = (
    title: string, 
    content: string | Record<string, string> | Array<{category: string, recommendations: string[]}>,
    icon: React.ReactNode,
    gradientClasses: string
  ) => {
    const renderContent = () => {
      if (typeof content === 'string') {
        return (
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-200 leading-relaxed">{content}</p>
          </div>
        );
      } else if (Array.isArray(content)) {
        return content.map((item, index) => (
          <div key={index} className="mt-4">
            <h4 className="text-lg font-medium text-white mb-2">{item.category}</h4>
            <ul className="list-disc list-inside space-y-2">
              {item.recommendations.map((rec, recIndex) => (
                <li key={recIndex} className="text-gray-200">{rec}</li>
              ))}
            </ul>
          </div>
        ));
      } else {
        return Object.entries(content).map(([key, value], index) => (
          <div key={index} className="mt-4">
            <h4 className="text-lg font-medium text-white mb-2">
              {key.split(/(?=[A-Z])/).join(" ").replace(/_/g, " ")}
            </h4>
            <p className="text-gray-200 leading-relaxed">{value}</p>
          </div>
        ));
      }
    };

    return (
      <div className={`${gradientClasses} rounded-xl p-6 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 mb-6`}>
        <div className="flex items-center gap-3 mb-4">
          {icon}
          <h2 className="text-xl font-semibold text-white">{title}</h2>
        </div>
        {renderContent()}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-3 space-y-6">
        {/* Gradient AI Analysis Button */}
        <div className="mb-6">
          <Button
            onClick={handleGeminiAnalysis}
            disabled={!hasResults || isGeminiLoading}
            className="w-full bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-700 hover:via-purple-600 hover:to-indigo-700 text-white font-medium py-3 px-6
