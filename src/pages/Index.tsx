import Header from "@/components/Header";
import ImageUpload from "@/components/ImageUpload";
import ImagePreview from "@/components/ImagePreview";
import AnalysisResults from "@/components/AnalysisResults";
import HowItWorksModal from "@/components/HowItWorksModal";
import PremiumAccessModal from "@/components/PremiumAccessModal";
import { useState } from "react";

const Index = () => {
  const [apiKey, setApiKey] = useState<string | null>(
    localStorage.getItem("hairlens_api_key")
  );

  const handleKeyValidated = (key: string) => {
    setApiKey(key);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-900 to-indigo-800">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header Section with Responsive Text and Button Layout */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 lg:mb-8 space-y-4 sm:space-y-0 sm:space-x-4">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Hair Analysis Dashboard</h1>
          <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
            <HowItWorksModal />
            <PremiumAccessModal onKeyValidated={handleKeyValidated} />
          </div>
        </div>
        
        {/* Main Content Grid with Better Responsive Layout */}
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
            <AnalysisResults apiKey={apiKey} />
          </div>
        </div>
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