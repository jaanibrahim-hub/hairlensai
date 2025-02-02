import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const ImageUpload = () => {
  const [multipleMode, setMultipleMode] = useState(false);

  return (
    <div className="bg-gray-800/80 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="border-2 border-dashed border-gray-600 rounded-lg p-12 text-center hover:border-primary transition-colors duration-300">
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Multiple Images Mode</span>
            <Switch
              checked={multipleMode}
              onCheckedChange={setMultipleMode}
              className="bg-gray-600 data-[state=checked]:bg-primary"
            />
          </div>
        </div>
        
        {!multipleMode ? (
          <div className="space-y-4">
            <input type="file" className="hidden" id="imageInput" accept="image/*" />
            <i className="fas fa-camera text-4xl text-primary"></i>
            <h3 className="text-xl font-medium text-white">Take a photo of your scalp/hair</h3>
            <p className="text-gray-400">or</p>
            <Button className="bg-primary hover:bg-primary/90">
              <i className="fas fa-upload mr-2"></i>Upload Image
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["Front View", "Side View", "Back View"].map((view) => (
              <div key={view} className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-primary transition-colors duration-300">
                <input type="file" className="hidden" accept="image/*" />
                <i className="fas fa-plus text-2xl text-primary mb-2"></i>
                <p className="text-sm text-white">{view}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;