// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Image Types
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

// Analysis Types
export interface AnalysisResult {
  id: string;
  imageId: string;
  userId?: string;
  analysisData: {
    healthScore: number;
    overallHealthScore: number;
    microscopicAnalysis: {
      cuticleLayerScore: number;
      cortexIntegrity: number;
      medullaDensity: number;
      proteinStructure: number;
    };
    scalpHealth: {
      follicleActivity: number;
      sebumProduction: number;
      bloodCirculation: number;
      inflammation: number;
    };
    growthCycle: {
      anogenPhase: number;
      catogenPhase: number;
      telogenPhase: number;
      growthRate: number;
    };
    chemicalAnalysis: {
      damageLevel: number;
      treatmentHistory: string;
      porosity: string;
      elasticity: number;
    };
    environmentalFactors: {
      uvDamage: number;
      pollution: number;
      humidity: number;
      temperature: number;
    };
    treatmentRecommendations: TreatmentRecommendation[];
    analysisTimestamp: string;
    confidence: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface TreatmentRecommendation {
  category: string;
  priority: string;
  treatments: string[];
}

// Request Types
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

// Session Types
export interface SessionData {
  sessionToken: string;
  expiresAt: string;
}

export interface SessionValidation {
  sessionId: string;
  userId?: string;
  expiresAt: string;
  valid: boolean;
}

// Pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Error Types
export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}