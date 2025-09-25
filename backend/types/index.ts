export interface Env {
  DB: D1Database;
  IMAGES_BUCKET: R2Bucket;
  SESSIONS: KVNamespace;
  AI_ANALYSIS_API_KEY: string;
  ENCRYPTION_KEY: string;
  JWT_SECRET: string;
}

export interface UploadedImage {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
  userId?: string;
  r2Key: string;
}

export interface AnalysisResult {
  id: string;
  imageId: string;
  userId?: string;
  analysisData: {
    healthScore: number;
    overallHealthScore: number;
    microscopicAnalysis: any;
    scalpHealth: any;
    growthCycle: any;
    chemicalAnalysis: any;
    environmentalFactors: any;
    treatmentRecommendations: any;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ImageUploadRequest {
  image: File;
  userId?: string;
  metadata?: Record<string, any>;
}

export interface AnalysisRequest {
  imageId: string;
  userId?: string;
  analysisType?: 'comprehensive' | 'basic' | 'microscopic';
}