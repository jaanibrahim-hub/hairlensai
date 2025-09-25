import Header from "@/components/Header";
import ImageUpload from "@/components/ImageUpload";
import ImagePreview from "@/components/ImagePreview";
import AnalysisResults from "@/components/AnalysisResults";
import ProgressTracking from "@/components/ProgressTracking";
import TreatmentTimeline from "@/components/TreatmentTimeline";
import HairGrowthPredictor from "@/components/HairGrowthPredictor";
import HowItWorksModal from "@/components/HowItWorksModal";
import PremiumAccessModal from "@/components/PremiumAccessModal";
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
        {/* Header Section with Responsive Text and Button Layout */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 lg:mb-8 space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex flex-col">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Hair Analysis Dashboard</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full font-medium">
                🚀 Powered by Gemini 2.5 Flash
              </span>
              <span className="text-xs text-gray-400">Advanced AI Analysis</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
            <HowItWorksModal />
            <PremiumAccessModal onKeyValidated={handleKeyValidated} />
          </div>
        </div>
        
        {/* Main Content with Tabs */}
        <Tabs defaultValue="analysis" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800/80 border-gray-700">
            <TabsTrigger value="analysis" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              🧠 AI Analysis
            </TabsTrigger>
            <TabsTrigger value="progress" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              📊 Progress
            </TabsTrigger>
            <TabsTrigger value="timeline" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              🎯 Timeline
            </TabsTrigger>
            <TabsTrigger value="predictor" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              🔮 Growth Predictor
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="analysis" className="mt-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-start">
              {/* Left Column - Upload and Preview */}
              <div className="space-y-4 sm:space-y-6">
                <div className="bg-gray-800/80 rounded-lg shadow-lg">
                  <ImageUpload />
                </div>
                <div className="bg-gray-800/80 rounded-lg shadow-lg">
                  <ImagePreview />
                </div>
              </div>
              {/* Right Column - Analysis Results */}
              <div className="mt-4 xl:mt-0">
                <AnalysisResults apiKey={apiKey} onAnalysisComplete={setCurrentAnalysis} />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="progress" className="mt-6">
            <ProgressTracking />
          </TabsContent>
          
          <TabsContent value="timeline" className="mt-6">
            <TreatmentTimeline />
          </TabsContent>
          
          <TabsContent value="predictor" className="mt-6">
            <HairGrowthPredictor 
              analysisData={currentAnalysis} 
              treatmentPlan={currentAnalysis?.recommendedTreatments?.[0]?.name}
            />
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Responsive Footer */}
      <footer className="border-t border-gray-800 mt-8">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="text-center text-sm sm:text-base text-gray-400">
            <p>© 2025 HairLens AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;