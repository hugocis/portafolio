'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { Node } from '@prisma/client'
import { NodeEditor } from '@/components/dashboard/node-editor'
import { NodeInspector } from '@/components/portfolio/node-inspector'
import { InteractiveTree } from '@/components/portfolio/interactive-tree'
import { ConfirmationDialog } from '@/components/dashboard/confirmation-dialog'
import { BackToTop } from '@/components/ui/back-to-top'
import { LayoutSelector, LayoutType } from '@/components/portfolio/layout-selector'
import { TimelineLayout } from '@/components/portfolio/timeline-layout'
import { KanbanLayout } from '@/components/portfolio/kanban-layout'
import { GridLayout } from '@/components/portfolio/grid-layout'
import { PageLoading } from '@/components/ui/loading'
import { ArrowRightStartOnRectangleIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { Squares2X2Icon as Squares2X2IconSolid, SparklesIcon as SparklesIconSolid, FolderPlusIcon } from '@heroicons/react/24/solid'

export default function DashboardPage() {
    const { data: session, status } = useSession()
    const [nodes, setNodes] = useState<Node[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedNode, setSelectedNode] = useState<Node | null>(null)
    const [isEditorOpen, setIsEditorOpen] = useState(false)
    const [isInspectorOpen, setIsInspectorOpen] = useState(false)
    const [parentNodeId, setParentNodeId] = useState<string | null>(null)
    const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>(undefined)
    const [isOwner, setIsOwner] = useState(false)
    const [currentLayout, setCurrentLayout] = useState<LayoutType>('tree')
    const [scrollY, setScrollY] = useState(0)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [forceRootCategory, setForceRootCategory] = useState(false)
    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean
        title: string
        message: string
        onConfirm: () => void
        loading: boolean
    }>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
        loading: false
    })

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        if (status === 'authenticated') {
            fetchNodes()
            setIsOwner(true)
        }
    }, [status])

    const fetchNodes = async () => {
        try {
            const response = await fetch('/api/nodes')

            if (response.ok) {
                const data = await response.json()
                setNodes(data.nodes)
            }
        } catch (error) {
            console.error('Error fetching nodes:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleNodeAdd = (parentId?: string, isRootCategory = false) => {
        setSelectedNode(null)
        setParentNodeId(parentId || null)
        setForceRootCategory(isRootCategory)
        setIsEditorOpen(true)
    }

    const handleCreateRootCategory = () => {
        handleNodeAdd(undefined, true)
    }

    const handleNodeEdit = (node: Node) => {
        setSelectedNode(node)
        setParentNodeId(null)
        setIsEditorOpen(true)
    }

    const handleNodeDelete = async (nodeId: string) => {
        const nodeToDelete = nodes.find(n => n.id === nodeId)

        setConfirmDialog({
            isOpen: true,
            title: 'Eliminar Nodo',
            message: `¿Estás seguro de que quieres eliminar "${nodeToDelete?.title}"? Esta acción eliminará también todos los nodos hijos y no se puede deshacer.`,
            loading: false,
            onConfirm: async () => {
                setConfirmDialog(prev => ({ ...prev, loading: true }))

                try {
                    const response = await fetch(`/api/nodes/${nodeId}`, {
                        method: 'DELETE'
                    })

                    if (response.ok) {
                        await fetchNodes()
                        setConfirmDialog({
                            isOpen: false,
                            title: '',
                            message: '',
                            onConfirm: () => { },
                            loading: false
                        })
                    } else {
                        throw new Error('Failed to delete node')
                    }
                } catch (error) {
                    console.error('Error deleting node:', error)
                    setConfirmDialog(prev => ({ ...prev, loading: false }))
                }
            }
        })
    }

    const handleNodeClick = (node: Node) => {
        setSelectedNodeId(node.id)
        setSelectedNode(node)
        setIsInspectorOpen(true)
    }

    const handleNodeInspectorClose = () => {
        setIsInspectorOpen(false)
        setSelectedNode(null)
    }

    const handleNodeSave = async (nodeData: Partial<Node>) => {
        try {
            const url = selectedNode ? `/api/nodes/${selectedNode.id}` : '/api/nodes'
            const method = selectedNode ? 'PUT' : 'POST'

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(nodeData),
            })

            if (!response.ok) {
                throw new Error('Failed to save node')
            }

            await fetchNodes()
            setIsEditorOpen(false)
            setSelectedNode(null)
            setParentNodeId(null)
        } catch (error) {
            console.error('Error saving node:', error)
            throw error // Re-throw so the NodeEditor can handle it
        }
    }

    if (status === 'loading' || loading) {
        return <PageLoading text="Cargando dashboard..." />
    }

    if (status === 'unauthenticated') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
                    <p className="text-gray-600 mb-4">You need to be signed in to access the dashboard.</p>
                    <Link
                        href="/api/auth/signin"
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                        Sign In
                    </Link>
                </div>
            </div>
        )
    }

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

                        {/* Center Title - Hidden on mobile */}
                        <div className="hidden md:flex flex-1 justify-center absolute left-1/2 transform -translate-x-1/2">
                            <div className="relative px-6 py-2.5 rounded-2xl overflow-hidden group cursor-default">
                                {/* Animated gradient background layers */}
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-5 group-hover:opacity-15 transition-opacity duration-500"></div>
                                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-10 blur-xl transition-all duration-700 animate-gradient-shift"></div>

                                {/* Shine effect */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                                </div>

                                {/* Subtle border glow */}
                                <div className="absolute inset-0 rounded-2xl ring-1 ring-gray-200/50 dark:ring-gray-700/50 group-hover:ring-purple-500/30 group-hover:ring-2 transition-all duration-300"></div>

                                {/* Content */}
                                <h1 className="relative text-lg font-bold flex items-center gap-2 whitespace-nowrap">
                                    <span className="relative">
                                        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-shift bg-[length:200%_auto] font-extrabold">
                                            Dashboard
                                        </span>
                                        {/* Sparkle effect on hover */}
                                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-br from-yellow-400 to-pink-500 rounded-full opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-0 transition-all duration-300 blur-[1px] animate-pulse"></span>
                                    </span>
                                    <span className="text-gray-400 dark:text-gray-500 group-hover:text-purple-400 dark:group-hover:text-purple-500 transition-colors duration-300">•</span>
                                    <span className="text-gray-900 dark:text-white font-semibold group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                                        {session?.user?.name || session?.user?.username}
                                    </span>
                                </h1>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-4">
                            <Link
                                href="/"
                                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors relative group"
                            >
                                Inicio
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                            </Link>
                            <Link
                                href="/explore"
                                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors relative group"
                            >
                                Explorar
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                            </Link>
                            <Link
                                href={`/user/${session?.user?.username}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:scale-105"
                            >
                                Mi Portfolio
                            </Link>
                            <button
                                onClick={() => signOut({ callbackUrl: '/' })}
                                className="inline-flex items-center px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 font-medium transition-colors"
                                title="Cerrar sesión"
                            >
                                <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
                            </button>
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
                        <>
                            {/* Backdrop */}
                            <div
                                className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                                onClick={() => setMobileMenuOpen(false)}
                            />
                            <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-gray-200 dark:border-slate-700 shadow-xl z-50">
                                <div className="px-4 py-6 space-y-4">
                                    <Link
                                        href="/"
                                        className="block py-3 px-4 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Inicio
                                    </Link>
                                    <Link
                                        href="/explore"
                                        className="block py-3 px-4 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Explorar
                                    </Link>
                                    <Link
                                        href={`/user/${session?.user?.username}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
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
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-20 z-10">
                {/* Animated Background */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-indigo-600/5 dark:from-blue-400/10 dark:via-purple-400/10 dark:to-indigo-400/10"></div>
                    <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 dark:bg-purple-700 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob"></div>
                    <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 dark:bg-yellow-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 dark:bg-pink-700 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center space-x-2 text-sm mb-6">
                        <Link href="/" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            Inicio
                        </Link>
                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-gray-900 dark:text-white font-medium">Dashboard</span>
                    </nav>
                    <div className="text-center mb-8">
                        {/* Status Badge */}
                        <div className="inline-flex items-center space-x-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full px-6 py-3 mb-6 border border-gray-200 dark:border-slate-600 shadow-lg animate-float">
                            <SparklesIconSolid className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                ¡Bienvenido de vuelta, {session?.user?.name || session?.user?.username}!
                            </span>
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                            <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                                Tu
                            </span>
                            {' '}
                            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-gradient">
                                Dashboard Creativo
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                            Construye, organiza y administra tu portfolio profesional.
                            <br className="hidden sm:block" />
                            Cada nodo es una pieza de tu historia profesional.
                        </p>

                        {/* Layout Selector */}
                        <div className="flex justify-center relative z-[9997]">
                            <LayoutSelector
                                currentLayout={currentLayout}
                                onLayoutChange={setCurrentLayout}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Content */}
            <div className="bg-white dark:bg-slate-900 relative z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                    {/* Main Layout - Responsive */}
                    <div className="space-y-6">
                        {/* Mobile Sidebar - Above content on mobile */}
                        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            {/* Acciones */}
                            <div className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200 dark:border-slate-700 p-4 sm:p-6">
                                <div className="flex items-center mb-4 sm:mb-6">
                                    <div className="p-1.5 sm:p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg sm:rounded-xl mr-2 sm:mr-3 shadow-lg">
                                        <svg className="h-4 w-4 sm:h-5 sm:w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                                        Acciones
                                    </h3>
                                </div>
                                <div className="space-y-2 sm:space-y-3">
                                    {/* Dropdown Button for Add */}
                                    <div className="relative">
                                        <button
                                            onClick={handleCreateRootCategory}
                                            className="w-full inline-flex items-center justify-center px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm sm:text-base font-semibold rounded-xl sm:rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                                        >
                                            <FolderPlusIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                                            Nueva Categoría
                                        </button>
                                    </div>
                                    <Link
                                        href="/dashboard/profile"
                                        className="w-full inline-flex items-center justify-center px-3 sm:px-4 py-2 sm:py-3 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 text-sm sm:text-base font-medium rounded-xl sm:rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-600 transition-all duration-300 border-2 border-gray-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500"
                                    >
                                        <svg className="h-4 w-4 sm:h-5 sm:w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Perfil
                                    </Link>
                                    <Link
                                        href="/dashboard/blobs"
                                        className="w-full inline-flex items-center justify-center px-3 sm:px-4 py-2 sm:py-3 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 text-sm sm:text-base font-medium rounded-xl sm:rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-600 transition-all duration-300 border-2 border-gray-200 dark:border-slate-600 hover:border-purple-300 dark:hover:border-purple-500"
                                    >
                                        <svg className="h-4 w-4 sm:h-5 sm:w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        Archivos
                                    </Link>
                                    <Link
                                        href={`/user/${session?.user?.username}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full inline-flex items-center justify-center px-3 sm:px-4 py-2 sm:py-3 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 text-sm sm:text-base font-medium rounded-xl sm:rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-600 transition-all duration-300 border-2 border-gray-200 dark:border-slate-600 hover:border-green-300 dark:hover:border-green-500"
                                    >
                                        <svg className="h-4 w-4 sm:h-5 sm:w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2M6 18L18 6M8 6h10v10" />
                                        </svg>
                                        Ver
                                    </Link>
                                </div>
                            </div>

                            {/* Estadísticas */}
                            <div className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200 dark:border-slate-700 p-4 sm:p-6">
                                <div className="flex items-center mb-4 sm:mb-6">
                                    <div className="p-1.5 sm:p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg sm:rounded-xl mr-2 sm:mr-3 shadow-lg">
                                        <svg className="h-4 w-4 sm:h-5 sm:w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                                        Stats
                                    </h3>
                                </div>
                                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                    <div className="text-center p-2 sm:p-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl border border-blue-200/50 dark:border-blue-700/50">
                                        <div className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">{nodes.length}</div>
                                        <div className="text-xs font-medium text-gray-700 dark:text-gray-300">Total</div>
                                    </div>
                                    <div className="text-center p-2 sm:p-3 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-800/30 rounded-xl border border-green-200/50 dark:border-green-700/50">
                                        <div className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400 mb-1">{nodes.filter(n => n.isVisible).length}</div>
                                        <div className="text-xs font-medium text-gray-700 dark:text-gray-300">Públicos</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main grid layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
                            {/* Portfolio Content */}
                            <div className="lg:col-span-3">
                                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
                                    <div className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 dark:from-blue-900/30 dark:via-purple-900/30 dark:to-indigo-900/30 px-6 py-6 border-b border-gray-200 dark:border-slate-700">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="flex items-center space-x-3 mb-1">
                                                    {currentLayout === 'tree' && (
                                                        <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                                            <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h3m0 0h9a2 2 0 002-2V9a2 2 0 00-2-2h-9m0 0V5a2 2 0 012-2h7a2 2 0 012 2v2m-9 4h2.5A1.5 1.5 0 0114 10v1.5a1.5 1.5 0 01-1.5 1.5H12" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                    {currentLayout === 'timeline' && (
                                                        <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                                            <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                    {currentLayout === 'kanban' && (
                                                        <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                                            <svg className="h-5 w-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                    {currentLayout === 'grid' && (
                                                        <div className="p-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                                                            <svg className="h-5 w-5 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                                        {currentLayout === 'tree' && 'Árbol de Portfolio'}
                                                        {currentLayout === 'timeline' && 'Vista Timeline'}
                                                        {currentLayout === 'kanban' && 'Vista Kanban'}
                                                        {currentLayout === 'grid' && 'Vista Grid'}
                                                    </h3>
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {currentLayout === 'tree' && 'Organización jerárquica de tu contenido'}
                                                    {currentLayout === 'timeline' && 'Cronología de tu trayectoria profesional'}
                                                    {currentLayout === 'kanban' && 'Gestión visual por categorías'}
                                                    {currentLayout === 'grid' && 'Vista compacta en cuadrícula'}
                                                </p>
                                            </div>
                                            <div className="flex items-center space-x-4 text-sm">
                                                <div className="flex items-center space-x-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full px-3 py-1.5 border border-gray-200 dark:border-slate-600">
                                                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                                                    <span className="text-gray-700 dark:text-gray-300 font-medium">{nodes.filter(n => n.isVisible).length} Públicos</span>
                                                </div>
                                                <div className="flex items-center space-x-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full px-3 py-1.5 border border-gray-200 dark:border-slate-600">
                                                    <div className="w-2.5 h-2.5 bg-gray-400 rounded-full"></div>
                                                    <span className="text-gray-700 dark:text-gray-300 font-medium">{nodes.filter(n => !n.isVisible).length} Privados</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        {nodes.length > 0 ? (
                                            <>
                                                {currentLayout === 'tree' && (
                                                    <InteractiveTree
                                                        nodes={nodes}
                                                        username={session?.user?.username || ''}
                                                        isOwner={isOwner}
                                                        onNodeClick={handleNodeClick}
                                                        onNodeEdit={handleNodeEdit}
                                                        onNodeDelete={handleNodeDelete}
                                                        onNodeAdd={handleNodeAdd}
                                                        selectedNodeId={selectedNodeId}
                                                    />
                                                )}
                                                {currentLayout === 'timeline' && (
                                                    <TimelineLayout
                                                        nodes={nodes}
                                                        onNodeClick={handleNodeClick}
                                                        isOwner={isOwner}
                                                    />
                                                )}
                                                {currentLayout === 'kanban' && (
                                                    <KanbanLayout
                                                        nodes={nodes}
                                                        onNodeClick={handleNodeClick}
                                                        isOwner={isOwner}
                                                    />
                                                )}
                                                {currentLayout === 'grid' && (
                                                    <GridLayout
                                                        nodes={nodes}
                                                        onNodeClick={handleNodeClick}
                                                        isOwner={isOwner}
                                                    />
                                                )}
                                            </>
                                        ) : (
                                            <div className="text-center py-20">
                                                <div className="max-w-3xl mx-auto">
                                                    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                                        <svg className="h-12 w-12 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                        </svg>
                                                    </div>
                                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                                                        ¡Bienvenido a tu Portfolio! 🎉
                                                    </h3>
                                                    <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg max-w-2xl mx-auto leading-relaxed">
                                                        Empieza a construir tu historia profesional. Aquí tienes algunos pasos para comenzar:
                                                    </p>

                                                    {/* Onboarding Steps */}
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border-2 border-blue-200 dark:border-blue-800">
                                                            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                                                                <span className="text-white font-bold text-xl">1</span>
                                                            </div>
                                                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Crea Categorías</h4>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400">Organiza tu contenido en secciones como Proyectos, Experiencia, Habilidades</p>
                                                        </div>
                                                        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-6 border-2 border-purple-200 dark:border-purple-800">
                                                            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                                                                <span className="text-white font-bold text-xl">2</span>
                                                            </div>
                                                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Añade Contenido</h4>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400">Agrega proyectos, experiencias y logros dentro de cada categoría</p>
                                                        </div>
                                                        <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-6 border-2 border-green-200 dark:border-green-800">
                                                            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                                                                <span className="text-white font-bold text-xl">3</span>
                                                            </div>
                                                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Comparte</h4>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400">Publica tu portfolio y compártelo con el mundo</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                                        <button
                                                            onClick={handleCreateRootCategory}
                                                            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
                                                        >
                                                            <FolderPlusIcon className="h-6 w-6 mr-2" />
                                                            Crear Primera Categoría
                                                        </button>
                                                        <Link
                                                            href="/explore"
                                                            className="inline-flex items-center px-8 py-4 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 font-semibold rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-600 transition-all duration-300 border-2 border-gray-200 dark:border-slate-600"
                                                        >
                                                            <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                            Ver Ejemplos
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar - Hidden on mobile, shown on lg+ */}
                            <div className="hidden lg:block lg:col-span-1">
                                <div className="space-y-6">
                                    {/* Acciones */}
                                    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-gray-200 dark:border-slate-700 p-6">
                                        <div className="flex items-center mb-6">
                                            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mr-3 shadow-lg">
                                                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                                Acciones Rápidas
                                            </h3>
                                        </div>
                                        <div className="space-y-3">
                                            <button
                                                onClick={handleCreateRootCategory}
                                                className="w-full inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                                            >
                                                <FolderPlusIcon className="h-5 w-5 mr-2" />
                                                Nueva Categoría Raíz
                                            </button>
                                            <Link
                                                href="/dashboard/profile"
                                                className="w-full inline-flex items-center justify-center px-4 py-3 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 font-medium rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-600 transition-all duration-300 border-2 border-gray-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500"
                                            >
                                                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                Editar Perfil
                                            </Link>
                                            <Link
                                                href="/dashboard/blobs"
                                                className="w-full inline-flex items-center justify-center px-4 py-3 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 font-medium rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-600 transition-all duration-300 border-2 border-gray-200 dark:border-slate-600 hover:border-purple-300 dark:hover:border-purple-500"
                                            >
                                                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                Archivos
                                            </Link>
                                            <Link
                                                href={`/user/${session?.user?.username}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full inline-flex items-center justify-center px-4 py-3 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 font-medium rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-600 transition-all duration-300 border-2 border-gray-200 dark:border-slate-600 hover:border-green-300 dark:hover:border-green-500"
                                            >
                                                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2M6 18L18 6M8 6h10v10" />
                                                </svg>
                                                Ver Portfolio
                                            </Link>
                                            <Link
                                                href="/explore"
                                                className="w-full inline-flex items-center justify-center px-4 py-3 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 font-medium rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-600 transition-all duration-300 border-2 border-gray-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-500"
                                            >
                                                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                                Explorar
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Estadísticas */}
                                    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-gray-200 dark:border-slate-700 p-6">
                                        <div className="flex items-center mb-6">
                                            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl mr-3 shadow-lg">
                                                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                                Tu Portfolio
                                            </h3>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl border border-blue-200/50 dark:border-blue-700/50">
                                                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">{nodes.length}</div>
                                                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Elementos</div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-800/30 rounded-xl border border-green-200/50 dark:border-green-700/50">
                                                    <div className="text-xl font-bold text-green-600 dark:text-green-400 mb-1">{nodes.filter(n => n.isVisible).length}</div>
                                                    <div className="text-xs font-medium text-gray-700 dark:text-gray-300">Públicos</div>
                                                </div>
                                                <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/30 dark:to-violet-800/30 rounded-xl border border-purple-200/50 dark:border-purple-700/50">
                                                    <div className="text-xl font-bold text-purple-600 dark:text-purple-400 mb-1">{nodes.filter(n => n.type === 'PROJECT').length}</div>
                                                    <div className="text-xs font-medium text-gray-700 dark:text-gray-300">Proyectos</div>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="text-center p-3 bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-yellow-900/30 dark:to-orange-800/30 rounded-xl border border-yellow-200/50 dark:border-yellow-700/50">
                                                    <div className="text-xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">{nodes.filter(n => n.type === 'SKILL').length}</div>
                                                    <div className="text-xs font-medium text-gray-700 dark:text-gray-300">Habilidades</div>
                                                </div>
                                                <div className="text-center p-3 bg-gradient-to-br from-pink-50 to-rose-100 dark:from-pink-900/30 dark:to-rose-800/30 rounded-xl border border-pink-200/50 dark:border-pink-700/50">
                                                    <div className="text-xl font-bold text-pink-600 dark:text-pink-400 mb-1">{nodes.filter(n => n.type === 'EXPERIENCE').length}</div>
                                                    <div className="text-xs font-medium text-gray-700 dark:text-gray-300">Experiencia</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Node Inspector Modal */}
            <NodeInspector
                node={selectedNode}
                isOpen={isInspectorOpen}
                onClose={handleNodeInspectorClose}
            />

            {/* Node Editor Modal */}
            <NodeEditor
                node={selectedNode || undefined}
                parentId={parentNodeId || undefined}
                portfolioId="portfolio-id"
                isOpen={isEditorOpen}
                onClose={() => {
                    setIsEditorOpen(false)
                    setForceRootCategory(false)
                }}
                onSave={handleNodeSave}
                forceRootCategory={forceRootCategory}
            />

            {/* Confirmation Dialog */}
            <ConfirmationDialog
                isOpen={confirmDialog.isOpen}
                title={confirmDialog.title}
                message={confirmDialog.message}
                onConfirm={confirmDialog.onConfirm}
                onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
                loading={confirmDialog.loading}
                type="danger"
            />

            {/* Back to Top */}
            <BackToTop />
        </div>
    )
}