import apiClient from './apiClient';
import { SessionData, SessionValidation, ApiResponse } from '../types/api';

export class SessionService {
  private sessionToken: string | null = null;

  // Create new session
  async createSession(userId?: string, ttl?: number): Promise<ApiResponse<SessionData>> {
    const requestData: any = {};
    
    if (userId) {
      requestData.userId = userId;
    }
    
    if (ttl) {
      requestData.ttl = ttl;
    }

    try {
      const response = await apiClient.post<SessionData>('/api/session', requestData);
      
      if (response.success && response.data) {
        this.sessionToken = response.data.sessionToken;
        apiClient.setSessionToken(response.data.sessionToken);
      }
      
      return response;
    } catch (error) {
      console.error('Failed to create session:', error);
      return {
        success: false,
        error: 'SESSION_CREATE_FAILED',
        message: 'Failed to create user session'
      };
    }
  }

  // Validate existing session
  async validateSession(token?: string): Promise<ApiResponse<SessionValidation>> {
    const tokenToValidate = token || this.sessionToken || apiClient.getSessionToken();
    
    if (!tokenToValidate) {
      return {
        success: false,
        error: 'NO_SESSION_TOKEN',
        message: 'No session token available'
      };
    }

    try {
      const response = await apiClient.get<SessionValidation>(`/api/session/${tokenToValidate}`);
      
      if (response.success && response.data?.valid) {
        this.sessionToken = tokenToValidate;
        apiClient.setSessionToken(tokenToValidate);
      } else {
        // Session is invalid, clear it
        this.clearSession();
      }
      
      return response;
    } catch (error) {
      console.error('Failed to validate session:', error);
      this.clearSession();
      return {
        success: false,
        error: 'SESSION_VALIDATION_FAILED',
        message: 'Failed to validate session'
      };
    }
  }

  // Get current session token
  getSessionToken(): string | null {
    return this.sessionToken || apiClient.getSessionToken();
  }

  // Check if session exists and is valid
  async isSessionValid(): Promise<boolean> {
    const token = this.getSessionToken();
    if (!token) return false;

    try {
      const validation = await this.validateSession(token);
      return validation.success && validation.data?.valid === true;
    } catch {
      return false;
    }
  }

  // Clear session
  clearSession(): void {
    this.sessionToken = null;
    apiClient.clearSession();
  }

  // Auto-create session if none exists
  async ensureSession(userId?: string): Promise<string | null> {
    // Check if current session is valid
    if (await this.isSessionValid()) {
      return this.getSessionToken();
    }

    // Create new session
    try {
      const response = await this.createSession(userId);
      if (response.success && response.data) {
        return response.data.sessionToken;
      }
    } catch (error) {
      console.error('Failed to ensure session:', error);
    }

    return null;
  }

  // Get session info without validation call
  getSessionInfo(): { token: string | null; hasSession: boolean } {
    const token = this.getSessionToken();
    return {
      token,
      hasSession: !!token
    };
  }

  // Refresh session (extend expiry)
  async refreshSession(): Promise<ApiResponse<SessionData>> {
    const currentToken = this.getSessionToken();
    if (!currentToken) {
      return {
        success: false,
        error: 'NO_SESSION',
        message: 'No active session to refresh'
      };
    }

    // For now, create a new session (in production, you might have a refresh endpoint)
    return this.createSession();
  }

  // Generate anonymous session for guest users
  async createAnonymousSession(): Promise<string | null> {
    try {
      const response = await this.createSession(); // No userId = anonymous
      return response.success && response.data ? response.data.sessionToken : null;
    } catch (error) {
      console.error('Failed to create anonymous session:', error);
      return null;
    }
  }

  // Session event handlers
  onSessionExpired(callback: () => void): void {
    // You could implement session expiry event handling here
    // For now, this is a placeholder for future enhancement
  }

  onSessionCreated(callback: (token: string) => void): void {
    // You could implement session creation event handling here
    // For now, this is a placeholder for future enhancement
  }
}

// Create singleton instance
export const sessionService = new SessionService();
export default sessionService;