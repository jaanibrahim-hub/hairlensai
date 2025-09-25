import { Context } from 'hono';
import { Env, ApiResponse } from '../../types';
import { generateId } from '../utils/helpers';

interface SessionData {
  id: string;
  userId?: string;
  sessionToken: string;
  expiresAt: string;
  createdAt: string;
  lastAccessed: string;
}

export const sessionHandler = {
  async create(c: Context<{ Bindings: Env }>) {
    try {
      const body = await c.req.json();
      const userId = body.userId || null;
      const ttl = body.ttl || 24 * 60 * 60 * 1000; // Default 24 hours
      
      const sessionId = generateId();
      const sessionToken = generateId() + generateId(); // Extra long token
      const expiresAt = new Date(Date.now() + ttl).toISOString();
      const now = new Date().toISOString();
      
      const sessionData: SessionData = {
        id: sessionId,
        userId,
        sessionToken,
        expiresAt,
        createdAt: now,
        lastAccessed: now
      };

      // Store in D1 database
      await c.env.DB.prepare(`
        INSERT INTO user_sessions 
        (id, user_id, session_token, expires_at, created_at, last_accessed)
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(
        sessionData.id,
        sessionData.userId,
        sessionData.sessionToken,
        sessionData.expiresAt,
        sessionData.createdAt,
        sessionData.lastAccessed
      ).run();

      // Also store in KV for faster access
      await c.env.SESSIONS.put(sessionToken, JSON.stringify({
        sessionId: sessionData.id,
        userId: sessionData.userId,
        expiresAt: sessionData.expiresAt
      }), {
        expirationTtl: Math.floor(ttl / 1000) // KV expects seconds
      });

      return c.json<ApiResponse<{ sessionToken: string; expiresAt: string }>>({
        success: true,
        data: {
          sessionToken: sessionData.sessionToken,
          expiresAt: sessionData.expiresAt
        },
        message: 'Session created successfully'
      });

    } catch (error) {
      console.error('Create session error:', error);
      return c.json<ApiResponse>({
        success: false,
        error: 'Failed to create session',
        message: 'Could not create user session'
      }, 500);
    }
  },

  async validate(c: Context<{ Bindings: Env }>) {
    try {
      const sessionToken = c.req.param('token');
      
      // Try KV first for faster access
      const kvSession = await c.env.SESSIONS.get(sessionToken);
      
      if (kvSession) {
        const sessionData = JSON.parse(kvSession);
        
        // Check if expired
        if (new Date(sessionData.expiresAt) < new Date()) {
          // Clean up expired session
          await c.env.SESSIONS.delete(sessionToken);
          await c.env.DB.prepare('DELETE FROM user_sessions WHERE session_token = ?')
            .bind(sessionToken).run();
          
          return c.json<ApiResponse>({
            success: false,
            error: 'Session expired',
            message: 'Your session has expired. Please create a new session.'
          }, 401);
        }

        // Update last accessed time
        await c.env.DB.prepare('UPDATE user_sessions SET last_accessed = ? WHERE session_token = ?')
          .bind(new Date().toISOString(), sessionToken).run();

        return c.json<ApiResponse<{
          sessionId: string;
          userId?: string;
          expiresAt: string;
          valid: boolean;
        }>>({
          success: true,
          data: {
            sessionId: sessionData.sessionId,
            userId: sessionData.userId,
            expiresAt: sessionData.expiresAt,
            valid: true
          },
          message: 'Session is valid'
        });
      }

      // Fallback to database lookup
      const dbSession = await c.env.DB.prepare(
        'SELECT * FROM user_sessions WHERE session_token = ? AND expires_at > ?'
      ).bind(sessionToken, new Date().toISOString()).first();
      
      if (!dbSession) {
        return c.json<ApiResponse>({
          success: false,
          error: 'Invalid session',
          message: 'Session not found or expired'
        }, 401);
      }

      // Update last accessed time
      await c.env.DB.prepare('UPDATE user_sessions SET last_accessed = ? WHERE id = ?')
        .bind(new Date().toISOString(), dbSession.id).run();

      // Restore to KV for future fast access
      const ttl = Math.floor((new Date(dbSession.expires_at as string).getTime() - Date.now()) / 1000);
      if (ttl > 0) {
        await c.env.SESSIONS.put(sessionToken, JSON.stringify({
          sessionId: dbSession.id,
          userId: dbSession.user_id,
          expiresAt: dbSession.expires_at
        }), { expirationTtl: ttl });
      }

      return c.json<ApiResponse<{
        sessionId: string;
        userId?: string;
        expiresAt: string;
        valid: boolean;
      }>>({
        success: true,
        data: {
          sessionId: dbSession.id as string,
          userId: dbSession.user_id as string,
          expiresAt: dbSession.expires_at as string,
          valid: true
        },
        message: 'Session is valid'
      });

    } catch (error) {
      console.error('Validate session error:', error);
      return c.json<ApiResponse>({
        success: false,
        error: 'Failed to validate session',
        message: 'Could not validate session'
      }, 500);
    }
  },

  async cleanup(c: Context<{ Bindings: Env }>) {
    try {
      // Delete expired sessions from database
      const result = await c.env.DB.prepare(
        'DELETE FROM user_sessions WHERE expires_at < ?'
      ).bind(new Date().toISOString()).run();

      return c.json<ApiResponse<{ deletedCount: number }>>({
        success: true,
        data: { deletedCount: result.changes },
        message: `Cleaned up ${result.changes} expired sessions`
      });

    } catch (error) {
      console.error('Session cleanup error:', error);
      return c.json<ApiResponse>({
        success: false,
        error: 'Failed to cleanup sessions',
        message: 'Could not cleanup expired sessions'
      }, 500);
    }
  }
};