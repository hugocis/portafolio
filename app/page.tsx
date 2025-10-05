'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import {
  CogIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  RocketLaunchIcon,
  GlobeAltIcon,
  EyeIcon,
  HeartIcon,
  CheckIcon,
  ArrowTopRightOnSquareIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import {
  Squares2X2Icon as Squares2X2IconSolid,
  SparklesIcon as SparklesIconSolid,
  StarIcon as StarIconSolid
} from '@heroicons/react/24/solid'

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalPortfolios, setTotalPortfolios] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const fetchFeaturedUsers = async () => {
      try {
        const response = await fetch('/api/users/public')
        if (response.ok) {
          const data: { users: User[] } = await response.json()
          setFeaturedUsers(data.users.slice(0, 6))
          setTotalUsers(data.users.length)
          setTotalPortfolios(data.users.filter(user => user.portfolio).length)
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrollY > 50
        ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-gray-200 dark:border-slate-700 shadow-lg'
        : 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-b border-gray-200 dark:border-slate-700'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <Squares2X2IconSolid className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Portfolio Tree
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/explore"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors relative group"
              >
                Explorar
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </Link>

              {status === 'authenticated' ? (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/dashboard"
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors relative group"
                  >
                    Dashboard
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                  <Link
                    href={`/user/${session.user?.username}`}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    Mi Portfolio
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="inline-flex items-center px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 font-medium transition-colors"
                    title="Cerrar sesión"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/auth/signin"
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors relative group"
                  >
                    Iniciar Sesión
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                  <Link
                    href="/auth/register"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    Comenzar
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors flex-shrink-0"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              ) : (
                <Bars3Icon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-gray-200 dark:border-slate-700 shadow-xl z-50">
              <div className="px-4 py-6 space-y-4">
                <Link
                  href="/explore"
                  className="block py-3 px-4 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Explorar
                </Link>

                {status === 'authenticated' ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="block py-3 px-4 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href={`/user/${session.user?.username}`}
                      className="block py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-center font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Mi Portfolio
                    </Link>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false)
                        signOut({ callbackUrl: '/' })
                      }}
                      className="w-full block py-3 px-4 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 text-left"
                    >
                      Cerrar Sesión
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/signin"
                      className="block py-3 px-4 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Iniciar Sesión
                    </Link>
                    <Link
                      href="/auth/register"
                      className="block py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-center font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Comenzar
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20" ref={heroRef}>
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-indigo-600/5 dark:from-blue-400/10 dark:via-purple-400/10 dark:to-indigo-400/10"></div>
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 dark:bg-purple-700 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 dark:bg-yellow-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 dark:bg-pink-700 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 relative">
          <div className="text-center">
            {/* Status Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-gray-200 dark:border-slate-600 shadow-lg animate-float">
              <SparklesIconSolid className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Crea tu portfolio profesional
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Tu Portfolio en
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-gradient">
                Estructura de Árbol
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Organiza tu trabajo, proyectos y experiencias de forma visual e intuitiva.
              <br className="hidden sm:block" />
              Construye tu historia profesional como un árbol que crece y se ramifica.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              {status === 'authenticated' ? (
                <>
                  <Link
                    href="/dashboard"
                    className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center space-x-3 shadow-xl hover:shadow-2xl hover:scale-105"
                  >
                    <CogIcon className="h-6 w-6 group-hover:rotate-180 transition-transform duration-500" />
                    <span>Ir al Dashboard</span>
                  </Link>
                  <Link
                    href={`/user/${session.user?.username}`}
                    className="group border-2 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-2xl text-lg font-semibold hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 flex items-center space-x-3"
                  >
                    <UserIcon className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                    <span>Ver Mi Portfolio</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/register"
                    className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center space-x-3 shadow-xl hover:shadow-2xl hover:scale-105"
                  >
                    <RocketLaunchIcon className="h-6 w-6 group-hover:-translate-y-1 transition-transform duration-300" />
                    <span>Comenzar Gratis</span>
                  </Link>
                  <Link
                    href="/explore"
                    className="group border-2 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-2xl text-lg font-semibold hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 flex items-center space-x-3"
                  >
                    <EyeIcon className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                    <span>Ver Ejemplos</span>
                  </Link>
                </>
              )}
            </div>


          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-32 bg-white dark:bg-slate-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234F46E5' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='3'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 rounded-full px-6 py-3 mb-6">
              <CheckIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                Características Principales
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              ¿Por qué Portfolio Tree?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Revoluciona la forma en que presentas tu trabajo profesional
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Feature 1 */}
            <div className="group bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-3xl p-8 text-center hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-blue-100 dark:border-blue-800/50">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Squares2X2IconSolid className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Estructura Organizada</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Organiza tu contenido en categorías, proyectos y habilidades de forma jerárquica y visual.
              </p>
              <div className="mt-6 flex justify-center">
                <ArrowTopRightOnSquareIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-3xl p-8 text-center hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-green-100 dark:border-green-800/50">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <CogIcon className="h-10 w-10 text-white group-hover:rotate-180 transition-transform duration-500" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Gestión Fácil</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Dashboard intuitivo para crear, editar y organizar todo tu contenido sin complicaciones.
              </p>
              <div className="mt-6 flex justify-center">
                <ArrowTopRightOnSquareIcon className="h-5 w-5 text-green-600 dark:text-green-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/20 dark:to-violet-900/20 rounded-3xl p-8 text-center hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-purple-100 dark:border-purple-800/50 md:col-span-2 lg:col-span-1">
              <div className="bg-gradient-to-r from-purple-600 to-violet-600 rounded-2xl p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <GlobeAltIcon className="h-10 w-10 text-white group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Compartir Profesional</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                URL limpia y profesional para compartir en aplicaciones de trabajo y redes sociales.
              </p>
              <div className="mt-6 flex justify-center">
                <ArrowTopRightOnSquareIcon className="h-5 w-5 text-purple-600 dark:text-purple-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </div>
            </div>
          </div>

          {/* Additional Features Grid */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { icon: CheckIcon, title: 'Responsive Design', desc: 'Perfecto en todos los dispositivos' },
              { icon: SparklesIconSolid, title: 'Temas Personalizables', desc: 'Adapta el diseño a tu estilo' },
              { icon: RocketLaunchIcon, title: 'Carga Rápida', desc: 'Optimizado para velocidad' }
            ].map((feature, index) => (
              <div key={index} className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-6 text-center hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-300">
                <feature.icon className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Portfolios */}
      {!loading && featuredUsers.length > 0 && (
        <section className="py-20 sm:py-32 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-slate-800 dark:via-blue-900/20 dark:to-indigo-900/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full px-6 py-3 mb-6 border border-gray-200 dark:border-slate-600">
                <StarIconSolid className="h-5 w-5 text-yellow-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Portfolios Destacados
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Inspiración Real
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Descubre cómo otros profesionales utilizan Portfolio Tree para destacar
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredUsers.map((user, index) => (
                <Link key={user.id} href={`/user/${user.username}`} className="group">
                  <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-gray-200 dark:border-slate-700 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
                    {/* Card Header */}
                    <div className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 dark:from-blue-900/30 dark:via-purple-900/30 dark:to-indigo-900/30 p-6">
                      <div className="absolute top-4 right-4">
                        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full p-2">
                          <HeartIcon className="h-5 w-5 text-gray-400 group-hover:text-red-500 transition-colors duration-300" />
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        {user.image ? (
                          <div className="relative">
                            <Image
                              src={user.image}
                              alt={user.name || user.username}
                              width={64}
                              height={64}
                              className="w-16 h-16 rounded-2xl object-cover shadow-lg ring-4 ring-white dark:ring-slate-700"
                            />
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
                          </div>
                        ) : (
                          <div className="relative">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg ring-4 ring-white dark:ring-slate-700">
                              <span className="text-white font-bold text-xl">
                                {(user.name || user.username).charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 dark:text-white text-lg truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                            {user.name || user.username}
                          </h3>
                          <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">@{user.username}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {user.portfolio?.title || 'Portfolio profesional'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-6">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                              {user.portfolio?.nodes?.length || 0}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Nodos</div>
                          </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium px-3 py-1 rounded-full">
                          {index === 0 ? '🏆 Destacado' : index === 1 ? '🔥 Trending' : '⭐ Popular'}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                          Ver portfolio completo
                        </span>
                        <ArrowTopRightOnSquareIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center">
              <Link
                href="/explore"
                className="group inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-xl hover:shadow-2xl hover:scale-105"
              >
                <span>Explorar Todos los Portfolios</span>
                <ArrowRightOnRectangleIcon className="h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 sm:py-32 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-60 h-60 bg-white/5 rounded-full blur-2xl animate-pulse animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-white/30">
              <RocketLaunchIcon className="h-5 w-5 text-white" />
              <span className="text-sm font-medium text-white">
                ¡Comienza tu historia profesional hoy!
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-8 leading-tight">
              ¿Listo para crear tu
              <br />
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                portfolio perfecto?
              </span>
            </h2>

            <p className="text-lg sm:text-xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              {totalUsers > 0 ? (
                <>Únete a los <strong className="text-white">{totalUsers}</strong> profesionales que ya están construyendo su presencia digital de forma innovadora.</>
              ) : (
                <>Sé el primero en construir tu presencia digital de forma innovadora con Portfolio Tree.</>
              )}
            </p>

            {status !== 'authenticated' ? (
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link
                  href="/auth/register"
                  className="group bg-white text-blue-600 px-10 py-5 rounded-2xl text-lg font-bold hover:bg-gray-50 transition-all duration-300 flex items-center justify-center space-x-3 shadow-2xl hover:shadow-3xl hover:scale-105 min-w-[250px]"
                >
                  <RocketLaunchIcon className="h-6 w-6 group-hover:-translate-y-1 transition-transform duration-300" />
                  <span>Comenzar Gratis</span>
                </Link>
                <Link
                  href="/explore"
                  className="group border-2 border-white text-white px-10 py-5 rounded-2xl text-lg font-bold hover:bg-white hover:text-blue-600 transition-all duration-300 flex items-center justify-center space-x-3 min-w-[250px]"
                >
                  <EyeIcon className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                  <span>Ver Ejemplos</span>
                </Link>
              </div>
            ) : (
              <Link
                href="/dashboard"
                className="group bg-white text-blue-600 px-10 py-5 rounded-2xl text-lg font-bold hover:bg-gray-50 transition-all duration-300 inline-flex items-center space-x-3 shadow-2xl hover:shadow-3xl hover:scale-105"
              >
                <CogIcon className="h-6 w-6 group-hover:rotate-180 transition-transform duration-500" />
                <span>Ir al Dashboard</span>
              </Link>
            )}

            {/* Stats */}
            {totalUsers > 0 && (
              <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-white mb-2">{totalPortfolios}</div>
                  <div className="text-blue-100 text-sm font-medium">Portfolios Creados</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-white mb-2">{totalUsers}</div>
                  <div className="text-blue-100 text-sm font-medium">Usuarios Registrados</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-black text-white py-16 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0 5.5-4.5 10-10 10s-10-4.5-10-10 4.5-10 10-10 10 4.5 10 10zm10 0c0 5.5-4.5 10-10 10s-10-4.5-10-10 4.5-10 10-10 10 4.5 10 10z'/%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Main Footer Content */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mr-4 shadow-lg">
                <Squares2X2IconSolid className="h-8 w-8 text-white" />
              </div>
              <span className="text-2xl font-bold">Portfolio Tree</span>
            </div>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Construye y comparte tu historia profesional de forma visual e intuitiva.
            </p>

            <div className="flex justify-center space-x-8 mb-8">
              <Link href="/explore" className="text-gray-400 hover:text-white transition-colors">
                Explorar
              </Link>
              {status !== 'authenticated' && (
                <>
                  <Link href="/auth/signin" className="text-gray-400 hover:text-white transition-colors">
                    Iniciar Sesión
                  </Link>
                  <Link href="/auth/register" className="text-gray-400 hover:text-white transition-colors">
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-slate-800 dark:border-slate-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-400 text-sm text-center md:text-left">
                © 2025 Portfolio Tree. Todos los derechos reservados.
              </p>

              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <span>Hecho con</span>
                <HeartIcon className="h-4 w-4 text-red-500 animate-pulse" />
                <span>por Hugo Cisneros</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
