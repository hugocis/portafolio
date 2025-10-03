'use client'

import { useState, useEffect } from 'react'
import { Node, NodeType } from '@prisma/client'
import { Dialog, Transition, Tab } from '@headlessui/react'
import { XMarkIcon, PlusIcon, EyeIcon, EyeSlashIcon, GlobeAltIcon, HashtagIcon } from '@heroicons/react/24/outline'
import { FolderIcon, DocumentIcon, CodeBracketIcon, AcademicCapIcon, BriefcaseIcon, BookOpenIcon, Cog6ToothIcon } from '@heroicons/react/24/solid'
import { Fragment } from 'react'

interface NodeEditorProps {
  node?: Node
  parentId?: string
  portfolioId: string
  isOpen: boolean
  onClose: () => void
  onSave: (nodeData: Partial<Node>) => Promise<void>
}

const nodeTypes = [
  { id: 'CATEGORY', name: 'Categoría', icon: FolderIcon, color: 'text-blue-600', bgColor: 'bg-blue-100', description: 'Organiza contenido en grupos' },
  { id: 'PROJECT', name: 'Proyecto', icon: DocumentIcon, color: 'text-purple-600', bgColor: 'bg-purple-100', description: 'Proyectos específicos con detalles' },
  { id: 'LANGUAGE', name: 'Lenguaje', icon: CodeBracketIcon, color: 'text-green-600', bgColor: 'bg-green-100', description: 'Lenguajes de programación' },
  { id: 'SKILL', name: 'Habilidad', icon: Cog6ToothIcon, color: 'text-indigo-600', bgColor: 'bg-indigo-100', description: 'Habilidades técnicas' },
  { id: 'EXPERIENCE', name: 'Experiencia', icon: BriefcaseIcon, color: 'text-red-600', bgColor: 'bg-red-100', description: 'Experiencia laboral' },
  { id: 'EDUCATION', name: 'Educación', icon: AcademicCapIcon, color: 'text-orange-600', bgColor: 'bg-orange-100', description: 'Formación académica' },
  { id: 'DOCUMENTATION', name: 'Documentación', icon: BookOpenIcon, color: 'text-cyan-600', bgColor: 'bg-cyan-100', description: 'Documentos y recursos' }
]

