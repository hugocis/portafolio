import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { unlink } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

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

    // Eliminar del file system local (Docker)
    // blob.url is like "/uploads/filename.jpg"
    const filepath = join(process.cwd(), 'public', blob.url);

    try {
      if (existsSync(filepath)) {
        await unlink(filepath);
      } else {
        console.warn(`File not found for deletion: ${filepath}`);
      }
    } catch (fsError) {
      console.error('Error deleting file from disk:', fsError);
      // Continuar de todos modos para eliminar de la base de datos
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
