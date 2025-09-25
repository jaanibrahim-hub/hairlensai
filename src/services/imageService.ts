import apiClient from './apiClient';
import { 
  UploadedImage, 
  ImageUploadRequest, 
  ApiResponse, 
  PaginatedResponse,
  PaginationParams 
} from '../types/api';

export class ImageService {
  // Upload single image
  async uploadImage(request: ImageUploadRequest): Promise<ApiResponse<UploadedImage>> {
    const additionalData: Record<string, any> = {};
    
    if (request.userId) {
      additionalData.userId = request.userId;
    }
    
    if (request.metadata) {
      additionalData.metadata = JSON.stringify(request.metadata);
    }

    return apiClient.upload<UploadedImage>('/api/upload', request.image, additionalData);
  }

  // Upload multiple images
  async uploadImages(images: File[], userId?: string): Promise<ApiResponse<{ images: UploadedImage[], errors: string[] }>> {
    const formData = new FormData();
    
    images.forEach((image) => {
      formData.append('images', image);
    });
    
    if (userId) {
      formData.append('userId', userId);
    }

    // Custom upload for batch since it's different from single upload
    const url = `${apiClient['baseUrl']}/api/upload/batch`;
    const headers: Record<string, string> = {};
    
    const token = apiClient.getSessionToken();
    if (token) {
      headers['X-Session-Token'] = token;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Batch upload failed');
      }

      return data;
    } catch (error) {
      console.error('Batch upload error:', error);
      return {
        success: false,
        error: 'BATCH_UPLOAD_ERROR',
        message: 'Failed to upload images. Please try again.'
      };
    }
  }

  // Get image metadata by ID
  async getImage(imageId: string): Promise<ApiResponse<UploadedImage>> {
    return apiClient.get<UploadedImage>(`/api/images/${imageId}`);
  }

  // Get image download URL
  getImageDownloadUrl(imageId: string): string {
    return `${apiClient['baseUrl']}/api/images/${imageId}/download`;
  }

  // Get user's images with pagination
  async getUserImages(
    userId: string, 
    pagination: PaginationParams = {}
  ): Promise<ApiResponse<PaginatedResponse<UploadedImage>>> {
    const { page = 1, limit = 20 } = pagination;
    return apiClient.get<PaginatedResponse<UploadedImage>>(
      `/api/user/${userId}/images?page=${page}&limit=${limit}`
    );
  }

  // Delete image
  async deleteImage(imageId: string): Promise<ApiResponse> {
    return apiClient.delete(`/api/images/${imageId}`);
  }

  // Validate image before upload
  validateImage(file: File): { valid: boolean; error?: string } {
    const maxSize = parseInt(import.meta.env.VITE_MAX_IMAGE_SIZE_MB || '10') * 1024 * 1024;
    const allowedTypes = (import.meta.env.VITE_ALLOWED_IMAGE_TYPES || 'image/jpeg,image/png,image/webp').split(',');
    
    if (!file) {
      return { valid: false, error: 'No file provided' };
    }
    
    if (file.size > maxSize) {
      return { valid: false, error: `File size exceeds ${Math.floor(maxSize / 1024 / 1024)}MB limit` };
    }
    
    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed' };
    }
    
    return { valid: true };
  }

  // Get image preview URL (for display in UI)
  getImagePreviewUrl(imageId: string): string {
    // Same as download URL for now, but could be different for thumbnails
    return this.getImageDownloadUrl(imageId);
  }

  // Create thumbnail URL if backend supports it
  getThumbnailUrl(imageId: string, size: number = 300): string {
    return `${apiClient['baseUrl']}/api/images/${imageId}/thumbnail?size=${size}`;
  }
}

// Create singleton instance
export const imageService = new ImageService();
export default imageService;