'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import {
  Squares2X2Icon,
  CogIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  RocketLaunchIcon,
  SparklesIcon,
  GlobeAltIcon,
  EyeIcon,
  HeartIcon
} from '@heroicons/react/24/outline'

import { Node } from '@prisma/client'

interface User {
  id: string
  name: string | null
  username: string
  image: string | null
  portfolio: {
    title: string
    nodes: Node[]
  } | null
}

export default function HomePage() {
  const { data: session, status } = useSession()
  const [featuredUsers, setFeaturedUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedUsers = async () => {
      try {
        const response = await fetch('/api/users/public')
        if (response.ok) {
          const data: { users: User[] } = await response.json()
          setFeaturedUsers(data.users.slice(0, 3))
        }
      } catch (error) {
        console.error('Error fetching featured users:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedUsers()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Squares2X2Icon className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Portfolio Tree
              </span>
            </Link>

            <div className="flex items-center space-x-4">
              <Link
                href="/explore"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Explorar
              </Link>

              {status === 'authenticated' ? (
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
                <>
                  <Link
                    href="/auth/signin"
                    className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    href="/auth/register"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
                  >
                    Comenzar
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-gray-200">
              <SparklesIcon className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                Crea tu portfolio profesional
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-8">
              <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Tu Portfolio en
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Estructura de Árbol
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Organiza tu trabajo, proyectos y experiencias de forma visual e intuitiva.
              Construye tu historia profesional como un árbol que crece y se ramifica.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {status === 'authenticated' ? (
                <>
                  <Link
                    href="/dashboard"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 shadow-lg"
                  >
                    <CogIcon className="h-6 w-6" />
                    <span>Ir al Dashboard</span>
                  </Link>
                  <Link
                    href={`/user/${session.user?.username}`}
                    className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 flex items-center space-x-2"
                  >
                    <UserIcon className="h-6 w-6" />
                    <span>Ver Mi Portfolio</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/register"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 shadow-lg"
                  >
                    <RocketLaunchIcon className="h-6 w-6" />
                    <span>Comenzar Gratis</span>
                  </Link>
                  <Link
                    href="/explore"
                    className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 flex items-center space-x-2"
                  >
                    <EyeIcon className="h-6 w-6" />
                    <span>Ver Ejemplos</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ¿Por qué Portfolio Tree?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Revoluciona la forma en que presentas tu trabajo profesional
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 text-center">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Squares2X2Icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Estructura Organizada</h3>
              <p className="text-gray-600 leading-relaxed">
                Organiza tu contenido en categorías, proyectos y habilidades de forma jerárquica y visual.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-8 text-center">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <CogIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Gestión Fácil</h3>
              <p className="text-gray-600 leading-relaxed">
                Dashboard intuitivo para crear, editar y organizar todo tu contenido sin complicaciones.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-2xl p-8 text-center">
              <div className="bg-gradient-to-r from-purple-600 to-violet-600 rounded-xl p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <GlobeAltIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Compartir Profesional</h3>
              <p className="text-gray-600 leading-relaxed">
                URL limpia y profesional para compartir en aplicaciones de trabajo y redes sociales.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Portfolios */}
      {!loading && featuredUsers.length > 0 && (
        <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Portfolios Destacados
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Descubre cómo otros profesionales utilizan Portfolio Tree
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {featuredUsers.map((user) => (
                <Link key={user.id} href={`/user/${user.username}`}>
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 overflow-hidden">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
                      <div className="flex items-center space-x-4">
                        {user.image ? (
                          <Image
                            src={user.image}
                            alt={user.name || user.username}
                            width={64}
                            height={64}
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

                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 font-medium">
                          {user.portfolio?.nodes?.length || 0} nodos
                        </span>
                        <HeartIcon className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center">
              <Link
                href="/explore"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
              >
                <span>Ver Todos los Portfolios</span>
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            ¿Listo para crear tu portfolio?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Únete a profesionales que ya están construyendo su presencia digital de forma innovadora
          </p>

          {status !== 'authenticated' ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/register"
                className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <RocketLaunchIcon className="h-6 w-6" />
                <span>Comenzar Gratis</span>
              </Link>
              <Link
                href="/explore"
                className="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <EyeIcon className="h-6 w-6" />
                <span>Ver Ejemplos</span>
              </Link>
            </div>
          ) : (
            <Link
              href="/dashboard"
              className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all duration-200 inline-flex items-center space-x-2"
            >
              <CogIcon className="h-6 w-6" />
              <span>Ir al Dashboard</span>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg mr-3">
                <Squares2X2Icon className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold">Portfolio Tree</span>
            </div>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Construye y comparte tu historia profesional de forma visual e intuitiva
            </p>

            <div className="flex justify-center space-x-8 mb-8">
              <Link href="/explore" className="text-gray-400 hover:text-white transition-colors">
                Explorar
              </Link>
              <Link href="/auth/signin" className="text-gray-400 hover:text-white transition-colors">
                Iniciar Sesión
              </Link>
              <Link href="/auth/register" className="text-gray-400 hover:text-white transition-colors">
                Registrarse
              </Link>
            </div>

            <div className="border-t border-gray-800 pt-8">
              <p className="text-gray-500 text-sm">
                © 2024 Portfolio Tree. Construye tu presencia digital profesional.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
