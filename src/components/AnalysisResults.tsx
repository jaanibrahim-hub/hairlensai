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
import { Brain } from "lucide-react";
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
import { Line, Doughnut, PolarArea } from 'react-chartjs-2';
import AdvancedAnalysis from "./AdvancedAnalysis";
import { performSecondaryAnalysis } from "@/utils/geminiApi";

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

const transformApiResponse = (apiResponse: any): AnalysisResult => {
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
      const hairDiameter = value as HairDiameter;
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
    }
  });
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();
  const [hasResults, setHasResults] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [isGeminiLoading, setIsGeminiLoading] = useState(false);
  const [geminiAnalysis, setGeminiAnalysis] = useState<string>("");
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
      setGeminiAnalysis(
        `# Diagnostic Summary\n${secondaryAnalysis.diagnostic_summary}\n\n` +
        `# Detailed Analysis\n${secondaryAnalysis.detailed_analysis}\n\n` +
        `# Treatment Plan\n${secondaryAnalysis.treatment_plan.map(plan => 
          `## ${plan.category}\n${plan.recommendations.join('\n')}`
        ).join('\n\n')}`
      );
      
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 rounded-lg p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-700/50">
          {/* AI Analysis Button */}
          <div className="mb-6">
            <Button
              onClick={handleGeminiAnalysis}
              disabled={!hasResults || isGeminiLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Brain className="w-5 h-5" />
              {isGeminiLoading ? "Analyzing..." : "Get AI Hair Analysis"}
              {!hasResults && <span className="text-xs">(Upload image first)</span>}
            </Button>
          </div>

          {/* Quick Summary */}
          <div className="bg-gradient-to-br from-gray-700/80 to-gray-800/80 rounded-lg p-6 mb-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-600/50">
            <h3 className="text-xl font-semibold mb-4 text-white">Quick Summary</h3>
            <p className="text-gray-300 leading-relaxed">
              {analysisData.quickSummary || "Your scalp and hair analysis shows key metrics including sebum levels, pore condition, inflammation markers, and follicular activity."}
            </p>
          </div>

          {/* Overall Health Score */}
          <div className="bg-gradient-to-br from-gray-700/80 to-gray-800/80 rounded-lg p-6 mb-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-600/50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">Overall Health Score</h3>
              <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                {analysisData.healthScore}%
              </span>
            </div>
            <Progress 
              value={analysisData.healthScore} 
              className="h-3 bg-gray-700"
              indicatorClassName={`bg-gradient-to-r ${
                analysisData.healthScore >= 80 ? 'from-green-400 to-green-600' :
                analysisData.healthScore >= 60 ? 'from-yellow-400 to-yellow-600' :
                'from-red-400 to-red-600'
              }`}
            />
            <div className="flex justify-between mt-3 text-sm">
              <span className="text-red-400">Poor</span>
              <span className="text-yellow-400">Good</span>
              <span className="text-green-400">Excellent</span>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Curl Pattern Distribution */}
            <div className="bg-gradient-to-br from-gray-700/80 to-gray-800/80 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-600/50">
              <h4 className="text-lg font-semibold mb-4 text-white">Curl Pattern Distribution</h4>
              <div className="aspect-square relative">
                <Doughnut data={curlPatternData} options={doughnutOptions} />
              </div>
            </div>

            {/* Growth Phase Distribution */}
            <div className="bg-gradient-to-br from-gray-700/80 to-gray-800/80 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-600/50">
              <h4 className="text-lg font-semibold mb-4 text-white">Growth Phase Distribution</h4>
              <div className="aspect-square relative">
                <Doughnut data={growthPhaseData} options={doughnutOptions} />
              </div>
            </div>
          </div>

          {/* Advanced Analysis Section */}
          <div className="mb-6">
            <AdvancedAnalysis data={analysisData} />
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {analysisData.metrics.map((metric, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-700/80 to-gray-800/80 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-600/50 group"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center">
                    <i className={`fas fa-${metric.icon} text-purple-400 text-xl`}></i>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-400">{metric.label}</h4>
                    <p className={`text-lg font-semibold ${metric.color || 'text-white'}`}>
                      {metric.value}
                    </p>
                  </div>
                </div>
                {metric.label === "Health Status" && (
                  <div className="mt-2 w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-400 to-purple-600 transition-all duration-500"
                      style={{ width: `${analysisData.healthScore}%` }}
                    ></div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
              <i className="fas fa-save mr-2"></i>Save Analysis
            </Button>
            <Button variant="outline" className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 border-gray-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
              <i className="fas fa-share-alt mr-2"></i>Share Results
            </Button>
            <Button variant="outline" className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 border-gray-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
              <i className="fas fa-download mr-2"></i>Download Report
            </Button>
            <Button variant="outline" className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 border-gray-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
              <i className="fas fa-redo mr-2"></i>New Scan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;
