import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { analyzeHairImage } from "@/utils/geminiApi";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

const ImageUpload = () => {
  const [multipleMode, setMultipleMode] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lightingQuality, setLightingQuality] = useState<number | null>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsAnalyzing(true);
      toast.info("Analyzing your hair image...");

      // Convert image to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = (reader.result as string).split(',')[1];
        
        try {
          const analysisResults = await analyzeHairImage(base64String);
          
          // Set lighting quality based on the analysis
          const avgLightingQuality = 
            (analysisResults.lightingConditions?.brightness +
             analysisResults.lightingConditions?.contrast +
             analysisResults.lightingConditions?.uniformity) / 3;
          
          setLightingQuality(avgLightingQuality);

          if (avgLightingQuality < 70) {
            toast.warning("Lighting conditions could be improved for better analysis");
          }

          // Dispatch analysis results
          window.dispatchEvent(new CustomEvent('hairAnalysisComplete', { detail: analysisResults }));
          toast.success("Analysis complete!");
        } catch (error) {
          toast.error("Failed to analyze image. Please try again.");
        } finally {
          setIsAnalyzing(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error("Error processing image. Please try again.");
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-gray-800/80 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="border-2 border-dashed border-gray-600 rounded-lg p-12 text-center hover:border-primary transition-colors duration-300">
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Multiple Images Mode</span>
            <Switch
              checked={multipleMode}
              onCheckedChange={setMultipleMode}
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
            <i className="fas fa-camera text-4xl text-primary"></i>
            <h3 className="text-xl font-medium text-white">Take a photo of your scalp/hair</h3>
            <p className="text-gray-400">or</p>
            <Button 
              className="bg-primary hover:bg-primary/90"
              onClick={() => document.getElementById('imageInput')?.click()}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Analyzing...
                </>
              ) : (
                <>
                  <i className="fas fa-upload mr-2"></i>
                  Upload Image
                </>
              )}
            </Button>

            {lightingQuality !== null && (
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Lighting Quality</span>
                  <span className={`
                    ${lightingQuality >= 80 ? 'text-green-400' : 
                      lightingQuality >= 60 ? 'text-yellow-400' : 'text-red-400'}
                  `}>
                    {lightingQuality >= 80 ? 'Excellent' : 
                     lightingQuality >= 60 ? 'Good' : 'Poor'}
                  </span>
                </div>
                <Progress 
                  value={lightingQuality} 
                  className="h-2"
                  indicatorClassName={`
                    ${lightingQuality >= 80 ? 'bg-green-400' : 
                      lightingQuality >= 60 ? 'bg-yellow-400' : 'bg-red-400'}
                  `}
                />
                {lightingQuality < 70 && (
                  <p className="text-xs text-yellow-400 mt-2">
                    Tip: Ensure even lighting and avoid shadows for better analysis
                  </p>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["Front View", "Side View", "Back View"].map((view) => (
              <div key={view} className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-primary transition-colors duration-300">
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <i className="fas fa-plus text-2xl text-primary mb-2"></i>
                <p className="text-sm text-white">{view}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;