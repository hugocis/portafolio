'use client'

import { useState } from 'react'
import { Node } from '@prisma/client'
import { ChevronRightIcon, ChevronDownIcon, PlusIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline'
import { FolderIcon, DocumentIcon, CodeBracketIcon, AcademicCapIcon, BriefcaseIcon } from '@heroicons/react/24/solid'

interface NodeWithChildren extends Node {
    children?: NodeWithChildren[]
}

interface InteractiveTreeProps {
    nodes: NodeWithChildren[]
    username: string
    isOwner?: boolean
    onNodeClick?: (node: Node) => void
    onNodeEdit?: (node: Node) => void
    onNodeDelete?: (nodeId: string) => void
    onNodeAdd?: (parentId?: string) => void
    selectedNodeId?: string
}

const getNodeIcon = (type: string) => {
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

const getNodeColor = (type: string) => {
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
    isOwner = false,
    onNodeClick,
    onNodeEdit,
    onNodeDelete,
    onNodeAdd,
    selectedNodeId
}: {
    node: NodeWithChildren
    level?: number
    isOwner?: boolean
    onNodeClick?: (node: Node) => void
    onNodeEdit?: (node: Node) => void
    onNodeDelete?: (nodeId: string) => void
    onNodeAdd?: (parentId?: string) => void
    selectedNodeId?: string
}) {
    const [isExpanded, setIsExpanded] = useState(true)
    const [showActions, setShowActions] = useState(false)
    const hasChildren = node.children && node.children.length > 0
    const Icon = getNodeIcon(node.type)
    const colorClass = getNodeColor(node.type)
    const isSelected = selectedNodeId === node.id

    return (
        <div className="relative">
            {/* Tree connections */}
            <div className="flex items-center">
                {/* Indentation for tree levels */}
                {level > 0 && (
                    <div className="flex items-center">
                        {/* Parent level indentations */}
                        {Array.from({ length: level - 1 }).map((_, index) => (
                            <div key={index} className="w-6 flex justify-center">
                                <div className="w-px bg-gray-200 h-full opacity-50"></div>
                            </div>
                        ))}

                        {/* Current level connector */}
                        <div className="w-6 flex items-center justify-start">
                            <div className="w-4 border-t border-gray-300 border-dashed"></div>
                        </div>
                    </div>
                )}

                {/* Node content */}
                <div
                    className={`flex-1 flex items-center py-2 px-3 rounded-lg transition-all duration-200 cursor-pointer group ${isSelected
                        ? 'bg-blue-100 border-2 border-blue-300 shadow-md transform scale-105'
                        : 'hover:bg-gray-50 hover:shadow-sm'
                        }`}
                    onClick={() => {
                        if (hasChildren) {
                            setIsExpanded(!isExpanded)
                        }
                        if (onNodeClick) {
                            onNodeClick(node)
                        }
                    }}
                    onMouseEnter={() => setShowActions(true)}
                    onMouseLeave={() => setShowActions(false)}
                >
                    {/* Expand/Collapse button */}
                    {hasChildren && (
                        <button
                            className="mr-2 p-1 rounded hover:bg-gray-200 transition-colors"
                            onClick={(e) => {
                                e.stopPropagation()
                                setIsExpanded(!isExpanded)
                            }}
                        >
                            {isExpanded ? (
                                <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                            ) : (
                                <ChevronRightIcon className="h-4 w-4 text-gray-500" />
                            )}
                        </button>
                    )}

                    {!hasChildren && <div className="w-6" />}

                    {/* Node icon */}
                    <Icon className={`h-5 w-5 mr-3 ${colorClass} transition-transform group-hover:scale-110`} />

                    {/* Node content */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <div>
                                <span className={`font-medium ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                                    {node.title}
                                </span>
                                {node.description && (
                                    <p className="text-sm text-gray-600 mt-1">{node.description}</p>
                                )}
                            </div>

                            {/* Action buttons */}
                            {isOwner && (showActions || isSelected) && (
                                <div className="flex items-center space-x-1 ml-4">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            if (onNodeAdd) onNodeAdd(node.id)
                                        }}
                                        className="p-1 rounded text-green-600 hover:bg-green-100 transition-colors"
                                        title="Añadir nodo hijo"
                                    >
                                        <PlusIcon className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            if (onNodeEdit) onNodeEdit(node)
                                        }}
                                        className="p-1 rounded text-blue-600 hover:bg-blue-100 transition-colors"
                                        title="Editar nodo"
                                    >
                                        <PencilIcon className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            if (onNodeDelete && confirm('¿Estás seguro de que quieres eliminar este nodo y todos sus hijos?')) {
                                                onNodeDelete(node.id)
                                            }
                                        }}
                                        className="p-1 rounded text-red-600 hover:bg-red-100 transition-colors"
                                        title="Eliminar nodo"
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            )}

                            {/* View button for non-owners */}
                            {!isOwner && showActions && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        if (onNodeClick) onNodeClick(node)
                                    }}
                                    className="p-1 rounded text-gray-600 hover:bg-gray-100 transition-colors ml-4"
                                    title="Ver detalles"
                                >
                                    <EyeIcon className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        {/* Tags */}
                        {node.tags && node.tags.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                                {node.tags.slice(0, 4).map((tag, index) => (
                                    <span
                                        key={index}
                                        className="inline-block bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full"
                                    >
                                        {tag}
                                    </span>
                                ))}
                                {node.tags.length > 4 && (
                                    <span className="text-gray-500 text-xs">+{node.tags.length - 4}</span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Children */}
            {hasChildren && isExpanded && (
                <div>
                    {node.children!
                        .filter(child => child.isVisible)
                        .sort((a, b) => a.order - b.order)
                        .map((child, index, array) => (
                            <TreeNode
                                key={child.id}
                                node={child}
                                level={level + 1}
                                isOwner={isOwner}
                                onNodeClick={onNodeClick}
                                onNodeEdit={onNodeEdit}
                                onNodeDelete={onNodeDelete}
                                onNodeAdd={onNodeAdd}
                                selectedNodeId={selectedNodeId}
                            />
                        ))}
                </div>
            )}
        </div>
    )
}

export function InteractiveTree({
    nodes,
    username,
    isOwner = false,
    onNodeClick,
    onNodeEdit,
    onNodeDelete,
    onNodeAdd,
    selectedNodeId
}: InteractiveTreeProps) {
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
        <div className="p-6 space-y-2">
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-700 to-purple-600 bg-clip-text text-transparent">{username}&apos;s Portfolio</h2>
                        <p className="text-gray-600 mt-1">
                            {isOwner
                                ? 'Navega por tu portafolio. Haz hover sobre los nodos para ver las acciones disponibles.'
                                : 'Explora el portafolio navegando por los diferentes nodos.'
                            }
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                {treeNodes.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <DocumentIcon className="h-8 w-8 text-blue-500" />
                        </div>
                        <p className="text-lg font-medium text-gray-700">No hay contenido aún</p>
                        {isOwner && (
                            <p className="mt-2">
                                <button
                                    onClick={() => onNodeAdd && onNodeAdd()}
                                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                                >
                                    Crea tu primer nodo
                                </button>
                            </p>
                        )}
                    </div>
                ) : (
                    treeNodes.map((node, index) => (
                        <TreeNode
                            key={node.id}
                            node={node}
                            isOwner={isOwner}
                            onNodeClick={onNodeClick}
                            onNodeEdit={onNodeEdit}
                            onNodeDelete={onNodeDelete}
                            onNodeAdd={onNodeAdd}
                            selectedNodeId={selectedNodeId}
                        />
                    ))
                )}
            </div>
        </div>
    )
}