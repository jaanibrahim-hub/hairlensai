import { Context } from 'hono';
import { Env, ApiResponse, UploadedImage } from '../../types';
import { generateId, sanitizeFilename, validateImage } from '../utils/helpers';

export const imageUploadHandler = {
  async single(c: Context<{ Bindings: Env }>) {
    try {
      const formData = await c.req.formData();
      const image = formData.get('image') as File;
      const userId = formData.get('userId') as string | null;
      
      if (!image) {
        return c.json<ApiResponse>({
          success: false,
          error: 'No image file provided',
          message: 'Please select an image file to upload'
        }, 400);
      }

      // Validate image
      const validation = validateImage(image);
      if (!validation.valid) {
        return c.json<ApiResponse>({
          success: false,
          error: validation.error,
          message: 'Invalid image file'
        }, 400);
      }

      const imageId = generateId();
      const sanitizedFilename = sanitizeFilename(image.name);
      const r2Key = `images/${imageId}/${sanitizedFilename}`;
      
      // Upload to R2
      await c.env.IMAGES_BUCKET.put(r2Key, image.stream(), {
        httpMetadata: {
          contentType: image.type,
          contentDisposition: `attachment; filename="${sanitizedFilename}"`
        },
        customMetadata: {
          originalName: image.name,
          uploadedBy: userId || 'anonymous',
          uploadedAt: new Date().toISOString()
        }
      });

      // Save metadata to D1
      const uploadedImage: UploadedImage = {
        id: imageId,
        filename: sanitizedFilename,
        originalName: image.name,
        mimeType: image.type,
        size: image.size,
        uploadedAt: new Date().toISOString(),
        userId: userId || undefined,
        r2Key
      };

      await c.env.DB.prepare(`
        INSERT INTO uploaded_images 
        (id, filename, original_name, mime_type, size, uploaded_at, user_id, r2_key)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        uploadedImage.id,
        uploadedImage.filename,
        uploadedImage.originalName,
        uploadedImage.mimeType,
        uploadedImage.size,
        uploadedImage.uploadedAt,
        uploadedImage.userId,
        uploadedImage.r2Key
      ).run();

      return c.json<ApiResponse<UploadedImage>>({
        success: true,
        data: uploadedImage,
        message: 'Image uploaded successfully'
      });

    } catch (error) {
      console.error('Image upload error:', error);
      return c.json<ApiResponse>({
        success: false,
        error: 'Upload failed',
        message: 'Failed to upload image. Please try again.'
      }, 500);
    }
  },

  async batch(c: Context<{ Bindings: Env }>) {
    try {
      const formData = await c.req.formData();
      const images = formData.getAll('images') as File[];
      const userId = formData.get('userId') as string | null;
      
      if (!images || images.length === 0) {
        return c.json<ApiResponse>({
          success: false,
          error: 'No image files provided',
          message: 'Please select at least one image file to upload'
        }, 400);
      }

      const uploadedImages: UploadedImage[] = [];
      const errors: string[] = [];

      for (const image of images) {
        try {
          const validation = validateImage(image);
          if (!validation.valid) {
            errors.push(`${image.name}: ${validation.error}`);
            continue;
          }

          const imageId = generateId();
          const sanitizedFilename = sanitizeFilename(image.name);
          const r2Key = `images/${imageId}/${sanitizedFilename}`;
          
          await c.env.IMAGES_BUCKET.put(r2Key, image.stream(), {
            httpMetadata: {
              contentType: image.type,
              contentDisposition: `attachment; filename="${sanitizedFilename}"`
            },
            customMetadata: {
              originalName: image.name,
              uploadedBy: userId || 'anonymous',
              uploadedAt: new Date().toISOString()
            }
          });

          const uploadedImage: UploadedImage = {
            id: imageId,
            filename: sanitizedFilename,
            originalName: image.name,
            mimeType: image.type,
            size: image.size,
            uploadedAt: new Date().toISOString(),
            userId: userId || undefined,
            r2Key
          };

          await c.env.DB.prepare(`
            INSERT INTO uploaded_images 
            (id, filename, original_name, mime_type, size, uploaded_at, user_id, r2_key)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(
            uploadedImage.id,
            uploadedImage.filename,
            uploadedImage.originalName,
            uploadedImage.mimeType,
            uploadedImage.size,
            uploadedImage.uploadedAt,
            uploadedImage.userId,
            uploadedImage.r2Key
          ).run();

          uploadedImages.push(uploadedImage);

        } catch (error) {
          console.error(`Error uploading ${image.name}:`, error);
          errors.push(`${image.name}: Upload failed`);
        }
      }

      return c.json<ApiResponse<{ images: UploadedImage[], errors: string[] }>>({
        success: uploadedImages.length > 0,
        data: { images: uploadedImages, errors },
        message: `Successfully uploaded ${uploadedImages.length} images. ${errors.length} failed.`
      });

    } catch (error) {
      console.error('Batch upload error:', error);
      return c.json<ApiResponse>({
        success: false,
        error: 'Batch upload failed',
        message: 'Failed to upload images. Please try again.'
      }, 500);
    }
  }
};