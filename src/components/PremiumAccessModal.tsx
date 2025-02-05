import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles } from "lucide-react";

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
      await new Promise(resolve => setTimeout(resolve, 1500));
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
        <Button variant="outline" className="bg-purple-600 text-white hover:bg-purple-700 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Access Premium AI Analysis
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[90vw] md:max-w-[700px] h-[90vh] bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            🌟 Ready to Transform Your Hair Journey?
          </DialogTitle>
          <DialogDescription className="sr-only">
            Premium access modal for hair analysis features
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[calc(90vh-120px)] px-4">
          <div className="space-y-6">
            {/* Introduction */}
            <div className="bg-gradient-to-r from-purple-900 to-indigo-900 p-6 rounded-lg border border-purple-500/30">
              <p className="text-lg text-gray-200 mb-4">
                Hey there! Jump right in - our AI is ready to analyze your hair instantly! We've trained our system on 170,000+ real cases, making it super smart at understanding your unique hair story.
              </p>
            </div>

            {/* Free Plan Features */}
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-purple-300">⚠️ Starting Out? Try Basic (Free Forever):</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Unlimited AI analysis - try as many times as you want!</li>
                <li>Capture from multiple angles</li>
                <li>Share results with friends & stylists</li>
                <li>No app download needed - works right in your browser</li>
                <li>Quick tip: Screenshot your results since we don't store data in free plan</li>
              </ul>
            </div>

            {/* File Revisit Option */}
            <div className="bg-gradient-to-r from-purple-900 to-indigo-900 p-6 rounded-lg border border-purple-500/30">
              <div className="flex flex-col items-center space-y-4">
                <h3 className="text-xl font-bold text-purple-300">💾 Store & Revisit Your Analysis</h3>
                <p className="text-gray-200 text-center">Keep track of your progress with our file storage option!</p>
                <Button 
                  variant="outline"
                  className="bg-white text-purple-900 hover:bg-gray-100 font-semibold"
                  onClick={() => toast.success("Coming soon! We'll notify you when file storage is available.")}
                >
                  Go Personal - $50
                </Button>
                <p className="text-sm text-gray-400">Access and review your analysis anytime</p>
              </div>
            </div>

            {/* Personal Plan */}
            <div className="bg-gradient-to-r from-purple-900 to-indigo-900 p-6 rounded-lg border border-purple-500/30">
              <h3 className="text-xl font-bold mb-4 text-purple-300">🎯 Ready to Track Your Progress? Go Personal:</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Store up to 10 analyses</li>
                <li>Unlock all premium services</li>
                <li>Compare your journey with 170,000 Case Studies</li>
                <li>Perfect for tracking treatment results</li>
                <li>Download beautiful PDF reports</li>
                <li>Build your hair health timeline</li>
                <li>Get Personalized After Surgery Recommendations</li>
                <li>Share with consultations directly</li>
                <li>Unlimited Runs</li>
              </ul>
            </div>

            {/* File Revisit Option */}
            <div className="bg-gradient-to-r from-purple-900 to-indigo-900 p-6 rounded-lg border border-purple-500/30">
              <div className="flex flex-col items-center space-y-4">
                <h3 className="text-xl font-bold text-purple-300">💾 Store Your Patient Records</h3>
                <p className="text-gray-200 text-center">Keep track of your patients and generate Unlimited reports</p>
                <Button 
                  variant="outline"
                  className="bg-white text-purple-900 hover:bg-gray-100 font-semibold"
                  onClick={() => toast.success("Book a call! We are ready to serve you.")}
                >
                  Own a Business - Custom Pricing
                </Button>
                <p className="text-sm text-gray-400">Access and review your analysis anytime</p>
              </div>
            </div>

            {/* Business Solutions */}
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-purple-300">🏢 Own a Business? Make This Technology Yours!</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-purple-400 mb-2">Perfect for:</h4>
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                    <li>Hair Salons & Clinics</li>
                    <li>Product Companies</li>
                    <li>Research Institutions</li>
                    <li>Beauty Brands</li>
                    <li>Health & Wellness Centers</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-purple-400 mb-2">What Can You Get:</h4>
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                    <li>Unlimited Runs</li>
                    <li>Unlimited Storage Option</li>
                    <li>Before and after / Multi angel Image upload</li>
                    <li>Access to All Premium Features</li>
                    <li>Store Customer information</li>
                    <li>Custom reporting</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Professional Features */}
            <div className="bg-gradient-to-r from-purple-900 to-indigo-900 p-6 rounded-lg border border-purple-500/30">
              <h3 className="text-xl font-bold mb-4 text-purple-300">💎 Professional Features That Wow:</h3>
              <div className="grid grid-cols-2 gap-4">
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Let clients try before visiting</li>
                  <li>Generate leads through online analysis</li>
                  <li>Share success stories under your brand</li>
                  <li>Integration with your systems</li>
                </ul>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Brand it as your own solution</li>
                  <li>Train AI on your specific cases</li>
                  <li>Full white-labeling options</li>
                  <li>Build your brand authority</li>
                </ul>
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
                    {showKey ? "Hide" : "Show"}
                  </button>
                </div>
                <Button 
                  onClick={handleActivate}
                  disabled={isValidating}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {isValidating ? "Validating..." : "Activate Premium Access"}
                </Button>
              </div>
            </div>

            {/* Contact Information */}
            <div className="text-center space-y-2 py-4">
              <p className="text-sm text-gray-400">
                Ready to revolutionize your business? Let's chat about your vision!
              </p>
              <p className="text-sm text-purple-400">
                Email: carelessinbar@icloud.com | Book a call: topmate.io/deepdive Dubai, U.A.E
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default PremiumAccessModal;
