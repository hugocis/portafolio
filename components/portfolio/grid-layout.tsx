'use client'

import { Node } from '@prisma/client'
import { useState } from 'react'
import { Squares2X2Icon } from '@heroicons/react/24/outline'
import { FolderIcon, DocumentIcon, AcademicCapIcon, BriefcaseIcon, BookOpenIcon, Cog6ToothIcon, CodeBracketIcon } from '@heroicons/react/24/solid'

interface GridLayoutProps {
  nodes: Node[]
  onNodeClick?: (node: Node) => void
  isOwner?: boolean
}

const nodeTypeConfig = {
  CATEGORY: { name: 'Categoría', icon: FolderIcon, color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', gradient: 'from-blue-500 to-blue-600' },
  PROJECT: { name: 'Proyecto', icon: DocumentIcon, color: 'text-purple-600', bgColor: 'bg-purple-50', borderColor: 'border-purple-200', gradient: 'from-purple-500 to-purple-600' },
  LANGUAGE: { name: 'Lenguaje', icon: CodeBracketIcon, color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200', gradient: 'from-green-500 to-green-600' },
  SKILL: { name: 'Habilidad', icon: Cog6ToothIcon, color: 'text-indigo-600', bgColor: 'bg-indigo-50', borderColor: 'border-indigo-200', gradient: 'from-indigo-500 to-indigo-600' },
  EXPERIENCE: { name: 'Experiencia', icon: BriefcaseIcon, color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200', gradient: 'from-red-500 to-red-600' },
  EDUCATION: { name: 'Educación', icon: AcademicCapIcon, color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200', gradient: 'from-orange-500 to-orange-600' },
  DOCUMENTATION: { name: 'Documentación', icon: BookOpenIcon, color: 'text-cyan-600', bgColor: 'bg-cyan-50', borderColor: 'border-cyan-200', gradient: 'from-cyan-500 to-cyan-600' }
}

export function GridLayout({ nodes, onNodeClick, isOwner }: GridLayoutProps) {
  const [filter, setFilter] = useState<string>('all')

  const visibleNodes = nodes.filter(node => node.isVisible || isOwner)
  const filteredNodes = filter === 'all' 
    ? visibleNodes 
    : visibleNodes.filter(node => node.type === filter)

  const handleNodeClick = (node: Node) => {
    onNodeClick?.(node)
  }

  // Obtener tipos únicos para el filtro
  const availableTypes = Array.from(new Set(visibleNodes.map(node => node.type)))

  return (
    <div>
      {/* Header with Filters */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg">
                <Squares2X2Icon className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Vista Grid</h2>
            </div>
            <p className="text-gray-600">
              {filteredNodes.length} elemento{filteredNodes.length !== 1 ? 's' : ''} 
              {filter !== 'all' ? ` en ${nodeTypeConfig[filter as keyof typeof nodeTypeConfig]?.name}` : ''}
            </p>
          </div>

          {/* Type Filter */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Todos
            </button>
            {availableTypes.map((type) => {
              const typeConfig = nodeTypeConfig[type as keyof typeof nodeTypeConfig]
              const TypeIcon = typeConfig?.icon || DocumentIcon
              
              return (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    filter === type
                      ? `bg-gradient-to-r ${typeConfig?.gradient} text-white shadow-md`
                      : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <TypeIcon className="h-4 w-4" />
                  <span>{typeConfig?.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredNodes.map((node) => {
          const typeConfig = nodeTypeConfig[node.type as keyof typeof nodeTypeConfig]
          const TypeIcon = typeConfig?.icon || DocumentIcon

          return (
            <div
              key={node.id}
              onClick={() => handleNodeClick(node)}
              className="group cursor-pointer"
            >
              {/* Card */}
              <div className={`bg-white rounded-2xl border-2 ${typeConfig?.borderColor || 'border-gray-200'} shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group-hover:-translate-y-2`}>
                {/* Header */}
                <div className={`p-6 bg-gradient-to-br ${typeConfig?.bgColor || 'bg-gray-50'} relative overflow-hidden`}>
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/30"></div>
                    <div className="absolute bottom-6 left-8 w-4 h-4 rounded-full bg-white/20"></div>
                    <div className="absolute top-8 left-12 w-2 h-2 rounded-full bg-white/40"></div>
                  </div>
                  
                  <div className="relative flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${typeConfig?.gradient} shadow-lg`}>
                      <TypeIcon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex items-center space-x-2">
                      {!node.isVisible && isOwner && (
                        <div className="w-2 h-2 bg-yellow-400 rounded-full" title="Privado"></div>
                      )}
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${typeConfig?.bgColor} ${typeConfig?.color}`}>
                        {typeConfig?.name}
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors line-clamp-2">
                    {node.title}
                  </h3>
                </div>

                {/* Body */}
                <div className="p-6">
                  {/* Description */}
                  {node.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                      {node.description}
                    </p>
                  )}

                  {/* Tags */}
                  {node.tags && node.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {node.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-block bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                      {node.tags.length > 3 && (
                        <span className="inline-block text-gray-500 text-xs px-3 py-1 font-medium">
                          +{node.tags.length - 3} más
                        </span>
                      )}
                    </div>
                  )}

                  {/* Project Links */}
                  {node.type === 'PROJECT' && (node.projectUrl || node.githubUrl || node.demoUrl) && (
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {node.projectUrl && (
                        <div className="text-center p-2 bg-green-50 rounded-lg">
                          <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mb-1"></div>
                          <span className="text-xs text-green-700 font-medium">Web</span>
                        </div>
                      )}
                      {node.githubUrl && (
                        <div className="text-center p-2 bg-gray-50 rounded-lg">
                          <div className="w-2 h-2 bg-gray-700 rounded-full mx-auto mb-1"></div>
                          <span className="text-xs text-gray-700 font-medium">GitHub</span>
                        </div>
                      )}
                      {node.demoUrl && (
                        <div className="text-center p-2 bg-blue-50 rounded-lg">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto mb-1"></div>
                          <span className="text-xs text-blue-700 font-medium">Demo</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-500">
                      {new Date(node.createdAt).toLocaleDateString('es-ES')}
                    </span>
                    <div className="flex items-center space-x-1">
                      <div className={`w-8 h-1 rounded-full bg-gradient-to-r ${typeConfig?.gradient}`}></div>
                      <svg className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300 pointer-events-none rounded-2xl"></div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredNodes.length === 0 && (
        <div className="text-center py-20">
          <Squares2X2Icon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {filter === 'all' ? 'Grid Vacío' : `Sin ${nodeTypeConfig[filter as keyof typeof nodeTypeConfig]?.name}`}
          </h3>
          <p className="text-gray-500 mb-6">
            {isOwner 
              ? filter === 'all' 
                ? 'Agrega algunos nodos para ver tu portfolio en formato grid'
                : `No tienes elementos de tipo ${nodeTypeConfig[filter as keyof typeof nodeTypeConfig]?.name?.toLowerCase()}`
              : filter === 'all'
                ? 'No hay elementos visibles en este portfolio'
                : `No hay elementos visibles de tipo ${nodeTypeConfig[filter as keyof typeof nodeTypeConfig]?.name?.toLowerCase()}`
            }
          </p>
          {filter !== 'all' && (
            <button
              onClick={() => setFilter('all')}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ver Todos los Elementos
            </button>
          )}
        </div>
      )}
    </div>
  )
}