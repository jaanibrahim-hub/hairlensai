import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import AdvancedAnalysis from "./AdvancedAnalysis";
import { performSecondaryAnalysis } from "@/utils/geminiApi";

// Register ChartJS components
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

interface AnalysisResultsProps {
  apiKey: string | null;
}

const AnalysisResults = ({ apiKey }: AnalysisResultsProps) => {
  const [isGeminiLoading, setIsGeminiLoading] = useState(false);
  const [geminiAnalysis, setGeminiAnalysis] = useState<string>("");
  const { toast } = useToast();

  const handleGeminiAnalysis = async () => {
    if (!apiKey) {
      toast({
        title: "Premium Feature",
        description: "Please activate premium access to use the AI Doctor feature.",
        variant: "destructive",
      });
      return;
    }

    setIsGeminiLoading(true);
    
    try {
      toast({
        title: "Analysis Started",
        description: "Processing your hair analysis data...",
      });

      const secondaryAnalysis = await performSecondaryAnalysis({}, apiKey);
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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* AI Analysis Button */}
      <Button
        onClick={handleGeminiAnalysis}
        disabled={isGeminiLoading}
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
      >
        <Brain className="w-5 h-5" />
        {isGeminiLoading ? "Analyzing..." : "Get AI Hair Analysis"}
      </Button>

      {/* Quick Summary Card */}
      <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl p-6 shadow-xl backdrop-blur-sm border border-gray-700/50">
        <h2 className="text-xl font-semibold text-white mb-4">Quick Summary</h2>
        <p className="text-gray-300">
          Your hair analysis shows promising results with areas for improvement. Let's dive into the details below.
        </p>
      </div>

      {/* Health Score Card */}
      <div className="bg-gradient-to-br from-purple-900/80 to-indigo-900/80 rounded-xl p-6 shadow-xl backdrop-blur-sm border border-purple-700/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Overall Health Score</h2>
          <span className="text-3xl font-bold text-purple-400">85%</span>
        </div>
        <Progress value={85} className="h-3 bg-purple-950" />
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-sm text-gray-400">Strength</div>
            <div className="text-lg font-semibold text-purple-400">90%</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-400">Moisture</div>
            <div className="text-lg font-semibold text-purple-400">82%</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-400">Growth</div>
            <div className="text-lg font-semibold text-purple-400">83%</div>
          </div>
        </div>
      </div>

      {/* Growth Trends Card */}
      <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl p-6 shadow-xl backdrop-blur-sm border border-gray-700/50">
        <h2 className="text-xl font-semibold text-white mb-4">Growth Trends</h2>
        <div className="h-64">
          <Line
            data={{
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
              datasets: [{
                label: 'Hair Growth',
                data: [65, 70, 75, 72, 78, 85],
                borderColor: '#9b87f5',
                backgroundColor: 'rgba(155, 135, 245, 0.1)',
                fill: true,
                tension: 0.4
              }]
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
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
            }}
          />
        </div>
      </div>

      {/* Pattern Distribution Card */}
      <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl p-6 shadow-xl backdrop-blur-sm border border-gray-700/50">
        <h2 className="text-xl font-semibold text-white mb-4">Pattern Distribution</h2>
        <div className="h-64">
          <Doughnut
            data={{
              labels: ['Straight', 'Wavy', 'Curly'],
              datasets: [{
                data: [30, 45, 25],
                backgroundColor: ['#9b87f5', '#0EA5E9', '#F97316'],
                borderWidth: 0
              }]
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: {
                    color: '#9b87f5',
                    padding: 20,
                    font: {
                      size: 12
                    }
                  }
                }
              }
            }}
          />
        </div>
      </div>

      {/* Advanced Analysis Section */}
      <AdvancedAnalysis data={{}} />

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button className="bg-purple-600 hover:bg-purple-700">
          <i className="fas fa-save mr-2"></i>Save Report
        </Button>
        <Button variant="outline" className="bg-gray-700 hover:bg-gray-600">
          <i className="fas fa-share-alt mr-2"></i>Share Results
        </Button>
        <Button variant="outline" className="bg-gray-700 hover:bg-gray-600">
          <i className="fas fa-download mr-2"></i>Download PDF
        </Button>
      </div>
    </div>
  );
};

export default AnalysisResults;