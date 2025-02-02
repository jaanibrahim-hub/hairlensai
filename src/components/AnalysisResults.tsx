import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const AnalysisResults = () => {
  const metrics = [
    { icon: "cut", label: "Hair Type", value: "Type 2B Wavy" },
    { icon: "heart", label: "Health Status", value: "Good", color: "text-green-400" },
    { icon: "seedling", label: "Porosity", value: "Medium" },
    { icon: "ruler-vertical", label: "Length", value: "Medium (12-16 inches)" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gray-800/80 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300">
        <h2 className="text-xl font-semibold mb-4 text-white">Analysis Results</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="bg-gray-700/80 rounded-lg p-4 hover:bg-gray-700 transition-colors duration-300"
            >
              <div className="flex items-center">
                <i className={`fas fa-${metric.icon} text-primary mr-3`}></i>
                <span className="text-gray-200">{metric.label}</span>
              </div>
              <span className={`font-medium mt-2 block ${metric.color || 'text-white'}`}>
                {metric.value}
              </span>
            </div>
          ))}
        </div>
        
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Overall Health Score</span>
            <span className="text-lg font-bold text-primary">76%</span>
          </div>
          <Progress value={76} className="h-2.5 bg-gray-700" />
        </div>
      </div>
      
      <div className="flex justify-center space-x-4 flex-wrap gap-4">
        <Button className="bg-primary hover:bg-primary/90">
          <i className="fas fa-save mr-2"></i>Save Analysis
        </Button>
        <Button variant="outline">
          <i className="fas fa-share-alt mr-2"></i>Share Results
        </Button>
        <Button variant="outline">
          <i className="fas fa-download mr-2"></i>Download Report
        </Button>
      </div>
    </div>
  );
};

export default AnalysisResults;