import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Plus,
  Camera,
  Upload,
  Zap,
  Download,
  Share2,
  Settings,
  X
} from 'lucide-react';

const FloatingActionButton: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const actions = [
    {
      id: 'camera',
      icon: Camera,
      label: 'Take Photo',
      color: 'from-blue-500 to-blue-700',
      action: () => {
        // Trigger camera capture
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) fileInput.click();
      }
    },
    {
      id: 'upload',
      icon: Upload,
      label: 'Upload Image',
      color: 'from-emerald-500 to-emerald-700',
      action: () => {
        // Trigger file upload
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) fileInput.click();
      }
    },
    {
      id: 'analyze',
      icon: Zap,
      label: 'Quick Analyze',
      color: 'from-purple-500 to-purple-700',
      action: () => {
        // Trigger quick analysis
        console.log('Quick analyze');
      }
    },
    {
      id: 'share',
      icon: Share2,
      label: 'Share Results',
      color: 'from-pink-500 to-pink-700',
      action: () => {
        // Share functionality
        if (navigator.share) {
          navigator.share({
            title: 'HairLens AI Analysis',
            text: 'Check out my hair analysis results!',
            url: window.location.href
          });
        }
      }
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Action buttons */}
      <div className={`flex flex-col-reverse gap-3 mb-3 transition-all duration-300 ${
        isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        {actions.map((action, index) => {
          const IconComponent = action.icon;
          return (
            <div
              key={action.id}
              className="flex items-center gap-3 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="bg-gray-900/90 backdrop-blur-sm text-white text-sm py-2 px-3 rounded-lg shadow-lg animate-bounce-in">
                {action.label}
              </div>
              <Button
                size="sm"
                onClick={action.action}
                className={`w-12 h-12 rounded-full bg-gradient-to-r ${action.color} hover:scale-110 transition-all duration-300 shadow-lg animate-pulse-glow`}
              >
                <IconComponent className="w-5 h-5" />
              </Button>
            </div>
          );
        })}
      </div>

      {/* Main FAB */}
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-110 transition-all duration-300 shadow-xl animate-pulse-glow ${
          isExpanded ? 'rotate-45' : 'rotate-0'
        }`}
      >
        {isExpanded ? (
          <X className="w-6 h-6 transition-transform duration-300" />
        ) : (
          <Plus className="w-6 h-6 transition-transform duration-300" />
        )}
      </Button>

      {/* Ripple effect */}
      <div className="absolute inset-0 rounded-full animate-ping bg-purple-400 opacity-20 pointer-events-none" />
    </div>
  );
};

export default FloatingActionButton;