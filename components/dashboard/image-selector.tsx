'use client'

import { useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { XMarkIcon, MagnifyingGlassIcon, PhotoIcon, CheckCircleIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import FileUploader from './file-uploader'

interface Blob {
    id: string
    url: string
    filename: string
    size: number
    mimeType: string
    category: string | null
    createdAt: string
}

interface ImageSelectorProps {
    isOpen: boolean
    onClose: () => void
    onSelect: (images: string[]) => void
    selectedImages?: string[]
    multiSelect?: boolean
}

export function ImageSelector({
    isOpen,
    onClose,
    onSelect,
    selectedImages = [],
    multiSelect = true
}: ImageSelectorProps) {
    const [blobs, setBlobs] = useState<Blob[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [selected, setSelected] = useState<string[]>(selectedImages)
    const [activeTab, setActiveTab] = useState<'gallery' | 'upload'>('gallery')
    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        if (isOpen) {
            fetchBlobs()
            setSelected(selectedImages)
        }
    }, [isOpen, selectedImages])

    const fetchBlobs = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/blobs?limit=100')

            if (response.ok) {
                const data = await response.json()
                // Filter only images
                setBlobs(data.blobs.filter((b: Blob) => b.mimeType.startsWith('image/')))
            }
        } catch (error) {
            console.error('Error fetching blobs:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredBlobs = blobs.filter(blob =>
        blob.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (blob.category && blob.category.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    const handleSelect = (url: string) => {
        if (multiSelect) {
            if (selected.includes(url)) {
                setSelected(selected.filter(u => u !== url))
            } else {
                setSelected([...selected, url])
            }
        } else {
            setSelected([url])
        }
    }

    const handleConfirm = () => {
        onSelect(selected)
        onClose()
    }

    const handleUpload = async (file: File) => {
        setUploading(true)
        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('category', 'project-image')

            const response = await fetch('/api/blobs', {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Failed to upload image')
            }

            const blob = await response.json()

            // Add to selected images
            setSelected([...selected, blob.url])

            // Refresh gallery
            await fetchBlobs()

            // Switch to gallery tab to see the uploaded image
            setActiveTab('gallery')
        } catch (error) {
            console.error('Error uploading image:', error)
            throw error
        } finally {
            setUploading(false)
        }
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
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-6xl transform overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-2xl transition-all">
                                {/* Header */}
                                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                                                <PhotoIcon className="h-6 w-6 text-white" />
                                            </div>
                                            <div>
                                                <Dialog.Title className="text-xl font-bold text-white">
                                                    Seleccionar Imágenes
                                                </Dialog.Title>
                                                <p className="text-sm text-blue-100 mt-0.5">
                                                    {multiSelect ? 'Selecciona una o más imágenes' : 'Selecciona una imagen'}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={onClose}
                                            className="text-white/80 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
                                        >
                                            <XMarkIcon className="h-6 w-6" />
                                        </button>
                                    </div>
                                </div>

                                {/* Tabs */}
                                <div className="border-b border-gray-200 dark:border-slate-700">
                                    <div className="flex">
                                        <button
                                            onClick={() => setActiveTab('gallery')}
                                            className={`flex-1 px-6 py-4 text-sm font-medium transition-all duration-200 relative ${activeTab === 'gallery'
                                                    ? 'text-blue-600 dark:text-blue-400'
                                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                                }`}
                                        >
                                            <span className="flex items-center justify-center gap-2">
                                                <PhotoIcon className="h-5 w-5" />
                                                Galería de Imágenes
                                            </span>
                                            {activeTab === 'gallery' && (
                                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600"></div>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('upload')}
                                            className={`flex-1 px-6 py-4 text-sm font-medium transition-all duration-200 relative ${activeTab === 'upload'
                                                    ? 'text-blue-600 dark:text-blue-400'
                                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                                }`}
                                        >
                                            <span className="flex items-center justify-center gap-2">
                                                <CloudArrowUpIcon className="h-5 w-5" />
                                                Subir Nueva Imagen
                                            </span>
                                            {activeTab === 'upload' && (
                                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600"></div>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Search Bar - Only for gallery tab */}
                                {activeTab === 'gallery' && (
                                    <div className="p-6 border-b border-gray-200 dark:border-slate-700">
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="Buscar por nombre o categoría..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-700 border-2 border-gray-200 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                                            />
                                            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            {searchQuery && (
                                                <button
                                                    onClick={() => setSearchQuery('')}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                >
                                                    <XMarkIcon className="h-5 w-5" />
                                                </button>
                                            )}
                                        </div>
                                        {multiSelect && selected.length > 0 && (
                                            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                                                {selected.length} {selected.length === 1 ? 'imagen seleccionada' : 'imágenes seleccionadas'}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Content */}
                                <div className="p-6 max-h-[60vh] overflow-y-auto">
                                    {activeTab === 'upload' ? (
                                        <div className="max-w-2xl mx-auto">
                                            <div className="mb-6 text-center">
                                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                                    <CloudArrowUpIcon className="h-8 w-8 text-white" />
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                                    Subir Nueva Imagen
                                                </h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    La imagen se agregará automáticamente a tu selección
                                                </p>
                                            </div>

                                            <FileUploader
                                                onUpload={handleUpload}
                                                accept="image/*"
                                                category="project-image"
                                            />

                                            {uploading && (
                                                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                                                    <div className="flex items-center gap-3">
                                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
                                                        <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                                                            Subiendo imagen...
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {selected.length > 0 && (
                                                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                                                    <p className="text-sm font-medium text-green-900 dark:text-green-200 text-center">
                                                        ✓ {selected.length} {selected.length === 1 ? 'imagen seleccionada' : 'imágenes seleccionadas'}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ) : loading ? (
                                        <div className="flex flex-col items-center justify-center py-12">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">Cargando imágenes...</p>
                                        </div>
                                    ) : filteredBlobs.length === 0 ? (
                                        <div className="text-center py-12">
                                            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <PhotoIcon className="h-10 w-10 text-blue-500 dark:text-blue-400" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                                {searchQuery ? 'No se encontraron imágenes' : 'No hay imágenes todavía'}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {searchQuery ? `No hay imágenes que coincidan con "${searchQuery}"` : 'Sube imágenes desde el gestor de archivos'}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                            {filteredBlobs.map((blob) => {
                                                const isSelected = selected.includes(blob.url)
                                                return (
                                                    <button
                                                        key={blob.id}
                                                        onClick={() => handleSelect(blob.url)}
                                                        className={`group relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${isSelected
                                                                ? 'border-blue-500 ring-4 ring-blue-500/20 shadow-lg'
                                                                : 'border-gray-200 dark:border-slate-600 hover:border-blue-300'
                                                            }`}
                                                    >
                                                        <Image
                                                            src={blob.url}
                                                            alt={blob.filename}
                                                            fill
                                                            className="object-cover"
                                                        />

                                                        {/* Overlay */}
                                                        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity ${isSelected ? 'opacity-100' : ''
                                                            }`}>
                                                            <div className="absolute bottom-2 left-2 right-2">
                                                                <p className="text-white text-xs font-medium truncate">
                                                                    {blob.filename}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Selected Indicator */}
                                                        {isSelected && (
                                                            <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1 shadow-lg">
                                                                <CheckCircleIcon className="h-5 w-5 text-white" />
                                                            </div>
                                                        )}

                                                        {/* Category Badge */}
                                                        {blob.category && (
                                                            <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md">
                                                                {blob.category}
                                                            </div>
                                                        )}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="px-6 py-4 bg-gray-50 dark:bg-slate-700/50 border-t border-gray-200 dark:border-slate-700 flex justify-between items-center">
                                    <button
                                        onClick={onClose}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleConfirm}
                                        disabled={selected.length === 0}
                                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        <CheckCircleIcon className="h-5 w-5" />
                                        Confirmar Selección {selected.length > 0 && `(${selected.length})`}
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
