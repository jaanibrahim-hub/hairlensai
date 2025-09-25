import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { analyzeHairImage } from "@/utils/geminiApi";
import { analyzeImageQuality, getQualityStatusColor, getQualityStatusText, ImageAnalysisResult } from "@/utils/imageQuality";
import { toast } from "sonner";
import PremiumAccessModal from "./PremiumAccessModal";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  const [imageQuality, setImageQuality] = useState<ImageAnalysisResult | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [isProcessingQuality, setIsProcessingQuality] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setImageQuality(null);
      setCurrentImage(null);
      
      const isValid = await validateImage(file);
      if (!isValid) return;

      // First, analyze image quality
      setIsProcessingQuality(true);
      toast.info("Analyzing image quality...");
      
      const qualityResult = await analyzeImageQuality(file);
      setImageQuality(qualityResult);
      setIsProcessingQuality(false);
      
      // Display quality assessment
      const qualityScore = qualityResult.quality.overallScore;
      if (qualityScore < 40) {
        toast.error(`Poor image quality (${qualityScore}/100). Please follow the recommendations below.`);
        return;
      } else if (qualityScore < 70) {
        toast.warning(`Image quality could be improved (${qualityScore}/100). Consider the suggestions below for better results.`);
      } else {
        toast.success(`Excellent image quality (${qualityScore}/100)! Ready for analysis.`);
      }
      
      // Show preview
      const imageUrl = URL.createObjectURL(file);
      setCurrentImage(imageUrl);

    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Error processing image. Please try again.");
      setIsProcessingQuality(false);
    }
  };

  const handleAnalyzeImage = async () => {
    if (!imageQuality || !fileInputRef.current?.files?.[0]) return;

    const file = fileInputRef.current.files[0];
    
    try {
      setIsAnalyzing(true);
      setUploadProgress(0);
      toast.info("Starting AI hair analysis...");

      // Enhanced progress simulation
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 15;
        });
      }, 800);

      // Use enhanced image if available
      const imageToAnalyze = imageQuality.processedImage || URL.createObjectURL(file);
      
      // Convert to base64
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = async () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        const base64String = canvas.toDataURL().split(',')[1];
        
        try {
          console.log('🚀 Sending enhanced image for Gemini 2.5 Flash analysis');
          const analysisResults = await analyzeHairImage(base64String);
          
          // Add quality metadata to results
          analysisResults._imageQuality = imageQuality.quality;
          analysisResults._enhancementApplied = imageQuality.enhancementApplied;
          
          window.dispatchEvent(new CustomEvent('hairAnalysisComplete', { detail: analysisResults }));
          setUploadProgress(100);
          toast.success("🎉 Advanced AI analysis complete!");
          
          // Clear the image after successful analysis
          setTimeout(() => {
            setCurrentImage(null);
            setImageQuality(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
          }, 2000);
        } catch (error) {
          console.error('Analysis error:', error);
          toast.error("Failed to analyze. Please try again.");
        } finally {
          clearInterval(progressInterval);
          setIsAnalyzing(false);
          setUploadProgress(0);
        }
      };
      
      img.src = imageToAnalyze;
      
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error("Error during analysis. Please try again.");
      setIsAnalyzing(false);
      setUploadProgress(0);
    }
  };

  const resetUpload = () => {
    setCurrentImage(null);
    setImageQuality(null);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
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
              ref={fileInputRef}
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

            {!currentImage ? (
              <Button 
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 px-6 py-2 text-sm sm:text-base"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessingQuality}
              >
                {isProcessingQuality ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    <span className="text-sm sm:text-base">Checking Quality...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-upload mr-2"></i>
                    <span className="text-sm sm:text-base">Upload Image</span>
                  </>
                )}
              </Button>
            ) : (
              <div className="space-y-4 w-full max-w-md mx-auto">
                {/* Image Preview */}
                <div className="relative">
                  <img 
                    src={currentImage} 
                    alt="Preview" 
                    className="w-full h-48 object-cover rounded-lg border-2 border-gray-600"
                  />
                  <button
                    onClick={resetUpload}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                
                {/* Quality Assessment */}
                {imageQuality && (
                  <Card className="bg-gray-700/50 border-gray-600">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-white">Image Quality Assessment</span>
                        <Badge className={`${getQualityStatusColor(imageQuality.quality.overallScore)} bg-transparent border-current`}>
                          {imageQuality.quality.overallScore}/100 - {getQualityStatusText(imageQuality.quality.overallScore)}
                        </Badge>
                      </div>
                      
                      {/* Quality Metrics */}
                      <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-300">Sharpness:</span>
                          <span className={getQualityStatusColor(imageQuality.quality.sharpness)}>
                            {imageQuality.quality.sharpness}/100
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Lighting:</span>
                          <span className={getQualityStatusColor(imageQuality.quality.lighting)}>
                            {imageQuality.quality.lighting}/100
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Hair Visibility:</span>
                          <span className={getQualityStatusColor(imageQuality.quality.hairVisibility)}>
                            {imageQuality.quality.hairVisibility}/100
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Scalp Visibility:</span>
                          <span className={getQualityStatusColor(imageQuality.quality.scalpVisibility)}>
                            {imageQuality.quality.scalpVisibility}/100
                          </span>
                        </div>
                      </div>
                      
                      {/* Recommendations */}
                      {imageQuality.quality.recommendations.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-xs font-medium text-white">Recommendations:</span>
                          {imageQuality.quality.recommendations.map((rec, idx) => (
                            <div key={idx} className="text-xs text-gray-300 flex items-start gap-1">
                              <span className="text-blue-400 mt-0.5">•</span>
                              <span>{rec}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {imageQuality.enhancementApplied && (
                        <div className="mt-3 p-2 bg-blue-500/20 rounded text-xs text-blue-300">
                          ✨ Auto-enhancement applied for better analysis
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
                
                {/* Analysis Buttons */}
                <div className="flex gap-2">
                  <Button 
                    onClick={handleAnalyzeImage}
                    disabled={isAnalyzing || !imageQuality?.quality.isAcceptable}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {isAnalyzing ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-brain mr-2"></i>
                        Analyze with AI
                      </>
                    )}
                  </Button>
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="border-gray-600 text-gray-300"
                  >
                    <i className="fas fa-exchange-alt mr-2"></i>
                    Replace
                  </Button>
                </div>
                
                {!imageQuality?.quality.isAcceptable && (
                  <div className="p-3 bg-yellow-500/20 rounded text-xs text-yellow-300">
                    ⚠️ Image quality too low for accurate analysis. Please follow recommendations above.
                  </div>
                )}
              </div>
            )}
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

        <div className="mt-4 text-xs text-gray-500 space-y-1">
          <p>💡 Tip: Use good lighting and focus on hair/scalp areas for best results</p>
          <p>🔬 Real-time quality assessment powered by computer vision</p>
          <p>🚀 Enhanced with Gemini 2.5 Flash for clinical-grade analysis</p>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;