import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const HowItWorksModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-purple-600 text-white hover:bg-purple-700">
          How It Works
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Welcome to HairLens AI</DialogTitle>
          <DialogDescription className="text-lg">
            Your Advanced Hair Analysis & Care Solution
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <section className="space-y-3">
            <h3 className="text-xl font-semibold">About HairLens AI</h3>
            <p className="text-gray-600 dark:text-gray-300">
              HairLens AI is a cutting-edge hair analysis platform that uses advanced AI technology
              to provide personalized hair care recommendations. Our system analyzes multiple aspects
              of your hair and scalp health to deliver comprehensive insights and treatment suggestions.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-xl font-semibold">Current Features</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
              <li>AI-powered hair and scalp analysis</li>
              <li>Multi-angle image processing</li>
              <li>Detailed health metrics and visualizations</li>
              <li>Personalized treatment recommendations</li>
              <li>Growth phase analysis and tracking</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="text-xl font-semibold">Future Enhancements</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
              <li>Real-time AI consultation</li>
              <li>Treatment progress tracking</li>
              <li>Integration with hair care products</li>
              <li>Community features and expert advice</li>
              <li>Advanced predictive analytics</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="text-xl font-semibold">Target Audience</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
              <li>Hair care professionals and clinics</li>
              <li>Individuals concerned about hair health</li>
              <li>Beauty salons and specialists</li>
              <li>Research institutions</li>
            </ul>
          </section>

          <div className="border-t pt-6 mt-6">
            <h3 className="text-xl font-semibold mb-4">About the Creator</h3>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                Created by Usman Yousaf, a passionate developer focused on innovative AI solutions.
              </p>
              <div className="flex flex-col space-y-2">
                <a
                  href="https://linkedin.com/in/usman9999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-purple-600 hover:text-purple-700"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  LinkedIn Profile
                </a>
                <a
                  href="https://topmate.io/deepdive"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-purple-600 hover:text-purple-700"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Book a Consultation
                </a>
                <a
                  href="https://use1.link/usman"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-purple-600 hover:text-purple-700"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View More Projects
                </a>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HowItWorksModal;