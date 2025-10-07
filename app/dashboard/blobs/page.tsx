'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import FileUploader from '@/components/dashboard/file-uploader';
import { 
  TrashIcon, 
  PhotoIcon, 
  DocumentIcon,
  FunnelIcon,
  CloudArrowUpIcon,
  ArrowDownTrayIcon,
  ArrowLeftIcon,
  Squares2X2Icon,
  ListBulletIcon,
  MagnifyingGlassIcon,
  ArrowDownCircleIcon
} from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';

interface Blob {
  id: string;
  url: string;
  filename: string;
  size: number;
  mimeType: string;
  category: string | null;
  createdAt: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function BlobsPage() {
  const [blobs, setBlobs] = useState<Blob[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { value: 'all', label: 'Todos los Archivos', icon: 'folder' },
    { value: 'avatar', label: 'Avatares', icon: 'user' },
    { value: 'project-image', label: 'Imágenes de Proyectos', icon: 'photo' },
    { value: 'project-screenshot', label: 'Screenshots', icon: 'camera' },
    { value: 'project-mockup', label: 'Mockups y Diseños', icon: 'sparkles' },
    { value: 'certificate', label: 'Certificados', icon: 'trophy' },
    { value: 'document', label: 'Documentos', icon: 'document' },
    { value: 'cv', label: 'CVs', icon: 'clipboard' },
    { value: 'logo', label: 'Logos', icon: 'star' },
    { value: 'icon', label: 'Iconos', icon: 'star' },
    { value: 'banner', label: 'Banners', icon: 'rectangle' },
  ];

  const fetchBlobs = async (page = 1, category?: string) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      });
      
      if (category && category !== 'all') {
        params.append('category', category);
      }

      const response = await fetch(`/api/blobs?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch blobs');
      }

      const data = await response.json();
      setBlobs(data.blobs);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching blobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlobs(currentPage, selectedCategory);
  }, [currentPage, selectedCategory]);

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    if (selectedCategory !== 'all') {
      formData.append('category', selectedCategory);
    }

    const response = await fetch('/api/blobs', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload file');
    }

    // Refresh the list
    fetchBlobs(currentPage, selectedCategory);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este archivo?')) {
      return;
    }

    try {
      setDeleting(id);
      const response = await fetch(`/api/blobs/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete file');
      }

      // Refresh the list
      fetchBlobs(currentPage, selectedCategory);
    } catch (error) {
      console.error('Error deleting blob:', error);
      alert('Failed to delete file');
    } finally {
      setDeleting(null);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isImage = (mimeType: string) => mimeType.startsWith('image/');

  const copyToClipboard = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Filtrar blobs por búsqueda
  const filteredBlobs = blobs.filter(blob => 
    blob.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (blob.category && blob.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 dark:bg-purple-700 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 dark:bg-yellow-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 dark:bg-pink-700 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Back Button */}
        <Link
          href="/dashboard"
          className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-6 group"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Volver al Dashboard
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
              <CloudArrowUpIcon className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Gestor de Archivos
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Administra tus recursos multimedia
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md">
                <PhotoIcon className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {blobs.filter(b => b.mimeType.startsWith('image/')).length}
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Imágenes</p>
          </div>

          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-md">
                <DocumentIcon className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {blobs.filter(b => !b.mimeType.startsWith('image/')).length}
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Documentos</p>
          </div>

          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-md">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {(blobs.reduce((acc, b) => acc + b.size, 0) / (1024 * 1024)).toFixed(1)}
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">MB Total</p>
          </div>

          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-md">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
              </div>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {pagination?.total || 0}
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Archivos</p>
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200 dark:border-slate-700 p-4 sm:p-6 lg:p-8 mb-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 pb-4 border-b-2 border-gray-200 dark:border-slate-700">
            <div className="p-1.5 sm:p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex-shrink-0">
              <CloudArrowUpIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                Subir Archivo
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Arrastra o selecciona archivos (Max 10MB)
              </p>
            </div>
          </div>
          <FileUploader onUpload={handleUpload} category={selectedCategory !== 'all' ? selectedCategory : undefined} />
        </div>

        {/* Search Bar */}
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-4 sm:p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex-shrink-0">
              <MagnifyingGlassIcon className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Buscar Archivos
            </h3>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por nombre o categoría..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:border-green-500 dark:focus:border-green-400 focus:ring-4 focus:ring-green-500/10 transition-all outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="mt-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Mostrando {filteredBlobs.length} de {blobs.length} archivos
            </p>
          )}
        </div>

        {/* Filter and View Section */}
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-4 sm:p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex-shrink-0">
              <FunnelIcon className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Filtros y Vista
            </h3>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            {/* Category Filter */}
            <div className="flex-1">
              <label htmlFor="category-filter" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Categoría
              </label>
              <select
                id="category-filter"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-lg sm:rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:border-purple-500 dark:focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode Toggle */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Modo de Vista
              </label>
              <div className="flex bg-gray-100 dark:bg-slate-700 rounded-lg sm:rounded-xl p-1.5 border-2 border-gray-200 dark:border-slate-600 shadow-inner">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-md'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                  title="Vista de cuadrícula"
                >
                  <Squares2X2Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden sm:inline text-sm font-medium">Cuadrícula</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-md'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                  title="Vista de lista"
                >
                  <ListBulletIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden sm:inline text-sm font-medium">Lista</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Files Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200 dark:border-slate-700">
            <div className="relative mb-6">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 dark:border-slate-700 border-t-blue-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <CloudArrowUpIcon className="h-8 w-8 text-blue-600 dark:text-blue-400 animate-pulse" />
              </div>
            </div>
            <p className="text-base font-medium text-gray-600 dark:text-gray-400">Cargando archivos...</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Por favor espera un momento</p>
          </div>
        ) : filteredBlobs.length === 0 ? (
          <div className="text-center py-20 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200 dark:border-slate-700">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg ring-4 ring-blue-50 dark:ring-blue-900/20">
              {searchQuery ? (
                <MagnifyingGlassIcon className="h-12 w-12 text-blue-500 dark:text-blue-400" />
              ) : (
                <PhotoIcon className="h-12 w-12 text-blue-500 dark:text-blue-400" />
              )}
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              {searchQuery ? 'No se encontraron archivos' : 'No hay archivos todavía'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              {searchQuery ? `No hay archivos que coincidan con "${searchQuery}"` : 'Sube tu primer archivo usando el formulario de arriba'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Limpiar búsqueda
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Grid View */}
            {viewMode === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {filteredBlobs.map((blob) => (
                <div
                  key={blob.id}
                  className="group bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-slate-700 hover:scale-105"
                >
                  {/* Preview */}
                  <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center overflow-hidden relative">
                    {isImage(blob.mimeType) ? (
                      <Image
                        src={blob.url}
                        alt={blob.filename}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="p-6">
                        <DocumentIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <p className="font-medium text-sm text-gray-900 dark:text-white truncate mb-2" title={blob.filename}>
                      {blob.filename}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                      <span>{formatFileSize(blob.size)}</span>
                      <span>{formatDate(blob.createdAt)}</span>
                    </div>

                    {blob.category && (
                      <div className="mb-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-700/50">
                          {blob.category}
                        </span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => copyToClipboard(blob.url, blob.id)}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all duration-200 relative"
                        title="Copiar URL"
                      >
                        {copiedId === blob.id ? (
                          <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                          </svg>
                        )}
                      </button>
                      <a
                        href={blob.url}
                        download
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                        title="Descargar"
                      >
                        <ArrowDownCircleIcon className="h-4 w-4" />
                      </a>
                      <a
                        href={blob.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center px-3 py-2 text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
                      >
                        Ver
                      </a>
                      
                      <button
                        onClick={() => handleDelete(blob.id)}
                        disabled={deleting === blob.id}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                        title="Eliminar"
                      >
                        {deleting === blob.id ? (
                          <div className="animate-spin h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full"></div>
                        ) : (
                          <TrashIcon className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
            <div className="space-y-3">
              {filteredBlobs.map((blob) => (
                <div
                  key={blob.id}
                  className="group bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-slate-700 hover:scale-[1.02]"
                >
                  <div className="flex flex-col sm:flex-row items-stretch">
                    {/* Preview */}
                    <div className="relative w-full sm:w-32 h-32 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center flex-shrink-0">
                      {isImage(blob.mimeType) ? (
                        <Image
                          src={blob.url}
                          alt={blob.filename}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="p-4">
                          <DocumentIcon className="h-10 w-10 text-gray-400 dark:text-gray-500" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base text-gray-900 dark:text-white truncate mb-1" title={blob.filename}>
                          {blob.filename}
                        </h3>
                        
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            {formatFileSize(blob.size)}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {formatDate(blob.createdAt)}
                          </span>
                          {blob.category && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-700/50">
                              {blob.category}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => copyToClipboard(blob.url, blob.id)}
                          className="p-2.5 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all duration-200 border border-transparent hover:border-green-200 dark:hover:border-green-800"
                          title={copiedId === blob.id ? "¡Copiado!" : "Copiar URL"}
                        >
                          {copiedId === blob.id ? (
                            <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                          )}
                        </button>
                        <a
                          href={blob.url}
                          download
                          className="p-2.5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
                          title="Descargar"
                        >
                          <ArrowDownCircleIcon className="h-5 w-5" />
                        </a>
                        <a
                          href={blob.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2.5 text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                          Ver
                        </a>
                        
                        <button
                          onClick={() => handleDelete(blob.id)}
                          disabled={deleting === blob.id}
                          className="p-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 border border-transparent hover:border-red-200 dark:hover:border-red-800"
                          title="Eliminar"
                        >
                          {deleting === blob.id ? (
                            <div className="animate-spin h-5 w-5 border-2 border-red-600 border-t-transparent rounded-full"></div>
                          ) : (
                            <TrashIcon className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            )}

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="mt-8 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 border-2 border-gray-200 dark:border-slate-600 shadow-md hover:shadow-lg hover:scale-105 disabled:hover:scale-100"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="font-semibold">Anterior</span>
                  </button>
                  
                  <div className="flex items-center gap-3">
                    <div className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg">
                      <span className="text-sm sm:text-base">
                        Página {currentPage} de {pagination.pages}
                      </span>
                    </div>
                    {pagination && (
                      <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg border border-blue-200/50 dark:border-blue-700/50">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {pagination.total} total
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === pagination.pages}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 border-2 border-gray-200 dark:border-slate-600 shadow-md hover:shadow-lg hover:scale-105 disabled:hover:scale-100"
                  >
                    <span className="font-semibold">Siguiente</span>
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
