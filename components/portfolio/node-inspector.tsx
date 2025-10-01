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
    // Enhanced markdown formatting with proper processing
    let formatted = content
      
      // Headers (process before escaping HTML)
      .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold text-gray-900 mt-6 mb-3 border-b border-gray-200 pb-1">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-gray-900 mt-8 mb-4 border-b-2 border-gray-300 pb-2">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-gray-900 mt-8 mb-6 border-b-2 border-blue-200 pb-2 text-blue-800">$1</h1>')
      
      // Bold and italic
      .replace(/\*\*\*(.+?)\*\*\*/g, '<strong class="font-bold text-gray-900"><em class="italic">$1</em></strong>')
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em class="italic text-gray-700">$1</em>')
      
      // Code blocks (multiline)
      .replace(/```([^`]+)```/g, '<pre class="bg-gray-800 text-green-400 p-4 rounded-lg my-4 overflow-x-auto border-l-4 border-blue-500"><code class="font-mono text-sm">$1</code></pre>')
      
      // Inline code
      .replace(/`(.+?)`/g, '<code class="bg-blue-100 text-blue-800 px-2 py-1 rounded font-mono text-sm border">$1</code>')
      
      // Links
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline font-medium transition-colors">$1 🔗</a>')
      
      // Lists
      .replace(/^[\*\-] (.+)$/gm, '<li class="flex items-start mb-2"><span class="text-blue-600 mr-2 mt-1">•</span><span>$1</span></li>')
      .replace(/^\d+\. (.+)$/gm, '<li class="flex items-start mb-2 ml-4"><span class="text-blue-600 mr-2 font-semibold">→</span><span>$1</span></li>')
      
      // Blockquotes
      .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-blue-400 pl-4 my-4 italic text-gray-600 bg-blue-50 py-2 rounded-r">$1</blockquote>')
      
      // Line breaks and paragraphs
      .replace(/\n\n+/g, '</p><p class="mb-4 leading-relaxed">')
      .replace(/\n/g, '<br>')
    
    // Wrap in paragraph if it doesn't start with a block element
    if (!formatted.match(/^<(h[1-6]|p|pre|li|blockquote)/)) {
      formatted = '<p class="mb-4 leading-relaxed">' + formatted + '</p>'
    }
    
    // Wrap lists in containers
    if (formatted.includes('<li')) {
      formatted = formatted.replace(/((<li[^>]*>.*?<\/li>\s*)+)/g, '<ul class="space-y-1 my-4 bg-gray-50 p-3 rounded-lg">$1</ul>')
    }
    
    return formatted
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
                      <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                        <svg className="h-4 w-4 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Contenido Detallado
                      </h4>
                      <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200 shadow-inner">
                        <div 
                          className="prose prose-sm max-w-none text-gray-700 leading-relaxed markdown-content"
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