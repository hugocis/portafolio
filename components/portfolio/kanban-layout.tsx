'use client'

import { Node } from '@prisma/client'
import { ViewColumnsIcon } from '@heroicons/react/24/outline'
import { FolderIcon, DocumentIcon, AcademicCapIcon, BriefcaseIcon, BookOpenIcon, Cog6ToothIcon, CodeBracketIcon } from '@heroicons/react/24/solid'

interface KanbanLayoutProps {
    nodes: Node[]
    onNodeClick?: (node: Node) => void
    isOwner?: boolean
}

const nodeTypeConfig = {
    CATEGORY: { name: 'Categoría', icon: FolderIcon, color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
    PROJECT: { name: 'Proyecto', icon: DocumentIcon, color: 'text-purple-600', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
    LANGUAGE: { name: 'Lenguaje', icon: CodeBracketIcon, color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
    SKILL: { name: 'Habilidad', icon: Cog6ToothIcon, color: 'text-indigo-600', bgColor: 'bg-indigo-50', borderColor: 'border-indigo-200' },
    EXPERIENCE: { name: 'Experiencia', icon: BriefcaseIcon, color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
    EDUCATION: { name: 'Educación', icon: AcademicCapIcon, color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' },
    DOCUMENTATION: { name: 'Documentación', icon: BookOpenIcon, color: 'text-cyan-600', bgColor: 'bg-cyan-50', borderColor: 'border-cyan-200' }
}

const columnOrder = ['PROJECT', 'EXPERIENCE', 'EDUCATION', 'SKILL', 'LANGUAGE', 'DOCUMENTATION', 'CATEGORY']

export function KanbanLayout({ nodes, onNodeClick, isOwner }: KanbanLayoutProps) {

    const visibleNodes = nodes.filter(node => node.isVisible || isOwner)

    // Agrupar nodos por tipo
    const nodesByType = visibleNodes.reduce((acc, node) => {
        if (!acc[node.type]) {
            acc[node.type] = []
        }
        acc[node.type].push(node)
        return acc
    }, {} as Record<string, Node[]>)

    // Ordenar las columnas según el orden definido
    const orderedColumns = columnOrder.filter(type => nodesByType[type]?.length > 0)

    const handleNodeClick = (node: Node) => {
        onNodeClick?.(node)
    }

    return (
        <div className="h-full">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-gradient-to-r from-purple-600 to-violet-600 rounded-lg">
                        <ViewColumnsIcon className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Vista Kanban</h2>
                </div>
                <p className="text-gray-600">
                    Organizado por categorías • {visibleNodes.length} elemento{visibleNodes.length !== 1 ? 's' : ''} total{orderedColumns.length > 0 ? ` en ${orderedColumns.length} columna${orderedColumns.length !== 1 ? 's' : ''}` : ''}
                </p>
            </div>

            {/* Kanban Board */}
            <div className="flex space-x-6 overflow-x-auto pb-6 min-h-96">
                {orderedColumns.map((type) => {
                    const typeConfig = nodeTypeConfig[type as keyof typeof nodeTypeConfig]
                    const TypeIcon = typeConfig?.icon || DocumentIcon
                    const columnNodes = nodesByType[type] || []

                    return (
                        <div key={type} className="flex-shrink-0 w-80">
                            {/* Column Header */}
                            <div className={`rounded-t-xl border-2 ${typeConfig?.borderColor || 'border-gray-200'} bg-white p-4 shadow-sm`}>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-3">
                                        <div className={`p-2 rounded-lg ${typeConfig?.bgColor || 'bg-gray-50'}`}>
                                            <TypeIcon className={`h-5 w-5 ${typeConfig?.color || 'text-gray-600'}`} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">
                                                {typeConfig?.name || type}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {columnNodes.length} elemento{columnNodes.length !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${typeConfig?.bgColor || 'bg-gray-50'} ${typeConfig?.color || 'text-gray-600'}`}>
                                        {columnNodes.length}
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full bg-gray-200 rounded-full h-1">
                                    <div
                                        className={`h-1 rounded-full bg-gradient-to-r ${type === 'PROJECT' ? 'from-purple-400 to-purple-600' :
                                            type === 'EXPERIENCE' ? 'from-red-400 to-red-600' :
                                                type === 'EDUCATION' ? 'from-orange-400 to-orange-600' :
                                                    type === 'SKILL' ? 'from-indigo-400 to-indigo-600' :
                                                        type === 'LANGUAGE' ? 'from-green-400 to-green-600' :
                                                            'from-gray-400 to-gray-600'
                                            }`}
                                        style={{ width: `${Math.min(100, (columnNodes.length / Math.max(1, Math.max(...Object.values(nodesByType).map(arr => arr.length)))) * 100)}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Column Body */}
                            <div className={`border-2 border-t-0 ${typeConfig?.borderColor || 'border-gray-200'} rounded-b-xl bg-gradient-to-b ${typeConfig?.bgColor || 'bg-gray-50'}/30 to-white min-h-96 max-h-96 overflow-y-auto`}>
                                <div className="p-4 space-y-3">
                                    {columnNodes.map((node) => (
                                        <div
                                            key={node.id}
                                            onClick={() => handleNodeClick(node)}
                                            className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group hover:-translate-y-1"
                                        >
                                            {/* Card Header */}
                                            <div className="flex items-start justify-between mb-3">
                                                <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                                                    {node.title}
                                                </h4>
                                                {!node.isVisible && isOwner && (
                                                    <div className="flex-shrink-0 w-2 h-2 bg-yellow-400 rounded-full ml-2 mt-1" title="Privado"></div>
                                                )}
                                            </div>

                                            {/* Description */}
                                            {node.description && (
                                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                                    {node.description}
                                                </p>
                                            )}

                                            {/* Tags */}
                                            {node.tags && node.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mb-3">
                                                    {node.tags.slice(0, 3).map((tag, index) => (
                                                        <span
                                                            key={index}
                                                            className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                    {node.tags.length > 3 && (
                                                        <span className="inline-block text-gray-500 text-xs px-2 py-1">
                                                            +{node.tags.length - 3}
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            {/* Project Indicators */}
                                            {node.type === 'PROJECT' && (
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-2">
                                                        {node.projectUrl && (
                                                            <div className="w-2 h-2 bg-green-500 rounded-full" title="Sitio Web"></div>
                                                        )}
                                                        {node.githubUrl && (
                                                            <div className="w-2 h-2 bg-gray-700 rounded-full" title="GitHub"></div>
                                                        )}
                                                        {node.demoUrl && (
                                                            <div className="w-2 h-2 bg-blue-500 rounded-full" title="Demo"></div>
                                                        )}
                                                    </div>
                                                    <span className="text-xs text-gray-400">
                                                        {new Date(node.createdAt).getFullYear()}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Date for other types */}
                                            {node.type !== 'PROJECT' && (
                                                <div className="flex justify-end">
                                                    <span className="text-xs text-gray-400">
                                                        {new Date(node.createdAt).toLocaleDateString('es-ES')}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Card Footer - Progress Indicator */}
                                            <div className={`mt-3 h-1 w-full rounded-full bg-gradient-to-r ${type === 'PROJECT' ? 'from-purple-200 to-purple-400' :
                                                type === 'EXPERIENCE' ? 'from-red-200 to-red-400' :
                                                    type === 'EDUCATION' ? 'from-orange-200 to-orange-400' :
                                                        type === 'SKILL' ? 'from-indigo-200 to-indigo-400' :
                                                            type === 'LANGUAGE' ? 'from-green-200 to-green-400' :
                                                                'from-gray-200 to-gray-400'
                                                }`}></div>
                                        </div>
                                    ))}

                                    {/* Empty Column State */}
                                    {columnNodes.length === 0 && (
                                        <div className="text-center py-8">
                                            <div className={`mx-auto w-12 h-12 rounded-full ${typeConfig?.bgColor || 'bg-gray-100'} flex items-center justify-center mb-3`}>
                                                <TypeIcon className={`h-6 w-6 ${typeConfig?.color || 'text-gray-400'}`} />
                                            </div>
                                            <p className="text-sm text-gray-500">
                                                Sin {typeConfig?.name?.toLowerCase() || 'elementos'}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                })}

                {/* Empty State for whole board */}
                {orderedColumns.length === 0 && (
                    <div className="flex-1 flex items-center justify-center py-20">
                        <div className="text-center">
                            <ViewColumnsIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Tablero Vacío
                            </h3>
                            <p className="text-gray-500 mb-4">
                                {isOwner ? 'Agrega algunos nodos para organizar tu contenido' : 'No hay elementos visibles en este portfolio'}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}