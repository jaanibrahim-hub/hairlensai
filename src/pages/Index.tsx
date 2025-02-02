import Header from "@/components/Header";
import ImageUpload from "@/components/ImageUpload";
import ImagePreview from "@/components/ImagePreview";
import AnalysisResults from "@/components/AnalysisResults";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-900 to-indigo-800">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-6">
            <ImageUpload />
            <ImagePreview />
          </div>
          <AnalysisResults />
        </div>
      </main>
      
      <footer className="border-t border-gray-800 mt-8">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-gray-400">
            <p>© 2024 HairLens AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;