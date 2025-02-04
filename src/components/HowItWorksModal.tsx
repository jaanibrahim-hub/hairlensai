"use client";

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
          <DialogTitle className="text-2xl font-bold">Your Hair's Story, Decoded</DialogTitle>
          <DialogDescription className="text-lg">
            Professional Hair Analysis In Your Pocket
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-8 py-6">
          <section className="space-y-4">
            <p className="text-xl text-gray-800 dark:text-gray-200 italic">
              "Your hair tells a story. But for too long, only expensive specialists could read it. 
              We're changing that. We puts the power of professional hair analysis in your pocket, 
              turning confusing hair care decisions into clear, data-driven choices."
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-semibold">Welcome To HairLens AI</h3>
            <h4 className="text-lg font-medium">Our AI's Powerful Foundation</h4>
            <p className="text-gray-600 dark:text-gray-300">
              Through an intensive 3,880 hours of training on over 170,000+ authenticated scalp and hair images, 
              our AI has mastered the art of hair analysis.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-semibold">Our Unique Dataset</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Unlike generic AI models trained on random internet photos, 
              our system learns from real clinical cases, verified treatments, and documented outcomes. 
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">What Makes Us Special</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                  <li>Real clinical outcomes, not just predictions</li>
                  <li>Verified before-and-after treatment results</li>
                  <li>Multiple ethnicities and hair types</li>
                  <li>Different age groups and genders</li>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h4 className="font-semibold mb-2 text-blue-800 dark:text-blue-300">Individual Users (Patients) Benefits</h4>
          <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
            <li>Pre-consultation analysis before visiting doctors</li>
            <li>Track treatment progress over time</li>
            <li>Compare before/after results</li>
            <li>Share success stories and journey</li>
            <li>Make informed decisions about treatments</li>
            <li>Find suitable clinics based on their specific condition</li>
            <li>Save money by getting initial analysis before expensive consultations</li>
          </ul>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <h4 className="font-semibold mb-2 text-green-800 dark:text-green-300">Success Metrics</h4>
          <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
            <li>94% diagnostic accuracy</li>
            <li>89% treatment prediction rate</li>
            <li>95% expert correlation</li>
            <li>97% user satisfaction</li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
          <h4 className="font-semibold mb-2 text-purple-800 dark:text-purple-300">Hair Care Clinics & Doctors Benefits</h4>
          <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
            <li>Data-driven patient assessments</li>
            <li>Track patient progress scientifically</li>
            <li>Build trust through transparent analysis</li>
            <li>Showcase success stories with verified results</li>
            <li>Attract new patients with technology-driven approach</li>
            <li>Better treatment planning with historical data</li>
            <li>Differentiate from competitors</li>
          </ul>
        </div>
        <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-lg">
          <h4 className="font-semibold mb-2 text-teal-800 dark:text-teal-300">Hair Product Companies Benefits</h4>
          <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
            <li>Validate product effectiveness</li>
            <li>Get real user data and testimonials</li>
            <li>Target specific hair conditions</li>
            <li>Personalize product recommendations</li>
            <li>Build trust through scientific analysis</li>
            <li>Track product performance</li>
            <li>Create data-backed marketing materials</li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="bg-pink-50 dark:bg-pink-900/20 p-4 rounded-lg">
          <h4 className="font-semibold mb-2 text-pink-800 dark:text-pink-300">Salons & Stylists Benefits</h4>
          <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
            <li>Professional analysis for clients</li>
            <li>Recommend appropriate treatments</li>
            <li>Track client hair health</li>
            <li>Build long-term relationships</li>
            <li>Upsell premium services</li>
            <li>Demonstrate expertise</li>
          </ul>
        </div>
        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
          <h4 className="font-semibold mb-2 text-indigo-800 dark:text-indigo-300">Research Institutions Benefits</h4>
          <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
            <li>Access to anonymized data</li>
            <li>Track treatment effectiveness</li>
            <li>Study hair loss patterns</li>
            <li>Develop new treatments</li>
            <li>Validate research findings</li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
          <h4 className="font-semibold mb-2 text-orange-800 dark:text-orange-300">Insurance Companies Benefits</h4>
          <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
            <li>Verify treatment necessity</li>
            <li>Track treatment outcomes</li>
            <li>Reduce fraudulent claims</li>
            <li>Better cost assessment</li>
          </ul>
        </div>
        <div className="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-lg">
          <h4 className="font-semibold mb-2 text-cyan-800 dark:text-cyan-300">Wellness Centers Benefits</h4>
          <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
            <li>Holistic health tracking</li>
            <li>Integrate with other wellness metrics</li>
            <li>Personalized treatment plans</li>
            <li>Progress monitoring</li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
          <h4 className="font-semibold mb-2 text-red-800 dark:text-red-300">Pharmaceutical Companies Benefits</h4>
          <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
            <li>Product testing</li>
            <li>Clinical trial support</li>
            <li>Treatment effectiveness tracking</li>
            <li>Market research</li>
          </ul>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg">
          <h4 className="font-semibold mb-2 text-emerald-800 dark:text-emerald-300">Global Reach</h4>
          <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
            <li>12 international centers</li>
            <li>Multiple ethnic hair types</li>
            <li>Cross-cultural validation</li>
            <li>Diverse environmental conditions</li>
          </ul>
        </div>
      </div>
    </section>

          <section className="space-y-4">
            <h3 className="text-xl font-semibold">Our Vision</h3>
            <p className="text-gray-600 dark:text-gray-300">
              HairLens AI isn't just another analysis tool - it's a comprehensive ecosystem where:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
              <li>Individuals get professional-grade analysis before expensive consultations</li>
              <li>Clinics showcase their success stories with verified results</li>
              <li>Product companies validate their effectiveness with real data</li>
              <li>Researchers access valuable insights for groundbreaking treatments</li>
              <li>Wellness centers integrate hair health into holistic care plans</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-semibold">Our Unique Dataset</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Through a groundbreaking collaboration with leading multinational hair treatment clinics, 
              we gained access to an extraordinary dataset of over 170,000+ authenticated patient records 
              across 12 international clinical centers. This diverse data spans multiple ethnicities, 
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
                  <li>3,880 hours of AI training</li>
                  <li>170,000+ analyzed cases</li>
                  <li>60+ model iterations</li>
                  <li>Extensive cross-cultural validation</li>
                  <li>Rigorous security implementation</li>
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

          <section className="space-y-4">
            <h3 className="text-xl font-semibold">What sets HairLensAI apart is our foundation in real clinical data</h3>
            <p className="text-gray-600 dark:text-gray-300">
            While competitors rely on generic AI models, our system is trained on verified clinical outcomes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
              <li>Documented treatments across different climates and environments</li>
              <li>Treatment recommendations are based on actual success rates, not theoretical assumptions</li>
              <li>Multiple ethnicities and hair types, Different age groups and genders</li>
              <li>Real-time comparison with similar cases from our extensive database</li>
              <li>Continuously improving accuracy through machine learning</li>
              <li>Each analysis is backed by thousands of similar, successful cases</li>
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