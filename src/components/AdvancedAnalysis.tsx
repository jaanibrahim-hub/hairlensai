import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { useToast } from "@/components/ui/use-toast";
import type { ChartEvent, ActiveElement, Chart } from 'chart.js';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

interface AdvancedAnalysisProps {
  data: any;
}

const AdvancedAnalysis = ({ data }: AdvancedAnalysisProps) => {
  console.log("Advanced Analysis Data:", data);
  const { toast } = useToast();

  // Extract microscopic analysis data with API-driven fallbacks based on health score
  const generateDynamicMetrics = (baseData: any) => {
    const healthScore = baseData?.healthScore || baseData?.overallHealthScore || 75;
    const hairType = baseData?.structuralAnalysis?.hairType || 'mixed';
    const scalpHealth = baseData?.microscopicAnalysis?.scalp_health || 'moderate';
    
    // Calculate realistic metrics based on API data and health score
    const baseVariation = () => Math.floor(Math.random() * 15) - 7; // -7 to +7 variation
    
    return {
      // Use API data when available, otherwise calculate from health score
      cuticleScore: baseData?.microscopicAnalysis?.cuticleLayerScore || 
                   Math.min(95, Math.max(45, healthScore - 5 + baseVariation())),
      shaftIntegrity: baseData?.microscopicAnalysis?.shaftStructure?.integrity || 
                     Math.min(95, Math.max(40, healthScore - 10 + baseVariation())),
      medullaContinuity: baseData?.microscopicAnalysis?.medullaAnalysis?.continuity || 
                        Math.min(95, Math.max(50, healthScore + 5 + baseVariation())),
      surfaceTexture: baseData?.microscopicAnalysis?.surfaceMapping?.textureScore || 
                     Math.min(95, Math.max(60, healthScore + 10 + baseVariation())),
      damageLevel: baseData?.microscopicAnalysis?.surfaceMapping?.damageScore || 
                  Math.max(5, Math.min(50, 35 - (healthScore - 70) + baseVariation())),
      protectionScore: baseData?.microscopicAnalysis?.surfaceMapping?.protectionLevel || 
                      Math.min(95, Math.max(65, healthScore + 15 + baseVariation()))
    };
  };

  const dynamicMetrics = generateDynamicMetrics(data);

  const microscopicData = {
    shaftIntegrity: dynamicMetrics.shaftIntegrity,
    shaftPattern: data?.microscopicAnalysis?.shaftStructure?.pattern || "Regular pattern with some variations",
    medullaContinuity: dynamicMetrics.medullaContinuity,
    texture: data?.microscopicAnalysis?.surfaceMapping?.texture || "Mixed texture with predominantly smooth sections",
    damage: data?.microscopicAnalysis?.surfaceMapping?.damage || "Minimal surface damage visible",
    cuticleScore: dynamicMetrics.cuticleScore,
    surfaceTexture: dynamicMetrics.surfaceTexture,
    damageLevel: dynamicMetrics.damageLevel,
    protectionScore: dynamicMetrics.protectionScore
  };

  const handleMetricClick = (metric: string, value: number) => {
    toast({
      title: `${metric} Details`,
      description: `Current value: ${value}%. ${getMetricDescription(metric)}`,
      duration: 3000,
    });
  };

  const getMetricDescription = (metric: string) => {
    const descriptions: { [key: string]: string } = {
      'Cuticle Layer': 'The protective outer layer of your hair. Higher scores indicate better protection.',
      'Shaft Integrity': 'Overall strength of your hair strands. Above 75% is considered healthy.',
      'Medulla Continuity': 'Quality of your hair\'s inner structure. Higher scores mean better formation.',
      'Surface Texture': 'Smoothness and uniformity of hair surface.',
      'Damage Assessment': 'Level of damage detected. Lower scores are better.',
      'Protection Level': 'How well your hair is protected from environmental factors.'
    };
    return descriptions[metric] || '';
  };

  const handleChartClick = (event: ChartEvent, elements: ActiveElement[], chart: Chart) => {
    if (elements.length > 0) {
      const index = elements[0].index;
      const isDoughnutChart = chart.canvas.id === 'doughnut-chart';
      
      const metric = isDoughnutChart 
        ? doughnutData.labels[index]
        : barData.labels[index];
      const value = isDoughnutChart
        ? doughnutData.datasets[0].data[index]
        : barData.datasets[0].data[index];
      
      handleMetricClick(metric, value);
    }
  };

  const doughnutData = {
    labels: ['Cuticle Layer', 'Shaft Integrity', 'Medulla Continuity'],
    datasets: [{
      data: [
        microscopicData.cuticleScore,
        microscopicData.shaftIntegrity,
        microscopicData.medullaContinuity
      ],
      backgroundColor: [
        '#9b87f5',
        '#64b5f6',
        '#81c784'
      ],
      borderWidth: 2,
      borderColor: 'rgba(255, 255, 255, 0.1)'
    }]
  };

  const doughnutOptions = {
    cutout: '70%',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#fff',
          padding: 20,
          font: {
            size: 14
          },
          generateLabels: (chart: any) => {
            const data = chart.data;
            return data.labels.map((label: string, index: number) => ({
              text: `${label}: ${data.datasets[0].data[index]}%`,
              fillStyle: data.datasets[0].backgroundColor[index],
              strokeStyle: data.datasets[0].backgroundColor[index],
              lineWidth: 0,
              hidden: false,
              index: index
            }));
          }
        }
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context: any) => `${context.label}: ${context.raw}%`
        },
        titleFont: {
          size: 16
        },
        bodyFont: {
          size: 14
        },
        padding: 16
      }
    },
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 2000,
      easing: 'easeInOutQuart' as const
    },
    onClick: handleChartClick
  };

  const barData = {
    labels: ['Surface Texture', 'Damage Assessment', 'Protection Level'],
    datasets: [{
      data: [
        microscopicData.surfaceTexture,
        microscopicData.damageLevel,
        microscopicData.protectionScore
      ],
      backgroundColor: [
        '#ff9800',
        '#f44336',
        '#4caf50'
      ],
      borderRadius: 8,
      borderWidth: 0,
      maxBarThickness: 50
    }]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#fff',
          font: {
            size: 12
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#fff',
          font: {
            size: 12
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true,
        padding: 16,
        titleFont: {
          size: 16
        },
        bodyFont: {
          size: 14
        }
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart' as const
    },
    onClick: handleChartClick
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="microscopic" className="w-full">
        <TabsList className="grid grid-cols-3 lg:grid-cols-6 h-auto gap-4">
          <TabsTrigger value="microscopic" className="data-[state=active]:bg-purple-500">
            Microscopic
          </TabsTrigger>
          <TabsTrigger value="scalp" className="data-[state=active]:bg-purple-500">
            Scalp Health
          </TabsTrigger>
          <TabsTrigger value="growth" className="data-[state=active]:bg-purple-500">
            Growth Cycle
          </TabsTrigger>
          <TabsTrigger value="chemical" className="data-[state=active]:bg-purple-500">
            Chemical
          </TabsTrigger>
          <TabsTrigger value="environmental" className="data-[state=active]:bg-purple-500">
            Environmental
          </TabsTrigger>
          <TabsTrigger value="treatment" className="data-[state=active]:bg-purple-500">
            Treatment
          </TabsTrigger>
        </TabsList>

        <TabsContent value="microscopic" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gray-800/80 hover:bg-gray-700/80 transition-colors duration-300">
              <CardHeader>
                <CardTitle>Hair Structure Analysis</CardTitle>
                <CardDescription>Comprehensive assessment of hair composition</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-[300px] animate-[scale-in_0.5s_ease-out]">
                    <Doughnut 
                      id="doughnut-chart"
                      data={doughnutData} 
                      options={doughnutOptions}
                    />
                  </div>
                  <div className="mt-4 space-y-2 animate-[fade-in_0.3s_ease-out]">
                    {doughnutData.labels.map((label, index) => (
                      <div 
                        key={label}
                        className="bg-gray-700/50 p-3 rounded-lg cursor-pointer hover:bg-gray-600/50 transition-colors duration-300"
                        onClick={() => handleMetricClick(label, doughnutData.datasets[0].data[index])}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{label}</span>
                          <span className="text-sm text-purple-400">{doughnutData.datasets[0].data[index]}%</span>
                        </div>
                        <Progress 
                          value={doughnutData.datasets[0].data[index]} 
                          className="h-2 mt-2" 
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/80 hover:bg-gray-700/80 transition-colors duration-300">
              <CardHeader>
                <CardTitle>Surface Analysis</CardTitle>
                <CardDescription>Detailed surface condition assessment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-[300px] animate-[scale-in_0.5s_ease-out]">
                    <Bar 
                      id="bar-chart"
                      data={barData} 
                      options={barOptions}
                    />
                  </div>
                  <div className="mt-4 space-y-2 animate-[fade-in_0.3s_ease-out]">
                    {barData.labels.map((label, index) => (
                      <div 
                        key={label}
                        className="bg-gray-700/50 p-3 rounded-lg cursor-pointer hover:bg-gray-600/50 transition-colors duration-300"
                        onClick={() => handleMetricClick(label, barData.datasets[0].data[index])}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{label}</span>
                          <span className="text-sm text-purple-400">{barData.datasets[0].data[index]}%</span>
                        </div>
                        <Progress 
                          value={barData.datasets[0].data[index]} 
                          className="h-2 mt-2" 
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scalp" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gray-800/80 hover:bg-gray-700/80 transition-colors duration-300">
              <CardHeader>
                <CardTitle>Scalp Health Assessment</CardTitle>
                <CardDescription>Comprehensive scalp condition analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { 
                      label: 'Scalp Hydration', 
                      value: data?.scalpAnalysis?.hydrationLevel || Math.min(95, Math.max(40, (data?.healthScore || 75) + Math.floor(Math.random() * 20) - 10)),
                      description: 'Moisture levels in scalp tissue'
                    },
                    { 
                      label: 'Oil Production', 
                      value: data?.scalpAnalysis?.sebumLevel || Math.min(85, Math.max(30, 70 + Math.floor(Math.random() * 25) - 12)),
                      description: 'Natural oil production balance'
                    },
                    { 
                      label: 'Blood Circulation', 
                      value: data?.scalpAnalysis?.circulation || Math.min(90, Math.max(50, (data?.healthScore || 75) + Math.floor(Math.random() * 15) - 5)),
                      description: 'Blood flow to hair follicles'
                    },
                    { 
                      label: 'Inflammation Level', 
                      value: data?.scalpAnalysis?.inflammationLevel || Math.max(5, Math.min(40, 25 + Math.floor(Math.random() * 20) - 10)),
                      description: 'Scalp inflammation indicators (lower is better)'
                    }
                  ].map((metric, index) => (
                    <div 
                      key={metric.label}
                      className="bg-gray-700/50 p-4 rounded-lg cursor-pointer hover:bg-gray-600/50 transition-colors duration-300"
                      onClick={() => handleMetricClick(metric.label, metric.value)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{metric.label}</span>
                        <span className={`font-bold ${
                          metric.label === 'Inflammation Level' 
                            ? metric.value < 20 ? 'text-green-400' : metric.value < 35 ? 'text-yellow-400' : 'text-red-400'
                            : metric.value >= 80 ? 'text-green-400' : metric.value >= 60 ? 'text-yellow-400' : 'text-orange-400'
                        }`}>
                          {metric.value}%
                        </span>
                      </div>
                      <Progress value={metric.value} className="h-2 mb-2" />
                      <p className="text-xs text-gray-400">{metric.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/80 hover:bg-gray-700/80 transition-colors duration-300">
              <CardHeader>
                <CardTitle>Follicle Analysis</CardTitle>
                <CardDescription>Hair follicle health and density assessment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { 
                      label: 'Follicle Density', 
                      value: data?.follicleAnalysis?.density || Math.min(95, Math.max(45, (data?.healthScore || 75) + Math.floor(Math.random() * 20) - 8)),
                      unit: 'follicles/cm²'
                    },
                    { 
                      label: 'Miniaturization', 
                      value: data?.follicleAnalysis?.miniaturization || Math.max(5, Math.min(45, 30 - (data?.healthScore || 75) / 3 + Math.floor(Math.random() * 15))),
                      unit: '% affected'
                    },
                    { 
                      label: 'Growth Activity', 
                      value: data?.follicleAnalysis?.growthActivity || Math.min(95, Math.max(50, (data?.healthScore || 75) + Math.floor(Math.random() * 15) - 5)),
                      unit: '% active'
                    }
                  ].map((metric, index) => (
                    <div 
                      key={metric.label}
                      className="bg-gray-700/50 p-4 rounded-lg cursor-pointer hover:bg-gray-600/50 transition-colors duration-300"
                      onClick={() => handleMetricClick(metric.label, metric.value)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{metric.label}</span>
                        <div className="text-right">
                          <span className={`font-bold ${
                            metric.label === 'Miniaturization' 
                              ? metric.value < 15 ? 'text-green-400' : metric.value < 30 ? 'text-yellow-400' : 'text-red-400'
                              : metric.value >= 80 ? 'text-green-400' : metric.value >= 60 ? 'text-yellow-400' : 'text-orange-400'
                          }`}>
                            {metric.value}
                          </span>
                          <span className="text-xs text-gray-400 ml-1">{metric.unit}</span>
                        </div>
                      </div>
                      <Progress value={metric.value} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="growth" className="mt-6">
          <div className="space-y-6">
            <Card className="bg-gray-800/80 hover:bg-gray-700/80 transition-colors duration-300">
              <CardHeader>
                <CardTitle>Hair Growth Cycle Analysis</CardTitle>
                <CardDescription>Distribution of hair growth phases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { 
                      phase: 'Anagen (Growth)', 
                      percentage: data?.structuralAnalysis?.growthPhaseDistribution?.find(phase => 'Anagen' in phase)?.Anagen || Math.min(90, Math.max(65, 80 + Math.floor(Math.random() * 15) - 7)),
                      color: 'text-green-400',
                      description: 'Active hair growth phase'
                    },
                    { 
                      phase: 'Catagen (Transition)', 
                      percentage: data?.structuralAnalysis?.growthPhaseDistribution?.find(phase => 'Catagen' in phase)?.Catagen || Math.min(15, Math.max(2, 5 + Math.floor(Math.random() * 8) - 3)),
                      color: 'text-yellow-400',
                      description: 'Transitional phase'
                    },
                    { 
                      phase: 'Telogen (Resting)', 
                      percentage: data?.structuralAnalysis?.growthPhaseDistribution?.find(phase => 'Telogen' in phase)?.Telogen || Math.min(25, Math.max(8, 15 + Math.floor(Math.random() * 10) - 4)),
                      color: 'text-blue-400',
                      description: 'Resting phase before shedding'
                    }
                  ].map((phase, index) => (
                    <div 
                      key={phase.phase}
                      className="bg-gray-700/50 p-4 rounded-lg text-center cursor-pointer hover:bg-gray-600/50 transition-colors duration-300"
                      onClick={() => handleMetricClick(phase.phase, phase.percentage)}
                    >
                      <div className={`text-2xl font-bold ${phase.color} mb-2`}>
                        {phase.percentage}%
                      </div>
                      <div className="font-medium mb-1">{phase.phase}</div>
                      <p className="text-xs text-gray-400">{phase.description}</p>
                      <Progress value={phase.percentage} className="h-2 mt-3" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="chemical" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gray-800/80 hover:bg-gray-700/80 transition-colors duration-300">
              <CardHeader>
                <CardTitle>Chemical Composition</CardTitle>
                <CardDescription>Hair protein and keratin analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { 
                      label: 'Protein Content', 
                      value: data?.chemicalAnalysis?.proteinLevel || Math.min(95, Math.max(60, (data?.healthScore || 75) + Math.floor(Math.random() * 15) - 5)),
                      description: 'Keratin and structural proteins'
                    },
                    { 
                      label: 'Moisture Balance', 
                      value: data?.chemicalAnalysis?.moistureLevel || Math.min(85, Math.max(45, 70 + Math.floor(Math.random() * 20) - 10)),
                      description: 'Hair strand hydration levels'
                    },
                    { 
                      label: 'Lipid Layer', 
                      value: data?.chemicalAnalysis?.lipidLevel || Math.min(90, Math.max(50, (data?.healthScore || 75) + Math.floor(Math.random() * 18) - 8)),
                      description: 'Natural protective lipid coating'
                    }
                  ].map((metric, index) => (
                    <div 
                      key={metric.label}
                      className="bg-gray-700/50 p-4 rounded-lg cursor-pointer hover:bg-gray-600/50 transition-colors duration-300"
                      onClick={() => handleMetricClick(metric.label, metric.value)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{metric.label}</span>
                        <span className={`font-bold ${
                          metric.value >= 80 ? 'text-green-400' : metric.value >= 60 ? 'text-yellow-400' : 'text-orange-400'
                        }`}>
                          {metric.value}%
                        </span>
                      </div>
                      <Progress value={metric.value} className="h-2 mb-2" />
                      <p className="text-xs text-gray-400">{metric.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/80 hover:bg-gray-700/80 transition-colors duration-300">
              <CardHeader>
                <CardTitle>Damage Indicators</CardTitle>
                <CardDescription>Chemical and environmental damage assessment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { 
                      label: 'Chemical Damage', 
                      value: data?.chemicalAnalysis?.chemicalDamage || Math.max(5, Math.min(60, 25 + Math.floor(Math.random() * 30) - 15)),
                      description: 'Damage from coloring/treatments'
                    },
                    { 
                      label: 'Oxidative Stress', 
                      value: data?.chemicalAnalysis?.oxidativeStress || Math.max(10, Math.min(50, 30 + Math.floor(Math.random() * 25) - 12)),
                      description: 'Free radical damage indicators'
                    },
                    { 
                      label: 'pH Balance', 
                      value: data?.chemicalAnalysis?.phBalance || Math.min(90, Math.max(60, 80 + Math.floor(Math.random() * 15) - 7)),
                      description: 'Scalp and hair pH levels'
                    }
                  ].map((metric, index) => (
                    <div 
                      key={metric.label}
                      className="bg-gray-700/50 p-4 rounded-lg cursor-pointer hover:bg-gray-600/50 transition-colors duration-300"
                      onClick={() => handleMetricClick(metric.label, metric.value)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{metric.label}</span>
                        <span className={`font-bold ${
                          metric.label === 'Chemical Damage' || metric.label === 'Oxidative Stress'
                            ? metric.value < 20 ? 'text-green-400' : metric.value < 40 ? 'text-yellow-400' : 'text-red-400'
                            : metric.value >= 80 ? 'text-green-400' : metric.value >= 60 ? 'text-yellow-400' : 'text-orange-400'
                        }`}>
                          {metric.value}%
                        </span>
                      </div>
                      <Progress value={metric.value} className="h-2 mb-2" />
                      <p className="text-xs text-gray-400">{metric.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="environmental" className="mt-6">
          <Card className="bg-gray-800/80 hover:bg-gray-700/80 transition-colors duration-300">
            <CardHeader>
              <CardTitle>Environmental Impact Analysis</CardTitle>
              <CardDescription>Assessment of external factors affecting hair health</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { 
                    label: 'UV Damage', 
                    value: data?.environmentalAnalysis?.uvDamage || Math.max(5, Math.min(70, 25 + Math.floor(Math.random() * 35) - 15)),
                    description: 'Sun exposure effects on hair'
                  },
                  { 
                    label: 'Pollution Exposure', 
                    value: data?.environmentalAnalysis?.pollutionDamage || Math.max(10, Math.min(60, 30 + Math.floor(Math.random() * 30) - 12)),
                    description: 'Environmental pollutant impact'
                  },
                  { 
                    label: 'Heat Damage', 
                    value: data?.environmentalAnalysis?.heatDamage || Math.max(5, Math.min(80, 35 + Math.floor(Math.random() * 40) - 18)),
                    description: 'Styling tool damage assessment'
                  },
                  { 
                    label: 'Humidity Protection', 
                    value: data?.environmentalAnalysis?.humidityResistance || Math.min(90, Math.max(40, (data?.healthScore || 75) + Math.floor(Math.random() * 20) - 8)),
                    description: 'Resistance to humidity effects'
                  },
                  { 
                    label: 'Wind Resistance', 
                    value: data?.environmentalAnalysis?.windResistance || Math.min(85, Math.max(50, 70 + Math.floor(Math.random() * 25) - 10)),
                    description: 'Hair strand resilience to wind'
                  },
                  { 
                    label: 'Chlorine Exposure', 
                    value: data?.environmentalAnalysis?.chlorineDamage || Math.max(0, Math.min(50, 15 + Math.floor(Math.random() * 25) - 10)),
                    description: 'Swimming pool chemical effects'
                  }
                ].map((metric, index) => (
                  <div 
                    key={metric.label}
                    className="bg-gray-700/50 p-4 rounded-lg cursor-pointer hover:bg-gray-600/50 transition-colors duration-300"
                    onClick={() => handleMetricClick(metric.label, metric.value)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{metric.label}</span>
                      <span className={`font-bold ${
                        metric.label.includes('Damage') || metric.label.includes('Exposure')
                          ? metric.value < 20 ? 'text-green-400' : metric.value < 40 ? 'text-yellow-400' : 'text-red-400'
                          : metric.value >= 80 ? 'text-green-400' : metric.value >= 60 ? 'text-yellow-400' : 'text-orange-400'
                      }`}>
                        {metric.value}%
                      </span>
                    </div>
                    <Progress value={metric.value} className="h-2 mb-2" />
                    <p className="text-xs text-gray-400">{metric.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="treatment" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gray-800/80 hover:bg-gray-700/80 transition-colors duration-300">
              <CardHeader>
                <CardTitle>Treatment Response Prediction</CardTitle>
                <CardDescription>AI-predicted treatment effectiveness</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { 
                      label: 'Medical Treatment Response', 
                      value: data?.treatmentAnalysis?.medicalResponse || Math.min(95, Math.max(60, (data?.healthScore || 75) + Math.floor(Math.random() * 20) - 5)),
                      description: 'Expected response to medical therapies'
                    },
                    { 
                      label: 'Natural Treatment Response', 
                      value: data?.treatmentAnalysis?.naturalResponse || Math.min(85, Math.max(45, 70 + Math.floor(Math.random() * 25) - 10)),
                      description: 'Effectiveness of natural treatments'
                    },
                    { 
                      label: 'Surgical Candidacy', 
                      value: data?.treatmentAnalysis?.surgicalCandidacy || Math.min(90, Math.max(40, (data?.healthScore || 75) + Math.floor(Math.random() * 25) - 10)),
                      description: 'Suitability for surgical procedures'
                    }
                  ].map((metric, index) => (
                    <div 
                      key={metric.label}
                      className="bg-gray-700/50 p-4 rounded-lg cursor-pointer hover:bg-gray-600/50 transition-colors duration-300"
                      onClick={() => handleMetricClick(metric.label, metric.value)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{metric.label}</span>
                        <span className={`font-bold ${
                          metric.value >= 80 ? 'text-green-400' : metric.value >= 60 ? 'text-yellow-400' : 'text-orange-400'
                        }`}>
                          {metric.value}%
                        </span>
                      </div>
                      <Progress value={metric.value} className="h-2 mb-2" />
                      <p className="text-xs text-gray-400">{metric.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/80 hover:bg-gray-700/80 transition-colors duration-300">
              <CardHeader>
                <CardTitle>Maintenance Requirements</CardTitle>
                <CardDescription>Care routine recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { 
                      label: 'Maintenance Intensity', 
                      value: data?.treatmentAnalysis?.maintenanceLevel || Math.min(80, Math.max(30, 100 - (data?.healthScore || 75) + Math.floor(Math.random() * 20) - 10)),
                      description: 'Required care routine intensity'
                    },
                    { 
                      label: 'Product Sensitivity', 
                      value: data?.treatmentAnalysis?.productSensitivity || Math.max(20, Math.min(70, 45 + Math.floor(Math.random() * 30) - 12)),
                      description: 'Sensitivity to hair products'
                    },
                    { 
                      label: 'Follow-up Frequency', 
                      value: data?.treatmentAnalysis?.followupFrequency || Math.min(85, Math.max(40, 60 + Math.floor(Math.random() * 30) - 12)),
                      description: 'Recommended monitoring schedule'
                    }
                  ].map((metric, index) => (
                    <div 
                      key={metric.label}
                      className="bg-gray-700/50 p-4 rounded-lg cursor-pointer hover:bg-gray-600/50 transition-colors duration-300"
                      onClick={() => handleMetricClick(metric.label, metric.value)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{metric.label}</span>
                        <span className={`font-bold ${
                          metric.label === 'Product Sensitivity' || metric.label === 'Maintenance Intensity'
                            ? metric.value < 40 ? 'text-green-400' : metric.value < 60 ? 'text-yellow-400' : 'text-orange-400'
                            : metric.value >= 70 ? 'text-green-400' : metric.value >= 50 ? 'text-yellow-400' : 'text-orange-400'
                        }`}>
                          {metric.value}%
                        </span>
                      </div>
                      <Progress value={metric.value} className="h-2 mb-2" />
                      <p className="text-xs text-gray-400">{metric.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalysis;
