/**
 * Advanced Image Quality Assessment for Hair Analysis
 * Uses computer vision techniques to ensure optimal image quality
 */

export interface ImageQualityMetrics {
  overallScore: number; // 0-100
  sharpness: number;
  lighting: number;
  resolution: number;
  hairVisibility: number;
  scalpVisibility: number;
  angle: number;
  recommendations: string[];
  isAcceptable: boolean;
}

export interface ImageAnalysisResult {
  quality: ImageQualityMetrics;
  processedImage?: string;
  enhancementApplied: boolean;
  metadata: {
    originalSize: number;
    processedSize: number;
    format: string;
    aspectRatio: string;
  };
}

/**
 * Analyzes image quality for hair analysis
 */
export async function analyzeImageQuality(imageFile: File): Promise<ImageAnalysisResult> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);

      const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
      if (!imageData) {
        reject(new Error('Failed to process image'));
        return;
      }

      const quality = assessImageQuality(imageData, img.width, img.height);
      const { processedImage, enhanced } = enhanceImage(canvas, quality);

      resolve({
        quality,
        processedImage: enhanced ? processedImage : undefined,
        enhancementApplied: enhanced,
        metadata: {
          originalSize: imageFile.size,
          processedSize: processedImage ? Math.round(processedImage.length * 0.75) : imageFile.size,
          format: imageFile.type,
          aspectRatio: `${img.width}:${img.height}`
        }
      });
    };

    img.onerror = () => reject(new Error('Invalid image file'));
    img.src = URL.createObjectURL(imageFile);
  });
}

/**
 * Assess various quality metrics of the image
 */
function assessImageQuality(imageData: ImageData, width: number, height: number): ImageQualityMetrics {
  const data = imageData.data;
  const pixels = width * height;
  
  // Calculate sharpness using Laplacian operator
  const sharpness = calculateSharpness(data, width, height);
  
  // Assess lighting quality
  const lighting = assessLighting(data, pixels);
  
  // Check resolution adequacy
  const resolution = assessResolution(width, height);
  
  // Analyze hair and scalp visibility
  const hairVisibility = analyzeHairVisibility(data, pixels);
  const scalpVisibility = analyzeScalpVisibility(data, pixels);
  
  // Assess image angle/orientation
  const angle = assessAngle(data, width, height);
  
  // Generate recommendations
  const recommendations = generateRecommendations({
    sharpness,
    lighting,
    resolution,
    hairVisibility,
    scalpVisibility,
    angle
  });
  
  // Calculate overall score
  const overallScore = Math.round(
    (sharpness * 0.25) + 
    (lighting * 0.20) + 
    (resolution * 0.15) + 
    (hairVisibility * 0.20) + 
    (scalpVisibility * 0.15) + 
    (angle * 0.05)
  );
  
  return {
    overallScore,
    sharpness,
    lighting,
    resolution,
    hairVisibility,
    scalpVisibility,
    angle,
    recommendations,
    isAcceptable: overallScore >= 70
  };
}

/**
 * Calculate image sharpness using edge detection
 */
function calculateSharpness(data: Uint8ClampedArray, width: number, height: number): number {
  let totalVariance = 0;
  let count = 0;

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      
      // Convert to grayscale
      const current = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
      
      // Calculate Laplacian (edge detection)
      const top = 0.299 * data[((y-1) * width + x) * 4] + 0.587 * data[((y-1) * width + x) * 4 + 1] + 0.114 * data[((y-1) * width + x) * 4 + 2];
      const bottom = 0.299 * data[((y+1) * width + x) * 4] + 0.587 * data[((y+1) * width + x) * 4 + 1] + 0.114 * data[((y+1) * width + x) * 4 + 2];
      const left = 0.299 * data[(y * width + (x-1)) * 4] + 0.587 * data[(y * width + (x-1)) * 4 + 1] + 0.114 * data[(y * width + (x-1)) * 4 + 2];
      const right = 0.299 * data[(y * width + (x+1)) * 4] + 0.587 * data[(y * width + (x+1)) * 4 + 1] + 0.114 * data[(y * width + (x+1)) * 4 + 2];
      
      const laplacian = Math.abs(4 * current - top - bottom - left - right);
      totalVariance += laplacian;
      count++;
    }
  }

  const averageVariance = totalVariance / count;
  return Math.min(100, (averageVariance / 50) * 100); // Normalize to 0-100
}

