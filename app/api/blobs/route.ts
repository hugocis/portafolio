import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { put } from '@vercel/blob';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// GET /api/blobs - List user's blobs
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const where = {
      userId: user.id,
      ...(category && { category }),
    };

    const [blobs, total] = await Promise.all([
      prisma.blob.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.blob.count({ where }),
    ]);

    return NextResponse.json({
      blobs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching blobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blobs' },
      { status: 500 }
    );
  }
}

// POST /api/blobs - Upload a new blob
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = formData.get('category') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'application/zip',
      'text/plain',
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type' },
        { status: 400 }
      );
    }

    // Upload to Vercel Blob or use local storage
    let blobUrl: string;
    let blobKey: string;

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      // Use Vercel Blob
      const blob = await put(file.name, file, {
        access: 'public',
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      blobUrl = blob.url;
      blobKey = blob.pathname;
    } else {
      // Use local storage (for development)
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Save to public folder
      const uploadsDir = join(process.cwd(), 'public', 'uploads');
      
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
      }
      
      const timestamp = Date.now();
      const filename = `${timestamp}-${file.name}`;
      const filepath = join(uploadsDir, filename);
      
      await writeFile(filepath, buffer);
      
      blobUrl = `/uploads/${filename}`;
      blobKey = filename;
    }

    // Save blob metadata to database
    const blob = await prisma.blob.create({
      data: {
        userId: user.id,
        key: blobKey,
        url: blobUrl,
        filename: file.name,
        size: file.size,
        mimeType: file.type,
        category: category || null,
      },
    });

    return NextResponse.json(blob, { status: 201 });
  } catch (error) {
    console.error('Error uploading blob:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
