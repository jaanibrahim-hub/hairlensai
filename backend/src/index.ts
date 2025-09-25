import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { jwt } from 'hono/jwt';
import { Env, ApiResponse, UploadedImage, AnalysisResult } from '../types';
import { imageUploadHandler } from './handlers/imageUpload';
import { analysisHandler } from './handlers/analysis';
import { imageRetrievalHandler } from './handlers/imageRetrieval';
import { sessionHandler } from './handlers/session';

const app = new Hono<{ Bindings: Env }>();

// CORS configuration
app.use('*', cors({
  origin: ['https://hair-analysis-ai.pages.dev', 'https://hair-analysis-ai-staging.pages.dev', 'http://localhost:5173'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Session-Token'],
}));

// Health check endpoint
app.get('/', (c) => {
  return c.json({
    success: true,
    message: 'Hair Analysis AI Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Session management
app.post('/api/session', sessionHandler.create);
app.get('/api/session/:token', sessionHandler.validate);

// Image upload endpoints
app.post('/api/upload', imageUploadHandler.single);
app.post('/api/upload/batch', imageUploadHandler.batch);

// Image retrieval endpoints
app.get('/api/images/:id', imageRetrievalHandler.getById);
app.get('/api/images/:id/download', imageRetrievalHandler.download);
app.get('/api/user/:userId/images', imageRetrievalHandler.getUserImages);

// Analysis endpoints
app.post('/api/analyze/:imageId', analysisHandler.analyze);
app.get('/api/analysis/:id', analysisHandler.getResult);
app.get('/api/image/:imageId/analysis', analysisHandler.getByImageId);

// Delete endpoints
app.delete('/api/images/:id', imageRetrievalHandler.deleteImage);
app.delete('/api/analysis/:id', analysisHandler.deleteResult);

// Error handling middleware
app.onError((err, c) => {
  console.error('API Error:', err);
  
  const response: ApiResponse = {
    success: false,
    error: err.message || 'Internal Server Error',
    message: 'An error occurred while processing your request'
  };
  
  return c.json(response, 500);
});

// 404 handler
app.notFound((c) => {
  const response: ApiResponse = {
    success: false,
    error: 'Not Found',
    message: 'The requested endpoint does not exist'
  };
  
  return c.json(response, 404);
});

export default app;