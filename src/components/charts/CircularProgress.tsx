import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CircularProgressProps {
  value: number;
  label: string;
  color?: string;
}

export const CircularProgress = ({ value, label, color = "#9b87f5" }: CircularProgressProps) => {
  return (
    <Card className="p-4">
      <div className="text-center">
        <div className="relative inline-flex">
          <Progress 
            value={value} 
            className={cn(
              "w-24 h-24",
              color === "#9b87f5" ? "bg-purple-200" : "bg-gray-200"
            )}
          />
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{ color }}
          >
            <span className="text-2xl font-bold">{value}%</span>
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-400">{label}</p>
      </div>
    </Card>
  );
};