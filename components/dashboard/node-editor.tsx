'use client'

import { useState, useEffect } from 'react'
import { Node, NodeType } from '@prisma/client'
import { Dialog, Transition, Tab } from '@headlessui/react'
import { XMarkIcon, PlusIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
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
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {selectedType && (
                        <div className={`p-2 rounded-lg ${selectedType.bgColor}`}>
                          <selectedType.icon className={`h-6 w-6 ${selectedType.color}`} />
                        </div>
                      )}
                      <div>
                        <Dialog.Title as="h3" className="text-lg font-medium text-white">
                          {node ? 'Editar Nodo' : 'Crear Nuevo Nodo'}
                        </Dialog.Title>
                        <p className="text-blue-100 text-sm">
                          {selectedType?.description || 'Configura tu contenido'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={onClose}
                      className="text-blue-100 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                  <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
                    <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1 mb-6">
                      <Tab className={({ selected }) =>
                        `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all
                         ${selected
                          ? 'bg-white text-blue-700 shadow'
                          : 'text-blue-600 hover:bg-white/[0.12] hover:text-blue-700'
                        }`
                      }>
                        Información Básica
                      </Tab>
                      {formData.type === 'PROJECT' && (
                        <Tab className={({ selected }) =>
                          `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all
                           ${selected
                            ? 'bg-white text-blue-700 shadow'
                            : 'text-blue-600 hover:bg-white/[0.12] hover:text-blue-700'
                          }`
                        }>
                          Enlaces del Proyecto
                        </Tab>
                      )}
                      <Tab className={({ selected }) =>
                        `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all
                         ${selected
                          ? 'bg-white text-blue-700 shadow'
                          : 'text-blue-600 hover:bg-white/[0.12] hover:text-blue-700'
                        }`
                      }>
                        Contenido
                      </Tab>
                      <Tab className={({ selected }) =>
                        `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all
                         ${selected
                          ? 'bg-white text-blue-700 shadow'
                          : 'text-blue-600 hover:bg-white/[0.12] hover:text-blue-700'
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
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Tipo de Nodo
                          </label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {nodeTypes.map((type) => {
                              const Icon = type.icon
                              return (
                                <button
                                  key={type.id}
                                  type="button"
                                  onClick={() => setFormData(prev => ({ ...prev, type: type.id as NodeType }))}
                                  className={`p-4 rounded-lg border-2 transition-all text-left
                                    ${formData.type === type.id
                                      ? 'border-blue-500 bg-blue-50'
                                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                  <div className={`inline-flex p-2 rounded-lg ${type.bgColor} mb-2`}>
                                    <Icon className={`h-5 w-5 ${type.color}`} />
                                  </div>
                                  <div className="font-medium text-gray-900 text-sm">{type.name}</div>
                                  <div className="text-xs text-gray-500">{type.description}</div>
                                </button>
                              )
                            })}
                          </div>
                        </div>

                        {/* Title */}
                        <div>
                          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Título *
                          </label>
                          <input
                            type="text"
                            id="title"
                            required
                            value={formData.title || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            className={`block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg
                              ${errors.title ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                            placeholder="Nombre descriptivo para tu nodo"
                          />
                          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                        </div>

                        {/* Description */}
                        <div>
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Descripción
                          </label>
                          <textarea
                            id="description"
                            rows={3}
                            value={formData.description || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Breve descripción de qué trata este nodo"
                          />
                        </div>
                      </Tab.Panel>

                      {/* Project Links Tab */}
                      {formData.type === 'PROJECT' && (
                        <Tab.Panel className="space-y-6">
                          <div className="grid grid-cols-1 gap-6">
                            <div>
                              <label htmlFor="projectUrl" className="block text-sm font-medium text-gray-700 mb-1">
                                🌐 URL del Proyecto
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
                              <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700 mb-1">
                                🐙 URL de GitHub
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
                              <label htmlFor="demoUrl" className="block text-sm font-medium text-gray-700 mb-1">
                                🎥 URL de Demo
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
                          <p className="mt-1 text-sm text-gray-500">
                            📝 Soporta formato Markdown para texto enriquecido
                          </p>
                        </div>

                        {/* Tags */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
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