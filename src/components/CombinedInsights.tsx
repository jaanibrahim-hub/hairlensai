import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

interface CombinedInsightsProps {
  growthPhaseData: {
    labels: string[];
    datasets: {
      data: number[];
    }[];
  };
  healthScore: number;
}

const CombinedInsights = ({ growthPhaseData, healthScore }: CombinedInsightsProps) => {
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    // Start animation after component mount
    setAnimate(true);
  }, []);

  // Calculate scores based on growth phase data
  const anogenPercentage = growthPhaseData.datasets[0].data[0] || 85;
  const telogenPercentage = growthPhaseData.datasets[0].data[2] || 10;
  const scalpHealthScore = healthScore || 76;

  const treatmentPriorityScore = Math.round(
    (100 - (anogenPercentage * 0.4)) + 
    ((100 - scalpHealthScore) * 0.3) + 
    (telogenPercentage * 0.3)
  );

  const recoveryPotentialScore = Math.round(
    (anogenPercentage * 0.5) + 
    (scalpHealthScore * 0.3) + 
    ((100 - telogenPercentage) * 0.2)
  );

  const interventionUrgencyScore = Math.round(
    (telogenPercentage * 0.4) + 
    ((100 - scalpHealthScore) * 0.3) + 
    ((100 - anogenPercentage) * 0.3)
  );

  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-red-400";
    if (score >= 50) return "text-orange-400";
    return "text-green-400";
  };

  const getGaugeRotation = (score: number) => {
    return `rotate-[${Math.min(180, (score / 100) * 180)}deg]`;
  };

  return (
    <div className="bg-gray-800/80 rounded-lg p-6 space-y-8 mt-6">
      <h3 className="text-xl font-semibold mb-4">Combined Insights</h3>
      
      {/* Treatment Priority Score */}
      <div className="bg-gray-700/50 rounded-lg p-6 transform hover:scale-102 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-medium">Treatment Priority Score</h4>
          <span className={`text-2xl font-bold ${getScoreColor(treatmentPriorityScore)}`}>
            {treatmentPriorityScore}/100
          </span>
        </div>
        
        <div className="relative h-32 w-full">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-16 bg-gradient-to-r from-purple-500 via-orange-500 to-red-500 rounded-t-full overflow-hidden">
              <div 
                className={`w-1 h-20 bg-white absolute left-1/2 bottom-0 origin-bottom transform ${
                  animate ? getGaugeRotation(treatmentPriorityScore) : 'rotate-0'
                } transition-all duration-1000 ease-out`}
              />
            </div>
          </div>
        </div>
        
        <p className="text-gray-300 mt-4">
          {treatmentPriorityScore >= 75 ? "High Priority: Immediate attention recommended" :
           treatmentPriorityScore >= 50 ? "Moderate Priority: Schedule consultation soon" :
           "Low Priority: Maintain current care routine"}
        </p>
      </div>

      {/* Recovery Potential Index */}
      <div className="bg-gray-700/50 rounded-lg p-6 transform hover:scale-102 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-medium">Recovery Potential Index</h4>
          <span className="text-2xl font-bold text-blue-400">
            {recoveryPotentialScore}%
          </span>
        </div>
        
        <div className="relative h-24 w-full bg-gray-800 rounded-lg overflow-hidden">
          <div 
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500 to-blue-300 transition-all duration-1000 ease-out"
            style={{ 
              height: animate ? `${recoveryPotentialScore}%` : '0%',
              filter: 'brightness(1.2)',
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-2 bg-white/20 animate-[wave_2s_ease-in-out_infinite]" />
          </div>
        </div>
        
        <p className="text-gray-300 mt-4">
          {recoveryPotentialScore >= 75 ? "Excellent recovery potential" :
           recoveryPotentialScore >= 50 ? "Good recovery potential with consistent care" :
           "Moderate recovery potential - intensive care recommended"}
        </p>
      </div>

      {/* Intervention Urgency Score */}
      <div className="bg-gray-700/50 rounded-lg p-6 transform hover:scale-102 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-medium">Intervention Urgency Score</h4>
          <span className={`text-2xl font-bold ${getScoreColor(interventionUrgencyScore)}`}>
            {interventionUrgencyScore}/100
          </span>
        </div>
        
        <div className="space-y-2">
          <Progress 
            value={animate ? interventionUrgencyScore : 0} 
            className="h-3 transition-all duration-1000"
          />
          <div className="flex justify-between text-sm text-gray-400">
            <span>Low Urgency</span>
            <span>Moderate</span>
            <span>High Urgency</span>
          </div>
        </div>
        
        <p className="text-gray-300 mt-4">
          {interventionUrgencyScore >= 75 ? "Urgent: Schedule consultation within 1 week" :
           interventionUrgencyScore >= 50 ? "Soon: Plan consultation within 2-3 weeks" :
           "Routine: Maintain regular check-ups"}
        </p>
      </div>
    </div>
  );
};

export default CombinedInsights;