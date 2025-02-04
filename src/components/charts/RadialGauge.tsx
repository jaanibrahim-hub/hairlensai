import { Card } from "@/components/ui/card";
import { Chart as ChartJS, ArcElement, RadialLinearScale } from 'chart.js';
import { PolarArea } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, ArcElement);

interface RadialGaugeProps {
  value: number;
  label: string;
  color?: string;
}

export const RadialGauge = ({ value, label, color = "#9b87f5" }: RadialGaugeProps) => {
  const data = {
    labels: [label],
    datasets: [
      {
        data: [value],
        backgroundColor: [color],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      r: {
        max: 100,
        min: 0,
        ticks: {
          display: false,
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        angleLines: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };

  return (
    <Card className="p-4">
      <div className="h-40">
        <PolarArea data={data} options={options} />
      </div>
      <div className="text-center mt-2">
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-lg font-semibold">{value}%</p>
      </div>
    </Card>
  );
};