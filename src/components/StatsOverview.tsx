import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Users,
  TrendingUp,
  Zap,
  Award,
  Target,
  Activity,
  BarChart3,
  Sparkles
} from 'lucide-react';

interface StatItem {
  id: string;
  label: string;
  value: number;
  target: number;
  icon: React.ComponentType<any>;
  color: string;
  trend: number;
}

const StatsOverview: React.FC = () => {
  const [stats, setStats] = useState<StatItem[]>([
    {
      id: 'analyses',
      label: 'Analyses Completed',
      value: 0,
      target: 1247,
      icon: BarChart3,
      color: 'from-purple-500 to-purple-700',
      trend: 12.5
    },
    {
      id: 'accuracy',
      label: 'AI Accuracy Rate',
      value: 0,
      target: 94.8,
      icon: Target,
      color: 'from-emerald-500 to-emerald-700',
      trend: 2.3
    },
    {
      id: 'improvements',
      label: 'User Improvements',
      value: 0,
      target: 87.2,
      icon: TrendingUp,
      color: 'from-blue-500 to-blue-700',
      trend: 8.7
    },
    {
      id: 'satisfaction',
      label: 'Satisfaction Score',
      value: 0,
      target: 4.9,
      icon: Award,
      color: 'from-pink-500 to-pink-700',
      trend: 4.2
    }
  ]);

  // Animate counter values
  useEffect(() => {
    stats.forEach((stat, index) => {
      const duration = 2000; // 2 seconds
      const steps = 60;
      const stepValue = stat.target / steps;
      
      let currentValue = 0;
      const interval = setInterval(() => {
        currentValue += stepValue;
        if (currentValue >= stat.target) {
          currentValue = stat.target;
          clearInterval(interval);
        }
        
        setStats(prev => prev.map((s, i) => 
          i === index ? { ...s, value: currentValue } : s
        ));
      }, duration / steps);
    });
  }, []);

  const formatValue = (value: number, id: string) => {
    if (id === 'satisfaction') return value.toFixed(1);
    if (id === 'accuracy' || id === 'improvements') return `${value.toFixed(1)}%`;
    return Math.floor(value).toLocaleString();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        const progressPercentage = (stat.value / stat.target) * 100;
        
        return (
          <Card 
            key={stat.id}
            className="glass-card backdrop-blur-md border-white/20 hover-lift animate-bounce-in overflow-hidden relative"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Animated background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-10 animate-pulse`} />
            
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-gray-200">
                {stat.label}
              </CardTitle>
              <div className={`p-2 rounded-full bg-gradient-to-r ${stat.color} animate-pulse-glow`}>
                <IconComponent className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            
            <CardContent className="relative z-10">
              <div className="flex items-baseline justify-between mb-2">
                <div className="text-2xl font-bold text-white gradient-text">
                  {formatValue(stat.value, stat.id)}
                </div>
                <div className="flex items-center text-xs text-emerald-400">
                  <TrendingUp className="w-3 h-3 mr-1 animate-pulse" />
                  +{stat.trend}%
                </div>
              </div>
              
              <Progress 
                value={progressPercentage} 
                className="h-2 progress-gradient animate-shimmer"
              />
              
              <div className="flex items-center mt-2 text-xs text-gray-400">
                <Activity className="w-3 h-3 mr-1 animate-pulse" />
                <span>Target: {formatValue(stat.target, stat.id)}</span>
              </div>
            </CardContent>
            
            {/* Sparkle effect */}
            <div className="absolute top-2 right-2">
              <Sparkles className="w-3 h-3 text-yellow-400 animate-pulse" style={{
                animationDelay: `${index * 0.5}s`
              }} />
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsOverview;