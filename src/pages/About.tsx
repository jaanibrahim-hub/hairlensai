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
              HairLens AI is at the forefront of revolutionizing hair care through advanced artificial intelligence. Our platform provides detailed analysis of hair and scalp conditions, offering personalized recommendations for optimal hair health.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Our Mission</h2>
            <p className="text-gray-700 mb-6">
              We're committed to democratizing professional hair care analysis, making it accessible to everyone through cutting-edge AI technology. Our goal is to help individuals understand their hair better and make informed decisions about their hair care routine.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Technology</h2>
            <p className="text-gray-700 mb-6">
              Powered by advanced image processing and machine learning algorithms, our platform analyzes multiple aspects of hair health, including:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li>Hair texture and type analysis</li>
              <li>Scalp condition assessment</li>
              <li>Growth pattern evaluation</li>
              <li>Density and thickness measurements</li>
              <li>Overall hair health metrics</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;