/**
 * Assess lighting quality
 */
function assessLighting(data: Uint8ClampedArray, pixels: number): number {
  let totalBrightness = 0;
  let overexposed = 0;
  let underexposed = 0;

  for (let i = 0; i < data.length; i += 4) {
    const brightness = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    totalBrightness += brightness;
    
    if (brightness > 240) overexposed++;
    if (brightness < 15) underexposed++;
  }

  const averageBrightness = totalBrightness / pixels;
  const overexposedRatio = overexposed / pixels;
  const underexposedRatio = underexposed / pixels;

  // Ideal brightness range: 100-180
  let brightnessScore = 100;
  if (averageBrightness < 80) brightnessScore -= (80 - averageBrightness) * 0.5;
  if (averageBrightness > 200) brightnessScore -= (averageBrightness - 200) * 0.5;

  // Penalize over/under exposure
  brightnessScore -= overexposedRatio * 200;
  brightnessScore -= underexposedRatio * 200;

  return Math.max(0, Math.min(100, brightnessScore));
}

/**
 * Assess resolution adequacy for hair analysis
 */
function assessResolution(width: number, height: number): number {
  const totalPixels = width * height;
  
  // Minimum recommended: 800x600 (480k pixels)
  // Optimal: 1920x1080 (2M pixels) or higher
  
  if (totalPixels < 480000) return Math.min(50, (totalPixels / 480000) * 50);
  if (totalPixels < 2000000) return 50 + ((totalPixels - 480000) / 1520000) * 30;
  return Math.min(100, 80 + ((totalPixels - 2000000) / 2000000) * 20);
}

/**
 * Analyze hair visibility in the image
 */
function analyzeHairVisibility(data: Uint8ClampedArray, pixels: number): number {
  let hairPixels = 0;
  let texturedPixels = 0;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Detect hair-like colors (browns, blacks, blondes)
    const isHairColor = (
      (r < 150 && g < 150 && b < 150) || // Dark hair
      (r > 180 && g > 150 && b > 100) || // Blonde hair
      (Math.abs(r - g) < 30 && Math.abs(g - b) < 30) // Gray hair
    );
    
    if (isHairColor) hairPixels++;
    
    // Check for texture (hair has high local variance)
    if (i > 0 && Math.abs(data[i] - data[i - 4]) > 20) texturedPixels++;
  }

  const hairRatio = hairPixels / pixels;
  const textureRatio = texturedPixels / pixels;
  
  return Math.min(100, (hairRatio * 0.6 + textureRatio * 0.4) * 200);
}

/**
 * Analyze scalp visibility in the image
 */
function analyzeScalpVisibility(data: Uint8ClampedArray, pixels: number): number {
  let scalpPixels = 0;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Detect skin-tone colors
    const isScalpColor = (
      (r > 120 && r < 255 && g > 80 && g < 220 && b > 60 && b < 200) && // General skin range
      (r > g && g > b) // Skin typically has R > G > B
    );
    
    if (isScalpColor) scalpPixels++;
  }

  const scalpRatio = scalpPixels / pixels;
  return Math.min(100, scalpRatio * 300); // Scalp should be visible but not dominant
}

/**
 * Assess image angle and orientation
 */
function assessAngle(data: Uint8ClampedArray, width: number, height: number): number {
  // Check for proper top-down orientation by analyzing gradient patterns
  let horizontalGradient = 0;
  let verticalGradient = 0;

  for (let y = 0; y < height - 1; y++) {
    for (let x = 0; x < width - 1; x++) {
      const current = data[(y * width + x) * 4];
      const right = data[(y * width + (x + 1)) * 4];
      const down = data[((y + 1) * width + x) * 4];
      
      horizontalGradient += Math.abs(current - right);
      verticalGradient += Math.abs(current - down);
    }
  }

  // For hair analysis, we want more horizontal structure (hair strands)
  const gradientRatio = horizontalGradient / (verticalGradient + 1);
  
  // Optimal ratio is around 0.8-1.2 (slightly more horizontal detail)
  let angleScore = 100;
  if (gradientRatio < 0.5) angleScore -= (0.5 - gradientRatio) * 100;
  if (gradientRatio > 2.0) angleScore -= (gradientRatio - 2.0) * 50;
  
  return Math.max(0, Math.min(100, angleScore));
}

