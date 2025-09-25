import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Line, Radar } from 'react-chartjs-2';
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  Filler
} from 'chart.js';
import { 
  TrendingUp, 
  Calendar, 
  Target, 
  Activity, 
  Zap,
  Eye,
  BarChart3,
  Brain
} from 'lucide-react';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  Filler
);

interface GrowthPrediction {
  timeframe: number; // months
  densityIncrease: number; // percentage
  thicknessImprovement: number; // percentage
  lengthGrowth: number; // inches
  healthScoreImprovement: number; // points
  confidenceLevel: number; // percentage
  keyFactors: string[];
  monthlyProgression: MonthlyGrowthData[];
  regionalPredictions: RegionalPrediction[];
}

interface MonthlyGrowthData {
  month: number;
  density: number;
  thickness: number;
  length: number;
  healthScore: number;
  confidence: number;
}

interface RegionalPrediction {
  region: string;
  currentDensity: number;
  predictedDensity: number;
  improvement: number;
  difficulty: 'easy' | 'moderate' | 'challenging';
}

interface HairGrowthPredictorProps {
  analysisData?: any;
  treatmentPlan?: string;
}

const HairGrowthPredictor: React.FC<HairGrowthPredictorProps> = ({
  analysisData,
  treatmentPlan
}) => {
  const [prediction, setPrediction] = useState<GrowthPrediction | null>(null);
  const [timeframe, setTimeframe] = useState<number>(6);
  const [adherenceLevel, setAdherenceLevel] = useState<number>(85);
  const [lifestyleScore, setLifestyleScore] = useState<number>(70);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string>('overall');

  useEffect(() => {
    if (analysisData) {
      generatePrediction();
    }
  }, [analysisData, timeframe, adherenceLevel, lifestyleScore]);

  const generatePrediction = () => {
    if (!analysisData) return;

    setIsGenerating(true);
    
    // Simulate AI processing delay
    setTimeout(() => {
      const newPrediction = calculateGrowthPrediction(
        analysisData,
        timeframe,
        adherenceLevel,
        lifestyleScore,
        treatmentPlan
      );
      setPrediction(newPrediction);
      setIsGenerating(false);
    }, 1500);
  };

  const calculateGrowthPrediction = (
    analysis: any,
    months: number,
    adherence: number,
    lifestyle: number,
    treatment?: string
  ): GrowthPrediction => {
    const baseHealthScore = analysis.overallHealthScore || analysis.healthScore || 70;
    const baselineMultiplier = Math.max(0.3, Math.min(1.2, baseHealthScore / 70));
    const adherenceMultiplier = adherence / 100;
    const lifestyleMultiplier = lifestyle / 100;
    const treatmentMultiplier = treatment ? 1.3 : 1.0;

    // Calculate improvements with realistic constraints
    const maxDensityIncrease = Math.min(40, 15 + (months * 2));
    const densityIncrease = Math.round(
      maxDensityIncrease * baselineMultiplier * adherenceMultiplier * lifestyleMultiplier * treatmentMultiplier
    );

    const maxThicknessImprovement = Math.min(30, 10 + (months * 1.5));
    const thicknessImprovement = Math.round(
      maxThicknessImprovement * baselineMultiplier * adherenceMultiplier * lifestyleMultiplier
    );

    const lengthGrowth = (months * 0.5) * adherenceMultiplier * lifestyleMultiplier; // ~0.5 inches per month

    const healthScoreImprovement = Math.round(
      Math.min(30, months * 2.5) * adherenceMultiplier * lifestyleMultiplier * treatmentMultiplier
    );

    const confidenceLevel = Math.min(95, Math.max(60, 
      70 + (adherence - 70) * 0.3 + (lifestyle - 70) * 0.2
    ));

    // Generate monthly progression
    const monthlyProgression: MonthlyGrowthData[] = [];
    for (let i = 1; i <= months; i++) {
      const progress = i / months;
      const curve = 1 - Math.exp(-3 * progress); // Growth curve (fast initial, then plateau)
      
      monthlyProgression.push({
        month: i,
        density: Math.round(densityIncrease * curve),
        thickness: Math.round(thicknessImprovement * curve),
        length: Math.round((lengthGrowth * progress) * 10) / 10,
        healthScore: Math.round(baseHealthScore + (healthScoreImprovement * curve)),
        confidence: Math.round(confidenceLevel * (0.7 + 0.3 * curve))
      });
    }

    // Regional predictions
    const regions = ['Crown', 'Temples', 'Hairline', 'Vertex'];
    const regionalPredictions: RegionalPrediction[] = regions.map(region => {
      const regionMultiplier = {
        'Crown': 1.1,
        'Temples': 0.8,
        'Hairline': 0.7,
        'Vertex': 1.0
      }[region] || 1.0;

      const currentDensity = Math.round(120 + Math.random() * 40); // Mock current density
      const predictedIncrease = densityIncrease * regionMultiplier;
      const predictedDensity = currentDensity + Math.round(currentDensity * (predictedIncrease / 100));
      
      const difficulty = predictedIncrease > 15 ? 'easy' : 
                        predictedIncrease > 8 ? 'moderate' : 'challenging';

      return {
        region,
        currentDensity,
        predictedDensity,
        improvement: predictedIncrease,
        difficulty
      };
    });

    return {
      timeframe: months,
      densityIncrease,
      thicknessImprovement,
      lengthGrowth,
      healthScoreImprovement,
      confidenceLevel,
      keyFactors: [
        `Baseline health score: ${baseHealthScore}`,
        `Treatment adherence: ${adherence}%`,
        `Lifestyle factors: ${lifestyle}%`,
        treatment ? `Active treatment: ${treatment}` : 'No active treatment',
        'Individual response variation'
      ],
      monthlyProgression,
      regionalPredictions
    };
  };

  const createGrowthChart = () => {
    if (!prediction) return null;

    const data = {
      labels: prediction.monthlyProgression.map(m => `Month ${m.month}`),
      datasets: [
        {
          label: 'Hair Density Improvement (%)',
          data: prediction.monthlyProgression.map(m => m.density),
          borderColor: '#9b87f5',
          backgroundColor: 'rgba(155, 135, 245, 0.1)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Hair Thickness Improvement (%)',
          data: prediction.monthlyProgression.map(m => m.thickness),
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Overall Health Score',
          data: prediction.monthlyProgression.map(m => m.healthScore),
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          fill: false,
          yAxisID: 'y1'
        }
      ]
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          labels: { color: '#ffffff' }
        }
      },
      scales: {
        x: {
          ticks: { color: '#9ca3af' },
          grid: { color: 'rgba(156, 163, 175, 0.2)' }
        },
        y: {
          type: 'linear' as const,
          display: true,
          position: 'left' as const,
          ticks: { color: '#9ca3af' },
          grid: { color: 'rgba(156, 163, 175, 0.2)' },
          title: {
            display: true,
            text: 'Improvement (%)',
            color: '#ffffff'
          }
        },
        y1: {
          type: 'linear' as const,
          display: true,
          position: 'right' as const,
          ticks: { color: '#f59e0b' },
          grid: { drawOnChartArea: false },
          title: {
            display: true,
            text: 'Health Score',
            color: '#ffffff'
          }
        }
      }
    };

    return <Line data={data} options={options} />;
  };

  const createRegionalChart = () => {
    if (!prediction) return null;

    const data = {
      labels: prediction.regionalPredictions.map(r => r.region),
      datasets: [
        {
          label: 'Current Density',
          data: prediction.regionalPredictions.map(r => r.currentDensity),
          backgroundColor: 'rgba(107, 114, 128, 0.6)',
          borderColor: '#6b7280',
          borderWidth: 2
        },
        {
          label: 'Predicted Density',
          data: prediction.regionalPredictions.map(r => r.predictedDensity),
          backgroundColor: 'rgba(155, 135, 245, 0.6)',
          borderColor: '#9b87f5',
          borderWidth: 2
        }
      ]
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          labels: { color: '#ffffff' }
        }
      },
      scales: {
        r: {
          beginAtZero: true,
          ticks: { color: '#9ca3af' },
          grid: { color: 'rgba(156, 163, 175, 0.2)' },
          angleLines: { color: 'rgba(156, 163, 175, 0.2)' }
        }
      }
    };

    return <Radar data={data} options={options} />;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'border-green-400 text-green-400';
      case 'moderate': return 'border-yellow-400 text-yellow-400';
      case 'challenging': return 'border-red-400 text-red-400';
      default: return 'border-gray-400 text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Configuration Panel */}
      <Card className="bg-gray-800/80 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-400" />
            Hair Growth Prediction Engine
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Prediction Timeframe */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Prediction Timeframe
              </label>
              <div className="px-4 py-2 bg-gray-700 rounded-lg">
                <Slider
                  value={[timeframe]}
                  onValueChange={(value) => setTimeframe(value[0])}
                  max={24}
                  min={3}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>3 months</span>
                  <span className="font-medium text-white">{timeframe} months</span>
                  <span>24 months</span>
                </div>
              </div>
            </div>

            {/* Treatment Adherence */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white flex items-center gap-2">
                <Target className="w-4 h-4" />
                Treatment Adherence
              </label>
              <div className="px-4 py-2 bg-gray-700 rounded-lg">
                <Slider
                  value={[adherenceLevel]}
                  onValueChange={(value) => setAdherenceLevel(value[0])}
                  max={100}
                  min={30}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>30%</span>
                  <span className="font-medium text-white">{adherenceLevel}%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>

            {/* Lifestyle Factors */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Lifestyle Quality
              </label>
              <div className="px-4 py-2 bg-gray-700 rounded-lg">
                <Slider
                  value={[lifestyleScore]}
                  onValueChange={(value) => setLifestyleScore(value[0])}
                  max={100}
                  min={30}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Poor</span>
                  <span className="font-medium text-white">{lifestyleScore}%</span>
                  <span>Excellent</span>
                </div>
              </div>
            </div>
          </div>

          <Button
            onClick={generatePrediction}
            disabled={isGenerating || !analysisData}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating Predictions...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Generate Hair Growth Prediction
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Prediction Results */}
      {prediction && (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="bg-gray-800 border-gray-700 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="progression">Monthly Progression</TabsTrigger>
            <TabsTrigger value="regional">Regional Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border-purple-500/50">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="w-6 h-6 mx-auto mb-2 text-purple-400" />
                  <div className="text-sm text-gray-300">Density Increase</div>
                  <div className="text-2xl font-bold text-white">+{prediction.densityIncrease}%</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-600/20 to-green-800/20 border-green-500/50">
                <CardContent className="p-4 text-center">
                  <BarChart3 className="w-6 h-6 mx-auto mb-2 text-green-400" />
                  <div className="text-sm text-gray-300">Thickness Gain</div>
                  <div className="text-2xl font-bold text-white">+{prediction.thicknessImprovement}%</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border-blue-500/50">
                <CardContent className="p-4 text-center">
                  <Activity className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                  <div className="text-sm text-gray-300">Length Growth</div>
                  <div className="text-2xl font-bold text-white">{prediction.lengthGrowth}"</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 border-yellow-500/50">
                <CardContent className="p-4 text-center">
                  <Target className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
                  <div className="text-sm text-gray-300">Confidence</div>
                  <div className="text-2xl font-bold text-white">{prediction.confidenceLevel}%</div>
                </CardContent>
              </Card>
            </div>

            {/* Key Factors */}
            <Card className="bg-gray-800/80 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Prediction Factors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {prediction.keyFactors.map((factor, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                    <span className="text-gray-200">{factor}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progression" className="space-y-6">
            {/* Growth Chart */}
            <Card className="bg-gray-800/80 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Predicted Growth Progression</CardTitle>
              </CardHeader>
              <CardContent>
                {createGrowthChart()}
              </CardContent>
            </Card>

            {/* Monthly Breakdown */}
            <Card className="bg-gray-800/80 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Monthly Milestones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {prediction.monthlyProgression.map((month) => (
                    <div key={month.month} className="p-4 bg-gray-700/50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium text-white">Month {month.month}</span>
                        <Badge variant="outline" className="border-purple-400 text-purple-400">
                          {month.confidence}% confidence
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-300">Density:</span>
                          <span className="text-white font-medium">+{month.density}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Thickness:</span>
                          <span className="text-white font-medium">+{month.thickness}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Length:</span>
                          <span className="text-white font-medium">{month.length}"</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Health Score:</span>
                          <span className="text-white font-medium">{month.healthScore}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="regional" className="space-y-6">
            {/* Regional Chart */}
            <Card className="bg-gray-800/80 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Regional Growth Prediction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-w-16 aspect-h-9">
                  {createRegionalChart()}
                </div>
              </CardContent>
            </Card>

            {/* Regional Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {prediction.regionalPredictions.map((region) => (
                <Card key={region.region} className="bg-gray-800/80 border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-white">{region.region}</h3>
                      <Badge variant="outline" className={getDifficultyColor(region.difficulty)}>
                        {region.difficulty}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-300">Current Density</span>
                          <span className="text-white">{region.currentDensity} hairs/cm²</span>
                        </div>
                        <Progress value={(region.currentDensity / 200) * 100} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-300">Predicted Density</span>
                          <span className="text-white">{region.predictedDensity} hairs/cm²</span>
                        </div>
                        <Progress value={(region.predictedDensity / 200) * 100} className="h-2" />
                      </div>
                      
                      <div className="pt-2 border-t border-gray-600">
                        <div className="flex justify-between">
                          <span className="text-gray-300 text-sm">Expected Improvement:</span>
                          <span className="text-green-400 font-medium">+{region.improvement.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default HairGrowthPredictor;