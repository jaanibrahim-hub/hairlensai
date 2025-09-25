import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Brain, Microscope, Zap, Eye, Sparkles, TrendingUp, Activity, CheckCircle } from "lucide-react";

interface AIAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIAnalysisModal = ({ isOpen, onClose }: AIAnalysisModalProps) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const analysisSteps = [
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Image Processing",
      description: "Analyzing image quality and enhancement requirements",
      duration: 3000,
      color: "text-blue-400"
    },
    {
      icon: <Microscope className="w-6 h-6" />,
      title: "Microscopic Analysis", 
      description: "Examining hair structure, cuticle layers, and shaft integrity",
      duration: 8000,
      color: "text-purple-400"
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI Pattern Recognition",
      description: "Identifying hair patterns, damage assessment, and growth phases",
      duration: 12000,
      color: "text-pink-400"
    },
    {
      icon: <Activity className="w-6 h-6" />,
      title: "Health Assessment",
      description: "Evaluating scalp condition, hair density, and overall health score",
      duration: 8000,
      color: "text-green-400"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Treatment Matching",
      description: "Generating personalized treatment recommendations",
      duration: 6000,
      color: "text-orange-400"
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Report Generation",
      description: "Finalizing comprehensive analysis report",
      duration: 3000,
      color: "text-yellow-400"
    }
  ];

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setCurrentStep(0);
      setCompletedSteps([]);
      return;
    }

    let totalDuration = 0;
    let stepTimeouts: NodeJS.Timeout[] = [];
    let progressInterval: NodeJS.Timeout;

    const startTime = Date.now();
    const totalAnalysisTime = analysisSteps.reduce((acc, step) => acc + step.duration, 0);

    // Progress animation
    progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(95, (elapsed / totalAnalysisTime) * 100);
      setProgress(newProgress);
    }, 100);

    // Step progression
    analysisSteps.forEach((step, index) => {
      const timeout = setTimeout(() => {
        setCurrentStep(index);
        if (index > 0) {
          setCompletedSteps(prev => [...prev, index - 1]);
        }
      }, totalDuration);

      stepTimeouts.push(timeout);
      totalDuration += step.duration;
    });

    // Complete final step
    const finalTimeout = setTimeout(() => {
      setCompletedSteps(prev => [...prev, analysisSteps.length - 1]);
      setProgress(100);
    }, totalDuration);

    stepTimeouts.push(finalTimeout);

    return () => {
      clearInterval(progressInterval);
      stepTimeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[600px] bg-gray-900/95 border border-gray-700/50 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white text-center mb-2">
            🧠 Advanced AI Hair Analysis
          </DialogTitle>
          <div className="text-gray-300 text-center">
            Our neural networks trained on 100,000+ clinical images are analyzing your hair...
          </div>
        </DialogHeader>

        <div className="space-y-6 p-6">
          {/* Overall Progress */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-300">Analysis Progress</span>
              <span className="text-sm font-bold text-purple-400">{Math.round(progress)}%</span>
            </div>
            <Progress 
              value={progress} 
              className="h-2 bg-gray-700/50"
            />
          </div>

          {/* Current Analysis Step */}
          <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg p-4 border border-purple-500/30">
            <div className="flex items-center gap-3 mb-2">
              <div className={`${analysisSteps[currentStep]?.color || 'text-purple-400'} animate-pulse`}>
                {analysisSteps[currentStep]?.icon}
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg">
                  {analysisSteps[currentStep]?.title || 'Processing...'}
                </h3>
                <p className="text-gray-300 text-sm">
                  {analysisSteps[currentStep]?.description || 'Please wait...'}
                </p>
              </div>
            </div>
          </div>

          {/* Analysis Steps Timeline */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-300 mb-3">Analysis Pipeline</h4>
            {analysisSteps.map((step, index) => (
              <div 
                key={index} 
                className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-500 ${
                  completedSteps.includes(index) 
                    ? 'bg-green-600/20 border border-green-500/30' 
                    : currentStep === index 
                    ? 'bg-purple-600/20 border border-purple-500/30 animate-pulse' 
                    : 'bg-gray-800/30 border border-gray-600/20'
                }`}
              >
                <div className={`flex-shrink-0 ${
                  completedSteps.includes(index) 
                    ? 'text-green-400' 
                    : currentStep === index 
                    ? step.color 
                    : 'text-gray-500'
                }`}>
                  {completedSteps.includes(index) ? <CheckCircle className="w-5 h-5" /> : step.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`font-medium text-sm ${
                    completedSteps.includes(index) || currentStep === index ? 'text-white' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </div>
                </div>
                {completedSteps.includes(index) && (
                  <div className="text-green-400 text-xs font-medium">✓ Complete</div>
                )}
                {currentStep === index && !completedSteps.includes(index) && (
                  <div className="text-purple-400 text-xs font-medium animate-pulse">• Processing</div>
                )}
              </div>
            ))}
          </div>

          {/* Processing Info */}
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600/30">
            <div className="text-center space-y-2">
              <div className="text-sm text-gray-300">
                🔬 Analyzing at microscopic level with advanced pattern recognition
              </div>
              <div className="text-xs text-gray-400">
                Estimated time: 30-60 seconds • High-precision analysis in progress
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIAnalysisModal;