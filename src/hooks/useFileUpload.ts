'use client';

import { useState } from 'react';
import { cloudinaryConfig, CLOUDINARY_UPLOAD_URL, uploadConfig } from '@/lib/cloudinaryConfig';

export interface UploadedFile {
  publicId: string;
  url: string;
  downloadUrl: string;
  originalName: string;
  size: number;
  format: string;
  type: string;
}

interface UploadProgress {
  percentage: number;
  loaded: number;
  total: number;
}

export const useFileUpload = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateDownloadUrl = (secureUrl: string, originalName: string, mimeType: string): string => {
    // Só forçar download para arquivos não-imagem
    if (!mimeType.startsWith('image/')) {
      // Substitui /image/ por /raw/
      const rawUrl = secureUrl.replace(/\/image\//, '/raw/');
      // Adiciona fl_attachment com nome amigável
      const friendlyName = encodeURIComponent(originalName);
      return rawUrl.replace('/upload/', `/upload/fl_attachment:${friendlyName}/`);
    }
    return secureUrl;
  };

  const validateFile = (file: File): string | null => {
    // Verificar tamanho
    if (file.size > uploadConfig.maxFileSize) {
      return `Arquivo muito grande. Máximo: ${uploadConfig.maxFileSize / (1024 * 1024)}MB`;
    }

    // Verificar tipo
    if (!uploadConfig.allowedTypes.includes(file.type)) {
      return `Tipo de arquivo não permitido: ${file.type}`;
    }

    return null;
  };

  const uploadFile = async (file: File): Promise<UploadedFile | null> => {
    // Validar arquivo
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return null;
    }

    setIsUploading(true);
    setError(null);
    setUploadProgress({ loaded: 0, total: file.size, percentage: 0 });

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', cloudinaryConfig.uploadPreset);
      formData.append('folder', uploadConfig.folder);
      formData.append('public_id', `leoveio_${Date.now()}_${file.name.replace(/\.[^/.]+$/, '')}`);

      const xhr = new XMLHttpRequest();
      
      const uploadPromise = new Promise<UploadedFile>((resolve, reject) => {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percentage = Math.round((e.loaded * 100) / e.total);
            setUploadProgress({
              loaded: e.loaded,
              total: e.total,
              percentage
            });
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            
            // Gerar URLs
            const originalUrl = response.secure_url;
            const downloadUrl = generateDownloadUrl(originalUrl, file.name, file.type);
            
            // Debug: log das URLs
            console.log('Original URL:', originalUrl);
            console.log('Download URL:', downloadUrl);
            console.log('Public ID:', response.public_id);
            
            const uploadedFile: UploadedFile = {
              publicId: response.public_id,
              url: originalUrl,
              downloadUrl: downloadUrl,
              originalName: file.name,
              size: file.size,
              format: response.format,
              type: file.type
            };
            resolve(uploadedFile);
          } else {
            reject(new Error(`Upload failed: ${xhr.status}`));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Upload failed'));
        });

        xhr.open('POST', CLOUDINARY_UPLOAD_URL);
        xhr.send(formData);
      });

      const result = await uploadPromise;
      
      // Adicionar à lista de arquivos enviados
      setUploadedFiles(prev => [...prev, result]);
      
      return result;

    } catch (err) {
      console.error('Erro no upload:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido no upload');
      return null;
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  const uploadMultipleFiles = async (files: File[]): Promise<UploadedFile[]> => {
    const results: UploadedFile[] = [];
    
    for (const file of files) {
      const result = await uploadFile(file);
      if (result) {
        results.push(result);
      }
    }
    
    return results;
  };

  const removeFile = (publicId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.publicId !== publicId));
  };

  const clearFiles = () => {
    setUploadedFiles([]);
    setError(null);
  };

  return {
    uploadedFiles,
    isUploading,
    uploadProgress,
    error,
    uploadFile,
    uploadMultipleFiles,
    removeFile,
    clearFiles,
    validateFile
  };
};