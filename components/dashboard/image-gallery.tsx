'use client'

import { useState } from 'react'
import Image from 'next/image'
import { XMarkIcon, PhotoIcon, PlusIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline'
import { ImageSelector } from './image-selector'

interface ImageGalleryProps {
    images: string[]
    onChange: (images: string[]) => void
    maxImages?: number
}

export function ImageGallery({ images = [], onChange, maxImages }: ImageGalleryProps) {
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
    const [showSelector, setShowSelector] = useState(false)

    const handleDragStart = (index: number) => {
        setDraggedIndex(index)
    }

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault()

        if (draggedIndex === null || draggedIndex === index) return

        const newImages = [...images]
        const draggedImage = newImages[draggedIndex]

        newImages.splice(draggedIndex, 1)
        newImages.splice(index, 0, draggedImage)

        onChange(newImages)
        setDraggedIndex(index)
    }

    const handleDragEnd = () => {
        setDraggedIndex(null)
    }

    const handleRemove = (index: number) => {
        const newImages = images.filter((_, i) => i !== index)
        onChange(newImages)
    }

    const handleAddImages = (selectedImages: string[]) => {
        let newImages: string[]
        if (maxImages && images.length + selectedImages.length > maxImages) {
            const available = maxImages - images.length
            newImages = [...images, ...selectedImages.slice(0, available)]
        } else {
            newImages = [...images, ...selectedImages]
        }

        onChange(newImages)
    }

    const canAddMore = !maxImages || images.length < maxImages

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Galería de Imágenes
                    {maxImages && (
                        <span className="ml-2 text-xs font-normal text-gray-500 dark:text-gray-400">
                            ({images.length}/{maxImages})
                        </span>
                    )}
                </label>
                {canAddMore && (
                    <button
                        type="button"
                        onClick={() => setShowSelector(true)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                        <PlusIcon className="h-4 w-4" />
                        Añadir Imágenes
                    </button>
                )}
            </div>

            {images.length === 0 ? (
                <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-2xl p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <PhotoIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                        No hay imágenes en la galería
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
                        Añade imágenes para mostrar en tu proyecto
                    </p>
                    <button
                        type="button"
                        onClick={() => setShowSelector(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        <PlusIcon className="h-5 w-5" />
                        Seleccionar Imágenes
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {images.map((url, index) => (
                        <div
                            key={`${url}-${index}`}
                            draggable
                            onDragStart={() => handleDragStart(index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragEnd={handleDragEnd}
                            className={`group relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 dark:border-slate-600 cursor-move transition-all duration-200 hover:scale-105 hover:shadow-xl ${draggedIndex === index ? 'opacity-50 scale-95' : ''
                                }`}
                        >
                            <Image
                                src={url}
                                alt={`Imagen ${index + 1}`}
                                fill
                                className="object-cover"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="absolute bottom-0 left-0 right-0 p-2 flex items-center justify-between">
                                    <div className="flex items-center gap-1 text-white text-xs font-medium bg-black/30 backdrop-blur-sm px-2 py-1 rounded">
                                        <ArrowsUpDownIcon className="h-3 w-3" />
                                        Arrastrar
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemove(index)}
                                        className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-lg"
                                        title="Eliminar imagen"
                                    >
                                        <XMarkIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Position Badge */}
                            <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                                {index + 1}
                            </div>
                        </div>
                    ))}

                    {/* Add More Button (in grid) */}
                    {canAddMore && images.length > 0 && (
                        <button
                            type="button"
                            onClick={() => setShowSelector(true)}
                            className="aspect-square rounded-xl border-2 border-dashed border-gray-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 bg-gray-50 dark:bg-slate-700/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 flex flex-col items-center justify-center gap-2 group"
                        >
                            <div className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full group-hover:scale-110 transition-transform">
                                <PlusIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                Añadir más
                            </span>
                        </button>
                    )}
                </div>
            )}

            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <ArrowsUpDownIcon className="h-4 w-4" />
                Arrastra las imágenes para reordenarlas
            </p>

            {/* Image Selector Modal */}
            <ImageSelector
                isOpen={showSelector}
                onClose={() => setShowSelector(false)}
                onSelect={handleAddImages}
                selectedImages={images}
                multiSelect={true}
            />
        </div>
    )
}
