import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const ImagePreview = () => {
  const [previewUrl, setPreviewUrl] = useState<string>("/placeholder.svg");

  useEffect(() => {
    const handleImageUpload = (event: CustomEvent<string>) => {
      setPreviewUrl(event.detail);
    };

    window.addEventListener('imageUploaded', handleImageUpload as EventListener);

    return () => {
      window.removeEventListener('imageUploaded', handleImageUpload as EventListener);
    };
  }, []);

  return (
    <div className="bg-gray-800/80 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300">
      <h2 className="text-xl font-semibold mb-4 text-white flex items-center">
        <i className="fas fa-image mr-2 text-purple-400"></i>
        Preview
      </h2>
      <div className="aspect-w-9 aspect-h-16 bg-gray-700 rounded-lg overflow-hidden relative group">
        <img
          src={previewUrl}
          alt="Hair Preview"
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="flex justify-center space-x-4 mt-4">
        <Button variant="outline" size="icon" className="bg-gray-700 hover:bg-gray-600">
          <i className="fas fa-rotate text-lg text-purple-400"></i>
        </Button>
        <Button variant="outline" size="icon" className="bg-gray-700 hover:bg-gray-600">
          <i className="fas fa-crop text-lg text-purple-400"></i>
        </Button>
      </div>
    </div>
  );
};

export default ImagePreview;