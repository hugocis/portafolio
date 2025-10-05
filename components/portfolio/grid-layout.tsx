'use client'

import { Node } from '@prisma/client'
import { useState } from 'react'
import { Squares2X2Icon, EyeIcon, EyeSlashIcon, LinkIcon } from '@heroicons/react/24/outline'
import { FolderIcon, DocumentIcon, AcademicCapIcon, BriefcaseIcon, BookOpenIcon, Cog6ToothIcon, CodeBracketIcon, StarIcon } from '@heroicons/react/24/solid'

interface GridLayoutProps {
    nodes: Node[]
    onNodeClick?: (node: Node) => void
    isOwner?: boolean
}

const nodeTypeConfig = {
    CATEGORY: { name: 'Categoría', icon: FolderIcon, color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', gradient: 'from-blue-500 to-blue-600', lightGradient: 'from-blue-100 to-blue-200' },
    PROJECT: { name: 'Proyecto', icon: DocumentIcon, color: 'text-purple-600', bgColor: 'bg-purple-50', borderColor: 'border-purple-200', gradient: 'from-purple-500 to-purple-600', lightGradient: 'from-purple-100 to-purple-200' },
    LANGUAGE: { name: 'Lenguaje', icon: CodeBracketIcon, color: 'text-emerald-600', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200', gradient: 'from-emerald-500 to-emerald-600', lightGradient: 'from-emerald-100 to-emerald-200' },
    SKILL: { name: 'Habilidad', icon: Cog6ToothIcon, color: 'text-indigo-600', bgColor: 'bg-indigo-50', borderColor: 'border-indigo-200', gradient: 'from-indigo-500 to-indigo-600', lightGradient: 'from-indigo-100 to-indigo-200' },
    EXPERIENCE: { name: 'Experiencia', icon: BriefcaseIcon, color: 'text-rose-600', bgColor: 'bg-rose-50', borderColor: 'border-rose-200', gradient: 'from-rose-500 to-rose-600', lightGradient: 'from-rose-100 to-rose-200' },
    EDUCATION: { name: 'Educación', icon: AcademicCapIcon, color: 'text-amber-600', bgColor: 'bg-amber-50', borderColor: 'border-amber-200', gradient: 'from-amber-500 to-amber-600', lightGradient: 'from-amber-100 to-amber-200' },
    DOCUMENTATION: { name: 'Documentación', icon: BookOpenIcon, color: 'text-cyan-600', bgColor: 'bg-cyan-50', borderColor: 'border-cyan-200', gradient: 'from-cyan-500 to-cyan-600', lightGradient: 'from-cyan-100 to-cyan-200' }
}

export function GridLayout({ nodes, onNodeClick, isOwner }: GridLayoutProps) {
    const [filter, setFilter] = useState<string>('all')
    const [viewMode, setViewMode] = useState<'compact' | 'detailed'>('detailed')

    const visibleNodes = nodes.filter(node => node.isVisible || isOwner)
    
    // Build hierarchy: group children under categories
    const buildHierarchy = () => {
        const nodeMap = new Map<string, Node & { children: Node[] }>()
        const roots: (Node & { children: Node[] })[] = []
        
        // First pass: create all nodes with empty children array
        visibleNodes.forEach(node => {
            nodeMap.set(node.id, { ...node, children: [] })
        })
        
        // Second pass: build parent-child relationships
        visibleNodes.forEach(node => {
            const nodeWithChildren = nodeMap.get(node.id)!
            if (node.parentId && nodeMap.has(node.parentId)) {
                const parent = nodeMap.get(node.parentId)!
                parent.children.push(nodeWithChildren)
            } else {
                roots.push(nodeWithChildren)
            }
        })
        
        return roots
    }
    
    const hierarchicalNodes = buildHierarchy()
    const filteredNodes = filter === 'all'
        ? hierarchicalNodes
        : hierarchicalNodes.filter(node => {
            // Show node if it matches filter or has children that match
            if (node.type === filter) return true
            if (node.children && node.children.length > 0) {
                return node.children.some(c => c.type === filter)
            }
            return false
        })

    const handleNodeClick = (node: Node) => {
        onNodeClick?.(node)
    }

    // Obtener tipos únicos para el filtro
    const availableTypes = Array.from(new Set(visibleNodes.map(node => node.type)))

    return (
        <div className="space-y-6">
            {/* Modern Header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-orange-900/20 dark:via-red-900/20 dark:to-pink-900/20 rounded-3xl border border-orange-200/50 dark:border-orange-700/50">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-6 right-8 w-32 h-32 bg-gradient-to-br from-orange-200 to-red-200 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-6 left-8 w-24 h-24 bg-gradient-to-br from-red-200 to-pink-200 rounded-full blur-2xl"></div>
                </div>
                
                <div className="relative p-8">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <div className="p-4 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-lg">
                                        <Squares2X2Icon className="h-8 w-8 text-white" />
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                                        Vista Grid
                                    </h2>
                                    <p className="text-lg text-gray-600 dark:text-gray-400">
                                        {filteredNodes.length} elemento{filteredNodes.length !== 1 ? 's' : ''}
                                        {filter !== 'all' ? ` • ${nodeTypeConfig[filter as keyof typeof nodeTypeConfig]?.name}` : ' • Todos los tipos'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                            {/* View Mode Toggle */}
                            <div className="flex bg-white/80 backdrop-blur-sm rounded-xl p-1 border border-gray-200/50 shadow-sm">
                                <button
                                    onClick={() => setViewMode('detailed')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                        viewMode === 'detailed'
                                            ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-md'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    Detallado
                                </button>
                                <button
                                    onClick={() => setViewMode('compact')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                        viewMode === 'compact'
                                            ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-md'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    Compacto
                                </button>
                            </div>

                            {/* Type Filters */}
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setFilter('all')}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                                        filter === 'all'
                                            ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg'
                                            : 'bg-white/80 backdrop-blur-sm text-gray-600 border border-gray-200/50 hover:bg-white hover:shadow-md'
                                    }`}
                                >
                                    Todos
                                </button>
                                {availableTypes.slice(0, 4).map((type) => {
                                    const typeConfig = nodeTypeConfig[type as keyof typeof nodeTypeConfig]
                                    const TypeIcon = typeConfig?.icon || DocumentIcon

                                    return (
                                        <button
                                            key={type}
                                            onClick={() => setFilter(type)}
                                            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                                                filter === type
                                                    ? `bg-gradient-to-r ${typeConfig?.gradient} text-white shadow-lg`
                                                    : 'bg-white/80 backdrop-blur-sm text-gray-600 border border-gray-200/50 hover:bg-white hover:shadow-md'
                                            }`}
                                        >
                                            <TypeIcon className="h-4 w-4" />
                                            <span className="hidden sm:inline">{typeConfig?.name}</span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Grid */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                {filteredNodes.map((node, index) => {
                    const typeConfig = nodeTypeConfig[node.type as keyof typeof nodeTypeConfig]
                    const TypeIcon = typeConfig?.icon || DocumentIcon
                    const isFeatured = node.tags?.includes('featured')
                    const hasChildren = 'children' in node && node.children && node.children.length > 0

                    return (
                        <div
                            key={node.id}
                            onClick={() => handleNodeClick(node)}
                            className="group animate-fade-in-scale cursor-pointer"
                            style={{
                                animationDelay: `${index * 100}ms`,
                                animationFillMode: 'both'
                            }}
                        >
                            {/* Enhanced Card */}
                            <div className={`relative bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden ${
                                isFeatured ? 'ring-2 ring-yellow-400/50' : ''
                            }`}>
                                {/* Featured Badge */}
                                {isFeatured && (
                                    <div className="absolute top-4 right-4 z-10">
                                        <div className="flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                            <StarIcon className="h-3 w-3" />
                                            <span>Featured</span>
                                        </div>
                                    </div>
                                )}

                                {/* Gradient Header */}
                                <div className={`relative p-6 bg-gradient-to-br ${typeConfig?.lightGradient || 'from-gray-100 to-gray-200'} overflow-hidden`}>
                                    {/* Animated Background Elements */}
                                    <div className="absolute inset-0 opacity-20">
                                        <div className={`absolute top-4 right-4 w-16 h-16 bg-gradient-to-r ${typeConfig?.gradient} rounded-full blur-xl animate-pulse`}></div>
                                        <div className={`absolute bottom-4 left-4 w-8 h-8 bg-gradient-to-r ${typeConfig?.gradient} rounded-full blur-lg animate-pulse`} style={{ animationDelay: '1s' }}></div>
                                    </div>

                                    <div className="relative">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`relative p-3 rounded-xl bg-gradient-to-r ${typeConfig?.gradient} shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                                                <TypeIcon className="h-6 w-6 text-white" />
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                {!node.isVisible && isOwner && (
                                                    <div className="p-1 bg-yellow-100 rounded-full" title="Privado">
                                                        <EyeSlashIcon className="h-3 w-3 text-yellow-600" />
                                                    </div>
                                                )}
                                                {node.isVisible && (
                                                    <div className="p-1 bg-green-100 rounded-full" title="Público">
                                                        <EyeIcon className="h-3 w-3 text-green-600" />
                                                    </div>
                                                )}
                                                <span className={`text-xs font-bold px-3 py-1 rounded-full ${typeConfig?.bgColor} ${typeConfig?.color} border border-current/20`}>
                                                    {typeConfig?.name}
                                                </span>
                                            </div>
                                        </div>

                                        <h3 className={`font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 ${
                                            viewMode === 'compact' ? 'text-base line-clamp-2' : 'text-lg line-clamp-2'
                                        }`}>
                                            {node.title}
                                        </h3>
                                    </div>
                                </div>

                                {/* Body Content */}
                                <div className={`p-6 ${viewMode === 'compact' ? 'space-y-3' : 'space-y-4'}`}>
                                    {/* Description */}
                                    {node.description && viewMode === 'detailed' && (
                                        <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                                            {node.description}
                                        </p>
                                    )}

                                    {/* Tags */}
                                    {node.tags && node.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {node.tags.slice(0, viewMode === 'compact' ? 2 : 4).map((tag, tagIndex) => (
                                                <span
                                                    key={tagIndex}
                                                    className="inline-block bg-gray-100/80 backdrop-blur-sm text-gray-700 text-xs px-3 py-1 rounded-full font-medium border border-gray-200/50 hover:bg-gray-200/80 transition-colors"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                            {node.tags.length > (viewMode === 'compact' ? 2 : 4) && (
                                                <span className="inline-block text-gray-500 text-xs px-3 py-1 font-medium">
                                                    +{node.tags.length - (viewMode === 'compact' ? 2 : 4)}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Project Links */}
                                    {node.type === 'PROJECT' && (node.projectUrl || node.githubUrl || node.demoUrl) && (
                                        <div className={`grid gap-2 ${
                                            viewMode === 'compact' ? 'grid-cols-3' : 'grid-cols-3'
                                        }`}>
                                            {node.projectUrl && (
                                                <div className="text-center p-2 bg-emerald-50 rounded-lg border border-emerald-200/50 hover:bg-emerald-100 transition-colors">
                                                    <LinkIcon className="h-4 w-4 text-emerald-600 mx-auto mb-1" />
                                                    <span className="text-xs text-emerald-700 font-medium">Web</span>
                                                </div>
                                            )}
                                            {node.githubUrl && (
                                                <div className="text-center p-2 bg-gray-50 rounded-lg border border-gray-200/50 hover:bg-gray-100 transition-colors">
                                                    <div className="w-4 h-4 bg-gray-700 rounded-sm mx-auto mb-1"></div>
                                                    <span className="text-xs text-gray-700 font-medium">GitHub</span>
                                                </div>
                                            )}
                                            {node.demoUrl && (
                                                <div className="text-center p-2 bg-blue-50 rounded-lg border border-blue-200/50 hover:bg-blue-100 transition-colors">
                                                    <div className="w-4 h-4 bg-blue-500 rounded-full mx-auto mb-1"></div>
                                                    <span className="text-xs text-blue-700 font-medium">Demo</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Children Preview */}
                                    {hasChildren && 'children' in node && node.children && node.children.length > 0 && (
                                        <div className="pt-4 border-t border-gray-200/50">
                                            <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center">
                                                <div className={`w-1 h-4 bg-gradient-to-b ${typeConfig?.gradient} rounded-full mr-2`}></div>
                                                Contenido ({node.children.length})
                                            </h4>
                                            <div className="grid gap-2 grid-cols-1">
                                                {node.children.slice(0, viewMode === 'compact' ? 2 : 3).map((child) => {
                                                    const childConfig = nodeTypeConfig[child.type as keyof typeof nodeTypeConfig]
                                                    const ChildIcon = childConfig?.icon || DocumentIcon
                                                    
                                                    return (
                                                        <div
                                                            key={child.id}
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                handleNodeClick(child)
                                                            }}
                                                            className="p-3 bg-gray-50/80 rounded-xl border border-gray-200/50 hover:bg-white hover:shadow-md transition-all duration-200 cursor-pointer group/child"
                                                        >
                                                            <div className="flex items-start space-x-3">
                                                                <div className={`p-2 rounded-lg ${childConfig?.bgColor} flex-shrink-0`}>
                                                                    <ChildIcon className={`h-4 w-4 ${childConfig?.color}`} />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <h5 className="font-semibold text-sm text-gray-900 truncate group-hover/child:text-blue-600">
                                                                        {child.title}
                                                                    </h5>
                                                                    {child.description && viewMode === 'detailed' && (
                                                                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                                                            {child.description}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                                {node.children.length > (viewMode === 'compact' ? 2 : 3) && (
                                                    <div className="text-center py-2 text-xs text-gray-500 font-medium">
                                                        +{node.children.length - (viewMode === 'compact' ? 2 : 3)} más
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100/50">
                                        <span className="text-xs text-gray-500 font-medium">
                                            {new Date(node.createdAt).toLocaleDateString('es-ES', { 
                                                year: 'numeric', 
                                                month: 'short' 
                                            })}
                                        </span>
                                        <div className="flex items-center space-x-2">
                                            <div className={`w-8 h-1 rounded-full bg-gradient-to-r ${typeConfig?.gradient}`}></div>
                                            <svg className="h-4 w-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>            {/* Enhanced Empty State */}
            {filteredNodes.length === 0 && (
                <div className="text-center py-20">
                    <div className="relative max-w-md mx-auto">
                        {/* Animated Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-red-100 rounded-3xl opacity-50 animate-pulse"></div>
                        
                        <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-12 border border-gray-200/50 shadow-lg">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                                <Squares2X2Icon className="relative h-20 w-20 text-gray-400 mx-auto mb-6" />
                            </div>
                            
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                {filter === 'all' ? '🎨 Grid Vacío' : `🔍 Sin ${nodeTypeConfig[filter as keyof typeof nodeTypeConfig]?.name}`}
                            </h3>
                            <p className="text-gray-600 mb-8 leading-relaxed">
                                {isOwner
                                    ? filter === 'all'
                                        ? 'Tu grid está esperando contenido increíble. ¡Agrega tu primer elemento y comienza a construir tu portfolio visual!'
                                        : `Aún no tienes elementos de tipo ${nodeTypeConfig[filter as keyof typeof nodeTypeConfig]?.name?.toLowerCase()}. ¡Crea uno para verlo aquí!`
                                    : filter === 'all'
                                        ? 'Este portfolio está en construcción. Vuelve pronto para ver proyectos increíbles.'
                                        : `No hay elementos visibles de tipo ${nodeTypeConfig[filter as keyof typeof nodeTypeConfig]?.name?.toLowerCase()} en este momento.`
                                }
                            </p>
                            {filter !== 'all' && (
                                <button
                                    onClick={() => setFilter('all')}
                                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-medium rounded-xl hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                                >
                                    <Squares2X2Icon className="h-5 w-5 mr-2" />
                                    Ver Todos los Elementos
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}