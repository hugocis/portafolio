'use client'

import { Node } from '@prisma/client'
import { CalendarDaysIcon, ClockIcon, EyeIcon, EyeSlashIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { FolderIcon, DocumentIcon, AcademicCapIcon, BriefcaseIcon, BookOpenIcon, Cog6ToothIcon, CodeBracketIcon, StarIcon, MapPinIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'

interface TimelineLayoutProps {
    nodes: Node[]
    onNodeClick?: (node: Node) => void
    isOwner?: boolean
}

const nodeTypeConfig = {
    CATEGORY: { name: 'Categoría', icon: FolderIcon, color: 'text-blue-600', bgColor: 'bg-blue-100', borderColor: 'border-blue-200', gradient: 'from-blue-500 to-blue-600', lightBg: 'from-blue-50 to-blue-100' },
    PROJECT: { name: 'Proyecto', icon: DocumentIcon, color: 'text-purple-600', bgColor: 'bg-purple-100', borderColor: 'border-purple-200', gradient: 'from-purple-500 to-purple-600', lightBg: 'from-purple-50 to-purple-100' },
    LANGUAGE: { name: 'Lenguaje', icon: CodeBracketIcon, color: 'text-emerald-600', bgColor: 'bg-emerald-100', borderColor: 'border-emerald-200', gradient: 'from-emerald-500 to-emerald-600', lightBg: 'from-emerald-50 to-emerald-100' },
    SKILL: { name: 'Habilidad', icon: Cog6ToothIcon, color: 'text-indigo-600', bgColor: 'bg-indigo-100', borderColor: 'border-indigo-200', gradient: 'from-indigo-500 to-indigo-600', lightBg: 'from-indigo-50 to-indigo-100' },
    EXPERIENCE: { name: 'Experiencia', icon: BriefcaseIcon, color: 'text-rose-600', bgColor: 'bg-rose-100', borderColor: 'border-rose-200', gradient: 'from-rose-500 to-rose-600', lightBg: 'from-rose-50 to-rose-100' },
    EDUCATION: { name: 'Educación', icon: AcademicCapIcon, color: 'text-amber-600', bgColor: 'bg-amber-100', borderColor: 'border-amber-200', gradient: 'from-amber-500 to-amber-600', lightBg: 'from-amber-50 to-amber-100' },
    DOCUMENTATION: { name: 'Documentación', icon: BookOpenIcon, color: 'text-cyan-600', bgColor: 'bg-cyan-100', borderColor: 'border-cyan-200', gradient: 'from-cyan-500 to-cyan-600', lightBg: 'from-cyan-50 to-cyan-100' }
}

export function TimelineLayout({ nodes, onNodeClick, isOwner }: TimelineLayoutProps) {
    const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc')
    const [filterType, setFilterType] = useState<string>('all')

    // Build hierarchy first
    const buildHierarchy = () => {
        const visibleNodes = nodes.filter(node => node.isVisible || isOwner)
        const nodeMap = new Map<string, Node & { children: Node[] }>()
        const roots: (Node & { children: Node[] })[] = []
        
        visibleNodes.forEach(node => {
            nodeMap.set(node.id, { ...node, children: [] })
        })
        
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
    
    // Organizar nodos por fecha (solo nodos raíz)
    const filteredNodes = hierarchicalNodes
        .filter(node => filterType === 'all' || node.type === filterType || (node.children && node.children.some(c => c.type === filterType)))
        .sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime()
            const dateB = new Date(b.createdAt).getTime()
            return sortOrder === 'desc' ? dateB - dateA : dateA - dateB
        })

    const handleNodeClick = (node: Node) => {
        onNodeClick?.(node)
    }

    const getYearFromDate = (date: Date) => new Date(date).getFullYear()
    const getMonthFromDate = (date: Date) => new Date(date).toLocaleDateString('es-ES', { month: 'long' })

    // Agrupar por año
    const nodesByYear = filteredNodes.reduce((acc, node) => {
        const year = getYearFromDate(node.createdAt)
        if (!acc[year]) {
            acc[year] = []
        }
        acc[year].push(node)
        return acc
    }, {} as Record<number, Node[]>)

    // Obtener tipos únicos para el filtro
    const availableTypes = Array.from(new Set(nodes.filter(node => node.isVisible || isOwner).map(node => node.type)))

    return (
        <div className="space-y-8">
            {/* Modern Header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50 dark:from-blue-900/20 dark:via-cyan-900/20 dark:to-indigo-900/20 rounded-3xl border border-blue-200/50 dark:border-blue-700/50">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-6 right-8 w-32 h-32 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-6 left-8 w-24 h-24 bg-gradient-to-br from-cyan-200 to-indigo-200 rounded-full blur-2xl"></div>
                </div>
                
                <div className="relative p-8">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <div className="p-4 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl shadow-lg">
                                        <CalendarDaysIcon className="h-8 w-8 text-white" />
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse"></div>
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                                        Timeline Profesional
                                    </h2>
                                    <p className="text-lg text-gray-600 dark:text-gray-400">
                                        {Object.keys(nodesByYear).length} año{Object.keys(nodesByYear).length !== 1 ? 's' : ''} • {filteredNodes.length} evento{filteredNodes.length !== 1 ? 's' : ''}
                                        {filterType !== 'all' ? ` • ${nodeTypeConfig[filterType as keyof typeof nodeTypeConfig]?.name}` : ''}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                            {/* Sort Toggle */}
                            <div className="flex bg-white/80 backdrop-blur-sm rounded-xl p-1 border border-gray-200/50 shadow-sm w-full sm:w-auto">
                                <button
                                    onClick={() => setSortOrder('desc')}
                                    className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                                        sortOrder === 'desc'
                                            ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-md'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    <span className="hidden sm:inline">Más Reciente</span>
                                    <span className="sm:hidden">Reciente</span>
                                </button>
                                <button
                                    onClick={() => setSortOrder('asc')}
                                    className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                                        sortOrder === 'asc'
                                            ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-md'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    <span className="hidden sm:inline">Más Antiguo</span>
                                    <span className="sm:hidden">Antiguo</span>
                                </button>
                            </div>

                            {/* Type Filters */}
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setFilterType('all')}
                                    className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                                        filterType === 'all'
                                            ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg'
                                            : 'bg-white/80 backdrop-blur-sm text-gray-600 border border-gray-200/50 hover:bg-white hover:shadow-md'
                                    }`}
                                >
                                    Todos
                                </button>
                                {availableTypes.slice(0, 3).map((type) => {
                                    const typeConfig = nodeTypeConfig[type as keyof typeof nodeTypeConfig]
                                    const TypeIcon = typeConfig?.icon || DocumentIcon

                                    return (
                                        <button
                                            key={type}
                                            onClick={() => setFilterType(type)}
                                            className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                                                filterType === type
                                                    ? `bg-gradient-to-r ${typeConfig?.gradient} text-white shadow-lg`
                                                    : 'bg-white/80 backdrop-blur-sm text-gray-600 border border-gray-200/50 hover:bg-white hover:shadow-md'
                                            }`}
                                        >
                                            <TypeIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                                            <span className="hidden sm:inline">{typeConfig?.name}</span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Enhanced Timeline */}
            <div className="relative">
                {/* Enhanced Timeline Line */}
                <div className="absolute left-4 sm:left-8 top-0 bottom-0 w-0.5 sm:w-1 bg-gradient-to-b from-blue-300 via-cyan-300 to-indigo-300 rounded-full shadow-lg"></div>

                <div className="space-y-8 sm:space-y-12">
                    {Object.entries(nodesByYear)
                        .sort(([a], [b]) => sortOrder === 'desc' ? parseInt(b) - parseInt(a) : parseInt(a) - parseInt(b))
                        .map(([year, yearNodes], yearIndex) => (
                            <div 
                                key={year} 
                                className="relative animate-fade-in-scale"
                                style={{
                                    animationDelay: `${yearIndex * 200}ms`,
                                    animationFillMode: 'both'
                                }}
                            >
                                {/* Enhanced Year Marker */}
                                <div className="flex items-center mb-6 sm:mb-8">
                                    <div className="relative z-10 flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-600 via-cyan-600 to-indigo-600 rounded-xl sm:rounded-2xl shadow-xl border-2 sm:border-4 border-white transform hover:scale-110 transition-transform duration-300">
                                        <div className="text-center">
                                            <span className="text-white font-bold text-base sm:text-lg block leading-tight">{year}</span>
                                            <span className="text-blue-100 text-xs font-medium">{yearNodes.length}</span>
                                        </div>
                                    </div>
                                    <div className="ml-4 sm:ml-8 flex-1">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                                            <div>
                                                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{year}</h2>
                                                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-lg">
                                                    {yearNodes.length} elemento{yearNodes.length !== 1 ? 's' : ''}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Enhanced Nodes for this year */}
                                <div className="ml-12 sm:ml-24 space-y-6 sm:space-y-8">
                                    {yearNodes.map((node, nodeIndex) => {
                                        const typeConfig = nodeTypeConfig[node.type as keyof typeof nodeTypeConfig]
                                        const TypeIcon = typeConfig?.icon || DocumentIcon
                                        const isFeatured = node.tags?.includes('featured')
                                        const hasChildren = 'children' in node && Array.isArray(node.children) && node.children.length > 0

                                        return (
                                            <div 
                                                key={node.id} 
                                                className="relative group animate-fade-in-scale"
                                                style={{
                                                    animationDelay: `${(yearIndex * 200) + (nodeIndex * 150)}ms`,
                                                    animationFillMode: 'both'
                                                }}
                                            >
                                                {/* Enhanced Connection Line */}
                                                <div className="absolute -left-8 sm:-left-16 top-6 sm:top-8 w-6 sm:w-12 h-0.5 bg-gradient-to-r from-gray-300 to-blue-400 group-hover:from-blue-400 group-hover:to-cyan-400 transition-all duration-500 shadow-sm"></div>

                                                {/* Enhanced Timeline Dot */}
                                                <div className={`absolute -left-10 sm:-left-20 top-4 sm:top-6 w-5 h-5 sm:w-6 sm:h-6 rounded-lg sm:rounded-xl border-2 sm:border-4 border-white shadow-lg transition-all duration-300 group-hover:scale-150 group-hover:rotate-45 ${typeConfig?.bgColor || 'bg-gray-100'} z-10`}>
                                                    <div className={`w-full h-full rounded-md sm:rounded-lg bg-gradient-to-br ${typeConfig?.gradient || 'from-gray-400 to-gray-500'}`}></div>
                                                </div>

                                                {/* Enhanced Node Card */}
                                                <div
                                                    onClick={() => handleNodeClick(node)}
                                                    className={`relative bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-200/50 p-4 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer group-hover:-translate-y-2 group-hover:scale-105 overflow-hidden ${
                                                        isFeatured ? 'ring-2 ring-yellow-400/50' : ''
                                                    }`}
                                                >
                                                    {/* Featured Badge */}
                                                    {isFeatured && (
                                                        <div className="absolute top-4 right-4 z-10">
                                                            <div className="flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                                                <StarIcon className="h-3 w-3" />
                                                                <span>Destacado</span>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Background Gradient */}
                                                    <div className={`absolute inset-0 bg-gradient-to-br ${typeConfig?.lightBg || 'from-gray-50 to-gray-100'} opacity-30 group-hover:opacity-50 transition-opacity duration-500`}></div>

                                                    <div className="relative">
                                                        {/* Enhanced Header */}
                                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 sm:mb-6 gap-4">
                                                            <div className="flex items-center space-x-3 sm:space-x-4 flex-1">
                                                                <div className={`p-2 sm:p-4 rounded-xl sm:rounded-2xl ${typeConfig?.bgColor || 'bg-gray-100'} shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 flex-shrink-0`}>
                                                                    <TypeIcon className={`h-6 w-6 sm:h-8 sm:w-8 ${typeConfig?.color || 'text-gray-600'}`} />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <h3 className="text-lg sm:text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 break-words">
                                                                        {node.title}
                                                                    </h3>
                                                                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2">
                                                                        <p className="text-xs sm:text-sm font-medium text-gray-600">
                                                                            {typeConfig?.name || node.type} • {getMonthFromDate(node.createdAt)} {getYearFromDate(node.createdAt)}
                                                                        </p>
                                                                        <div className="flex items-center space-x-2">
                                                                            {!node.isVisible && isOwner && (
                                                                                <div className="flex items-center space-x-1 bg-amber-100 rounded-full px-2 py-1" title="Privado">
                                                                                    <EyeSlashIcon className="h-3 w-3 text-amber-600" />
                                                                                    <span className="text-xs font-medium text-amber-700">Privado</span>
                                                                                </div>
                                                                            )}
                                                                            {node.isVisible && (
                                                                                <div className="flex items-center space-x-1 bg-emerald-100 rounded-full px-2 py-1" title="Público">
                                                                                    <EyeIcon className="h-3 w-3 text-emerald-600" />
                                                                                    <span className="text-xs font-medium text-emerald-700">Público</span>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500 bg-white/80 rounded-lg sm:rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200/50 self-start">
                                                                <ClockIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                                                                <span className="font-medium whitespace-nowrap">{new Date(node.createdAt).toLocaleDateString('es-ES')}</span>
                                                            </div>
                                                        </div>

                                                        {/* Enhanced Description */}
                                                        {node.description && (
                                                            <div className="mb-6">
                                                                <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                                                                    {node.description}
                                                                </p>
                                                            </div>
                                                        )}

                                                        {/* Children if any */}
                                                        {hasChildren && (
                                                            <div className="mb-6 p-4 sm:p-6 bg-gray-50 rounded-xl border border-gray-200">
                                                                <h4 className="text-sm sm:text-base font-bold text-gray-700 mb-4 flex items-center">
                                                                    <div className={`w-1 h-4 bg-gradient-to-b ${typeConfig?.gradient} rounded-full mr-2`}></div>
                                                                    Contenido ({(node as Node & { children: Node[] }).children.length})
                                                                </h4>
                                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                                    {(node as Node & { children: Node[] }).children.map((child: Node) => {
                                                                        const childConfig = nodeTypeConfig[child.type as keyof typeof nodeTypeConfig]
                                                                        const ChildIcon = childConfig?.icon || DocumentIcon
                                                                        return (
                                                                            <div
                                                                                key={child.id}
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation()
                                                                                    handleNodeClick(child)
                                                                                }}
                                                                                className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
                                                                            >
                                                                                <div className={`p-2 rounded-lg ${childConfig?.bgColor} flex-shrink-0`}>
                                                                                    <ChildIcon className={`h-4 w-4 ${childConfig?.color}`} />
                                                                                </div>
                                                                                <div className="flex-1 min-w-0">
                                                                                    <h5 className="font-semibold text-sm text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                                                                                        {child.title}
                                                                                    </h5>
                                                                                    {child.description && (
                                                                                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                                                                            {child.description}
                                                                                        </p>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Enhanced Tags */}
                                                        {node.tags && node.tags.length > 0 && (
                                                            <div className="flex flex-wrap gap-2 mb-6">
                                                                {node.tags.slice(0, 6).map((tag, tagIndex) => (
                                                                    <span
                                                                        key={tagIndex}
                                                                        className="inline-flex items-center bg-gray-100/80 backdrop-blur-sm text-gray-700 text-sm px-4 py-2 rounded-full font-medium border border-gray-200/50 hover:bg-gray-200/80 transition-colors"
                                                                    >
                                                                        {tag}
                                                                    </span>
                                                                ))}
                                                                {node.tags.length > 6 && (
                                                                    <span className="inline-flex items-center text-gray-500 text-sm px-4 py-2 font-medium">
                                                                        +{node.tags.length - 6} más
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}

                                                        {/* Enhanced Project Links */}
                                                        {node.type === 'PROJECT' && (node.projectUrl || node.githubUrl || node.demoUrl) && (
                                                            <div className="flex items-center space-x-4 mb-6">
                                                                {node.projectUrl && (
                                                                    <div className="flex items-center space-x-2 bg-emerald-50 rounded-xl px-4 py-2 border border-emerald-200/50">
                                                                        <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                                                                        <span className="text-sm font-medium text-emerald-700">Sitio Web</span>
                                                                    </div>
                                                                )}
                                                                {node.githubUrl && (
                                                                    <div className="flex items-center space-x-2 bg-gray-50 rounded-xl px-4 py-2 border border-gray-200/50">
                                                                        <div className="w-3 h-3 bg-gray-700 rounded-sm"></div>
                                                                        <span className="text-sm font-medium text-gray-700">GitHub</span>
                                                                    </div>
                                                                )}
                                                                {node.demoUrl && (
                                                                    <div className="flex items-center space-x-2 bg-blue-50 rounded-xl px-4 py-2 border border-blue-200/50">
                                                                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                                                                        <span className="text-sm font-medium text-blue-700">Demo</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}

                                                        {/* Enhanced Footer */}
                                                        <div className="flex items-center justify-between pt-6 border-t border-gray-200/50">
                                                            <div className={`h-2 w-24 rounded-full bg-gradient-to-r ${typeConfig?.gradient || 'from-gray-400 to-gray-500'} shadow-sm`}></div>
                                                            <ArrowRightIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-2 transition-all duration-300" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                </div>
            </div>

            {/* Enhanced Empty State */}
            {filteredNodes.length === 0 && (
                <div className="text-center py-20">
                    <div className="max-w-md mx-auto">
                        <div className="relative">
                            {/* Animated Background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-3xl opacity-50 animate-pulse"></div>
                            
                            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-12 border border-gray-200/50 shadow-lg">
                                <div className="relative mb-6">
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                                    <CalendarDaysIcon className="relative h-20 w-20 text-gray-400 mx-auto" />
                                </div>
                                
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                    {filterType === 'all' ? '⏰ Timeline Vacío' : `📅 Sin ${nodeTypeConfig[filterType as keyof typeof nodeTypeConfig]?.name}`}
                                </h3>
                                <p className="text-gray-600 mb-8 leading-relaxed">
                                    {isOwner
                                        ? filterType === 'all'
                                            ? 'Tu timeline profesional está esperando tus primeros hitos. ¡Agrega eventos para crear tu cronología!'
                                            : `Aún no tienes eventos de tipo ${nodeTypeConfig[filterType as keyof typeof nodeTypeConfig]?.name?.toLowerCase()}. ¡Crea uno para comenzar!`
                                        : filterType === 'all'
                                            ? 'Esta cronología está siendo construida. Vuelve pronto para ver una historia profesional increíble.'
                                            : `No hay eventos visibles de tipo ${nodeTypeConfig[filterType as keyof typeof nodeTypeConfig]?.name?.toLowerCase()} en este momento.`
                                    }
                                </p>
                                {filterType !== 'all' && (
                                    <button
                                        onClick={() => setFilterType('all')}
                                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                                    >
                                        <CalendarDaysIcon className="h-5 w-5 mr-2" />
                                        Ver Todo el Timeline
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}