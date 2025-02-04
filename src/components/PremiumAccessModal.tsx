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
import { ScrollArea } from "@/components/ui/scroll-area";

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
      // Here we'll add the actual key validation logic later
      // For now, we'll simulate a successful validation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store the key securely (we'll implement proper storage later)
      localStorage.setItem("hairlens_api_key", apiKey);
      
      toast.success("Access key verified successfully!");
      onKeyValidated(apiKey);
    } catch (error) {
      toast.error("Invalid access key. Please try again.");
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
      <DialogContent className="sm:max-w-[90vw] md:max-w-[700px] h-[90vh] bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            HairLens AI - Advanced Hair Analysis System
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[calc(90vh-120px)] px-4">
          <div className="space-y-6">
            {/* White-labeling Information */}
            <div className="bg-gradient-to-r from-purple-900 to-indigo-900 p-6 rounded-lg border border-purple-500/30">
              <h3 className="text-xl font-bold mb-3 text-purple-300">🌟 White-Label Opportunity</h3>
              <p className="text-gray-200 mb-4">
                Transform HairLens AI into your own branded solution! We offer complete white-labeling services with:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Custom AI model training on your specific image dataset</li>
                <li>Branded interface and customized features</li>
                <li>Dedicated support and implementation assistance</li>
                <li>Integration with your existing systems</li>
              </ul>
              <p className="mt-4 text-purple-300 font-medium">
                Interested in making HairLens AI your own? Contact us for white-labeling opportunities!
              </p>
            </div>

            {/* Core Features */}
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-purple-300">Core Analysis Features</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-purple-400">Diagnostic Tools</h4>
                  <ul className="list-disc list-inside text-gray-300">
                    <li>Real-time scalp analysis</li>
                    <li>Hair density mapping</li>
                    <li>Follicle health assessment</li>
                    <li>Growth pattern analysis</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-purple-400">AI Capabilities</h4>
                  <ul className="list-disc list-inside text-gray-300">
                    <li>Multi-angle image processing</li>
                    <li>Comparative analysis</li>
                    <li>Treatment progress tracking</li>
                    <li>Predictive modeling</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Business Solutions */}
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-purple-300">Business Solutions</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-purple-400">For Clinics</h4>
                  <ul className="list-disc list-inside text-gray-300">
                    <li>Patient progress tracking</li>
                    <li>Treatment planning tools</li>
                    <li>Automated reporting</li>
                    <li>Integration with EMR systems</li>
                    <li>ROI analytics</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-purple-400">For Research</h4>
                  <ul className="list-disc list-inside text-gray-300">
                    <li>Clinical trial support</li>
                    <li>Data aggregation</li>
                    <li>Pattern recognition</li>
                    <li>Research collaboration tools</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Professional Features */}
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-purple-300">Professional Features</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-purple-400">Analysis Tools</h4>
                  <ul className="list-disc list-inside text-gray-300">
                    <li>Advanced metrics tracking</li>
                    <li>Custom analysis parameters</li>
                    <li>Comparative studies</li>
                    <li>Treatment efficacy analysis</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-purple-400">Integration</h4>
                  <ul className="list-disc list-inside text-gray-300">
                    <li>API access</li>
                    <li>Custom workflows</li>
                    <li>Data export options</li>
                    <li>Third-party integrations</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Activation Section */}
            <div className="bg-gradient-to-r from-purple-900 to-indigo-900 p-6 rounded-lg border border-purple-500/30">
              <h3 className="font-semibold mb-4">Activate Premium Access</h3>
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    type={showKey ? "text" : "password"}
                    placeholder="Enter your access key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full bg-gray-700/50 border-gray-600"
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

            {/* Contact Information */}
            <div className="text-center space-y-2 py-4">
              <p className="text-sm text-gray-400">
                For enterprise solutions and custom implementations, contact our team
              </p>
              <p className="text-sm text-purple-400">
                Email: enterprise@hairlens.ai | Phone: +1 (555) 123-4567
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default PremiumAccessModal;