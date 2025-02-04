import { Card } from "@/components/ui/card";
import {
  PolarArea,
  PolarAreaChart,
  PolarAreaElement,
} from "recharts";

interface RadialGaugeProps {
  value: number;
  label: string;
  color?: string;
}

export const RadialGauge = ({ value, label, color = "#9b87f5" }: RadialGaugeProps) => {
  const data = [
    {
      name: label,
      value: value,
    },
  ];

  return (
    <Card className="p-4">
      <div className="h-40">
        <PolarArea
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={0}
          outerRadius={80}
          fill={color}
        />
      </div>
      <div className="text-center mt-2">
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-lg font-semibold">{value}%</p>
      </div>
    </Card>
  );
};