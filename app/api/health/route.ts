// Health check endpoint para verificar estado de la aplicación
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Verificar conexión a base de datos
    const { prisma } = await import('@/lib/prisma')
    await prisma.$queryRaw`SELECT 1`

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: 'connected',
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0'
    })
  } catch (error) {
    console.error('Health check failed:', error)
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        environment: process.env.NODE_ENV || 'development',
        error: 'Database connection failed'
      },
      { status: 500 }
    )
  }
}