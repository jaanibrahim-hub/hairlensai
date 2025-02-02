import { Button } from "@/components/ui/button";

const ImagePreview = () => {
  return (
    <div className="bg-gray-800/80 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300">
      <h2 className="text-xl font-semibold mb-4 text-white">Preview</h2>
      <div className="aspect-w-9 aspect-h-16 bg-gray-700 rounded-lg overflow-hidden">
        <img
          src="/placeholder.svg"
          alt="Hair Preview"
          className="object-cover"
        />
      </div>
      <div className="flex justify-center space-x-4 mt-4">
        <Button variant="outline" size="icon">
          <i className="fas fa-rotate text-lg"></i>
        </Button>
        <Button variant="outline" size="icon">
          <i className="fas fa-crop text-lg"></i>
        </Button>
      </div>
    </div>
  );
};

export default ImagePreview;