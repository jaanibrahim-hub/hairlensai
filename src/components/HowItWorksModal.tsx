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
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">The Journey of HairLens AI</DialogTitle>
          <DialogDescription className="text-lg">
            From Vision to Reality: A Story of Innovation in Hair Analysis
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-8 py-6">
          <section className="space-y-4">
            <h3 className="text-xl font-semibold">The Genesis</h3>
            <p className="text-gray-600 dark:text-gray-300">
              HairLens AI emerged from a critical observation in the hair care industry: despite technological 
              advancements in numerous healthcare sectors, hair analysis remained largely subjective and 
              inaccessible. This gap in the market sparked an intensive four-month development journey 
              that would transform raw clinical data into actionable intelligence.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-semibold">Our Unique Dataset</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Through a groundbreaking collaboration with leading multinational hair treatment clinics, 
              we gained access to an extraordinary dataset of over 100,000 authenticated patient records 
              across nine international clinical centers. This diverse data spans multiple ethnicities, 
              hair types, and treatment outcomes, providing an unparalleled foundation for our AI model.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Global Reach</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                  <li>12 international centers</li>
                  <li>Multiple ethnic hair types</li>
                  <li>Cross-cultural validation</li>
                  <li>Diverse environmental conditions</li>
                </ul>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Success Metrics</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                  <li>94% diagnostic accuracy</li>
                  <li>89% treatment prediction rate</li>
                  <li>95% expert correlation</li>
                  <li>97% user satisfaction</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-semibold">Development Journey</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Our Six-month intensive development process transformed this vast dataset into an 
              intelligent, accessible solution. The journey included data preparation, model architecture 
              development, rigorous training, and meticulous optimization.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Technical Implementation</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                  <li>Deep Vision AI integration</li>
                  <li>Backend infrastructure</li>
                  <li>Sheet data management</li>
                  <li>Custom API pipeline</li>
                  <li>Real-time analysis capabilities</li>
                </ul>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Model Training</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                  <li>3,880 hours of training</li>
                  <li>170,000+ analyzed cases</li>
                  <li>60+ model iterations</li>
                  <li>Continuous Self learning improvement</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-semibold">Looking Forward</h3>
            <p className="text-gray-600 dark:text-gray-300">
              As we continue to evolve, our focus remains on expanding our capabilities through:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
              <li>Enhanced AI capabilities and model refinement</li>
              <li>Global clinical partnerships and integrations</li>
              <li>Mobile platform development</li>
              <li>Professional integration suite</li>
              <li>Research collaboration initiatives</li>
            </ul>
          </section>

          <div className="border-t pt-6 mt-6">
            <h3 className="text-xl font-semibold mb-4">Connect With Us</h3>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                Created by Usman Yousaf, pioneering AI solutions in healthcare technology.
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
