import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, 
  api_key: 'r_YkZUG0TiZv2xsWl0X3YnUC7jE', 
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

export default cloudinary;

/**
 * Uploads a file to Cloudinary
 * @param file Base64 encoded file or URL
 * @param folder Folder to upload to
 * @returns Upload result
 */
export const uploadToCloudinary = async (
  file: string,
  folder: string = 'abaya/images'
) => {
  try {
    // If the file is a URL, use upload from URL
    if (file.startsWith('http')) {
      const result = await cloudinary.uploader.upload(file, {
        folder,
        resource_type: 'auto',
      });
      return result;
    }
    
    // Otherwise, assume it's a base64 encoded file
    const result = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: 'auto',
    });
    
    return result;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
}; 