'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FileUploader from '@/components/dashboard/file-uploader';
import { 
  TrashIcon, 
  PhotoIcon, 
  DocumentIcon,
  FunnelIcon,
  MagnifyingGlassIcon 
} from '@heroicons/react/24/outline';

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
  const router = useRouter();
  const [blobs, setBlobs] = useState<Blob[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const categories = [
    { value: 'all', label: 'All Files' },
    { value: 'avatar', label: 'Avatars' },
    { value: 'project-image', label: 'Project Images' },
    { value: 'document', label: 'Documents' },
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
    if (!confirm('Are you sure you want to delete this file?')) {
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">File Manager</h1>
        <p className="mt-2 text-gray-600">
          Upload and manage your files
        </p>
      </div>

      {/* Upload Section */}
      <div className="mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Upload File</h2>
          <FileUploader onUpload={handleUpload} category={selectedCategory !== 'all' ? selectedCategory : undefined} />
        </div>
      </div>

      {/* Filter Section */}
      <div className="mb-6 flex items-center gap-4">
        <FunnelIcon className="h-5 w-5 text-gray-400" />
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setCurrentPage(1);
          }}
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
        
        {pagination && (
          <div className="ml-auto text-sm text-gray-600">
            {pagination.total} {pagination.total === 1 ? 'file' : 'files'}
          </div>
        )}
      </div>

      {/* Files Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : blobs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-gray-600">No files yet</p>
          <p className="text-sm text-gray-500">Upload your first file above</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {blobs.map((blob) => (
              <div
                key={blob.id}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* Preview */}
                <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                  {isImage(blob.mimeType) ? (
                    <img
                      src={blob.url}
                      alt={blob.filename}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <DocumentIcon className="h-16 w-16 text-gray-400" />
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <p className="font-medium text-sm text-gray-900 truncate" title={blob.filename}>
                    {blob.filename}
                  </p>
                  
                  <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                    <span>{formatFileSize(blob.size)}</span>
                    <span>{formatDate(blob.createdAt)}</span>
                  </div>

                  {blob.category && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {blob.category}
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-4 flex gap-2">
                    <a
                      href={blob.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                    >
                      View
                    </a>
                    
                    <button
                      onClick={() => handleDelete(blob.id)}
                      disabled={deleting === blob.id}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                      title="Delete"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <span className="text-sm text-gray-600">
                Page {currentPage} of {pagination.pages}
              </span>
              
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === pagination.pages}
                className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
