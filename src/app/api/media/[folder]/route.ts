import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

interface MediaFile {
  name: string;
  path: string;
  extension: string;
  type: 'image' | 'video';
}

// Constantes para otimização
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff'];
const VIDEO_EXTENSIONS = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.flv', '.wmv'];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ folder: string }> }
) {
  try {
    const { folder: folderName } = await params;
    
    // Validação simples do nome da pasta
    if (!folderName || folderName.includes('..') || folderName.includes('/')) {
      return NextResponse.json({ error: 'Invalid folder name' }, { status: 400 });
    }

    const publicPath = path.join(process.cwd(), 'public', folderName);

    // Verificar se a pasta existe
    try {
      await fs.access(publicPath);
    } catch {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
    }

    // Ler conteúdo da pasta
    const files = await fs.readdir(publicPath);
    
    const photos: MediaFile[] = [];
    const videos: MediaFile[] = [];

    // Processar arquivos de forma mais eficiente
    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      
      if (!ext) continue; // Pular arquivos sem extensão
      
      const fileInfo: MediaFile = {
        name: file,
        path: `/${folderName}/${file}`,
        extension: ext.substring(1),
        type: IMAGE_EXTENSIONS.includes(ext) ? 'image' : 'video'
      };

      if (IMAGE_EXTENSIONS.includes(ext)) {
        photos.push(fileInfo);
      } else if (VIDEO_EXTENSIONS.includes(ext)) {
        videos.push(fileInfo);
      }
    }

    // Ordenar por nome
    photos.sort((a, b) => a.name.localeCompare(b.name));
    videos.sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({
      folder: folderName,
      photos,
      videos,
      totalFiles: photos.length + videos.length
    });

  } catch (error) {
    console.error('Error reading media folder:', error);
    return NextResponse.json(
      { error: 'Failed to read media folder' },
      { status: 500 }
    );
  }
} 