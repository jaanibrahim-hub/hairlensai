import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { analyzeHairImage } from "@/utils/geminiApi";
import { toast } from "sonner";

const ImageUpload = () => {
  const [multipleMode, setMultipleMode] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsAnalyzing(true);
      toast.info("Running through 170,000 case studies...");
      toast.info("Hair has cultural significance worldwide...");
      toast.info("It's completely normal to lose 50-100 hairs a day...");
      toast.info("Your hair grows about 4-6 inches each year");


      // Convert image to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = (reader.result as string).split(',')[1];
        
        try {
          const analysisResults = await analyzeHairImage(base64String);
          // You can emit an event or use a state management solution to update AnalysisResults
          window.dispatchEvent(new CustomEvent('hairAnalysisComplete', { detail: analysisResults }));
          toast.success("Analysis complete!");
        } catch (error) {
          toast.error("Failed to analyze. Please try again.");
        } finally {
          setIsAnalyzing(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error("Error processing. Please try again.");
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-gray-800/80 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="border-2 border-dashed border-gray-600 rounded-lg p-12 text-center hover:border-primary transition-colors duration-300">
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Multiple Images Mode (Premium Feature)</span>
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
            <h3 className="text-xl font-medium text-white">Please upload a high-quality photo of your scalp or hair for assessment.</h3>
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
