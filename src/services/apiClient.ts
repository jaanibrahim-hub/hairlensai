import { ApiResponse, ApiError } from '../types/api';

class ApiClient {
  private baseUrl: string;
  private sessionToken: string | null = null;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8787';
  }

  // Session Management
  setSessionToken(token: string) {
    this.sessionToken = token;
    localStorage.setItem('sessionToken', token);
  }

  getSessionToken(): string | null {
    if (!this.sessionToken) {
      this.sessionToken = localStorage.getItem('sessionToken');
    }
    return this.sessionToken;
  }

  clearSession() {
    this.sessionToken = null;
    localStorage.removeItem('sessionToken');
  }

  // Request Helper
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {})
    };

    // Add session token if available
    const token = this.getSessionToken();
    if (token) {
      headers['X-Session-Token'] = token;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(
          response.status.toString(),
          data.message || data.error || 'Request failed',
          data
        );
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      console.error('API Request failed:', error);
      throw new ApiError(
        'NETWORK_ERROR',
        'Network request failed. Please check your connection.',
        error
      );
    }
  }

  // File Upload Helper
  private async uploadFile<T>(
    endpoint: string,
    file: File,
    additionalData?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const formData = new FormData();
    
    formData.append('image', file);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });
    }

    const headers: Record<string, string> = {};
    
    // Add session token if available
    const token = this.getSessionToken();
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
        throw new ApiError(
          response.status.toString(),
          data.message || data.error || 'Upload failed',
          data
        );
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      console.error('File upload failed:', error);
      throw new ApiError(
        'UPLOAD_ERROR',
        'File upload failed. Please try again.',
        error
      );
    }
  }

  // Generic CRUD methods
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'DELETE' });
  }

  async upload<T>(endpoint: string, file: File, additionalData?: Record<string, any>): Promise<ApiResponse<T>> {
    return this.uploadFile<T>(endpoint, file, additionalData);
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    try {
      return await this.get('/');
    } catch (error) {
      return {
        success: false,
        error: 'API_UNAVAILABLE',
        message: 'Backend API is not available'
      };
    }
  }
}

// Create singleton instance
const apiClient = new ApiClient();
export default apiClient;