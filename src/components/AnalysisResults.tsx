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
import { Brain, Activity, Heart, Droplet, Wind } from "lucide-react";
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

  // Extract metrics from API response
  const getMetricValue = (label: string): string => {
    const metric = analysisData.metrics.find(
      (m) => m.label.toLowerCase() === label.toLowerCase()
    );
    return metric ? metric.value.toString().replace('%', '') : '0';
  };

  // Health Score Card Section
  const renderHealthScoreCard = () => {
    const hydrationScore = getMetricValue('hydration');
    const elasticityScore = getMetricValue('elasticity');
    const growthScore = getMetricValue('growth rate');

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
            <Wind className="w-5 h-5 text-green-400" />
            <div>
              <div className="text-sm text-gray-300">Elasticity</div>
              <div className="text-lg font-semibold text-white">{elasticityScore}%</div>
            </div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4 flex items-center gap-3">
            <Activity className="w-5 h-5 text-yellow-400" />
            <div>
              <div className="text-sm text-gray-300">Growth Rate</div>
              <div className="text-lg font-semibold text-white">{growthScore}%</div>
            </div>
          </div>
        </div>
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
            className="w-full bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-700 hover:via-purple-600 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 group"
          >
            <Brain className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
            {isGeminiLoading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                Analyzing...
              </span>
            ) : (
              <span className="text-lg">Get AI Hair Analysis</span>
            )}
            {!hasResults && <span className="text-xs">(Upload image first)</span>}
          </Button>
        </div>

        {/* Quick Summary Card with Glassmorphism */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
          <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-400" />
            Quick Summary
          </h3>
          <p className="text-gray-200 leading-relaxed">
            {analysisData.quickSummary || 
             "Your scalp and hair analysis shows key metrics including sebum levels, pore condition, inflammation markers, and follicular activity."}
          </p>
        </div>

        {/* Overall Health Score Card */}
        {renderHealthScoreCard()}

        {/* Rest of the component */}
        <Dialog open={showGeminiDialog} onOpenChange={setShowGeminiDialog}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>AI Hair Analysis Report</DialogTitle>
            </DialogHeader>
            {isGeminiLoading ? (
              <div className="flex flex-col items-center justify-center p-8 space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                <p className="text-gray-400">Analyzing your hair data...</p>
              </div>
            ) : (
              <div className="prose prose-invert max-w-none">
                <div className="whitespace-pre-wrap">{geminiAnalysis}</div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Curl Pattern Distribution */}
        <div className="bg-gray-600/50 p-6 rounded mb-6">
          <h4 className="font-medium mb-4 text-lg">Curl Pattern Distribution</h4>
          <div className="aspect-w-16 aspect-h-9">
            <Doughnut data={curlPatternData} options={doughnutOptions} />
          </div>
          <div className="mt-4 space-y-4">
            <div className="bg-gray-700/50 p-4 rounded">
              <p className="text-gray-300 text-sm leading-relaxed">
                This chart shows how your different hair textures are distributed. It's perfectly normal to have a mix!
              </p>
              <ul className="mt-3 space-y-2 text-sm text-gray-300">
                <li><span className="text-purple-400">•</span> Straight: Smooth, no waves or curls</li>
                <li><span className="text-orange-400">•</span> Wavy: Gentle S-shaped waves</li>
                <li><span className="text-blue-400">•</span> Curly: Springy, defined curls</li>
                <li><span className="text-pink-400">•</span> Coily: Tight, compact curls</li>
              </ul>
              <p className="mt-3 text-sm text-gray-400">
                Reference: Most people have a mix of patterns. What matters most is understanding your dominant pattern 
                to choose the right hair care routine!
              </p>
            </div>
          </div>
        </div>

        {/* Growth Phase Distribution */}
        <div className="bg-gray-600/50 p-6 rounded mb-6">
          <h4 className="font-medium mb-4 text-lg">Growth Phase Distribution</h4>
          <div className="aspect-w-16 aspect-h-9">
            <Doughnut data={growthPhaseData} options={doughnutOptions} />
          </div>
          <div className="mt-4 space-y-4">
            <div className="bg-gray-700/50 p-4 rounded">
              <p className="text-gray-300 text-sm leading-relaxed">
                Your hair goes through different growth phases - think of it like a garden's growing cycle!
              </p>
              <ul className="mt-3 space-y-2 text-sm text-gray-300">
                <li><span className="text-blue-400">•</span> Anagen (Growing): The active growth phase. Ideally 80-90% of your hair should be here!</li>
                <li><span className="text-purple-400">•</span> Catagen (Transitioning): A short resting phase. Usually 1-2% is normal.</li>
                <li><span className="text-orange-400">•</span> Telogen (Resting/Shedding): The shedding phase. Typically 8-10% of hair is here.</li>
              </ul>
              <p className="mt-3 text-sm text-gray-400">
                Reference: A healthy scalp typically has:
                - 80-90% in Anagen
                - 1-2% in Catagen
                - 8-10% in Telogen
                Don't worry if yours is a bit different - many factors can influence these numbers!
              </p>
            </div>
          </div>
        </div>

        {/* Advanced Analysis Section */}
        <AdvancedAnalysis data={analysisData} />

        {/* Structural Analysis */}
        <div className="bg-gray-700/80 rounded-lg p-4 mb-4">
          <h3 className="text-lg font-medium mb-3">Structural Analysis</h3>
          <div className="space-y-6">
            <div className="bg-gray-600/50 p-6 rounded">
              <h4 className="font-medium mb-4 text-lg">Hair Growth Cycle Analysis</h4>
              <div className="aspect-w-16 aspect-h-9">
                <Line data={analysisData.healthData} options={doughnutOptions} />
              </div>
              <div className="mt-4 bg-gray-700/50 p-4 rounded">
                <p className="text-gray-300 text-sm leading-relaxed">
                  This graph shows your hair's growth journey over time. The higher the line goes, the better your hair is growing! 
                  A healthy pattern usually shows steady growth or gentle ups and downs, which is totally normal. ( Premium Feature )
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Metrics Grid */}
        <div className="space-y-4">
          {analysisData.metrics.map((metric) => (
            <div
              key={metric.label}
              className="bg-gray-700/80 rounded-lg p-6 hover:bg-gray-600/80 transition-all duration-300 transform hover:scale-102 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-20 h-20 -mr-10 -mt-10 bg-purple-500/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                    <i className={`fas fa-${metric.icon} text-purple-400`}></i>
                  </div>
                  <span className="text-gray-300 font-medium">{metric.label}</span>
                </div>
                <div className="pl-13">
                  <span className={`text-lg font-semibold ${metric.color || 'text-white'}`}>
                    {metric.value}
                  </span>
                  {metric.label === "Health Status" && (
                    <div className="mt-2 w-full bg-gray-600 rounded-full h-1.5">
                      <div 
                        className="bg-purple-500 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${analysisData.healthScore}%` }}
                      ></div>
                    </div>
                  )}
                  {metric.label === "Scalp Condition" && (
                    <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                      {metric.value}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Hair Information */}
        <div className="bg-gray-800/80 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <h2 className="text-xl font-semibold mb-4">Hair Information</h2>
          <div className="space-y-4">
            <div className="bg-gray-700/80 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-medium mb-2">Diagnostic Analysis</h3>
              <p className="text-gray-300">
                {analysisData.hairInformation?.diagnosticAnalysis || "Advanced microscopic analysis reveals signs of androgenetic alopecia..."}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-700/80 rounded-lg p-4">
                <Line data={analysisData.healthData} options={doughnutOptions} />
                <p className="text-center text-sm text-gray-400 mt-2">Hair Growth Progress ( Premium Feature )</p>
              </div>
              <div className="bg-gray-700/80 rounded-lg p-4">
                <Line data={analysisData.healthData} options={doughnutOptions} />
                <p className="text-center text-sm text-gray-400 mt-2">Optimal vs Current Conditions ( Premium Feature )</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm text-gray-400">Care Tips</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                {analysisData.hairInformation?.careTips?.map((tip, index) => (
                  <li key={index}>{tip}</li>
                )) || (
                  <>
                    <li>Use DHT-blocking shampoo</li>
                    <li>Supplement with Biotin & Iron</li>
                    <li>Scalp massage 2x daily</li>
                    <li>Minimize heat styling</li>
                    <li>Practice stress management</li>
                    <li>Monthly scalp detox</li>
                    <li>Use microneeding treatment</li>
                    <li>Apply growth serums</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Recommended Treatments */}
        <div className="bg-gray-800/80 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <h2 className="text-xl font-semibold mb-4">Recommended Treatments</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analysisData.recommendedTreatments ? (
              <>
                <div className="bg-gray-700/80 rounded-lg p-4 border-l-4 border-green-500">
                  <h3 className="text-lg font-medium mb-2">Primary Recommendation</h3>
                  <div className="flex items-center mb-3">
                    <i className="fas fa-check-circle text-green-500 mr-2"></i>
                    <span className="font-medium">{analysisData.recommendedTreatments.primary.name}</span>
                  </div>
                  <p className="text-sm text-gray-300">
                    {analysisData.recommendedTreatments.primary.description}
                  </p>
                  <div className="mt-3">
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                      {analysisData.recommendedTreatments.primary.match}% Match
                    </span>
                  </div>
                </div>

                <div className="bg-gray-700/80 rounded-lg p-4 border-l-4 border-blue-500">
                  <h3 className="text-lg font-medium mb-2">Secondary Option</h3>
                  <div className="flex items-center mb-3">
                    <i className="fas fa-check-circle text-blue-500 mr-2"></i>
                    <span className="font-medium">{analysisData.recommendedTreatments.secondary.name}</span>
                  </div>
                  <p className="text-sm text-gray-300">
                    {analysisData.recommendedTreatments.secondary.description}
                  </p>
                  <div className="mt-3">
                    <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                      {analysisData.recommendedTreatments.secondary.match}% Match
                    </span>
                  </div>
                </div>

                <div className="bg-gray-700/80 rounded-lg p-4 border-l-4 border-purple-500">
                  <h3 className="text-lg font-medium mb-2">Supporting Treatment</h3>
                  <div className="flex items-center mb-3">
                    <i className="fas fa-check-circle text-purple-500 mr-2"></i>
                    <span className="font-medium">{analysisData.recommendedTreatments.supporting.name}</span>
                  </div>
                  <p className="text-sm text-gray-300">
                    {analysisData.recommendedTreatments.supporting.description}
                  </p>
                  <div className="mt-3">
                    <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded">
                      {analysisData.recommendedTreatments.supporting.match}% Match
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="bg-gray-700/80 rounded-lg p-4 border-l-4 border-green-500">
                  <h3 className="text-lg font-medium mb-2">Primary Recommendation</h3>
                  <div className="flex items-center mb-3">
                    <i className="fas fa-check-circle text-green-500 mr-2"></i>
                    <span className="font-medium">FUE (Follicular Unit Extraction)</span>
                  </div>
                  <p className="text-sm text-gray-300">
                    Best suited for your pattern of hair loss and scalp condition. 
                    Minimally invasive with natural-looking results.
                  </p>
                  <div className="mt-3">
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">98% Match</span>
                  </div>
                </div>

                <div className="bg-gray-700/80 rounded-lg p-4 border-l-4 border-blue-500">
                  <h3 className="text-lg font-medium mb-2">Secondary Option</h3>
                  <div className="flex items-center mb-3">
                    <i className="fas fa-check-circle text-blue-500 mr-2"></i>
                    <span className="font-medium">PRP Treatment</span>
                  </div>
                  <p className="text-sm text-gray-300">
                    Recommended for strengthening existing hair and promoting new growth.
                    Can be combined with FUE.
                  </p>
                  <div className="mt-3">
                    <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">85% Match</span>
                  </div>
                </div>

                <div className="bg-gray-700/80 rounded-lg p-4 border-l-4 border-purple-500">
                  <h3 className="text-lg font-medium mb-2">Supporting Treatment</h3>
                  <div className="flex items-center mb-3">
                    <i className="fas fa-check-circle text-purple-500 mr-2"></i>
                    <span className="font-medium">Exosomes Therapy</span>
                  </div>
                  <p className="text-sm text-gray-300">
                    Excellent for scalp health and strengthening follicles.
                    Complementary to main treatments.
                  </p>
                  <div className="mt-3">
                    <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded">75% Match</span>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Other Available Treatments</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {analysisData.recommendedTreatments?.other.map((treatment, index) => (
                <div key={index} className="bg-gray-700/80 p-3 rounded-lg text-center">
                  <span className="text-sm">{treatment.name}</span>
                  <div className="text-xs text-gray-400 mt-1">{treatment.match}% Match</div>
                </div>
              )) || (
                <>
                  <div className="bg-gray-700/80 p-3 rounded-lg text-center">
                    <span className="text-sm">Hair Transplant</span>
                    <div className="text-xs text-gray-400 mt-1">65% Match</div>
                  </div>
                  <div className="bg-gray-700/80 p-3 rounded-lg text-center">
                    <span className="text-sm">FUT</span>
                    <div className="text-xs text-gray-400 mt-1">45% Match</div>
                  </div>
                  <div className="bg-gray-700/80 p-3 rounded-lg text-center">
                    <span className="text-sm">SMP</span>
                    <div className="text-xs text-gray-400 mt-1">40% Match</div>
                  </div>
                  <div className="bg-gray-700/80 p-3 rounded-lg text-center">
                    <span className="text-sm">Micro FUE</span>
                    <div className="text-xs text-gray-400 mt-1">55% Match</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 flex-wrap gap-4">
          <Button className="bg-purple-600 hover:bg-purple-700">
            <i className="fas fa-save mr-2"></i>Save Analysis
          </Button>
          <Button variant="outline" className="bg-gray-700 hover:bg-gray-600">
            <i className="fas fa-share-alt mr-2"></i>Share Results
          </Button>
          <Button variant="outline" className="bg-gray-700 hover:bg-gray-600">
            <i className="fas fa-download mr-2"></i>Download Report
          </Button>
          <Button variant="outline" className="bg-gray-700 hover:bg-gray-600">
            <i className="fas fa-redo mr-2"></i>New Scan
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;
