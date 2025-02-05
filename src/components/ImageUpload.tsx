import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { analyzeHairImage } from "@/utils/geminiApi";
import { toast } from "sonner";
import PremiumAccessModal from "./PremiumAccessModal";
import { Progress } from "@/components/ui/progress";

// File validation constants with updated limits
const FILE_LIMITS = {
  MIN_SIZE: 100 * 1024, // 100KB
  MAX_SIZE: 20 * 1024 * 1024, // 20MB
  ALLOWED_FORMATS: {
    'image/png': {
      recommended: true,
      note: "Recommended for detailed analysis"
    },
    'image/jpeg': {
      recommended: true,
      note: "Good for general use"
    },
    'image/webp': {
      recommended: true,
      note: "Efficient format"
    }
  },
  MAX_RESOLUTION: 3072,
  COMPRESSION_THRESHOLD: 10 * 1024 * 1024 // 10MB
};

const ImageUpload = () => {
  const [multipleMode, setMultipleMode] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const validateImage = async (file: File): Promise<boolean> => {
    console.log('Validating image:', file.name, file.size, file.type);
    
    // Check file format
    if (!FILE_LIMITS.ALLOWED_FORMATS[file.type as keyof typeof FILE_LIMITS.ALLOWED_FORMATS]) {
      toast.error("Please upload a valid image file (PNG, JPEG, or WebP)");
      return false;
    }

    // Check file size
    if (file.size < FILE_LIMITS.MIN_SIZE) {
      toast.error("File size too small. Minimum size is 100KB for quality analysis");
      return false;
    }

    if (file.size > FILE_LIMITS.MAX_SIZE) {
      toast.error("File size too large. Maximum size is 20MB");
      return false;
    }

    // Check image dimensions
    const dimensions = await getImageDimensions(file);
    if (dimensions.width > FILE_LIMITS.MAX_RESOLUTION || dimensions.height > FILE_LIMITS.MAX_RESOLUTION) {
      toast.warning("Image will be automatically scaled to maintain quality");
    }

    // Warning for large files
    if (file.size > FILE_LIMITS.COMPRESSION_THRESHOLD) {
      toast.warning("Large file detected. Processing may take longer");
    }

    return true;
  };

  const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        resolve({ width: img.width, height: img.height });
      };
      img.src = URL.createObjectURL(file);
    });
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

    try {
      setUploadProgress(0);
      const isValid = await validateImage(file);
      if (!isValid) return;

      console.log('Starting image analysis');
      setIsAnalyzing(true);
      toast.info("Started analyzing your image");

      // Simulated upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 500);

      // Convert image to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = (reader.result as string).split(',')[1];
        
        try {
          console.log('Sending image for analysis');
          const analysisResults = await analyzeHairImage(base64String);
          window.dispatchEvent(new CustomEvent('hairAnalysisComplete', { detail: analysisResults }));
          setUploadProgress(100);
          toast.success("Analysis complete!");
        } catch (error) {
          console.error('Analysis error:', error);
          toast.error("Failed to analyze. Please try again.");
        } finally {
          clearInterval(progressInterval);
          setIsAnalyzing(false);
          setUploadProgress(0);
        }
      };

      reader.onerror = () => {
        console.error('FileReader error');
        toast.error("Error reading file. Please try again.");
        setIsAnalyzing(false);
        setUploadProgress(0);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Error processing image. Please try again.");
      setIsAnalyzing(false);
      setUploadProgress(0);
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
              accept=".png,.jpg,.jpeg,.webp"
              onChange={handleImageUpload}
            />
            <i className="fas fa-camera text-3xl sm:text-4xl text-primary"></i>
            <div className="space-y-2">
              <h3 className="text-lg sm:text-xl font-medium text-white">
                Upload a high-quality image of your scalp or hair
              </h3>
              <div className="text-sm text-gray-400 space-y-1">
                <p>Supported formats: PNG (recommended), JPEG, WebP</p>
                <p>Size limits: 100KB - 20MB</p>
                <p>Optimal resolution: Up to 3072x3072 pixels</p>
              </div>
            </div>

            {uploadProgress > 0 && (
              <div className="w-full space-y-2">
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-sm text-gray-400">{uploadProgress}% complete</p>
              </div>
            )}

            <Button 
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 px-6 py-2 text-sm sm:text-base"
              onClick={() => document.getElementById('imageInput')?.click()}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  <span className="text-sm sm:text-base">Analyzing...</span>
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
                  accept=".png,.jpg,.jpeg,.webp"
                  onChange={handleImageUpload}
                />
                <i className="fas fa-plus text-xl sm:text-2xl text-primary mb-2"></i>
                <p className="text-sm sm:text-base text-white">{view}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 text-xs text-gray-500">
          <p>Premium users can upload up to 3,000 images in batch mode</p>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;