'use client'

import { useState } from 'react'
import { Node } from '@prisma/client'
import {
    ChevronRightIcon,
    ChevronDownIcon,
    PlusIcon,
    PencilIcon,
    TrashIcon,
    EyeIcon,
    EyeSlashIcon,
    MagnifyingGlassIcon,
    XMarkIcon,
    Squares2X2Icon
} from '@heroicons/react/24/outline'
import {
    FolderIcon,
    DocumentIcon,
    CodeBracketIcon,
    AcademicCapIcon,
    BriefcaseIcon,
    Cog6ToothIcon,
    BookOpenIcon,
    StarIcon
} from '@heroicons/react/24/solid'

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

const nodeTypeConfig = {
    CATEGORY: {
        name: 'Categoría',
        icon: FolderIcon,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        gradient: 'from-blue-500 to-blue-600',
        lightBg: 'from-blue-50 to-blue-100'
    },
    PROJECT: {
        name: 'Proyecto',
        icon: DocumentIcon,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200',
        gradient: 'from-purple-500 to-purple-600',
        lightBg: 'from-purple-50 to-purple-100'
    },
    LANGUAGE: {
        name: 'Lenguaje',
        icon: CodeBracketIcon,
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-200',
        gradient: 'from-emerald-500 to-emerald-600',
        lightBg: 'from-emerald-50 to-emerald-100'
    },
    SKILL: {
        name: 'Habilidad',
        icon: Cog6ToothIcon,
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-50',
        borderColor: 'border-indigo-200',
        gradient: 'from-indigo-500 to-indigo-600',
        lightBg: 'from-indigo-50 to-indigo-100'
    },
    EXPERIENCE: {
        name: 'Experiencia',
        icon: BriefcaseIcon,
        color: 'text-rose-600',
        bgColor: 'bg-rose-50',
        borderColor: 'border-rose-200',
        gradient: 'from-rose-500 to-rose-600',
        lightBg: 'from-rose-50 to-rose-100'
    },
    EDUCATION: {
        name: 'Educación',
        icon: AcademicCapIcon,
        color: 'text-amber-600',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        gradient: 'from-amber-500 to-amber-600',
        lightBg: 'from-amber-50 to-amber-100'
    },
    DOCUMENTATION: {
        name: 'Documentación',
        icon: BookOpenIcon,
        color: 'text-cyan-600',
        bgColor: 'bg-cyan-50',
        borderColor: 'border-cyan-200',
        gradient: 'from-cyan-500 to-cyan-600',
        lightBg: 'from-cyan-50 to-cyan-100'
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
    selectedNodeId,
    searchTerm = ''
}: {
    node: NodeWithChildren
    level?: number
    isOwner?: boolean
    onNodeClick?: (node: Node) => void
    onNodeEdit?: (node: Node) => void
    onNodeDelete?: (nodeId: string) => void
    onNodeAdd?: (parentId?: string) => void
    selectedNodeId?: string
    searchTerm?: string
}) {
    const [isExpanded, setIsExpanded] = useState(true)
    const [showActions, setShowActions] = useState(false)
    const hasChildren = node.children && node.children.length > 0
    const typeConfig = nodeTypeConfig[node.type as keyof typeof nodeTypeConfig] || nodeTypeConfig.PROJECT
    const Icon = typeConfig.icon
    const isSelected = selectedNodeId === node.id
    const isFeatured = node.tags?.includes('featured')
    const isHighlighted = searchTerm && node.title.toLowerCase().includes(searchTerm.toLowerCase())

    return (
        <div className={`relative transition-all duration-200 ${isHighlighted ? 'bg-yellow-50/50 border border-yellow-200/50 rounded-xl' : ''}`}>
            {/* Clean Tree connections */}
            <div className="flex items-center">
                {/* Elegant indentation */}
                {level > 0 && (
                    <div className="flex items-center">
                        {Array.from({ length: level - 1 }).map((_, index) => (
                            <div key={index} className="w-7 flex justify-center">
                                <div className="w-px bg-gray-200 h-full opacity-60"></div>
                            </div>
                        ))}
                        <div className="w-7 flex items-center justify-start relative">
                            <div className="w-5 border-t border-gray-300 border-dashed opacity-60"></div>
                            <div className="absolute left-0 w-px h-6 bg-gray-200 -top-3 opacity-60"></div>
                        </div>
                    </div>
                )}

                {/* Styled Node content */}
                <div
                    className={`flex-1 flex items-center p-4 rounded-xl transition-all duration-300 cursor-pointer group relative overflow-hidden ${isSelected
                            ? `bg-gradient-to-r ${typeConfig.lightBg} border ${typeConfig.borderColor} shadow-md`
                            : 'hover:bg-gray-50/80 hover:shadow-sm'
                        } ${isFeatured ? 'ring-1 ring-yellow-300/50' : ''}`}
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
                    {/* Subtle background pattern */}
                    {isSelected && (
                        <div className="absolute inset-0 opacity-5">
                            <div className={`absolute top-4 right-4 w-12 h-12 bg-gradient-to-r ${typeConfig.gradient} rounded-full blur-xl`}></div>
                        </div>
                    )}

                    <div className="relative flex items-center w-full">
                        {/* Clean Expand/Collapse button */}
                        {hasChildren && (
                            <button
                                className="mr-3 p-1.5 rounded-lg hover:bg-white/80 hover:shadow-sm transition-all duration-200"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setIsExpanded(!isExpanded)
                                }}
                            >
                                {isExpanded ? (
                                    <ChevronDownIcon className={`h-4 w-4 ${typeConfig.color} transition-transform duration-200`} />
                                ) : (
                                    <ChevronRightIcon className={`h-4 w-4 ${typeConfig.color} transition-transform duration-200`} />
                                )}
                            </button>
                        )}

                        {!hasChildren && <div className="w-9" />}

                        {/* Styled Node icon */}
                        <div className={`relative p-2.5 rounded-lg ${typeConfig.bgColor} mr-4 shadow-sm group-hover:shadow-md transition-all duration-300`}>
                            <Icon className={`h-5 w-5 ${typeConfig.color}`} />
                            {isFeatured && (
                                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                                    <StarIcon className="h-2 w-2 text-white" />
                                </div>
                            )}
                        </div>

                        {/* Clean Node content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <span className={`font-semibold text-lg ${isSelected ? 'text-gray-900' : 'text-gray-800 group-hover:text-gray-900'
                                            } transition-colors`}>
                                            {node.title}
                                        </span>
                                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${typeConfig.bgColor} ${typeConfig.color}`}>
                                            {typeConfig.name}
                                        </span>
                                        <div className="flex items-center space-x-1">
                                            {!node.isVisible && isOwner && (
                                                <div className="flex items-center space-x-1 bg-amber-50 rounded-full px-2 py-1 border border-amber-200" title="Privado">
                                                    <EyeSlashIcon className="h-3 w-3 text-amber-600" />
                                                    <span className="text-xs font-medium text-amber-700">Privado</span>
                                                </div>
                                            )}
                                            {node.isVisible && (
                                                <div className="flex items-center space-x-1 bg-emerald-50 rounded-full px-2 py-1 border border-emerald-200" title="Público">
                                                    <EyeIcon className="h-3 w-3 text-emerald-600" />
                                                    <span className="text-xs font-medium text-emerald-700">Público</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {node.description && (
                                        <p className="text-sm text-gray-600 leading-relaxed mb-2 line-clamp-2">
                                            {node.description}
                                        </p>
                                    )}
                                    {hasChildren && (
                                        <p className="text-xs text-gray-500 font-medium">
                                            {node.children!.filter(child => child.isVisible || isOwner).length} elemento{node.children!.filter(child => child.isVisible || isOwner).length !== 1 ? 's' : ''} hijo{node.children!.filter(child => child.isVisible || isOwner).length !== 1 ? 's' : ''}
                                        </p>
                                    )}
                                </div>

                                {/* Styled Action buttons */}
                                {isOwner && (showActions || isSelected) && (
                                    <div className="flex items-center space-x-2 ml-4">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                if (onNodeAdd) onNodeAdd(node.id)
                                            }}
                                            className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:shadow-sm transition-all duration-200"
                                            title="Añadir elemento hijo"
                                        >
                                            <PlusIcon className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                if (onNodeEdit) onNodeEdit(node)
                                            }}
                                            className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 hover:shadow-sm transition-all duration-200"
                                            title="Editar"
                                        >
                                            <PencilIcon className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                if (onNodeDelete && confirm('¿Eliminar este elemento y todos sus hijos?')) {
                                                    onNodeDelete(node.id)
                                                }
                                            }}
                                            className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 hover:shadow-sm transition-all duration-200"
                                            title="Eliminar"
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}

                                {/* Styled View button for non-owners */}
                                {!isOwner && (showActions || isSelected) && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            if (onNodeClick) onNodeClick(node)
                                        }}
                                        className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 hover:shadow-sm transition-all duration-200 ml-4"
                                        title="Ver detalles"
                                    >
                                        <EyeIcon className="h-4 w-4" />
                                    </button>
                                )}
                            </div>

                            {/* Clean Tags */}
                            {node.tags && node.tags.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {node.tags.slice(0, 4).map((tag, index) => (
                                        <span
                                            key={index}
                                            className="inline-block bg-gray-100/80 text-gray-700 text-xs px-3 py-1 rounded-full font-medium hover:bg-gray-200/80 transition-colors"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                    {node.tags.length > 4 && (
                                        <span className="text-gray-500 text-xs px-3 py-1 font-medium">
                                            +{node.tags.length - 4} más
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Children */}
            {hasChildren && isExpanded && (
                <div className="mt-2">
                    {node.children!
                        .filter(child => child.isVisible || isOwner)
                        .sort((a, b) => a.order - b.order)
                        .map((child) => (
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
                                searchTerm={searchTerm}
                            />
                        ))}
                </div>
            )}
        </div>
    )
}

export function InteractiveTree({
    nodes,
    isOwner = false,
    onNodeClick,
    onNodeEdit,
    onNodeDelete,
    onNodeAdd,
    selectedNodeId
}: InteractiveTreeProps) {
    const [searchTerm, setSearchTerm] = useState('')

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

    // Filter nodes by search only
    const filteredNodes = nodes.filter(node => {
        const matchesSearch = !searchTerm ||
            node.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            node.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            node.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))

        const isVisible = node.isVisible || isOwner

        return matchesSearch && isVisible
    })

    const treeNodes = buildTree(filteredNodes)
        .sort((a, b) => a.order - b.order)

    const getTotalNodes = () => nodes.filter(node => node.isVisible || isOwner).length
    const getVisibleNodes = () => nodes.filter(node => node.isVisible).length
    const getPrivateNodes = () => nodes.filter(node => !node.isVisible).length

    return (
        <div className="space-y-6">
            {/* Professional Header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-900/20 dark:via-green-900/20 dark:to-teal-900/20 rounded-2xl border border-emerald-200/50 dark:border-emerald-700/50">
                {/* Subtle Background Pattern */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-6 right-8 w-24 h-24 bg-gradient-to-br from-emerald-200 to-green-200 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-6 left-8 w-16 h-16 bg-gradient-to-br from-green-200 to-teal-200 rounded-full blur-xl"></div>
                </div>

                <div className="relative p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="space-y-3">
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <div className="p-3 bg-gradient-to-br from-emerald-600 to-green-600 rounded-xl shadow-lg">
                                        <Squares2X2Icon className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                                        Árbol de Portfolio
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {getTotalNodes()} elemento{getTotalNodes() !== 1 ? 's' : ''} total
                                        {filteredNodes.length !== getTotalNodes() && ` • ${filteredNodes.length} mostrado${filteredNodes.length !== 1 ? 's' : ''}`}
                                    </p>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-gray-200/50">
                                    <EyeIcon className="h-4 w-4 text-emerald-600" />
                                    <span className="text-sm font-medium text-gray-700">{getVisibleNodes()} Públicos</span>
                                </div>
                                {isOwner && getPrivateNodes() > 0 && (
                                    <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-gray-200/50">
                                        <EyeSlashIcon className="h-4 w-4 text-amber-600" />
                                        <span className="text-sm font-medium text-gray-700">{getPrivateNodes()} Privados</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Search Only */}
                        <div className="flex items-center">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Buscar en el árbol..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full sm:w-64 pl-10 pr-10 py-2.5 border border-gray-200/50 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        <XMarkIcon className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tree Content */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm overflow-hidden">
                <div className="p-6 space-y-3">
                    {treeNodes.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="max-w-md mx-auto">
                                <div className="relative mb-8">
                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-green-100 rounded-2xl opacity-50"></div>

                                    <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 shadow-sm">
                                        <div className="relative mb-6">
                                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full blur-2xl opacity-20"></div>
                                            <Squares2X2Icon className="relative h-16 w-16 text-gray-400 mx-auto" />
                                        </div>

                                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                                            {searchTerm ? 'Sin Resultados' : 'Árbol Vacío'}
                                        </h3>
                                        <p className="text-gray-600 mb-6 leading-relaxed">
                                            {searchTerm ? (
                                                `No se encontraron elementos que coincidan con "${searchTerm}".`
                                            ) : isOwner ? (
                                                'Tu árbol de portfolio está listo para crecer. Agrega tu primer elemento y comienza a construir tu historia profesional.'
                                            ) : (
                                                'Este portfolio está creciendo. Vuelve pronto para ver contenido increíble.'
                                            )}
                                        </p>
                                        {searchTerm ? (
                                            <button
                                                onClick={() => setSearchTerm('')}
                                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                                            >
                                                <XMarkIcon className="h-5 w-5 mr-2" />
                                                Limpiar Búsqueda
                                            </button>
                                        ) : isOwner && (
                                            <button
                                                onClick={() => onNodeAdd && onNodeAdd()}
                                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                                            >
                                                <PlusIcon className="h-5 w-5 mr-2" />
                                                Crear Primer Elemento
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        treeNodes.map((node) => (
                            <TreeNode
                                key={node.id}
                                node={node}
                                isOwner={isOwner}
                                onNodeClick={onNodeClick}
                                onNodeEdit={onNodeEdit}
                                onNodeDelete={onNodeDelete}
                                onNodeAdd={onNodeAdd}
                                selectedNodeId={selectedNodeId}
                                searchTerm={searchTerm}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}