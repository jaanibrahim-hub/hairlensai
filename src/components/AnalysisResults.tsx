import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useRef } from "react";
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
import { Line, Pie } from 'react-chartjs-2';

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

const AnalysisResults = () => {
  const isMobile = useIsMobile();
  
  const metrics = [
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

  const healthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Hair Health',
        data: [65, 70, 68, 72, 75, 76],
        borderColor: '#9b87f5',
        backgroundColor: 'rgba(155, 135, 245, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#9b87f5',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#9b87f5',
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ]
  };

  const pieData = {
    labels: ['Healthy', 'Damaged', 'Growing', 'Resting'],
    datasets: [{
      data: [45, 15, 30, 10],
      backgroundColor: [
        'rgba(155, 135, 245, 0.8)',
        'rgba(255, 99, 132, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(255, 206, 86, 0.8)',
      ],
      borderColor: 'rgba(255, 255, 255, 0.8)',
      borderWidth: 2,
    }],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#9b87f5',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function(context: any) {
            return `  ${context.parsed.y}%`;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: '#9b87f5',
          padding: 10,
          font: {
            size: isMobile ? 10 : 12,
          }
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#9b87f5',
          padding: 10,
          font: {
            size: isMobile ? 10 : 12,
          }
        }
      }
    },
    elements: {
      line: {
        tension: 0.4
      }
    }
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          color: '#fff',
          font: {
            size: isMobile ? 10 : 12,
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#9b87f5',
        borderWidth: 1,
        padding: 12,
      }
    },
    cutout: '60%',
    animation: {
      animateScale: true,
      animateRotate: true
    }
  };

  return (
    <ScrollArea className="h-[calc(100vh-8rem)]">
      <div className="space-y-6 p-4">
        <Card className="bg-gray-800/80 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <Tabs defaultValue="analysis" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-6">
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
              <TabsTrigger value="information">Information</TabsTrigger>
              <TabsTrigger value="treatments">Treatments</TabsTrigger>
            </TabsList>

            <TabsContent value="analysis" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="bg-gray-700/80 p-4">
                  <h4 className="font-medium mb-4">Hair Health Trend</h4>
                  <Line data={healthData} options={chartOptions} />
                </Card>
                <Card className="bg-gray-700/80 p-4">
                  <h4 className="font-medium mb-4">Hair Distribution</h4>
                  <Pie data={pieData} options={pieOptions} />
                </Card>
                <Card className="bg-gray-700/80 p-4">
                  <h4 className="font-medium mb-4">Growth Phases</h4>
                  <Line data={healthData} options={chartOptions} />
                </Card>
              </div>

              <Card className="bg-gray-700/80 p-6">
                <h3 className="text-lg font-medium mb-4">Quick Summary</h3>
                <p className="text-gray-300 leading-relaxed">
                  Your scalp and hair analysis shows promising results with normal sebum production 
                  and minimal inflammation. The AI detected healthy growth patterns with 85% of follicles 
                  in the anagen phase. Your hair density of 165 hairs/cm² is within the optimal range.
                </p>
              </Card>
            </TabsContent>

            <TabsContent value="metrics" className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {metrics.map((metric) => (
                  <Card
                    key={metric.label}
                    className="bg-gray-700/80 p-4 hover:bg-gray-700 transition-colors duration-300"
                  >
                    <div className="flex items-center mb-2">
                      <i className={`fas fa-${metric.icon} text-purple-400 mr-3`}></i>
                      <span>{metric.label}</span>
                    </div>
                    <span className={`font-medium ${metric.color || ''}`}>
                      {metric.value}
                    </span>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="information" className="space-y-6">
              <Card className="bg-gray-700/80 p-6">
                <h3 className="text-lg font-medium mb-4">Diagnostic Analysis</h3>
                <p className="text-gray-300">
                  Advanced microscopic analysis reveals signs of androgenetic alopecia with approximately 25% miniaturized follicles 
                  concentrated in the crown and temple areas. Telogen Effluvium is indicated by an elevated percentage (28%) of club 
                  hairs in the telogen phase, suggesting recent systemic stress.
                </p>
              </Card>
            </TabsContent>

            <TabsContent value="treatments" className="space-y-6">
              <Card className="bg-gray-700/80 p-6">
                <h3 className="text-lg font-medium mb-4">Recommended Treatments</h3>
                <p className="text-gray-300">
                  Based on your analysis, we recommend the following treatments to improve your hair health:
                </p>
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
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Overall Health Score</span>
              <span className="text-lg font-bold text-purple-400">76%</span>
            </div>
            <Progress value={76} className="h-2.5 bg-gray-700" />
          </div>
        </Card>

        <div className="flex flex-wrap justify-center gap-4">
          <Button className="bg-purple-600 hover:bg-purple-700 transition-all duration-300">
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
    </ScrollArea>
  );
};

export default AnalysisResults;
