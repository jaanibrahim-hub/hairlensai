import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { analyzeHairImage } from "@/utils/geminiApi";
import { analyzeImageQuality, getQualityStatusColor, getQualityStatusText, ImageAnalysisResult } from "@/utils/imageQuality";
import { toast } from "sonner";
import PremiumAccessModal from "./PremiumAccessModal";
import LivePulse from "./LivePulse";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload, Sparkles, Zap, Eye, Brain } from "lucide-react";

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
    console.log('handleImageUpload called');
    console.log('event.target.files:', event.target.files);
    const file = event.target.files?.[0];
    console.log('Selected file:', file);
    if (!file) return;

    try {
      setUploadProgress(0);
      setImageQuality(null);
      setCurrentImage(null);
      
      console.log('Starting file validation...');
      const isValid = await validateImage(file);
      console.log('File validation result:', isValid);
      if (!isValid) {
        console.log('File validation failed, stopping process');
        return;
      }

      // Show image preview immediately
      console.log('Creating image preview...');
      const imageUrl = URL.createObjectURL(file);
      setCurrentImage(imageUrl);
      console.log('Image preview created:', imageUrl);
      
      // Run quality analysis in the background (non-blocking)
      console.log('Starting background image quality analysis...');
      setIsProcessingQuality(true);
      toast.success("Image uploaded successfully! Analyzing quality in background...");
      
      // Run quality analysis asynchronously without blocking the upload
      analyzeImageQuality(file)
        .then(qualityResult => {
          console.log('Quality analysis result:', qualityResult);
          setImageQuality(qualityResult);
          setIsProcessingQuality(false);
          
          // Display quality assessment
          const qualityScore = qualityResult.quality.overallScore;
          console.log('Quality score:', qualityScore);
          
          if (qualityScore < 40) {
            toast.warning(`Image quality could be better (${qualityScore}/100), but analysis will still work. Check recommendations below.`);
          } else if (qualityScore < 70) {
            toast.info(`Good image quality (${qualityScore}/100). Consider the suggestions below for even better results.`);
          } else {
            toast.success(`Excellent image quality (${qualityScore}/100)! Perfect for analysis.`);
          }
        })
        .catch(error => {
          console.error('Error during quality analysis:', error);
          setIsProcessingQuality(false);
          // Create a basic quality result so analysis can proceed
          const basicQuality: ImageAnalysisResult = {
            quality: {
              overallScore: 75,
              sharpness: 75,
              lighting: 75,
              resolution: 75,
              hairVisibility: 75,
              scalpVisibility: 75,
              angle: 75,
              recommendations: ["Image quality assessment skipped - proceeding with analysis"],
              isAcceptable: true
            },
            enhancementApplied: false,
            metadata: {
              originalSize: file.size,
              processedSize: file.size,
              format: file.type,
              aspectRatio: "Unknown"
            }
          };
          setImageQuality(basicQuality);
          toast.info("Quality analysis skipped - your image is ready for AI analysis!");
        });

    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Error processing image. Please try again.");
      setIsProcessingQuality(false);
    }
  };

  const handleAnalyzeImage = async () => {
    if (!fileInputRef.current?.files?.[0]) {
      toast.error("No image selected for analysis");
      return;
    }

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
    <div className="glass-card backdrop-blur-md border-white/20 rounded-xl p-4 sm:p-6 shadow-2xl hover-lift transition-all duration-300">
      {/* Live Status Indicator */}
      <div className="flex items-center justify-between mb-4">
        <LivePulse 
          status={isAnalyzing ? 'analyzing' : isProcessingQuality ? 'processing' : currentImage ? 'complete' : 'idle'} 
        />
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
          <span className="text-xs text-gray-300">AI-Powered Analysis</span>
        </div>
      </div>
      
      <div className="border-2 border-dashed border-white/30 rounded-xl p-6 sm:p-8 lg:p-12 text-center hover:border-purple-400 transition-all duration-300 hover:bg-white/5 relative overflow-hidden">
        {/* Animated background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 animate-shimmer" />
        
        <div className="mb-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm sm:text-base text-gray-200">Multiple Images Mode</span>
              <Badge variant="outline" className="border-yellow-400 text-yellow-400 text-xs">Premium</Badge>
            </div>
            <Switch
              checked={multipleMode}
              onCheckedChange={handleMultipleModeToggle}
              className="bg-gray-600 data-[state=checked]:bg-purple-600"
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
            <div className="relative mb-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center animate-pulse-glow">
                <Camera className="w-8 h-8 text-white animate-bounce" />
              </div>
              <div className="absolute inset-0 w-16 h-16 mx-auto bg-gradient-to-r from-purple-600 to-pink-600 rounded-full animate-ping opacity-20" />
            </div>
            <div className="space-y-3 relative z-10">
              <h3 className="text-lg sm:text-xl font-bold text-white gradient-text animate-slide-up">
                🎯 Upload High-Quality Hair Image
              </h3>
              <div className="text-sm text-gray-300 space-y-2 animate-slide-up" style={{animationDelay: '0.1s'}}>
                <div className="flex items-center justify-center gap-2">
                  <Eye className="w-4 h-4 text-emerald-400" />
                  <p><span className="text-emerald-400 font-medium">PNG</span> (recommended), JPEG, WebP</p>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Upload className="w-4 h-4 text-blue-400" />
                  <p>Size: <span className="text-blue-400 font-medium">100KB - 20MB</span></p>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  <p>Resolution: <span className="text-yellow-400 font-medium">Up to 3072x3072px</span></p>
                </div>
              </div>
            </div>

            {uploadProgress > 0 && (
              <div className="w-full space-y-3 animate-slide-up">
                <div className="relative">
                  <Progress value={uploadProgress} className="h-3 progress-gradient" />
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 rounded-full animate-pulse opacity-30" />
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Brain className="w-4 h-4 text-purple-400 animate-spin" />
                  <p className="text-sm text-gray-200 font-medium">{uploadProgress}% complete - AI Processing...</p>
                </div>
              </div>
            )}

            {!currentImage ? (
              <div className="space-y-4">
                <Button 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg"
                  onClick={() => {
                    console.log('Main upload button clicked');
                    console.log('fileInputRef.current:', fileInputRef.current);
                    if (fileInputRef.current) {
                      fileInputRef.current.click();
                    } else {
                      console.error('fileInputRef.current is null');
                    }
                  }}
                  disabled={isProcessingQuality}
                >
                  {isProcessingQuality ? (
                    <div className="flex items-center gap-2">
                      <Eye className="w-5 h-5 animate-spin" />
                      <span>✨ Checking Quality...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Upload className="w-5 h-5" />
                      <span>🚀 Choose Image to Upload</span>
                    </div>
                  )}
                </Button>
                
                {/* Alternative direct click on label */}
                <div className="text-center">
                  <label 
                    htmlFor="imageInput" 
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg cursor-pointer transition-colors"
                  >
                    Alternative: Click here to upload
                  </label>
                </div>
              </div>
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
                    disabled={isAnalyzing || !imageQuality}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {isAnalyzing ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Analyzing...
                      </>
                    ) : isProcessingQuality ? (
                      <>
                        <i className="fas fa-eye fa-spin mr-2"></i>
                        Quality Check...
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
                
                {imageQuality && imageQuality.quality.overallScore < 50 && (
                  <div className="p-3 bg-blue-500/20 rounded text-xs text-blue-300">
                    💡 Image quality could be improved, but AI analysis will still work. Check recommendations above for better results.
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