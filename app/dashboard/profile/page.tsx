'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import FileUploader from '@/components/dashboard/file-uploader';
import Image from 'next/image';
import {
  UserCircleIcon,
  CheckIcon,
  XMarkIcon,
  ArrowLeftIcon,
  GlobeAltIcon,
  MapPinIcon,
  EnvelopeIcon,
  CalendarIcon,
  LinkIcon
} from '@heroicons/react/24/outline';
import { UserIcon, DocumentTextIcon, CameraIcon } from '@heroicons/react/24/solid';

interface Profile {
  id: string;
  name: string | null;
  email: string;
  username: string;
  image: string | null;
  bio: string | null;
  website: string | null;
  location: string | null;
  createdAt?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showAvatarUpload, setShowAvatarUpload] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    bio: '',
    website: '',
    location: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/profile');

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setProfile(data);
      setFormData({
        name: data.name || '',
        username: data.username || '',
        bio: data.bio || '',
        website: data.website || '',
        location: data.location || '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError(null);

      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update profile');
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      setSuccess(true);

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', 'avatar');

    const response = await fetch('/api/blobs', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload avatar');
    }

    const blob = await response.json();

    // Update profile with new avatar URL
    const profileResponse = await fetch('/api/profile', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: blob.url }),
    });

    if (!profileResponse.ok) {
      throw new Error('Failed to update profile with new avatar');
    }

    const updatedProfile = await profileResponse.json();
    setProfile(updatedProfile);
    setShowAvatarUpload(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">Failed to load profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 dark:bg-purple-700 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 dark:bg-yellow-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 dark:bg-pink-700 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              <UserCircleIcon className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Configuración de Perfil
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Personaliza tu información y preferencias
              </p>
            </div>
          </div>
        </div>

        {/* Profile Card with Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Avatar Card */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200 dark:border-slate-700 p-4 sm:p-6">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="relative h-24 w-24 sm:h-32 sm:w-32 mx-auto">
                    {profile.image ? (
                      <Image
                        src={profile.image}
                        alt={profile.name || 'Profile'}
                        fill
                        className="rounded-full object-cover ring-4 ring-blue-100 dark:ring-blue-900/30"
                      />
                    ) : (
                      <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center ring-4 ring-blue-100 dark:ring-blue-900/30">
                        <UserIcon className="h-12 w-12 sm:h-16 sm:w-16 text-white" />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setShowAvatarUpload(!showAvatarUpload)}
                    className="absolute bottom-0 right-0 p-1.5 sm:p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
                    title="Cambiar foto"
                  >
                    <CameraIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                </div>

                {showAvatarUpload && (
                  <div className="mb-4">
                    <FileUploader
                      onUpload={handleAvatarUpload}
                      accept="image/*"
                      category="avatar"
                    />
                  </div>
                )}

                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {profile.name || 'Sin nombre'}
                </h2>
                <p className="text-sm sm:text-base text-blue-600 dark:text-blue-400 font-medium mb-4">
                  @{profile.username}
                </p>

                {/* Quick Info */}
                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                  {profile.location && (
                    <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
                      <MapPinIcon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="truncate">{profile.location}</span>
                    </div>
                  )}
                  {profile.website && (
                    <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
                      <GlobeAltIcon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate"
                      >
                        {profile.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
                    <EnvelopeIcon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="truncate">{profile.email}</span>
                  </div>
                  {profile.createdAt && (
                    <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
                      <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span>Desde {new Date(profile.createdAt).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}</span>
                    </div>
                  )}
                </div>

                {/* Public Profile Link */}
                <Link
                  href={`/user/${profile.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 sm:mt-6 inline-flex items-center justify-center gap-2 w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm sm:text-base font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <LinkIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  Ver Portfolio Público
                </Link>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="lg:col-span-2">
            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200 dark:border-slate-700 p-4 sm:p-6 lg:p-8">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b-2 border-gray-200 dark:border-slate-700">
                <div className="p-1.5 sm:p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex-shrink-0">
                  <DocumentTextIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                    Información Personal
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Actualiza tus datos de perfil
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                {/* Name */}
                <div className="group">
                  <label htmlFor="name" className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <UserIcon className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 dark:text-blue-400" />
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    placeholder="Tu nombre completo"
                  />
                </div>

                {/* Username */}
                <div className="group">
                  <label htmlFor="username" className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <svg className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Nombre de Usuario
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                      <span className="text-gray-500 dark:text-gray-400 font-medium text-sm sm:text-base">@</span>
                    </div>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      pattern="[a-zA-Z0-9_-]+"
                      className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
                      placeholder="tunombre"
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Solo letras, números, guiones y guiones bajos
                  </p>
                </div>

                {/* Email (read-only) */}
                <div className="group">
                  <label htmlFor="email" className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <EnvelopeIcon className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 dark:text-green-400" />
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      value={profile.email}
                      disabled
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700/50 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center pointer-events-none">
                      <svg className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                    Tu email está protegido y no se puede cambiar
                  </p>
                </div>

                {/* Bio */}
                <div className="group">
                  <label htmlFor="bio" className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <DocumentTextIcon className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-600 dark:text-yellow-400" />
                    Biografía
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                      {formData.bio.length}/500
                    </span>
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    maxLength={500}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:border-yellow-500 dark:focus:border-yellow-400 focus:ring-4 focus:ring-yellow-500/10 transition-all outline-none resize-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    placeholder="Cuéntanos sobre ti, tu experiencia, tus intereses..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  {/* Website */}
                  <div className="group">
                    <label htmlFor="website" className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <GlobeAltIcon className="h-3 w-3 sm:h-4 sm:w-4 text-indigo-600 dark:text-indigo-400" />
                      Sitio Web
                    </label>
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://tusitio.com"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                  </div>

                  {/* Location */}
                  <div className="group">
                    <label htmlFor="location" className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <MapPinIcon className="h-3 w-3 sm:h-4 sm:w-4 text-red-600 dark:text-red-400" />
                      Ubicación
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Ciudad, País"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:border-red-500 dark:focus:border-red-400 focus:ring-4 focus:ring-red-500/10 transition-all outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl flex items-start gap-2 sm:gap-3 animate-shake">
                    <div className="p-1 bg-red-100 dark:bg-red-900/40 rounded-lg flex-shrink-0">
                      <XMarkIcon className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-red-900 dark:text-red-200 mb-0.5">Error</p>
                      <p className="text-xs sm:text-sm text-red-700 dark:text-red-300 break-words">{error}</p>
                    </div>
                  </div>
                )}

                {/* Success Message */}
                {success && (
                  <div className="p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl flex items-start gap-2 sm:gap-3 animate-slideIn">
                    <div className="p-1 bg-green-100 dark:bg-green-900/40 rounded-lg flex-shrink-0">
                      <CheckIcon className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-green-900 dark:text-green-200 mb-0.5">¡Éxito!</p>
                      <p className="text-xs sm:text-sm text-green-700 dark:text-green-300">Tu perfil ha sido actualizado correctamente</p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4 sm:pt-6 mt-2 border-t-2 border-gray-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => router.push('/dashboard')}
                    className="px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg sm:rounded-xl hover:bg-gray-50 dark:hover:bg-slate-600 transition-all duration-300 border-2 border-gray-200 dark:border-slate-600 hover:scale-105"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:hover:scale-100"
                  >
                    {saving ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="hidden sm:inline">Guardando...</span>
                        <span className="sm:hidden">Guardando...</span>
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <CheckIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="hidden sm:inline">Guardar Cambios</span>
                        <span className="sm:hidden">Guardar</span>
                      </span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
