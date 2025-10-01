'use client'

import { Node } from '@prisma/client'
import { useState } from 'react'
import { CalendarDaysIcon, ClockIcon } from '@heroicons/react/24/outline'
import { FolderIcon, DocumentIcon, AcademicCapIcon, BriefcaseIcon, BookOpenIcon, Cog6ToothIcon, CodeBracketIcon } from '@heroicons/react/24/solid'

interface TimelineLayoutProps {
    nodes: Node[]
    onNodeClick?: (node: Node) => void
    isOwner?: boolean
}

const nodeTypeConfig = {
    CATEGORY: { name: 'Categoría', icon: FolderIcon, color: 'text-blue-600', bgColor: 'bg-blue-100', borderColor: 'border-blue-200' },
    PROJECT: { name: 'Proyecto', icon: DocumentIcon, color: 'text-purple-600', bgColor: 'bg-purple-100', borderColor: 'border-purple-200' },
    LANGUAGE: { name: 'Lenguaje', icon: CodeBracketIcon, color: 'text-green-600', bgColor: 'bg-green-100', borderColor: 'border-green-200' },
    SKILL: { name: 'Habilidad', icon: Cog6ToothIcon, color: 'text-indigo-600', bgColor: 'bg-indigo-100', borderColor: 'border-indigo-200' },
    EXPERIENCE: { name: 'Experiencia', icon: BriefcaseIcon, color: 'text-red-600', bgColor: 'bg-red-100', borderColor: 'border-red-200' },
    EDUCATION: { name: 'Educación', icon: AcademicCapIcon, color: 'text-orange-600', bgColor: 'bg-orange-100', borderColor: 'border-orange-200' },
    DOCUMENTATION: { name: 'Documentación', icon: BookOpenIcon, color: 'text-cyan-600', bgColor: 'bg-cyan-100', borderColor: 'border-cyan-200' }
}

export function TimelineLayout({ nodes, onNodeClick, isOwner }: TimelineLayoutProps) {

    // Organizar nodos por fecha (usando createdAt o una fecha custom si la tienes)
    const sortedNodes = [...nodes]
        .filter(node => node.isVisible || isOwner)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    const handleNodeClick = (node: Node) => {
        onNodeClick?.(node)
    }

    const getYearFromDate = (date: Date) => new Date(date).getFullYear()
    const getMonthFromDate = (date: Date) => new Date(date).toLocaleDateString('es-ES', { month: 'long' })

    // Agrupar por año
    const nodesByYear = sortedNodes.reduce((acc, node) => {
        const year = getYearFromDate(node.createdAt)
        if (!acc[year]) {
            acc[year] = []
        }
        acc[year].push(node)
        return acc
    }, {} as Record<number, Node[]>)

    return (
        <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-purple-200 to-indigo-200"></div>

            <div className="space-y-12">
                {Object.entries(nodesByYear)
                    .sort(([a], [b]) => parseInt(b) - parseInt(a))
                    .map(([year, yearNodes]) => (
                        <div key={year} className="relative">
                            {/* Year Marker */}
                            <div className="flex items-center mb-8">
                                <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg border-4 border-white">
                                    <span className="text-white font-bold text-lg">{year}</span>
                                </div>
                                <div className="ml-6 flex-1">
                                    <h2 className="text-2xl font-bold text-gray-900">{year}</h2>
                                    <p className="text-gray-500">{yearNodes.length} elemento{yearNodes.length !== 1 ? 's' : ''}</p>
                                </div>
                            </div>

                            {/* Nodes for this year */}
                            <div className="ml-20 space-y-6">
                                {yearNodes.map((node, index) => {
                                    const typeConfig = nodeTypeConfig[node.type as keyof typeof nodeTypeConfig]
                                    const TypeIcon = typeConfig?.icon || DocumentIcon

                                    return (
                                        <div key={node.id} className="relative group">
                                            {/* Connection Line */}
                                            <div className="absolute -left-12 top-6 w-8 h-0.5 bg-gray-300 group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300"></div>

                                            {/* Timeline Dot */}
                                            <div className={`absolute -left-16 top-4 w-4 h-4 rounded-full border-2 border-white shadow-lg transition-all duration-300 group-hover:scale-125 ${typeConfig?.bgColor || 'bg-gray-100'}`}>
                                                <div className={`w-full h-full rounded-full ${typeConfig?.bgColor || 'bg-gray-100'}`}></div>
                                            </div>

                                            {/* Node Card */}
                                            <div
                                                onClick={() => handleNodeClick(node)}
                                                className={`bg-white rounded-xl border-2 ${typeConfig?.borderColor || 'border-gray-200'} p-6 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group-hover:-translate-y-1`}
                                            >
                                                {/* Header */}
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className={`p-3 rounded-xl ${typeConfig?.bgColor || 'bg-gray-100'}`}>
                                                            <TypeIcon className={`h-6 w-6 ${typeConfig?.color || 'text-gray-600'}`} />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                                {node.title}
                                                            </h3>
                                                            <p className="text-sm text-gray-500">
                                                                {typeConfig?.name || node.type} • {getMonthFromDate(node.createdAt)} {getYearFromDate(node.createdAt)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                                                        <ClockIcon className="h-4 w-4" />
                                                        <span>{new Date(node.createdAt).toLocaleDateString('es-ES')}</span>
                                                    </div>
                                                </div>

                                                {/* Description */}
                                                {node.description && (
                                                    <p className="text-gray-600 mb-4 line-clamp-2">
                                                        {node.description}
                                                    </p>
                                                )}

                                                {/* Tags */}
                                                {node.tags && node.tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mb-4">
                                                        {node.tags.slice(0, 4).map((tag, tagIndex) => (
                                                            <span
                                                                key={tagIndex}
                                                                className="inline-flex items-center bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full"
                                                            >
                                                                {tag}
                                                            </span>
                                                        ))}
                                                        {node.tags.length > 4 && (
                                                            <span className="inline-flex items-center text-gray-500 text-xs px-3 py-1">
                                                                +{node.tags.length - 4} más
                                                            </span>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Project Links */}
                                                {node.type === 'PROJECT' && (node.projectUrl || node.githubUrl || node.demoUrl) && (
                                                    <div className="flex items-center space-x-3">
                                                        {node.projectUrl && (
                                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                        )}
                                                        {node.githubUrl && (
                                                            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                                                        )}
                                                        {node.demoUrl && (
                                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                        )}
                                                        <span className="text-xs text-gray-500 font-medium">Enlaces disponibles</span>
                                                    </div>
                                                )}

                                                {/* Visual Indicator */}
                                                <div className={`mt-4 h-1 w-full rounded-full bg-gradient-to-r ${node.type === 'PROJECT' ? 'from-purple-200 to-purple-400' :
                                                        node.type === 'EXPERIENCE' ? 'from-red-200 to-red-400' :
                                                            node.type === 'EDUCATION' ? 'from-orange-200 to-orange-400' :
                                                                node.type === 'SKILL' ? 'from-indigo-200 to-indigo-400' :
                                                                    'from-gray-200 to-gray-400'
                                                    }`}></div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
            </div>

            {/* Empty State */}
            {sortedNodes.length === 0 && (
                <div className="text-center py-20">
                    <div className="relative">
                        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                        <div className="ml-20">
                            <CalendarDaysIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Timeline Vacío
                            </h3>
                            <p className="text-gray-500">
                                {isOwner ? 'Agrega algunos nodos para ver tu cronología profesional' : 'No hay elementos visibles en esta cronología'}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}