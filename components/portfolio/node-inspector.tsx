'use client'

import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon, LinkIcon, CodeBracketIcon, GlobeAltIcon } from '@heroicons/react/24/outline'
import { FolderIcon, DocumentIcon, AcademicCapIcon, BriefcaseIcon, BookOpenIcon, Cog6ToothIcon } from '@heroicons/react/24/solid'
import { Fragment } from 'react'
import { Node, NodeType } from '@prisma/client'

interface NodeInspectorProps {
  node: Node | null
  isOpen: boolean
  onClose: () => void
}

const nodeTypeConfig = {
  CATEGORY: { name: 'Categoría', icon: FolderIcon, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  PROJECT: { name: 'Proyecto', icon: DocumentIcon, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  LANGUAGE: { name: 'Lenguaje', icon: CodeBracketIcon, color: 'text-green-600', bgColor: 'bg-green-100' },
  SKILL: { name: 'Habilidad', icon: Cog6ToothIcon, color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
  EXPERIENCE: { name: 'Experiencia', icon: BriefcaseIcon, color: 'text-red-600', bgColor: 'bg-red-100' },
  EDUCATION: { name: 'Educación', icon: AcademicCapIcon, color: 'text-orange-600', bgColor: 'bg-orange-100' },
  DOCUMENTATION: { name: 'Documentación', icon: BookOpenIcon, color: 'text-cyan-600', bgColor: 'bg-cyan-100' }
}

export function NodeInspector({ node, isOpen, onClose }: NodeInspectorProps) {
  if (!node) return null

  const typeConfig = nodeTypeConfig[node.type as NodeType]
  const TypeIcon = typeConfig?.icon || DocumentIcon

  const formatContent = (content: string) => {
    // Simple markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">$1</a>')
      .replace(/\n/g, '<br>')
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className={`px-6 py-4 ${typeConfig?.bgColor || 'bg-gray-100'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-white shadow-sm">
                        <TypeIcon className={`h-6 w-6 ${typeConfig?.color || 'text-gray-600'}`} />
                      </div>
                      <div>
                        <Dialog.Title as="h3" className="text-lg font-medium text-gray-900">
                          {node.title}
                        </Dialog.Title>
                        <p className="text-sm text-gray-600">
                          {typeConfig?.name || 'Contenido'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={onClose}
                      className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-white/50"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* Description */}
                  {node.description && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Descripción</h4>
                      <p className="text-gray-700 text-sm leading-relaxed">{node.description}</p>
                    </div>
                  )}

                  {/* Project Links */}
                  {node.type === 'PROJECT' && (node.projectUrl || node.githubUrl || node.demoUrl) && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Enlaces del Proyecto</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {node.projectUrl && (
                          <a
                            href={node.projectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <GlobeAltIcon className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-gray-900">Sitio Web</span>
                          </a>
                        )}
                        {node.githubUrl && (
                          <a
                            href={node.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <CodeBracketIcon className="h-4 w-4 text-gray-700" />
                            <span className="text-sm font-medium text-gray-900">GitHub</span>
                          </a>
                        )}
                        {node.demoUrl && (
                          <a
                            href={node.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <LinkIcon className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-gray-900">Demo</span>
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {node.tags && node.tags.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Etiquetas</h4>
                      <div className="flex flex-wrap gap-2">
                        {node.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  {node.content && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Contenido Detallado</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div 
                          className="prose prose-sm max-w-none text-gray-700"
                          dangerouslySetInnerHTML={{ __html: formatContent(node.content) }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Información</h4>
                    <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                      <div>
                        <span className="font-medium">Tipo:</span> {typeConfig?.name || node.type}
                      </div>
                      <div>
                        <span className="font-medium">Visibilidad:</span> {node.isVisible ? 'Público' : 'Privado'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 flex justify-end">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Cerrar
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}