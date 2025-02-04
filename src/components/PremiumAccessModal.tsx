import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface PremiumAccessModalProps {
  onKeyValidated: (key: string) => void;
}

const PremiumAccessModal = ({ onKeyValidated }: PremiumAccessModalProps) => {
  const [apiKey, setApiKey] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const handleActivate = async () => {
    if (!apiKey.trim()) {
      toast.error("Please enter an access key");
      return;
    }

    setIsValidating(true);
    try {
      // Store the Gemini API key
      localStorage.setItem("gemini_api_key", apiKey);
      
      toast.success("API key saved successfully!");
      onKeyValidated(apiKey);
    } catch (error) {
      toast.error("Failed to save API key. Please try again.");
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-purple-600 text-white hover:bg-purple-700">
          Access Premium AI Analysis
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-gray-900 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-4">
            HairLens AI - Advanced Hair Analysis System
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center text-sm text-gray-300">
            First-Ever Multi-Agent AI Hair Analysis Platform
          </div>

          <div className="space-y-4">
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Transform Your Hair Analysis Experience:</h3>
              <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                <li>Real-time AI-powered diagnostics</li>
                <li>Multi-agent cloud processing</li>
                <li>Advanced pattern recognition</li>
                <li>Global case matching</li>
                <li>Predictive treatment modeling</li>
              </ul>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Premium Features:</h3>
              <div className="space-y-3 text-sm text-gray-300">
                <div>
                  <p className="font-medium">1. Comprehensive Analysis</p>
                  <ul className="list-disc list-inside ml-4">
                    <li>AI-powered microscopic examination</li>
                    <li>Real-time density mapping</li>
                    <li>Growth phase analysis</li>
                    <li>Scalp condition assessment</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium">2. Smart Recommendations</p>
                  <ul className="list-disc list-inside ml-4">
                    <li>Personalized treatment protocols</li>
                    <li>Success rate predictions</li>
                    <li>Timeline projections</li>
                    <li>Cost-benefit analysis</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Activate Your Access:</h3>
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    type={showKey ? "text" : "password"}
                    placeholder="Enter your access key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full bg-gray-700 border-gray-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showKey ? (
                      <i className="fas fa-eye-slash" />
                    ) : (
                      <i className="fas fa-eye" />
                    )}
                  </button>
                </div>
                <Button 
                  onClick={handleActivate}
                  disabled={isValidating}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {isValidating ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2" />
                      Validating...
                    </>
                  ) : (
                    "Activate Premium Access"
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-400 text-center">
            <p>For professional use only. Results based on clinical data analysis.</p>
            <p>Contact Dr. Usman for support and access key renewal.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PremiumAccessModal;
