import { Context } from 'hono';
import { Env, ApiResponse, UploadedImage } from '../../types';

export const imageRetrievalHandler = {
  async getById(c: Context<{ Bindings: Env }>) {
    try {
      const imageId = c.req.param('id');
      
      const result = await c.env.DB.prepare(
        'SELECT * FROM uploaded_images WHERE id = ?'
      ).bind(imageId).first();
      
      if (!result) {
        return c.json<ApiResponse>({
          success: false,
          error: 'Image not found',
          message: 'The specified image does not exist'
        }, 404);
      }

      const image: UploadedImage = {
        id: result.id as string,
        filename: result.filename as string,
        originalName: result.original_name as string,
        mimeType: result.mime_type as string,
        size: result.size as number,
        uploadedAt: result.uploaded_at as string,
        userId: result.user_id as string,
        r2Key: result.r2_key as string
      };

      return c.json<ApiResponse<UploadedImage>>({
        success: true,
        data: image
      });

    } catch (error) {
      console.error('Get image error:', error);
      return c.json<ApiResponse>({
        success: false,
        error: 'Failed to retrieve image',
        message: 'Could not retrieve the image information'
      }, 500);
    }
  },

  async download(c: Context<{ Bindings: Env }>) {
    try {
      const imageId = c.req.param('id');
      
      const result = await c.env.DB.prepare(
        'SELECT * FROM uploaded_images WHERE id = ?'
      ).bind(imageId).first();
      
      if (!result) {
        return c.json<ApiResponse>({
          success: false,
          error: 'Image not found',
          message: 'The specified image does not exist'
        }, 404);
      }

      const imageObject = await c.env.IMAGES_BUCKET.get(result.r2_key as string);
      
      if (!imageObject) {
        return c.json<ApiResponse>({
          success: false,
          error: 'Image file not found',
          message: 'The image file could not be retrieved from storage'
        }, 404);
      }

      // Set appropriate headers for image response
      c.header('Content-Type', result.mime_type as string);
      c.header('Content-Disposition', `inline; filename="${result.filename}"`);
      c.header('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
      
      return c.body(imageObject.body);

    } catch (error) {
      console.error('Download image error:', error);
      return c.json<ApiResponse>({
        success: false,
        error: 'Failed to download image',
        message: 'Could not download the image file'
      }, 500);
    }
  },

  async getUserImages(c: Context<{ Bindings: Env }>) {
    try {
      const userId = c.req.param('userId');
      const page = parseInt(c.req.query('page') || '1');
      const limit = parseInt(c.req.query('limit') || '20');
      const offset = (page - 1) * limit;
      
      const results = await c.env.DB.prepare(`
        SELECT * FROM uploaded_images 
        WHERE user_id = ? 
        ORDER BY uploaded_at DESC 
        LIMIT ? OFFSET ?
      `).bind(userId, limit, offset).all();
      
      const countResult = await c.env.DB.prepare(
        'SELECT COUNT(*) as total FROM uploaded_images WHERE user_id = ?'
      ).bind(userId).first();
      
      const images: UploadedImage[] = results.results.map((result: any) => ({
        id: result.id,
        filename: result.filename,
        originalName: result.original_name,
        mimeType: result.mime_type,
        size: result.size,
        uploadedAt: result.uploaded_at,
        userId: result.user_id,
        r2Key: result.r2_key
      }));

      const total = (countResult?.total as number) || 0;
      const totalPages = Math.ceil(total / limit);

      return c.json<ApiResponse<{
        images: UploadedImage[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      }>>({
        success: true,
        data: {
          images,
          pagination: {
            page,
            limit,
            total,
            totalPages
          }
        },
        message: `Found ${images.length} images for user`
      });

    } catch (error) {
      console.error('Get user images error:', error);
      return c.json<ApiResponse>({
        success: false,
        error: 'Failed to retrieve user images',
        message: 'Could not retrieve images for this user'
      }, 500);
    }
  },

  async deleteImage(c: Context<{ Bindings: Env }>) {
    try {
      const imageId = c.req.param('id');
      
      // Get image info first
      const imageResult = await c.env.DB.prepare(
        'SELECT * FROM uploaded_images WHERE id = ?'
      ).bind(imageId).first();
      
      if (!imageResult) {
        return c.json<ApiResponse>({
          success: false,
          error: 'Image not found',
          message: 'The specified image does not exist'
        }, 404);
      }

      // Delete from R2 storage
      try {
        await c.env.IMAGES_BUCKET.delete(imageResult.r2_key as string);
      } catch (r2Error) {
        console.warn('Failed to delete from R2:', r2Error);
        // Continue with database deletion even if R2 deletion fails
      }

      // Delete from database (this will cascade to analysis_results)
      const deleteResult = await c.env.DB.prepare(
        'DELETE FROM uploaded_images WHERE id = ?'
      ).bind(imageId).run();
      
      if (deleteResult.changes === 0) {
        return c.json<ApiResponse>({
          success: false,
          error: 'Image not found',
          message: 'The specified image does not exist'
        }, 404);
      }

      return c.json<ApiResponse>({
        success: true,
        message: 'Image and associated analysis results deleted successfully'
      });

    } catch (error) {
      console.error('Delete image error:', error);
      return c.json<ApiResponse>({
        success: false,
        error: 'Failed to delete image',
        message: 'Could not delete the image'
      }, 500);
    }
  }
};