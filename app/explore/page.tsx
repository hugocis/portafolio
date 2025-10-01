'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline'

interface User {
  id: string
  name: string | null
  username: string
  email: string
  bio: string | null
  image: string | null
  portfolio: {
    id: string
    title: string
    subtitle: string | null
    isPublic: boolean
    nodes: any[]
  } | null
}

export default function ExplorePage() {
  const { data: session } = useSession()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [sortBy, setSortBy] = useState('recent')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users/public')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users || [])
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users
    .filter(user => {
      if (!user.portfolio?.isPublic) return false
      
      const matchesSearch = 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.bio?.toLowerCase().includes(searchTerm.toLowerCase())
      
      if (filterType === 'all') return matchesSearch
      if (filterType === 'projects') {
        return matchesSearch && (user.portfolio?.nodes?.some(node => node.type === 'PROJECT') || false)
      }
      
      return matchesSearch
    })
    .sort((a, b) => {
      if (sortBy === 'projects') {
        return (b.portfolio?.nodes?.length || 0) - (a.portfolio?.nodes?.length || 0)
      }
      if (sortBy === 'name') {
        return (a.name || a.username).localeCompare(b.name || b.username)
      }
      return 0 // recent (default order)
    })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Portfolio Tree
              </span>
            </Link>
            
            <div className="flex items-center space-x-4">
              {session ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href={`/user/${session.user?.username}`}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
                  >
                    Mi Portfolio
                  </Link>
                </>
              ) : (
                <Link
                  href="/"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
                >
                  Comenzar
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Explora Portfolios
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Descubre proyectos increíbles y conéctate con profesionales de todo el mundo
            </p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, usuario o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* Filter */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FunnelIcon className="h-5 w-5 text-gray-400" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Todos</option>
                  <option value="projects">Con Proyectos</option>
                </select>
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="recent">Más Recientes</option>
                <option value="projects">Más Proyectos</option>
                <option value="name">Por Nombre</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                {filteredUsers.length} portfolio{filteredUsers.length !== 1 ? 's' : ''} encontrado{filteredUsers.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredUsers.map((user) => (
                <Link key={user.id} href={`/user/${user.username}`}>
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
                      <div className="flex items-center space-x-4">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.name || user.username}
                            className="w-16 h-16 rounded-xl object-cover shadow-md"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
                            <span className="text-white font-bold text-xl">
                              {(user.name || user.username).charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-lg truncate">
                            {user.name || user.username}
                          </h3>
                          <p className="text-blue-600 text-sm font-medium">@{user.username}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6">
                      {user.bio && (
                        <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
                          {user.bio}
                        </p>
                      )}
                      
                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            {user.portfolio?.nodes?.length || 0}
                          </div>
                          <div className="text-xs text-gray-500 font-medium">Nodos</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">
                            {user.portfolio?.nodes?.filter(node => node.type === 'PROJECT').length || 0}
                          </div>
                          <div className="text-xs text-gray-500 font-medium">Proyectos</div>
                        </div>
                      </div>
                      
                      {/* Technologies */}
                      {user.portfolio?.nodes && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1">
                            {Array.from(
                              new Set(
                                user.portfolio.nodes
                                  .flatMap(node => node.tags || [])
                                  .filter(tag => tag && !['featured'].includes(tag))
                              )
                            ).slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full font-medium"
                              >
                                {tag}
                              </span>
                            ))}
                            {user.portfolio.nodes.flatMap(node => node.tags || []).length > 3 && (
                              <span className="inline-block text-gray-400 text-xs px-2 py-1 font-medium">
                                +{user.portfolio.nodes.flatMap(node => node.tags || []).length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* CTA */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="text-sm text-blue-600 font-medium">
                          Ver Portfolio
                        </span>
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MagnifyingGlassIcon className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No se encontraron portfolios
                </h3>
                <p className="text-gray-600 mb-6">
                  Intenta ajustar tus filtros de búsqueda
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Volver al Inicio
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}