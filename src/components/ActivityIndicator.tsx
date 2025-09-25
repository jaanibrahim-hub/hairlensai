import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  Activity,
  Zap,
  Brain,
  TrendingUp,
  Eye,
  Cpu,
  Sparkles
} from 'lucide-react';

interface ActivityIndicatorProps {
  className?: string;
}

const ActivityIndicator: React.FC<ActivityIndicatorProps> = ({ className }) => {
  const [currentActivity, setCurrentActivity] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const activities = [
    { 
      icon: Brain, 
      text: "AI Processing...", 
      color: "from-purple-500 to-purple-700",
      bgColor: "bg-purple-500/20"
    },
    { 
      icon: Eye, 
      text: "Analyzing Image...", 
      color: "from-blue-500 to-blue-700",
      bgColor: "bg-blue-500/20"
    },
    { 
      icon: Cpu, 
      text: "Computing Results...", 
      color: "from-emerald-500 to-emerald-700",
      bgColor: "bg-emerald-500/20"
    },
    { 
      icon: TrendingUp, 
      text: "Generating Insights...", 
      color: "from-pink-500 to-pink-700",
      bgColor: "bg-pink-500/20"
    },
    { 
      icon: Sparkles, 
      text: "Ready for Analysis!", 
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-500/20"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentActivity(prev => (prev + 1) % activities.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const current = activities[currentActivity];
  const IconComponent = current.icon;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`relative ${current.bgColor} rounded-full p-2 animate-pulse-glow`}>
        <IconComponent className="w-4 h-4 text-white animate-spin" style={{
          animationDuration: '2s'
        }} />
        <div className="absolute inset-0 rounded-full animate-ping opacity-30 bg-current"></div>
      </div>
      <Badge 
        variant="outline" 
        className={`bg-gradient-to-r ${current.color} text-white border-none animate-shimmer`}
      >
        <Activity className="w-3 h-3 mr-1 animate-pulse" />
        {current.text}
      </Badge>
      
      {/* Pulse indicator */}
      <div className="flex items-center gap-1">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className={`w-1 h-4 rounded-full bg-gradient-to-t ${current.color} animate-pulse`}
            style={{
              animationDelay: `${i * 0.2}s`,
              animationDuration: '1s'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ActivityIndicator;