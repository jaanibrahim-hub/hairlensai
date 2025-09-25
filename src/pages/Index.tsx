import Header from "@/components/Header";
import ImageUpload from "@/components/ImageUpload";
import ImagePreview from "@/components/ImagePreview";
import AnalysisResults from "@/components/AnalysisResults";
import ProgressTracking from "@/components/ProgressTracking";
import TreatmentTimeline from "@/components/TreatmentTimeline";
import HairGrowthPredictor from "@/components/HairGrowthPredictor";
import HowItWorksModal from "@/components/HowItWorksModal";
import PremiumAccessModal from "@/components/PremiumAccessModal";
import ActivityIndicator from "@/components/ActivityIndicator";
import StatsOverview from "@/components/StatsOverview";
import FloatingActionButton from "@/components/FloatingActionButton";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

const Index = () => {
  const [apiKey, setApiKey] = useState<string | null>(
    localStorage.getItem("hairlens_api_key")
  );
  const [currentAnalysis, setCurrentAnalysis] = useState<any>(null);

  const handleKeyValidated = (key: string) => {
    setApiKey(key);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-900 to-indigo-800">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header Section with Enhanced Animations */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 lg:mb-8 space-y-4 sm:space-y-0 sm:space-x-4 animate-slide-up">
          <div className="flex flex-col">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white animate-bounce-in gradient-text">
              💫 HairLens AI Dashboard
            </h1>
            <div className="flex items-center gap-2 mt-2 animate-slide-up" style={{animationDelay: '0.2s'}}>
              <span className="text-xs bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white px-3 py-1 rounded-full font-medium animate-pulse-glow">
                🚀 Powered by advanced machine learning trained on 100,000+ hair analysis datasets
              </span>
              <span className="text-xs bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-2 py-1 rounded-full">
                🧠 Advanced AI Analysis
              </span>
              <span className="text-xs bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full animate-shimmer">
                ✨ Professional Grade
              </span>
            </div>
            {/* Activity Indicator */}
            <div className="mt-3">
              <ActivityIndicator />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
            <HowItWorksModal />
            <PremiumAccessModal onKeyValidated={handleKeyValidated} />
          </div>
        </div>
        
        {/* Stats Overview Dashboard */}
        <div className="animate-slide-up" style={{animationDelay: '0.6s'}}>
          <StatsOverview />
        </div>
        

        
        {/* Enhanced Tabs with Glass Morphism */}
        <Tabs defaultValue="analysis" className="w-full">
          <TabsList className="grid w-full grid-cols-4 glass-card backdrop-blur-md border-white/20 animate-slide-up" style={{animationDelay: '0.4s'}}>
            <TabsTrigger 
              value="analysis" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-700 data-[state=active]:text-white hover:bg-white/10 transition-all duration-300 hover-lift"
            >
              🧠 AI Analysis
            </TabsTrigger>
            <TabsTrigger 
              value="progress" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-emerald-700 data-[state=active]:text-white hover:bg-white/10 transition-all duration-300 hover-lift"
            >
              📊 Progress
            </TabsTrigger>
            <TabsTrigger 
              value="timeline" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white hover:bg-white/10 transition-all duration-300 hover-lift"
            >
              🎯 Timeline
            </TabsTrigger>
            <TabsTrigger 
              value="predictor" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-600 data-[state=active]:to-pink-700 data-[state=active]:text-white hover:bg-white/10 transition-all duration-300 hover-lift"
            >
              🔮 Growth Predictor
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="analysis" className="mt-6 animate-slide-up">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-start">
              {/* Left Column - Upload and Preview */}
              <div className="space-y-4 sm:space-y-6">
                <div className="glass-card backdrop-blur-md rounded-xl shadow-2xl hover-lift animate-bounce-in">
                  <ImageUpload />
                </div>
                <div className="glass-card backdrop-blur-md rounded-xl shadow-2xl hover-lift animate-bounce-in" style={{animationDelay: '0.1s'}}>
                  <ImagePreview />
                </div>
              </div>
              {/* Right Column - Analysis Results */}
              <div className="mt-4 xl:mt-0 animate-bounce-in" style={{animationDelay: '0.2s'}}>
                <AnalysisResults apiKey={apiKey} onAnalysisComplete={setCurrentAnalysis} />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="progress" className="mt-6 animate-slide-up">
            <div className="glass-card backdrop-blur-md rounded-xl p-6 hover-lift">
              <ProgressTracking />
            </div>
          </TabsContent>
          
          <TabsContent value="timeline" className="mt-6 animate-slide-up">
            <div className="glass-card backdrop-blur-md rounded-xl p-6 hover-lift">
              <TreatmentTimeline />
            </div>
          </TabsContent>
          
          <TabsContent value="predictor" className="mt-6 animate-slide-up">
            <div className="glass-card backdrop-blur-md rounded-xl p-6 hover-lift">
              <HairGrowthPredictor 
                analysisData={currentAnalysis} 
                treatmentPlan={currentAnalysis?.recommendedTreatments?.[0]?.name}
              />
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Floating Action Button */}
      <FloatingActionButton />
      
      {/* Enhanced Footer with Glass Effect */}
      <footer className="glass-card backdrop-blur-md border-t border-white/20 mt-8">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="text-center text-sm sm:text-base text-gray-200">
            <p className="animate-pulse">© 2025 HairLens AI. Powered by Advanced AI Technology ✨</p>
            <div className="flex justify-center items-center gap-4 mt-2 text-xs text-gray-400">
              <span>🚀 Advanced AI Engine</span>
              <span>•</span>
              <span>🧠 Professional Analysis</span>
              <span>•</span>
              <span>⚡ Real-time Results</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;