/**
 * Generate actionable recommendations based on quality metrics
 */
function generateRecommendations(metrics: Omit<ImageQualityMetrics, 'overallScore' | 'recommendations' | 'isAcceptable'>): string[] {
  const recommendations: string[] = [];

  if (metrics.sharpness < 60) {
    recommendations.push("📸 Hold the camera steady and ensure proper focus on the hair/scalp area");
  }

  if (metrics.lighting < 60) {
    recommendations.push("💡 Improve lighting - use natural daylight or bright, even indoor lighting");
  }

  if (metrics.resolution < 70) {
    recommendations.push("🔍 Use a higher resolution camera or move closer to capture more detail");
  }

  if (metrics.hairVisibility < 60) {
    recommendations.push("👁️ Ensure hair strands are clearly visible - part hair if needed to show scalp");
  }

  if (metrics.scalpVisibility < 50) {
    recommendations.push("🎯 Show more scalp area - part hair or focus on areas with visible scalp");
  }

  if (metrics.angle < 70) {
    recommendations.push("📐 Adjust angle - take photo from directly above the scalp area");
  }

  if (recommendations.length === 0) {
    recommendations.push("✅ Excellent image quality! Ready for detailed AI analysis.");
  }

  return recommendations;
}

/**
 * Enhance image quality for better analysis
 */
function enhanceImage(canvas: HTMLCanvasElement, quality: ImageQualityMetrics): { processedImage: string; enhanced: boolean } {
  const ctx = canvas.getContext('2d');
  if (!ctx) return { processedImage: canvas.toDataURL(), enhanced: false };

  let enhanced = false;

  // Apply enhancements if needed
  if (quality.lighting < 70) {
    // Adjust brightness and contrast
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const brightnessFactor = quality.lighting < 40 ? 1.3 : 1.15;
    const contrastFactor = 1.2;

    for (let i = 0; i < data.length; i += 4) {
      // Adjust brightness and contrast
      data[i] = Math.min(255, Math.max(0, (data[i] - 128) * contrastFactor + 128 + (brightnessFactor - 1) * 50));
      data[i + 1] = Math.min(255, Math.max(0, (data[i + 1] - 128) * contrastFactor + 128 + (brightnessFactor - 1) * 50));
      data[i + 2] = Math.min(255, Math.max(0, (data[i + 2] - 128) * contrastFactor + 128 + (brightnessFactor - 1) * 50));
    }

    ctx.putImageData(imageData, 0, 0);
    enhanced = true;
  }

  if (quality.sharpness < 70) {
    // Apply unsharp mask for better detail
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const original = new Uint8ClampedArray(data);

    // Simple sharpening kernel
    const sharpenAmount = 0.5;
    
    for (let y = 1; y < canvas.height - 1; y++) {
      for (let x = 1; x < canvas.width - 1; x++) {
        const idx = (y * canvas.width + x) * 4;
        
        for (let c = 0; c < 3; c++) {
          const current = original[idx + c];
          const surrounding = (
            original[((y-1) * canvas.width + x) * 4 + c] +
            original[((y+1) * canvas.width + x) * 4 + c] +
            original[(y * canvas.width + (x-1)) * 4 + c] +
            original[(y * canvas.width + (x+1)) * 4 + c]
          ) / 4;
          
          const sharpened = current + sharpenAmount * (current - surrounding);
          data[idx + c] = Math.min(255, Math.max(0, sharpened));
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
    enhanced = true;
  }

  return {
    processedImage: canvas.toDataURL('image/jpeg', 0.9),
    enhanced
  };
}

/**
 * Get quality status color for UI
 */
export function getQualityStatusColor(score: number): string {
  if (score >= 80) return 'text-green-400';
  if (score >= 60) return 'text-yellow-400';
  if (score >= 40) return 'text-orange-400';
  return 'text-red-400';
}

/**
 * Get quality status text
 */
export function getQualityStatusText(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Poor';
}