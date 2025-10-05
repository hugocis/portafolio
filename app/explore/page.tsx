'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { Node } from '@prisma/client'
import { ComponentLoading } from '@/components/ui/loading'
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    SparklesIcon,
    HeartIcon,
    ArrowTopRightOnSquareIcon,
    UserGroupIcon,
    RocketLaunchIcon,
    XMarkIcon,
    Bars3Icon,
    AdjustmentsHorizontalIcon,
    CheckIcon,
    GlobeAltIcon,
    ClockIcon,
    ChartBarIcon,
    LanguageIcon,
    ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'
import {
    Squares2X2Icon as Squares2X2IconSolid,
} from '@heroicons/react/24/solid'

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
        nodes: Node[]
    } | null
}

export default function ExplorePage() {
    const { data: session, status } = useSession()
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterType, setFilterType] = useState('all')
    const [sortBy, setSortBy] = useState('recent')
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [scrollY, setScrollY] = useState(0)
    const [filterDropdownOpen, setFilterDropdownOpen] = useState(false)
    const [sortDropdownOpen, setSortDropdownOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element
            if (!target.closest('.dropdown-container')) {
                setFilterDropdownOpen(false)
                setSortDropdownOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

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

    const filterOptions = [
        { value: 'all', label: 'Todos los portfolios', icon: GlobeAltIcon, description: 'Ver todos los portfolios públicos' },
        { value: 'projects', label: 'Con proyectos', icon: RocketLaunchIcon, description: 'Solo portfolios con proyectos' }
    ]

    const sortOptions = [
        { value: 'recent', label: 'Más recientes', icon: ClockIcon, description: 'Ordenar por fecha de creación' },
        { value: 'projects', label: 'Más proyectos', icon: ChartBarIcon, description: 'Ordenar por cantidad de proyectos' },
        { value: 'name', label: 'Por nombre', icon: LanguageIcon, description: 'Ordenar alfabéticamente' }
    ]

    const getFilterLabel = () => filterOptions.find(opt => opt.value === filterType)?.label || 'Todos'
    const getSortLabel = () => sortOptions.find(opt => opt.value === sortBy)?.label || 'Más recientes'

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
                                href="/"
                                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors relative group"
                            >
                                Inicio
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
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
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
                        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-gray-200 dark:border-slate-700 shadow-xl">
                            <div className="px-4 py-6 space-y-4">
                                <Link
                                    href="/"
                                    className="block py-3 px-4 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Inicio
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
            <section className="relative overflow-hidden pt-20">
                {/* Animated Background */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-indigo-600/5 dark:from-blue-400/10 dark:via-purple-400/10 dark:to-indigo-400/10"></div>
                    <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 dark:bg-purple-700 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob"></div>
                    <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 dark:bg-yellow-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 relative">
                    <div className="text-center mb-16">
                        {/* Status Badge */}
                        <div className="inline-flex items-center space-x-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-gray-200 dark:border-slate-600 shadow-lg animate-float">
                            <UserGroupIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Explora la Comunidad
                            </span>
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
                            <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                                Descubre
                            </span>
                            <br />
                            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-gradient">
                                Portfolios Increíbles
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
                            Conecta con profesionales talentosos, descubre proyectos innovadores
                            <br className="hidden sm:block" />
                            y encuentra inspiración para tu próximo gran trabajo.
                        </p>
                    </div>
                </div>
            </section>

            {/* Filters and Search */}
            <section className="py-8 bg-white dark:bg-slate-900 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-gray-200 dark:border-slate-700 p-8 mb-8">
                        <div className="flex flex-col xl:flex-row gap-6 items-center">
                            {/* Search */}
                            <div className="relative flex-1 w-full">
                                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar por nombre, usuario o descripción..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-6 py-4 border-2 border-gray-200 dark:border-slate-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white text-lg transition-all duration-300"
                                />
                            </div>

                            {/* Filter Controls */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 w-full xl:w-auto">
                                {/* Filter Dropdown */}
                                <div className="relative w-full sm:w-auto dropdown-container">
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                        Filtrar por
                                    </label>
                                    <div className="relative">
                                        <button
                                            onClick={() => {
                                                setFilterDropdownOpen(!filterDropdownOpen)
                                                setSortDropdownOpen(false)
                                            }}
                                            className="w-full sm:w-48 bg-white dark:bg-slate-700 border-2 border-gray-200 dark:border-slate-600 rounded-2xl px-4 py-3 text-left focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-500 group"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className="p-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                                                        <AdjustmentsHorizontalIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                    </div>
                                                    <span className="font-medium text-gray-900 dark:text-white">
                                                        {getFilterLabel()}
                                                    </span>
                                                </div>
                                                <svg
                                                    className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${filterDropdownOpen ? 'rotate-180' : ''}`}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </button>

                                        {filterDropdownOpen && (
                                            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-2xl shadow-xl z-50 overflow-hidden animate-dropdown-in">
                                                {filterOptions.map((option, index) => (
                                                    <button
                                                        key={option.value}
                                                        onClick={() => {
                                                            setFilterType(option.value)
                                                            setFilterDropdownOpen(false)
                                                        }}
                                                        className={`w-full px-4 py-4 text-left hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200 border-b border-gray-100 dark:border-slate-700 last:border-b-0 animate-item-in ${filterType === option.value ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                                            }`}
                                                        style={{ animationDelay: `${index * 50}ms` }}
                                                    >
                                                        <div className="flex items-center space-x-3">
                                                            <div className="p-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                                                                <option.icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="font-medium text-gray-900 dark:text-white">
                                                                    {option.label}
                                                                </div>
                                                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                                    {option.description}
                                                                </div>
                                                            </div>
                                                            {filterType === option.value && (
                                                                <CheckIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                            )}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Sort Dropdown */}
                                <div className="relative w-full sm:w-auto dropdown-container">
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                        Ordenar por
                                    </label>
                                    <div className="relative">
                                        <button
                                            onClick={() => {
                                                setSortDropdownOpen(!sortDropdownOpen)
                                                setFilterDropdownOpen(false)
                                            }}
                                            className="w-full sm:w-48 bg-white dark:bg-slate-700 border-2 border-gray-200 dark:border-slate-600 rounded-2xl px-4 py-3 text-left focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-purple-300 dark:hover:border-purple-500 group"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className="p-1.5 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                                                        <FunnelIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                                    </div>
                                                    <span className="font-medium text-gray-900 dark:text-white">
                                                        {getSortLabel()}
                                                    </span>
                                                </div>
                                                <svg
                                                    className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${sortDropdownOpen ? 'rotate-180' : ''}`}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </button>

                                        {sortDropdownOpen && (
                                            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-2xl shadow-xl z-50 overflow-hidden animate-dropdown-in">
                                                {sortOptions.map((option, index) => (
                                                    <button
                                                        key={option.value}
                                                        onClick={() => {
                                                            setSortBy(option.value)
                                                            setSortDropdownOpen(false)
                                                        }}
                                                        className={`w-full px-4 py-4 text-left hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors duration-200 border-b border-gray-100 dark:border-slate-700 last:border-b-0 animate-item-in ${sortBy === option.value ? 'bg-purple-50 dark:bg-purple-900/20' : ''
                                                            }`}
                                                        style={{ animationDelay: `${index * 50}ms` }}
                                                    >
                                                        <div className="flex items-center space-x-3">
                                                            <div className="p-1.5 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                                                                <option.icon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="font-medium text-gray-900 dark:text-white">
                                                                    {option.label}
                                                                </div>
                                                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                                    {option.description}
                                                                </div>
                                                            </div>
                                                            {sortBy === option.value && (
                                                                <CheckIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                                            )}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Results Section */}
            <section className="py-8 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-slate-800 dark:via-blue-900/20 dark:to-indigo-900/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mb-6"></div>
                            <ComponentLoading text="Explorando portfolios..." size="lg" />
                        </div>
                    ) : (
                        <>
                            {/* Results Counter */}
                            <div className="mb-8 text-center">
                                <div className="inline-flex items-center space-x-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full px-6 py-3 border border-gray-200 dark:border-slate-600 shadow-lg">
                                    <SparklesIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                                        {filteredUsers.length} portfolio{filteredUsers.length !== 1 ? 's' : ''} encontrado{filteredUsers.length !== 1 ? 's' : ''}
                                    </span>
                                </div>
                            </div>

                            {/* Portfolio Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
                                {filteredUsers.map((user) => (
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
                                                {/* Bio */}
                                                {user.bio && (
                                                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-6 leading-relaxed">
                                                        {user.bio}
                                                    </p>
                                                )}

                                                {/* Stats */}
                                                <div className="grid grid-cols-2 gap-4 mb-6">
                                                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/30 rounded-2xl">
                                                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                                            {user.portfolio?.nodes?.length || 0}
                                                        </div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Nodos</div>
                                                    </div>
                                                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/30 rounded-2xl">
                                                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                                            {user.portfolio?.nodes?.filter(node => node.type === 'PROJECT').length || 0}
                                                        </div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Proyectos</div>
                                                    </div>
                                                </div>

                                                {/* Technologies */}
                                                {user.portfolio?.nodes && (
                                                    <div className="mb-6">
                                                        <div className="flex flex-wrap gap-2">
                                                            {Array.from(
                                                                new Set(
                                                                    user.portfolio.nodes
                                                                        .flatMap(node => node.tags || [])
                                                                        .filter(tag => tag && !['featured'].includes(tag))
                                                                )
                                                            ).slice(0, 3).map((tag) => (
                                                                <span
                                                                    key={tag}
                                                                    className="inline-block bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-700 dark:text-blue-300 text-xs px-3 py-1.5 rounded-full font-medium border border-blue-200 dark:border-blue-700"
                                                                >
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                            {user.portfolio.nodes.flatMap(node => node.tags || []).length > 3 && (
                                                                <span className="inline-block text-gray-400 dark:text-gray-500 text-xs px-3 py-1.5 font-medium">
                                                                    +{user.portfolio.nodes.flatMap(node => node.tags || []).length - 3}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* CTA */}
                                                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-700">
                                                    <span className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
                                                        Ver Portfolio Completo
                                                    </span>
                                                    <ArrowTopRightOnSquareIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* Empty State */}
                            {filteredUsers.length === 0 && (
                                <div className="text-center py-20">
                                    <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-8">
                                        <MagnifyingGlassIcon className="h-16 w-16 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                        No se encontraron portfolios
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto leading-relaxed">
                                        Intenta ajustar tus filtros de búsqueda o explora diferentes términos
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                        <button
                                            onClick={() => {
                                                setSearchTerm('')
                                                setFilterType('all')
                                                setSortBy('recent')
                                            }}
                                            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                                        >
                                            <SparklesIcon className="h-5 w-5 mr-2" />
                                            Limpiar Filtros
                                        </button>
                                        <Link
                                            href="/"
                                            className="inline-flex items-center px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors font-medium"
                                        >
                                            <RocketLaunchIcon className="h-5 w-5 mr-2" />
                                            Crear Portfolio
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </div>
    )
}