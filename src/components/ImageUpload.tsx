import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { analyzeHairImage } from "@/utils/geminiApi";
import { toast } from "sonner";
import PremiumAccessModal from "./PremiumAccessModal";

// File validation constants
const FILE_LIMITS = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/heic']
};

const ImageUpload = () => {
  const [multipleMode, setMultipleMode] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const validateImage = (file: File) => {
    console.log('Validating image:', file.name, file.size, file.type);
    
    if (!FILE_LIMITS.ALLOWED_TYPES.includes(file.type)) {
      toast.error("Please upload a valid image file (JPEG, PNG, WEBP)");
      return false;
    }

    if (file.size > FILE_LIMITS.MAX_SIZE) {
      toast.error("File size too large. Maximum size is 5MB");
      return false;
    }

    return true;
  };

  const handleMultipleModeToggle = () => {
    const apiKey = localStorage.getItem("hairlens_api_key");
    if (!apiKey) {
      toast.error("Multiple image mode is a premium feature");
      setShowPremiumModal(true);
      return;
    }
    setMultipleMode(!multipleMode);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!validateImage(file)) {
      return;
    }

    try {
      console.log('Starting image analysis');
      setIsAnalyzing(true);
      toast.info("Started analyzing your image");

      // Convert image to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = (reader.result as string).split(',')[1];
        
        try {
          console.log('Sending image for analysis');
          const analysisResults = await analyzeHairImage(base64String);
          window.dispatchEvent(new CustomEvent('hairAnalysisComplete', { detail: analysisResults }));
          toast.success("Analysis complete!");
        } catch (error) {
          console.error('Analysis error:', error);
          toast.error("Failed to analyze. Please try again.");
        } finally {
          setIsAnalyzing(false);
        }
      };

      reader.onerror = () => {
        console.error('FileReader error');
        toast.error("Error reading file. Please try again.");
        setIsAnalyzing(false);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Error processing image. Please try again.");
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-gray-800/80 rounded-lg p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 sm:p-8 lg:p-12 text-center hover:border-primary transition-colors duration-300">
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
            <span className="text-sm sm:text-base text-gray-400">Multiple Images Mode (Premium Feature)</span>
            <Switch
              checked={multipleMode}
              onCheckedChange={handleMultipleModeToggle}
              className="bg-gray-600 data-[state=checked]:bg-primary"
            />
          </div>
        </div>
        
        {!multipleMode ? (
          <div className="space-y-4">
            <input 
              type="file" 
              className="hidden" 
              id="imageInput" 
              accept="image/*"
              onChange={handleImageUpload}
            />
            <i className="fas fa-camera text-3xl sm:text-4xl text-primary"></i>
            <h3 className="text-lg sm:text-xl font-medium text-white">
              Please upload a high-quality image of your scalp or hair for assessment
              <br />
              <span className="text-sm text-gray-400">(Max size: 5MB, Formats: JPEG, PNG, WEBP)</span>
            </h3>
            <p className="text-gray-400">or</p>
            <Button 
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 px-6 py-2 text-sm sm:text-base"
              onClick={() => document.getElementById('imageInput')?.click()}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  <span className="text-sm sm:text-base">Analyzing...Running through 170,000+ case studies...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-upload mr-2"></i>
                  <span className="text-sm sm:text-base">Upload Image</span>
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {["Front View", "Side View", "Back View"].map((view) => (
              <div key={view} className="border-2 border-dashed border-gray-600 rounded-lg p-4 sm:p-6 text-center hover:border-primary transition-colors duration-300">
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <i className="fas fa-plus text-xl sm:text-2xl text-primary mb-2"></i>
                <p className="text-sm sm:text-base text-white">{view}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;