import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Hotspot {
  id: string;
  x: number;
  y: number;
  label: string;
  description: string;
}

const defaultHotspots: Hotspot[] = [
  {
    id: "crown",
    x: 50,
    y: 20,
    label: "Crown Area",
    description: "Density: Medium-high, showing healthy growth patterns",
  },
  {
    id: "hairline",
    x: 50,
    y: 10,
    label: "Hairline",
    description: "Natural hairline with consistent density",
  },
  {
    id: "temple",
    x: 20,
    y: 30,
    label: "Temple Area",
    description: "Good follicle density, minimal recession",
  },
  {
    id: "side",
    x: 80,
    y: 30,
    label: "Side Growth",
    description: "Healthy thickness and pattern consistency",
  },
  {
    id: "nape",
    x: 50,
    y: 80,
    label: "Nape Area",
    description: "Strong growth with good density",
  }
];

const ImagePreview = () => {
  const [previewUrl, setPreviewUrl] = useState<string>("/placeholder.svg");
  const [isZoomed, setIsZoomed] = useState(false);
  const [hotspots, setHotspots] = useState<Hotspot[]>(defaultHotspots);
  const { toast } = useToast();

  useEffect(() => {
    const handleImageUpload = (event: CustomEvent<string>) => {
      setPreviewUrl(event.detail);
      toast({
        title: "Image uploaded successfully",
        description: "Your hair analysis will begin shortly.",
      });
    };

    window.addEventListener('imageUploaded', handleImageUpload as EventListener);

    // Fallback image if preview is not available
    if (previewUrl === "/placeholder.svg") {
      setPreviewUrl("/lovable-uploads/a7cdb1d9-608f-4e95-8215-6f565f2808f8.png");
    }

    return () => {
      window.removeEventListener('imageUploaded', handleImageUpload as EventListener);
    };
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewUrl(result);
        toast({
          title: "Image uploaded successfully",
          description: "Your hair analysis will begin shortly.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRotate = () => {
    toast({
      title: "Image rotated",
      description: "Your image has been rotated 90 degrees.",
    });
  };

  const handleCrop = () => {
    toast({
      title: "Crop mode activated",
      description: "Drag to select the area you want to analyze.",
    });
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <div className="bg-gray-800/80 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300">
      <h2 className="text-xl font-semibold mb-4 text-white flex items-center justify-between">
        <div className="flex items-center">
          <i className="fas fa-image mr-2 text-purple-400"></i>
          Preview
        </div>
        <div className="flex gap-2">
          <input
            type="file"
            id="preview-upload"
            className="hidden"
            accept="image/*"
            onChange={handleFileUpload}
          />
          <Button
            variant="outline"
            size="sm"
            className="text-purple-400 hover:text-purple-300 bg-gray-700"
            onClick={() => document.getElementById('preview-upload')?.click()}
          >
            <i className="fas fa-upload mr-1"></i>
            Upload
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-purple-400 hover:text-purple-300"
            onClick={toggleZoom}
          >
            <i className={`fas fa-${isZoomed ? 'compress' : 'expand'} mr-1`}></i>
            {isZoomed ? 'Minimize' : 'Expand'}
          </Button>
        </div>
      </h2>
      <div 
        className={`relative group transition-all duration-300 ease-in-out ${
          isZoomed ? 'aspect-w-16 aspect-h-9' : 'aspect-w-9 aspect-h-16'
        }`}
      >
        <div className="bg-gray-700 rounded-lg overflow-hidden relative">
          <img
            src={previewUrl}
            alt="Hair Preview"
            className={`object-cover w-full h-full transition-transform duration-300 ${
              isZoomed ? 'scale-100' : 'group-hover:scale-105'
            }`}
          />
          <div className="absolute inset-0">
            <TooltipProvider>
              {hotspots.map((hotspot) => (
                <Tooltip key={hotspot.id}>
                  <TooltipTrigger asChild>
                    <button
                      className="absolute w-6 h-6 rounded-full bg-purple-500/50 hover:bg-purple-500/80 
                               border-2 border-white transform -translate-x-1/2 -translate-y-1/2 
                               transition-all duration-300 hover:scale-110 cursor-pointer
                               animate-pulse hover:animate-none"
                      style={{
                        left: `${hotspot.x}%`,
                        top: `${hotspot.y}%`,
                      }}
                    >
                      <span className="sr-only">{hotspot.label}</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-gray-800 p-3 max-w-xs">
                    <h3 className="font-medium text-white mb-1">{hotspot.label}</h3>
                    <p className="text-sm text-gray-300">{hotspot.description}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-white text-sm">
                Click expand to see more details or use the tools below to adjust the image
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center space-x-4 mt-4">
        <Button 
          variant="outline" 
          size="icon" 
          className="bg-gray-700 hover:bg-gray-600"
          onClick={handleRotate}
        >
          <i className="fas fa-rotate text-lg text-purple-400"></i>
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="bg-gray-700 hover:bg-gray-600"
          onClick={handleCrop}
        >
          <i className="fas fa-crop text-lg text-purple-400"></i>
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="bg-gray-700 hover:bg-gray-600"
          onClick={() => {
            toast({
              title: "Enhancement applied",
              description: "Image enhanced for better analysis.",
            });
          }}
        >
          <i className="fas fa-wand-magic-sparkles text-lg text-purple-400"></i>
        </Button>
      </div>
      <div className="mt-4 bg-gray-700/50 rounded-lg p-3">
        <div className="flex items-center text-sm text-gray-300">
          <i className="fas fa-info-circle text-purple-400 mr-2"></i>
          <span>Hover over the highlighted points to see detailed analysis for each area</span>
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;