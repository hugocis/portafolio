import { Node as PrismaNode, NodeType } from '@prisma/client'

export interface NodeWithChildren extends PrismaNode {
    children?: NodeWithChildren[]
}

export type { NodeType }