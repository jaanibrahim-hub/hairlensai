import React from 'react';
import { Activity, Cpu, Brain, Zap } from 'lucide-react';

interface LivePulseProps {
  status?: 'idle' | 'processing' | 'analyzing' | 'complete';
  className?: string;
}

const LivePulse: React.FC<LivePulseProps> = ({ status = 'idle', className }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'processing':
        return {
          icon: Cpu,
          color: 'from-blue-500 to-blue-700',
          bgColor: 'bg-blue-500/20',
          text: 'Processing...',
          pulseSpeed: 'animate-pulse'
        };
      case 'analyzing':
        return {
          icon: Brain,
          color: 'from-purple-500 to-purple-700',
          bgColor: 'bg-purple-500/20',
          text: 'AI Analyzing...',
          pulseSpeed: 'animate-bounce'
        };
      case 'complete':
        return {
          icon: Zap,
          color: 'from-emerald-500 to-emerald-700',
          bgColor: 'bg-emerald-500/20',
          text: 'Complete!',
          pulseSpeed: 'animate-ping'
        };
      default:
        return {
          icon: Activity,
          color: 'from-gray-500 to-gray-700',
          bgColor: 'bg-gray-500/20',
          text: 'Ready',
          pulseSpeed: 'animate-pulse'
        };
    }
  };

  const config = getStatusConfig();
  const IconComponent = config.icon;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Pulse indicator */}
      <div className="relative">
        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${config.color} ${config.pulseSpeed}`} />
        <div className={`absolute inset-0 w-3 h-3 rounded-full bg-gradient-to-r ${config.color} animate-ping opacity-30`} />
      </div>
      
      {/* Status icon */}
      <div className={`${config.bgColor} p-1 rounded-md`}>
        <IconComponent className={`w-3 h-3 text-white ${config.pulseSpeed}`} />
      </div>
      
      {/* Status text */}
      <span className="text-xs text-gray-300 font-medium">
        {config.text}
      </span>
    </div>
  );
};

export default LivePulse;