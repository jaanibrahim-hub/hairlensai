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
import type { ChartEvent } from 'chart.js';

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

  // Extract microscopic analysis data with fallbacks
  const microscopicData = {
    shaftIntegrity: data?.microscopicAnalysis?.shaftStructure?.integrity || 0,
    shaftPattern: data?.microscopicAnalysis?.shaftStructure?.pattern || "Regular pattern with some variations",
    medullaContinuity: data?.microscopicAnalysis?.medullaAnalysis?.continuity || 0,
    texture: data?.microscopicAnalysis?.surfaceMapping?.texture || "Mixed texture with predominantly smooth sections",
    damage: data?.microscopicAnalysis?.surfaceMapping?.damage || "Minimal surface damage visible",
    cuticleScore: data?.microscopicAnalysis?.cuticleLayerScore || 75,
    surfaceTexture: 85,
    damageLevel: 25,
    protectionScore: 90
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

  const handleChartClick = (event: ChartEvent, elements: Array<{ index: number; element: { chart: ChartJS } }>) => {
    if (elements[0]) {
      const chart = elements[0].element.chart;
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
      </Tabs>
    </div>
  );
};

export default AdvancedAnalysis;
