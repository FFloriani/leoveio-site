import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { folder: string } }
) {
  try {
    const folderName = params.folder;
    const publicPath = path.join(process.cwd(), 'public', folderName);

    // Check if folder exists
    try {
      await fs.access(publicPath);
    } catch {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
    }

    // Read directory contents
    const files = await fs.readdir(publicPath);
    
    // Filter and categorize files
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff'];
    const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.flv', '.wmv'];
    
    const photos: any[] = [];
    const videos: any[] = [];

    for (const file of files) {
      const filePath = path.join(publicPath, file);
      const stat = await fs.stat(filePath);
      
      if (stat.isFile()) {
        const ext = path.extname(file).toLowerCase();
        const fileInfo = {
          name: file,
          path: `/${folderName}/${file}`,
          extension: ext.substring(1), // Remove the dot
          size: stat.size,
          lastModified: stat.mtime
        };

        if (imageExtensions.includes(ext)) {
          photos.push({
            ...fileInfo,
            type: 'image'
          });
        } else if (videoExtensions.includes(ext)) {
          videos.push({
            ...fileInfo,
            type: 'video'
          });
        }
      }
    }

    // Sort files by name
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