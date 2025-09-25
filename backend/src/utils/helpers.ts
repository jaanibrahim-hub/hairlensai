import { Env } from '../../types';

export function generateId(): string {
  return crypto.randomUUID();
}

export function sanitizeFilename(filename: string): string {
  // Remove or replace dangerous characters
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_{2,}/g, '_')
    .substring(0, 255);
}

export function validateImage(file: File): { valid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: 'File size exceeds 10MB limit' };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed' };
  }
  
  return { valid: true };
}

export async function encryptData(data: string, key: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const keyBuffer = encoder.encode(key.substring(0, 32).padEnd(32, '0'));
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBuffer,
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  );
  
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    dataBuffer
  );
  
  const encrypted = new Uint8Array(encryptedBuffer);
  const result = new Uint8Array(iv.length + encrypted.length);
  result.set(iv);
  result.set(encrypted, iv.length);
  
  return btoa(String.fromCharCode(...result));
}

export async function decryptData(encryptedData: string, key: string): Promise<string> {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const keyBuffer = encoder.encode(key.substring(0, 32).padEnd(32, '0'));
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBuffer,
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  );
  
  const encryptedBuffer = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
  const iv = encryptedBuffer.slice(0, 12);
  const encrypted = encryptedBuffer.slice(12);
  
  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    encrypted
  );
  
  return decoder.decode(decryptedBuffer);
}

export function createApiKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'ha_'; // Hair Analysis prefix
  
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}

export function validateApiKey(apiKey: string): boolean {
  return apiKey.startsWith('ha_') && apiKey.length === 35;
}

export function rateLimit(identifier: string, limit: number, windowMs: number) {
  // This would implement rate limiting logic
  // For now, return a placeholder
  return {
    allowed: true,
    remaining: limit - 1,
    reset: Date.now() + windowMs
  };
}

export function logRequest(method: string, path: string, ip?: string, userAgent?: string) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${method} ${path} - IP: ${ip} - UA: ${userAgent}`);
}

export function formatFileSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}

export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

export function createThumbnail(imageBuffer: ArrayBuffer, maxWidth: number = 300): Promise<ArrayBuffer> {
  // This would implement image thumbnail generation
  // For now, return the original buffer
  return Promise.resolve(imageBuffer);
}

export function detectImageType(buffer: ArrayBuffer): string {
  const arr = new Uint8Array(buffer);
  
  // Check for JPEG
  if (arr[0] === 0xFF && arr[1] === 0xD8 && arr[2] === 0xFF) {
    return 'image/jpeg';
  }
  
  // Check for PNG
  if (arr[0] === 0x89 && arr[1] === 0x50 && arr[2] === 0x4E && arr[3] === 0x47) {
    return 'image/png';
  }
  
  // Check for WebP
  if (arr[8] === 0x57 && arr[9] === 0x45 && arr[10] === 0x42 && arr[11] === 0x50) {
    return 'image/webp';
  }
  
  return 'application/octet-stream';
}