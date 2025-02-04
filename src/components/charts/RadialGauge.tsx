import { Card } from "@/components/ui/card";
import { PolarArea } from 'react-chartjs-2';

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