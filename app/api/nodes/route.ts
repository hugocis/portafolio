import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NodeType } from '@prisma/client'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const portfolio = await prisma.portfolio.findUnique({
            where: { userId: session.user.id },
            include: {
                nodes: {
                    orderBy: { order: 'asc' }
                }
            }
        })

        if (!portfolio) {
            return NextResponse.json({ nodes: [] })
        }

        return NextResponse.json({ nodes: portfolio.nodes })
    } catch (error) {
        console.error('Error fetching nodes:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const {
            title,
            description,
            content,
            type,
            parentId,
            isVisible,
            projectUrl,
            githubUrl,
            demoUrl,
            tags
        } = body

        // Ensure user has a portfolio
        let portfolio = await prisma.portfolio.findUnique({
            where: { userId: session.user.id }
        })

        if (!portfolio) {
            const user = await prisma.user.findUnique({
                where: { id: session.user.id }
            })

            portfolio = await prisma.portfolio.create({
                data: {
                    userId: session.user.id,
                    title: `${user?.name || 'My'} Portfolio`,
                    isPublic: true
                }
            })
        }

        // Get the next order value
        const lastNode = await prisma.node.findFirst({
            where: {
                portfolioId: portfolio.id,
                parentId: parentId || null
            },
            orderBy: { order: 'desc' }
        })

        const order = (lastNode?.order || 0) + 1

        const node = await prisma.node.create({
            data: {
                title,
                description,
                content,
                type: type as NodeType,
                portfolioId: portfolio.id,
                parentId: parentId || null,
                isVisible: isVisible !== false,
                projectUrl,
                githubUrl,
                demoUrl,
                tags: tags || [],
                order
            }
        })

        return NextResponse.json(node, { status: 201 })
    } catch (error) {
        console.error('Error creating node:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}