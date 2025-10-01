import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            where: {
                portfolio: {
                    isPublic: true
                }
            },
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                bio: true,
                image: true,
                portfolio: {
                    select: {
                        id: true,
                        title: true,
                        subtitle: true,
                        isPublic: true,
                        nodes: {
                            select: {
                                id: true,
                                type: true,
                                title: true,
                                tags: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json({ users })
    } catch (error) {
        console.error('Error fetching public users:', error)
        return NextResponse.json(
            { error: 'Error al obtener usuarios' },
            { status: 500 }
        )
    }
}