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
          <div className="fixed inset-0 bg-black/20 backdrop-blur-md" />
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
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-3xl bg-white dark:bg-slate-800 text-left align-middle shadow-2xl transition-all border border-gray-200 dark:border-slate-700">
                {/* Header */}
                <div className={`px-8 py-6 bg-gradient-to-br ${typeConfig?.bgColor || 'from-gray-100 to-gray-200'} dark:from-slate-700 dark:to-slate-800 relative overflow-hidden`}>
                  {/* Animated background elements */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full mix-blend-overlay filter blur-xl opacity-70 animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full mix-blend-overlay filter blur-xl opacity-50 animate-pulse animation-delay-2000"></div>
                  </div>

                  <div className="flex items-center justify-between relative">
                    <div className="flex items-center space-x-4">
                      <div className="p-4 rounded-2xl bg-white dark:bg-slate-700 shadow-lg border border-white/50 dark:border-slate-600">
                        <TypeIcon className={`h-8 w-8 ${typeConfig?.color || 'text-gray-600'}`} />
                      </div>
                      <div>
                        <Dialog.Title as="h3" className="text-2xl font-bold text-gray-900 dark:text-white">
                          {node.title}
                        </Dialog.Title>
                        <div className="flex items-center space-x-3 mt-2">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/80 dark:bg-slate-600/80 ${typeConfig?.color || 'text-gray-600'}`}>
                            {typeConfig?.name || 'Contenido'}
                          </span>
                          {node.isVisible ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                              ✓ Público
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                              ⊘ Privado
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={onClose}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2 rounded-xl hover:bg-white/50 dark:hover:bg-slate-700/50 backdrop-blur-sm"
                    >
                      <XMarkIcon className="h-7 w-7" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 space-y-8">
                  {/* Description */}
                  {node.description && (
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
                      <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                        <svg className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Descripción
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{node.description}</p>
                    </div>
                  )}

                  {/* Project Links */}
                  {node.type === 'PROJECT' && (node.projectUrl || node.githubUrl || node.demoUrl) && (
                    <div>
                      <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                        <LinkIcon className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
                        Enlaces del Proyecto
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {node.projectUrl && (
                          <a
                            href={node.projectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-2 border-blue-200 dark:border-blue-700 rounded-2xl hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-800/30 dark:hover:to-blue-700/30 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                          >
                            <div className="p-2 bg-blue-500 rounded-xl">
                              <GlobeAltIcon className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <span className="font-semibold text-gray-900 dark:text-white">Sitio Web</span>
                              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                Ver proyecto en vivo
                              </div>
                            </div>
                          </a>
                        )}
                        {node.githubUrl && (
                          <a
                            href={node.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-3 p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-2xl hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-700/70 dark:hover:to-gray-600/70 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                          >
                            <div className="p-2 bg-gray-700 dark:bg-gray-600 rounded-xl">
                              <CodeBracketIcon className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <span className="font-semibold text-gray-900 dark:text-white">GitHub</span>
                              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                                Ver código fuente
                              </div>
                            </div>
                          </a>
                        )}
                        {node.demoUrl && (
                          <a
                            href={node.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-3 p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-2 border-green-200 dark:border-green-700 rounded-2xl hover:from-green-100 hover:to-green-200 dark:hover:from-green-800/30 dark:hover:to-green-700/30 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                          >
                            <div className="p-2 bg-green-500 rounded-xl">
                              <LinkIcon className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <span className="font-semibold text-gray-900 dark:text-white">Demo</span>
                              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                                Ver demostración
                              </div>
                            </div>
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {node.tags && node.tags.length > 0 && (
                    <div>
                      <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                        <svg className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        Etiquetas
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {node.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-800 dark:text-blue-300 text-sm px-4 py-2 rounded-full border border-blue-200 dark:border-blue-700 font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  {node.content && (
                    <div>
                      <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                        <svg className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Contenido Detallado
                      </h4>
                      <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border-2 border-purple-200 dark:border-purple-700 shadow-inner">
                        <div
                          className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300 leading-relaxed markdown-content"
                          dangerouslySetInnerHTML={{ __html: formatContent(node.content) }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-slate-700 dark:to-slate-600 border-t border-gray-200 dark:border-slate-600 flex justify-end">
                  <button
                    onClick={onClose}
                    className="px-6 py-3 text-base font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 border-2 border-gray-200 dark:border-slate-600 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-600 hover:border-gray-300 dark:hover:border-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 hover:scale-105"
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