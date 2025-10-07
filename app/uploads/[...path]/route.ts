import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

// GET /uploads/[...path] - Serve uploaded files
export async function GET(
    request: NextRequest,
    { params }: { params: { path: string[] } }
) {
    try {
        const filePath = params.path.join('/')
        const fullPath = join(process.cwd(), 'public', 'uploads', filePath)

        // Check if file exists
        if (!existsSync(fullPath)) {
            return NextResponse.json(
                { error: 'File not found' },
                { status: 404 }
            )
        }

        // Read file
        const fileBuffer = await readFile(fullPath)

        // Determine content type based on file extension
        const extension = filePath.split('.').pop()?.toLowerCase()
        const contentTypes: Record<string, string> = {
            jpg: 'image/jpeg',
            jpeg: 'image/jpeg',
            png: 'image/png',
            gif: 'image/gif',
            webp: 'image/webp',
            pdf: 'application/pdf',
            zip: 'application/zip',
            txt: 'text/plain',
        }

        const contentType = contentTypes[extension || ''] || 'application/octet-stream'

        // Return file with appropriate headers
        return new NextResponse(fileBuffer as unknown as BodyInit, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        })
    } catch (error) {
        console.error('Error serving file:', error)
        return NextResponse.json(
            { error: 'Failed to serve file' },
            { status: 500 }
        )
    }
}
