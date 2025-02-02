import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
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
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

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
}

interface HairDiameter {
  root: string;
  tip: string;
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
  // Transform metrics from object to array format
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

    // Handle special cases like hairDiameter with type checking
    let displayValue: string;
    if (typeof value === 'object' && value !== null && 'root' in value && 'tip' in value) {
      const hairDiameter = value as HairDiameter;
      displayValue = `Root: ${hairDiameter.root}, Tip: ${hairDiameter.tip}`;
    } else {
      displayValue = String(value);
    }

    return {
      icon: getIcon(key),
      label: key.split(/(?=[A-Z])/).join(" "), // Convert camelCase to Space Separated
      value: displayValue,
      color: key === 'healthStatus' && value !== 'Good' ? 'text-yellow-400' : undefined
    };
  });

  return {
    metrics: metricsArray,
    healthScore: Number(apiResponse.overallHealthScore) || 76,
    healthData: defaultHealthData, // Keep default chart data for now
  };
};

const AnalysisResults = () => {
  const [analysisData, setAnalysisData] = useState<AnalysisResult>({
    metrics: defaultMetrics,
    healthScore: 76,
    healthData: defaultHealthData,
  });

  useEffect(() => {
    const handleAnalysisComplete = (event: CustomEvent<any>) => {
      console.log('Analysis results received:', event.detail);
      if (event.detail) {
        const transformedData = transformApiResponse(event.detail);
        setAnalysisData(transformedData);
      }
    };

    window.addEventListener('hairAnalysisComplete', handleAnalysisComplete as EventListener);

    return () => {
      window.removeEventListener('hairAnalysisComplete', handleAnalysisComplete as EventListener);
    };
  }, []);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#9b87f5'
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#9b87f5'
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800/80 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300">
        <h2 className="text-xl font-semibold mb-4 text-white">Analysis Results</h2>
        
        {/* Structural Analysis */}
        <div className="bg-gray-700/80 rounded-lg p-4 mb-4">
          <h3 className="text-lg font-medium mb-3">Structural Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-600/50 p-3 rounded">
              <h4 className="font-medium mb-2">Hair Growth Cycle</h4>
              <Line data={analysisData.healthData} options={chartOptions} />
            </div>
            <div className="bg-gray-600/50 p-3 rounded">
              <h4 className="font-medium mb-2">Curl Pattern Distribution</h4>
              <Line data={analysisData.healthData} options={chartOptions} />
            </div>
            <div className="bg-gray-600/50 p-3 rounded">
              <h4 className="font-medium mb-2">Growth Phase Distribution</h4>
              <Line data={analysisData.healthData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Quick Summary */}
        <div className="bg-gray-700/80 rounded-lg p-4 mb-4">
          <h3 className="text-lg font-medium mb-2">Quick Summary</h3>
          <p className="text-gray-300">
            Your scalp and hair analysis shows key metrics including sebum levels, pore condition, inflammation markers, and follicular activity. 
            The AI detected normal sebum production, clear pores with minimal inflammation, and 85% anagen phase follicles indicating healthy growth cycle. 
            Your hair density is 165 hairs/cm² with average strand thickness of 0.08mm. Minimal breakage was observed at 7% of analyzed strands.
          </p>
        </div>

        {/* Health Charts */}
        <div className="bg-gray-700/80 rounded-lg p-4 mb-4">
          <Line data={analysisData.healthData} options={chartOptions} />
          <p className="text-center text-sm text-gray-400 mt-2">Hair Health Metrics Over Time</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {analysisData.metrics.map((metric) => (
            <div
              key={metric.label}
              className="bg-gray-700/80 rounded-lg p-4 hover:bg-gray-700 transition-colors duration-300 flex flex-col space-y-2"
            >
              <div className="flex items-center">
                <i className={`fas fa-${metric.icon} text-purple-400 mr-3`}></i>
                <span>{metric.label}</span>
              </div>
              <span className={`font-medium ${metric.color || ''}`}>
                {metric.value}
              </span>
            </div>
          ))}
        </div>

        {/* Health Score */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Overall Health Score</span>
            <span className="text-lg font-bold text-purple-400">{analysisData.healthScore}%</span>
          </div>
          <Progress value={analysisData.healthScore} className="h-2.5 bg-gray-700" />
        </div>
      </div>

      {/* Hair Information */}
      <div className="bg-gray-800/80 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300">
        <h2 className="text-xl font-semibold mb-4">Hair Information</h2>
        <div className="space-y-4">
          <div className="bg-gray-700/80 rounded-lg p-4 mb-4">
            <h3 className="text-lg font-medium mb-2">Diagnostic Analysis</h3>
            <p className="text-gray-300">
              Advanced microscopic analysis reveals signs of androgenetic alopecia with approximately 25% miniaturized follicles 
              concentrated in the crown and temple areas. Telogen Effluvium is indicated by an elevated percentage (28%) of club 
              hairs in the telogen phase, suggesting recent systemic stress.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-700/80 rounded-lg p-4">
              <Line data={analysisData.healthData} options={chartOptions} />
              <p className="text-center text-sm text-gray-400 mt-2">Hair Growth Progress</p>
            </div>
            <div className="bg-gray-700/80 rounded-lg p-4">
              <Line data={analysisData.healthData} options={chartOptions} />
              <p className="text-center text-sm text-gray-400 mt-2">Optimal vs Current Conditions</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm text-gray-400">Care Tips</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Use DHT-blocking shampoo</li>
              <li>Supplement with Biotin & Iron</li>
              <li>Scalp massage 2x daily</li>
              <li>Minimize heat styling</li>
              <li>Practice stress management</li>
              <li>Monthly scalp detox</li>
              <li>Use microneeding treatment</li>
              <li>Apply growth serums</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Recommended Treatments */}
      <div className="bg-gray-800/80 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300">
        <h2 className="text-xl font-semibold mb-4">Recommended Treatments</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3">Other Available Treatments</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
  );
};

export default AnalysisResults;
