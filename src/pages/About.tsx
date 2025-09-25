import Header from "@/components/Header";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-900 to-indigo-800">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">About HairLens AI</h1>
          
          <div className="prose prose-lg">
            <p className="text-gray-700 mb-6">
              HairLens AI is a cutting-edge platform that leverages artificial intelligence to provide detailed hair and scalp analysis, offering personalized recommendations for optimal hair health.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Features</h2>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li><strong>AI-Powered Analysis</strong>: Advanced image processing for detailed hair diagnostics</li>
              <li><strong>Real-Time Results</strong>: Instant analysis with comprehensive metrics</li>
              <li><strong>Personalized Insights</strong>: Tailored recommendations based on individual hair characteristics</li>
              <li><strong>Health Tracking</strong>: Monitor hair health progress over time</li>
              <li><strong>Professional Metrics</strong>: Detailed analysis including porosity, density, and growth patterns</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Technical Stack</h2>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li><strong>Frontend</strong>: React, TypeScript, Vite</li>
              <li><strong>Styling</strong>: Tailwind CSS, shadcn/ui</li>
              <li><strong>AI Integration</strong>: Advanced machine learning models trained on dermatological datasets</li>
              <li><strong>Data Visualization</strong>: Chart.js, React-Chartjs-2</li>
              <li><strong>State Management</strong>: React Hooks</li>
              <li><strong>Toast Notifications</strong>: Sonner</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">How It Works</h2>
            <p className="text-gray-700 mb-6">
              Upload a photo of your hair/scalp. Our AI analyzes multiple characteristics:
              <ul className="list-disc pl-6 text-gray-700 mt-4 mb-4">
                <li>Hair type and texture</li>
                <li>Scalp condition</li>
                <li>Growth patterns</li>
                <li>Density and thickness</li>
                <li>Overall health metrics</li>
              </ul>
              Receive detailed analysis and personalized recommendations.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Current Status</h2>
            <p className="text-gray-700 mb-6">
              Version: 1.0.0 (Beta)<br />
              Stage: Production-Ready Prototype
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Roadmap</h2>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li>Enhanced AI analysis capabilities</li>
              <li>Multi-image comparison</li>
              <li>Progress tracking dashboard</li>
              <li>Mobile application</li>
              <li>Professional stylist integration</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Creator</h2>
            <p className="text-gray-700 mb-6">
              Usman Yousaf<br />
              LinkedIn: <a href="https://www.linkedin.com/in/usman9999" className="text-blue-500 hover:underline">/in/usman9999</a><br />
              Book a Consultation: <a href="https://topmate.io/deepdive" className="text-blue-500 hover:underline">topmate.io/deepdive</a><br />
              Portfolio: <a href="https://use1.link/usman" className="text-blue-500 hover:underline">use1.link/usman</a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
