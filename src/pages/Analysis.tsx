import { useState } from "react";
import Header from "@/components/Header";
import ImageUpload from "@/components/ImageUpload";
import ImagePreview from "@/components/ImagePreview";
import AnalysisResults from "@/components/AnalysisResults";
import PremiumAccessModal from "@/components/PremiumAccessModal";

const Analysis = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);

  const handleKeyValidated = (key: string) => {
    setApiKey(key);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-900 to-indigo-800">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Hair Analysis</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <ImageUpload />
            <ImagePreview />
            <PremiumAccessModal onKeyValidated={handleKeyValidated} />
          </div>
          <AnalysisResults apiKey={apiKey} />
        </div>
      </main>
    </div>
  );
};

export default Analysis;