import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { del } from '@vercel/blob';

// DELETE /api/blobs/[id] - Delete a blob
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    
    // Find the blob
    const blob = await prisma.blob.findUnique({
      where: { id },
    });

    if (!blob) {
      return NextResponse.json({ error: 'Blob not found' }, { status: 404 });
    }

    // Check ownership
    if (blob.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Delete from storage
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      // Delete from Vercel Blob
      await del(blob.url, {
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
    } else {
      // Delete from local storage
      const fs = require('fs');
      const path = require('path');
      const filepath = path.join(process.cwd(), 'public', blob.url);
      
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    }

    // Delete from database
    await prisma.blob.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Blob deleted successfully' });
  } catch (error) {
    console.error('Error deleting blob:', error);
    return NextResponse.json(
      { error: 'Failed to delete blob' },
      { status: 500 }
    );
  }
}

// GET /api/blobs/[id] - Get a specific blob
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    
    const blob = await prisma.blob.findUnique({
      where: { id },
    });

    if (!blob) {
      return NextResponse.json({ error: 'Blob not found' }, { status: 404 });
    }

    // Check ownership
    if (blob.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(blob);
  } catch (error) {
    console.error('Error fetching blob:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blob' },
      { status: 500 }
    );
  }
}