export function NodeEditor({
  node,
  parentId,
  portfolioId,
  isOpen,
  onClose,
  onSave
}: NodeEditorProps) {
  const [formData, setFormData] = useState<Partial<Node>>({
    title: '',
    description: '',
    content: '',
    type: 'PROJECT',
    isVisible: true,
    projectUrl: '',
    githubUrl: '',
    demoUrl: '',
    tags: [],
    portfolioId,
    parentId: parentId || null,
  })

  const [loading, setLoading] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const [selectedTab, setSelectedTab] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (node) {
      setFormData({
        title: node.title || '',
        description: node.description || '',
        content: node.content || '',
        type: node.type || 'PROJECT',
        isVisible: node.isVisible ?? true,
        projectUrl: node.projectUrl || '',
        githubUrl: node.githubUrl || '',
        demoUrl: node.demoUrl || '',
        tags: node.tags || [],
        portfolioId,
        parentId: parentId || node.parentId || null,
      })
    } else {
      setFormData({
        title: '',
        description: '',
        content: '',
        type: 'PROJECT',
        isVisible: true,
        projectUrl: '',
        githubUrl: '',
        demoUrl: '',
        tags: [],
        portfolioId,
        parentId: parentId || null,
      })
    }
    setErrors({})
    setSelectedTab(0)
  }, [node, parentId, portfolioId, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title?.trim()) {
      newErrors.title = 'El título es obligatorio'
    }

    if (formData.type === 'PROJECT') {
      if (formData.projectUrl && !isValidUrl(formData.projectUrl)) {
        newErrors.projectUrl = 'URL no válida'
      }
      if (formData.githubUrl && !isValidUrl(formData.githubUrl)) {
        newErrors.githubUrl = 'URL no válida'
      }
      if (formData.demoUrl && !isValidUrl(formData.demoUrl)) {
        newErrors.demoUrl = 'URL no válida'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      setSelectedTab(0) // Go to basic info tab if there are errors
      return
    }

    setLoading(true)

    try {
      await onSave(formData)
      onClose()
    } catch (error) {
      console.error('Error saving node:', error)
    } finally {
      setLoading(false)
    }
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(tag => tag !== tagToRemove)
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  const selectedType = nodeTypes.find(type => type.id === formData.type)

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
              <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-3xl bg-white dark:bg-slate-800 text-left align-middle shadow-2xl transition-all border border-gray-200 dark:border-slate-700">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-8 py-6 relative overflow-hidden">
                  {/* Animated background elements */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full mix-blend-overlay filter blur-xl opacity-70 animate-pulse"></div>
                    <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full mix-blend-overlay filter blur-xl opacity-50 animate-pulse animation-delay-2000"></div>
                  </div>
                  
                  <div className="flex items-center justify-between relative">
                    <div className="flex items-center space-x-4">
                      {selectedType && (
                        <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg border border-white/30">
                          <selectedType.icon className="h-8 w-8 text-white" />
                        </div>
                      )}
                      <div>
                        <Dialog.Title as="h3" className="text-2xl font-bold text-white">
                          {node ? 'Editar Nodo' : 'Crear Nuevo Nodo'}
                        </Dialog.Title>
                        <p className="text-blue-100 text-base mt-1">
                          {selectedType?.description || 'Configura tu contenido profesional'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={onClose}
                      className="text-white/80 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/10 backdrop-blur-sm"
                    >
                      <XMarkIcon className="h-7 w-7" />
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8">
                  <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
                    <Tab.List className="flex space-x-2 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-2 mb-8 border border-blue-200 dark:border-blue-800">
                      <Tab className={({ selected }) =>
                        `flex-1 rounded-xl py-3 px-4 text-sm font-semibold leading-5 transition-all duration-300 focus:outline-none
                         ${selected
                          ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-lg border border-blue-200 dark:border-blue-600'
                          : 'text-blue-600 dark:text-blue-400 hover:bg-white/50 dark:hover:bg-slate-700/50 hover:text-blue-700 dark:hover:text-blue-300'
                        }`
                      }>
                        Información Básica
                      </Tab>
                      {formData.type === 'PROJECT' && (
                        <Tab className={({ selected }) =>
                          `flex-1 rounded-xl py-3 px-4 text-sm font-semibold leading-5 transition-all duration-300 focus:outline-none
                           ${selected
                            ? 'bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-lg border border-purple-200 dark:border-purple-600'
                            : 'text-purple-600 dark:text-purple-400 hover:bg-white/50 dark:hover:bg-slate-700/50 hover:text-purple-700 dark:hover:text-purple-300'
                          }`
                        }>
                          Enlaces del Proyecto
                        </Tab>
                      )}
                      <Tab className={({ selected }) =>
                        `flex-1 rounded-xl py-3 px-4 text-sm font-semibold leading-5 transition-all duration-300 focus:outline-none
                         ${selected
                          ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-lg border border-indigo-200 dark:border-indigo-600'
                          : 'text-indigo-600 dark:text-indigo-400 hover:bg-white/50 dark:hover:bg-slate-700/50 hover:text-indigo-700 dark:hover:text-indigo-300'
                        }`
                      }>
                        Contenido
                      </Tab>
                      <Tab className={({ selected }) =>
                        `flex-1 rounded-xl py-3 px-4 text-sm font-semibold leading-5 transition-all duration-300 focus:outline-none
                         ${selected
                          ? 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 shadow-lg border border-gray-200 dark:border-gray-600'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-slate-700/50 hover:text-gray-700 dark:hover:text-gray-300'
                        }`
                      }>
                        Configuración
                      </Tab>
                    </Tab.List>

                    <Tab.Panels>
                      {/* Basic Information Tab */}
                      <Tab.Panel className="space-y-6">
                        {/* Type Selection */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                            Tipo de Nodo
                          </label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {nodeTypes.map((type) => {
                              const Icon = type.icon
                              return (
                                <button
                                  key={type.id}
                                  type="button"
                                  onClick={() => setFormData(prev => ({ ...prev, type: type.id as NodeType }))}
                                  className={`group p-5 rounded-2xl border-2 transition-all duration-300 text-left hover:scale-105 hover:shadow-lg
                                    ${formData.type === type.id
                                      ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 shadow-lg'
                                      : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500 hover:bg-gray-50 dark:hover:bg-slate-700'
                                    }`}
                                >
                                  <div className={`inline-flex p-3 rounded-xl ${type.bgColor} mb-3 group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon className={`h-6 w-6 ${type.color}`} />
                                  </div>
                                  <div className="font-semibold text-gray-900 dark:text-white text-base">{type.name}</div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{type.description}</div>
                                </button>
                              )
                            })}
                          </div>
                        </div>

                        {/* Title */}
                        <div>
                          <label htmlFor="title" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Título *
                          </label>
                          <input
                            type="text"
                            id="title"
                            required
                            value={formData.title || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            className={`block w-full rounded-2xl border-2 border-gray-200 dark:border-slate-600 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-slate-700 dark:text-white text-lg py-3 px-4 transition-all duration-300
                              ${errors.title ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                            placeholder="Nombre descriptivo para tu nodo"
                          />
                          {errors.title && <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                            <XMarkIcon className="h-4 w-4" />
                            {errors.title}
                          </p>}
                        </div>

                        {/* Description */}
                        <div>
                          <label htmlFor="description" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Descripción
                          </label>
                          <textarea
                            id="description"
                            rows={4}
                            value={formData.description || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            className="block w-full rounded-2xl border-2 border-gray-200 dark:border-slate-600 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-slate-700 dark:text-white py-3 px-4 transition-all duration-300"
                            placeholder="Breve descripción de qué trata este nodo"
                          />
                        </div>
                      </Tab.Panel>

                      {/* Project Links Tab */}
                      {formData.type === 'PROJECT' && (
                        <Tab.Panel className="space-y-6">
                          <div className="grid grid-cols-1 gap-6">
                            <div>
                              <label htmlFor="projectUrl" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <GlobeAltIcon className="h-4 w-4 text-blue-500" />
                                URL del Proyecto
                              </label>
                              <input
                                type="url"
                                id="projectUrl"
                                value={formData.projectUrl || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, projectUrl: e.target.value }))}
                                className={`block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500
                                  ${errors.projectUrl ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                                placeholder="https://mi-proyecto.com"
                              />
                              {errors.projectUrl && <p className="mt-1 text-sm text-red-600">{errors.projectUrl}</p>}
                            </div>

                            <div>
                              <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <svg className="h-4 w-4 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                                </svg>
                                URL de GitHub
                              </label>
                              <input
                                type="url"
                                id="githubUrl"
                                value={formData.githubUrl || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
                                className={`block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500
                                  ${errors.githubUrl ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                                placeholder="https://github.com/usuario/proyecto"
                              />
                              {errors.githubUrl && <p className="mt-1 text-sm text-red-600">{errors.githubUrl}</p>}
                            </div>

                            <div>
                              <label htmlFor="demoUrl" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <svg className="h-4 w-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                URL de Demo
                              </label>
                              <input
                                type="url"
                                id="demoUrl"
                                value={formData.demoUrl || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, demoUrl: e.target.value }))}
                                className={`block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500
                                  ${errors.demoUrl ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                                placeholder="https://demo.mi-proyecto.com"
                              />
                              {errors.demoUrl && <p className="mt-1 text-sm text-red-600">{errors.demoUrl}</p>}
                            </div>
                          </div>
                        </Tab.Panel>
                      )}

                      {/* Content Tab */}
                      <Tab.Panel className="space-y-6">
                        <div>
                          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                            Contenido Detallado
                          </label>
                          <textarea
                            id="content"
                            rows={8}
                            value={formData.content || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-mono text-sm"
                            placeholder="Puedes usar Markdown para dar formato al contenido...

# Título
## Subtítulo
- Lista de elementos
- Otro elemento

**Texto en negrita**
*Texto en cursiva*

[Enlace](https://ejemplo.com)"
                          />
                          <p className="mt-1 text-sm text-gray-500 flex items-center gap-2">
                            <DocumentIcon className="h-4 w-4 text-blue-500" />
                            Soporta formato Markdown para texto enriquecido
                          </p>
                        </div>

                        {/* Tags */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                            <HashtagIcon className="h-4 w-4 text-indigo-500" />
                            Etiquetas
                          </label>
                          <div className="flex gap-2 mb-3">
                            <input
                              type="text"
                              value={tagInput}
                              onChange={(e) => setTagInput(e.target.value)}
                              onKeyPress={handleKeyPress}
                              placeholder="Añadir etiqueta..."
                              className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                            <button
                              type="button"
                              onClick={addTag}
                              disabled={!tagInput.trim()}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                              <PlusIcon className="h-4 w-4" />
                              Añadir
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {formData.tags?.map((tag, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                              >
                                {tag}
                                <button
                                  type="button"
                                  onClick={() => removeTag(tag)}
                                  className="text-blue-600 hover:text-blue-800 ml-1"
                                >
                                  <XMarkIcon className="h-3 w-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      </Tab.Panel>

                      {/* Settings Tab */}
                      <Tab.Panel className="space-y-6">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-lg ${formData.isVisible ? 'bg-green-100' : 'bg-gray-100'
                                }`}>
                                {formData.isVisible ? (
                                  <EyeIcon className="h-5 w-5 text-green-600" />
                                ) : (
                                  <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                                )}
                              </div>
                              <div>
                                <label htmlFor="isVisible" className="block font-medium text-gray-900">
                                  Visibilidad del Nodo
                                </label>
                                <p className="text-sm text-gray-500">
                                  {formData.isVisible
                                    ? 'Este nodo será visible en tu portafolio público'
                                    : 'Este nodo estará oculto para los visitantes'
                                  }
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, isVisible: !prev.isVisible }))}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${formData.isVisible ? 'bg-blue-600' : 'bg-gray-200'
                                }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.isVisible ? 'translate-x-6' : 'translate-x-1'
                                  }`}
                              />
                            </button>
                          </div>
                        </div>
                      </Tab.Panel>
                    </Tab.Panels>
                  </Tab.Group>

                  {/* Footer */}
                  <div className="flex justify-between items-center pt-6 border-t border-gray-200 mt-8">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Guardando...
                        </>
                      ) : (
                        <>{node ? 'Actualizar Nodo' : 'Crear Nodo'}</>
                      )}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}