'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Node } from '@prisma/client'
import { NodeType } from '@/types/portfolio'
import { ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { FolderIcon, DocumentIcon, CodeBracketIcon, AcademicCapIcon, BriefcaseIcon } from '@heroicons/react/24/solid'

interface NodeWithChildren extends Node {
    children?: NodeWithChildren[]
}

interface PortfolioTreeProps {
    nodes: NodeWithChildren[]
    username: string
    isOwner?: boolean
    onNodeClick?: (node: Node) => void
}

const getNodeIcon = (type: NodeType) => {
    switch (type) {
        case 'CATEGORY':
            return FolderIcon
        case 'LANGUAGE':
            return CodeBracketIcon
        case 'PROJECT':
            return DocumentIcon
        case 'EDUCATION':
            return AcademicCapIcon
        case 'EXPERIENCE':
            return BriefcaseIcon
        default:
            return DocumentIcon
    }
}

const getNodeColor = (type: NodeType) => {
    switch (type) {
        case 'CATEGORY':
            return 'text-blue-600'
        case 'LANGUAGE':
            return 'text-green-600'
        case 'PROJECT':
            return 'text-purple-600'
        case 'EDUCATION':
            return 'text-orange-600'
        case 'EXPERIENCE':
            return 'text-red-600'
        default:
            return 'text-gray-600'
    }
}

function TreeNode({
    node,
    level = 0,
    onNodeClick
}: {
    node: NodeWithChildren
    level?: number
    onNodeClick?: (node: Node) => void
}) {
    const [isExpanded, setIsExpanded] = useState(true)
    const hasChildren = node.children && node.children.length > 0
    const Icon = getNodeIcon(node.type)
    const colorClass = getNodeColor(node.type)

    return (
        <div className="select-none">
            <div
                className={`flex items-center py-2 px-2 hover:bg-gray-50 dark:hover:bg-slate-700 rounded cursor-pointer ${level === 0 ? 'font-semibold' : ''
                    }`}
                style={{ paddingLeft: `${level * 20 + 8}px` }}
                onClick={() => {
                    if (hasChildren) {
                        setIsExpanded(!isExpanded)
                    }
                    if (onNodeClick) {
                        onNodeClick(node)
                    }
                }}
            >
                {hasChildren && (
                    <button className="mr-1 p-1">
                        {isExpanded ? (
                            <ChevronDownIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        ) : (
                            <ChevronRightIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        )}
                    </button>
                )}
                {!hasChildren && <div className="w-6" />}
                <Icon className={`h-5 w-5 mr-2 ${colorClass}`} />
                <span className="text-gray-900 dark:text-gray-100">{node.title}</span>
                {node.tags && node.tags.length > 0 && (
                    <div className="ml-2 flex gap-1">
                        {node.tags.slice(0, 3).map((tag, index) => (
                            <span
                                key={index}
                                className="inline-block bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-full"
                            >
                                {tag}
                            </span>
                        ))}
                        {node.tags.length > 3 && (
                            <span className="text-gray-500 dark:text-gray-400 text-xs">+{node.tags.length - 3}</span>
                        )}
                    </div>
                )}
            </div>

            {hasChildren && isExpanded && (
                <div>
                    {node.children!
                        .filter(child => child.isVisible)
                        .sort((a, b) => a.order - b.order)
                        .map((child) => (
                            <TreeNode
                                key={child.id}
                                node={child}
                                level={level + 1}
                                onNodeClick={onNodeClick}
                            />
                        ))}
                </div>
            )}
        </div>
    )
}

export function PortfolioTree({ nodes, username, isOwner, onNodeClick }: PortfolioTreeProps) {
    // Build tree structure
    const buildTree = (nodes: Node[]): NodeWithChildren[] => {
        const nodeMap = new Map<string, NodeWithChildren>()
        const roots: NodeWithChildren[] = []

        // Create map of all nodes
        nodes.forEach(node => {
            nodeMap.set(node.id, { ...node, children: [] })
        })

        // Build parent-child relationships
        nodes.forEach(node => {
            const nodeWithChildren = nodeMap.get(node.id)!
            if (node.parentId) {
                const parent = nodeMap.get(node.parentId)
                if (parent) {
                    parent.children!.push(nodeWithChildren)
                }
            } else {
                roots.push(nodeWithChildren)
            }
        })

        return roots
    }

    const treeNodes = buildTree(nodes.filter(node => node.isVisible))
        .sort((a, b) => a.order - b.order)

    return (
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-4">
            <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{username}&apos;s Portfolio</h2>
                {isOwner && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Click on nodes to edit, or use the dashboard to manage your portfolio.
                    </p>
                )}
            </div>

            <div className="space-y-1">
                {treeNodes.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <p>No portfolio content yet.</p>
                        {isOwner && (
                            <p className="mt-2">
                                <Link href="/dashboard" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                                    Go to dashboard to add content
                                </Link>
                            </p>
                        )}
                    </div>
                ) : (
                    treeNodes.map((node) => (
                        <TreeNode
                            key={node.id}
                            node={node}
                            onNodeClick={onNodeClick}
                        />
                    ))
                )}
            </div>
        </div>
    )
}