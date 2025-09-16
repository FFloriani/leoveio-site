// Cloudinary Configuration
export const cloudinaryConfig = {
  cloudName: 'dcqgxyw0z',
  uploadPreset: 'leoveio-contacts'
};

// URL base para uploads
export const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/upload`;

// Configurações de upload
export const uploadConfig = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: [
    'image/jpeg',
    'image/png', 
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'application/zip',
    'application/x-rar-compressed'
  ],
  folder: 'leoveio-contacts'
};
