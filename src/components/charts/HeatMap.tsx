import { Card } from "@/components/ui/card";
import { useState } from "react";

interface HeatMapProps {
  data: {
    locations: string[];
    severity: number;
  };
  maxValue?: number;
}

export const HeatMap = ({ data, maxValue = 100 }: HeatMapProps) => {
  const getColor = (severity: number) => {
    const hue = ((1 - severity / maxValue) * 120).toString(10);
    return `hsl(${hue}, 70%, 50%)`;
  };

  return (
    <Card className="p-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Inflammation Zones</h3>
        <div className="grid grid-cols-2 gap-2">
          {data.locations.map((location, index) => (
            <div
              key={index}
              className="p-2 rounded"
              style={{ backgroundColor: getColor(data.severity) }}
            >
              <p className="text-xs text-white">{location}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>Low</span>
          <span>High</span>
        </div>
      </div>
    </Card>
  );
};