import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NodeType } from '@prisma/client'

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: nodeId } = await context.params
    const body = await request.json()

    // Check if user owns this node
    const existingNode = await prisma.node.findFirst({
      where: {
        id: nodeId,
        portfolio: {
          userId: session.user.id
        }
      }
    })

    if (!existingNode) {
      return NextResponse.json({ error: 'Node not found' }, { status: 404 })
    }

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

    const updatedNode = await prisma.node.update({
      where: { id: nodeId },
      data: {
        title,
        description,
        content,
        type: type as NodeType,
        parentId: parentId || null,
        isVisible: isVisible !== false,
        projectUrl,
        githubUrl,
        demoUrl,
        tags: tags || []
      }
    })

    return NextResponse.json(updatedNode)
  } catch (error) {
    console.error('Error updating node:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: nodeId } = await context.params

    // Check if user owns this node
    const existingNode = await prisma.node.findFirst({
      where: {
        id: nodeId,
        portfolio: {
          userId: session.user.id
        }
      }
    })

    if (!existingNode) {
      return NextResponse.json({ error: 'Node not found' }, { status: 404 })
    }

    // Delete the node and all its children (cascade delete)
    await prisma.node.delete({
      where: { id: nodeId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting node:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}