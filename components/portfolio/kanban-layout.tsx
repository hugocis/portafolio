'use client'

import { Node } from '@prisma/client'
import { ViewColumnsIcon, EyeIcon, EyeSlashIcon, ArrowRightIcon, PlusIcon } from '@heroicons/react/24/outline'
import { FolderIcon, DocumentIcon, AcademicCapIcon, BriefcaseIcon, BookOpenIcon, Cog6ToothIcon, CodeBracketIcon, StarIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'

interface KanbanLayoutProps {
    nodes: Node[]
    onNodeClick?: (node: Node) => void
    isOwner?: boolean
}

const nodeTypeConfig = {
    CATEGORY: { name: 'Categorías', icon: FolderIcon, color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', gradient: 'from-blue-500 to-blue-600', lightBg: 'from-blue-50 to-blue-100' },
    PROJECT: { name: 'Proyectos', icon: DocumentIcon, color: 'text-purple-600', bgColor: 'bg-purple-50', borderColor: 'border-purple-200', gradient: 'from-purple-500 to-purple-600', lightBg: 'from-purple-50 to-purple-100' },
    LANGUAGE: { name: 'Lenguajes', icon: CodeBracketIcon, color: 'text-emerald-600', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200', gradient: 'from-emerald-500 to-emerald-600', lightBg: 'from-emerald-50 to-emerald-100' },
    SKILL: { name: 'Habilidades', icon: Cog6ToothIcon, color: 'text-indigo-600', bgColor: 'bg-indigo-50', borderColor: 'border-indigo-200', gradient: 'from-indigo-500 to-indigo-600', lightBg: 'from-indigo-50 to-indigo-100' },
    EXPERIENCE: { name: 'Experiencia', icon: BriefcaseIcon, color: 'text-rose-600', bgColor: 'bg-rose-50', borderColor: 'border-rose-200', gradient: 'from-rose-500 to-rose-600', lightBg: 'from-rose-50 to-rose-100' },
    EDUCATION: { name: 'Educación', icon: AcademicCapIcon, color: 'text-amber-600', bgColor: 'bg-amber-50', borderColor: 'border-amber-200', gradient: 'from-amber-500 to-amber-600', lightBg: 'from-amber-50 to-amber-100' },
    DOCUMENTATION: { name: 'Documentación', icon: BookOpenIcon, color: 'text-cyan-600', bgColor: 'bg-cyan-50', borderColor: 'border-cyan-200', gradient: 'from-cyan-500 to-cyan-600', lightBg: 'from-cyan-50 to-cyan-100' }
}

const columnOrder = ['PROJECT', 'EXPERIENCE', 'EDUCATION', 'SKILL', 'LANGUAGE', 'DOCUMENTATION', 'CATEGORY']

export function KanbanLayout({ nodes, onNodeClick, isOwner }: KanbanLayoutProps) {
    const [isCompact, setIsCompact] = useState(false)
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

    const getTotalVisible = () => visibleNodes.filter(n => n.isVisible).length
    const getTotalPrivate = () => visibleNodes.filter(n => !n.isVisible).length

    return (
        <div className="space-y-6">
            {/* Modern Header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 dark:from-purple-900/20 dark:via-violet-900/20 dark:to-indigo-900/20 rounded-3xl border border-purple-200/50 dark:border-purple-700/50">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-6 right-8 w-32 h-32 bg-gradient-to-br from-purple-200 to-violet-200 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-6 left-8 w-24 h-24 bg-gradient-to-br from-violet-200 to-indigo-200 rounded-full blur-2xl"></div>
                </div>
                
                <div className="relative p-8">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <div className="p-4 bg-gradient-to-br from-purple-600 to-violet-600 rounded-2xl shadow-lg">
                                        <ViewColumnsIcon className="h-8 w-8 text-white" />
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full animate-pulse"></div>
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                                        Vista Kanban
                                    </h2>
                                    <p className="text-lg text-gray-600 dark:text-gray-400">
                                        {orderedColumns.length} columna{orderedColumns.length !== 1 ? 's' : ''} • {visibleNodes.length} elemento{visibleNodes.length !== 1 ? 's' : ''} total
                                    </p>
                                </div>
                            </div>
                            
                            {/* Stats */}
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 border border-gray-200/50">
                                    <EyeIcon className="h-4 w-4 text-green-600" />
                                    <span className="text-sm font-medium text-gray-700">{getTotalVisible()} Públicos</span>
                                </div>
                                {isOwner && getTotalPrivate() > 0 && (
                                    <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 border border-gray-200/50">
                                        <EyeSlashIcon className="h-4 w-4 text-amber-600" />
                                        <span className="text-sm font-medium text-gray-700">{getTotalPrivate()} Privados</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center space-x-4">
                            <div className="flex bg-white/80 backdrop-blur-sm rounded-xl p-1 border border-gray-200/50 shadow-sm">
                                <button
                                    onClick={() => setIsCompact(false)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                        !isCompact
                                            ? 'bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-md'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    Detallado
                                </button>
                                <button
                                    onClick={() => setIsCompact(true)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                        isCompact
                                            ? 'bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-md'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    Compacto
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Kanban Board */}
            <div className="overflow-x-auto pb-6">
                <div className="flex space-x-6 min-w-full">
                    {orderedColumns.map((type, columnIndex) => {
                        const typeConfig = nodeTypeConfig[type as keyof typeof nodeTypeConfig]
                        const TypeIcon = typeConfig?.icon || DocumentIcon
                        const columnNodes = nodesByType[type] || []
                        const maxNodes = Math.max(...Object.values(nodesByType).map(arr => arr.length))

                        return (
                            <div 
                                key={type} 
                                className="flex-shrink-0 w-80 animate-fade-in-scale"
                                style={{
                                    animationDelay: `${columnIndex * 150}ms`,
                                    animationFillMode: 'both'
                                }}
                            >
                                {/* Enhanced Column Header */}
                                <div className={`rounded-t-2xl border-2 ${typeConfig?.borderColor || 'border-gray-200'} bg-gradient-to-br ${typeConfig?.lightBg || 'from-gray-50 to-gray-100'} p-6 shadow-sm relative overflow-hidden`}>
                                    {/* Header Background Pattern */}
                                    <div className="absolute inset-0 opacity-20">
                                        <div className={`absolute top-4 right-4 w-16 h-16 bg-gradient-to-r ${typeConfig?.gradient} rounded-full blur-xl animate-pulse`}></div>
                                        <div className={`absolute bottom-2 left-6 w-8 h-8 bg-gradient-to-r ${typeConfig?.gradient} rounded-full blur-lg animate-pulse`} style={{ animationDelay: '1s' }}></div>
                                    </div>

                                    <div className="relative">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center space-x-3">
                                                <div className={`p-3 rounded-xl bg-gradient-to-r ${typeConfig?.gradient} shadow-lg transform hover:scale-110 transition-transform duration-300`}>
                                                    <TypeIcon className="h-6 w-6 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900 text-lg">
                                                        {typeConfig?.name || type}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">
                                                        {columnNodes.length} elemento{columnNodes.length !== 1 ? 's' : ''}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className={`px-3 py-1 rounded-full text-sm font-bold ${typeConfig?.bgColor || 'bg-gray-50'} ${typeConfig?.color || 'text-gray-600'} border-2 border-current/20`}>
                                                {columnNodes.length}
                                            </div>
                                        </div>

                                        {/* Enhanced Progress Bar */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs text-gray-600">
                                                <span>Progreso</span>
                                                <span>{Math.round((columnNodes.length / Math.max(1, maxNodes)) * 100)}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200/80 rounded-full h-2 shadow-inner">
                                                <div
                                                    className={`h-2 rounded-full bg-gradient-to-r ${typeConfig?.gradient} shadow-sm transition-all duration-1000 ease-out`}
                                                    style={{ 
                                                        width: `${Math.min(100, (columnNodes.length / Math.max(1, maxNodes)) * 100)}%`,
                                                        transitionDelay: `${columnIndex * 200}ms`
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Enhanced Column Body */}
                                <div className={`border-2 border-t-0 ${typeConfig?.borderColor || 'border-gray-200'} rounded-b-2xl bg-gradient-to-b from-gray-50/50 to-white shadow-lg ${
                                    isCompact ? 'min-h-80 max-h-80' : 'min-h-96 max-h-96'
                                } overflow-y-auto`}>
                                    <div className="p-4 space-y-3">
                                        {columnNodes.map((node, nodeIndex) => {
                                            const isFeatured = node.tags?.includes('featured')
                                            
                                            return (
                                                <div
                                                    key={node.id}
                                                    onClick={() => handleNodeClick(node)}
                                                    className="group cursor-pointer animate-fade-in-scale"
                                                    style={{
                                                        animationDelay: `${(columnIndex * 150) + (nodeIndex * 100)}ms`,
                                                        animationFillMode: 'both'
                                                    }}
                                                >
                                                    {/* Enhanced Card */}
                                                    <div className={`relative bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200/50 p-4 shadow-sm hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-105 ${
                                                        isFeatured ? 'ring-2 ring-yellow-400/50' : ''
                                                    }`}>
                                                        {/* Featured Badge */}
                                                        {isFeatured && (
                                                            <div className="absolute -top-2 -right-2">
                                                                <div className="flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                                                                    <StarIcon className="h-3 w-3" />
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Card Header */}
                                                        <div className="flex items-start justify-between mb-3">
                                                            <h4 className={`font-bold text-gray-900 group-hover:text-blue-600 transition-colors ${
                                                                isCompact ? 'text-sm line-clamp-1' : 'text-base line-clamp-2'
                                                            }`}>
                                                                {node.title}
                                                            </h4>
                                                            <div className="flex items-center space-x-1 ml-2">
                                                                {!node.isVisible && isOwner && (
                                                                    <div className="p-1 bg-amber-100 rounded-full" title="Privado">
                                                                        <EyeSlashIcon className="h-3 w-3 text-amber-600" />
                                                                    </div>
                                                                )}
                                                                {node.isVisible && (
                                                                    <div className="p-1 bg-emerald-100 rounded-full" title="Público">
                                                                        <EyeIcon className="h-3 w-3 text-emerald-600" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Description */}
                                                        {node.description && !isCompact && (
                                                            <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                                                                {node.description}
                                                            </p>
                                                        )}

                                                        {/* Tags */}
                                                        {node.tags && node.tags.length > 0 && (
                                                            <div className={`flex flex-wrap gap-1 ${isCompact ? 'mb-2' : 'mb-3'}`}>
                                                                {node.tags.slice(0, isCompact ? 2 : 3).map((tag, tagIndex) => (
                                                                    <span
                                                                        key={tagIndex}
                                                                        className="inline-block bg-gray-100/80 backdrop-blur-sm text-gray-700 text-xs px-2 py-1 rounded-full font-medium border border-gray-200/50"
                                                                    >
                                                                        {tag}
                                                                    </span>
                                                                ))}
                                                                {node.tags.length > (isCompact ? 2 : 3) && (
                                                                    <span className="inline-block text-gray-500 text-xs px-2 py-1 font-medium">
                                                                        +{node.tags.length - (isCompact ? 2 : 3)}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}

                                                        {/* Project Indicators */}
                                                        {node.type === 'PROJECT' && (node.projectUrl || node.githubUrl || node.demoUrl) && (
                                                            <div className="flex items-center justify-between mb-3">
                                                                <div className="flex items-center space-x-2">
                                                                    {node.projectUrl && (
                                                                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" title="Sitio Web"></div>
                                                                    )}
                                                                    {node.githubUrl && (
                                                                        <div className="w-2 h-2 bg-gray-700 rounded-full animate-pulse" title="GitHub" style={{ animationDelay: '0.5s' }}></div>
                                                                    )}
                                                                    {node.demoUrl && (
                                                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" title="Demo" style={{ animationDelay: '1s' }}></div>
                                                                    )}
                                                                </div>
                                                                <span className="text-xs text-gray-500 font-medium">
                                                                    {new Date(node.createdAt).getFullYear()}
                                                                </span>
                                                            </div>
                                                        )}

                                                        {/* Date for other types */}
                                                        {node.type !== 'PROJECT' && (
                                                            <div className="flex justify-between items-center mb-3">
                                                                <span className="text-xs text-gray-500 font-medium">
                                                                    {new Date(node.createdAt).toLocaleDateString('es-ES', { 
                                                                        month: 'short', 
                                                                        year: 'numeric' 
                                                                    })}
                                                                </span>
                                                                <ArrowRightIcon className="h-3 w-3 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300" />
                                                            </div>
                                                        )}

                                                        {/* Card Footer - Enhanced Progress Indicator */}
                                                        <div className={`h-1 w-full rounded-full bg-gradient-to-r ${typeConfig?.gradient} opacity-60 group-hover:opacity-100 transition-opacity duration-300`}></div>
                                                    </div>
                                                </div>
                                            )
                                        })}

                                        {/* Enhanced Empty Column State */}
                                        {columnNodes.length === 0 && (
                                            <div className="text-center py-12">
                                                <div className={`mx-auto w-16 h-16 rounded-2xl ${typeConfig?.bgColor || 'bg-gray-100'} flex items-center justify-center mb-4 border-2 border-dashed ${typeConfig?.borderColor || 'border-gray-300'}`}>
                                                    <TypeIcon className={`h-8 w-8 ${typeConfig?.color || 'text-gray-400'}`} />
                                                </div>
                                                <p className="text-sm font-medium text-gray-600 mb-2">
                                                    Sin {typeConfig?.name?.toLowerCase() || 'elementos'}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {isOwner ? 'Agrega contenido aquí' : 'Próximamente'}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Enhanced Empty State for whole board */}
            {orderedColumns.length === 0 && (
                <div className="flex-1 flex items-center justify-center py-20">
                    <div className="text-center max-w-md mx-auto">
                        <div className="relative">
                            {/* Animated Background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-violet-100 rounded-3xl opacity-50 animate-pulse"></div>
                            
                            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-12 border border-gray-200/50 shadow-lg">
                                <div className="relative mb-6">
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-violet-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                                    <ViewColumnsIcon className="relative h-20 w-20 text-gray-400 mx-auto" />
                                </div>
                                
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                    🏗️ Tablero en Construcción
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {isOwner 
                                        ? 'Tu tablero Kanban está esperando contenido increíble. Agrega algunos elementos para organizar tu trabajo por categorías.' 
                                        : 'Este tablero Kanban está siendo preparado. Vuelve pronto para ver una organización increíble del contenido.'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}