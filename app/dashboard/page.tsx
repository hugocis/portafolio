'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { Node } from '@prisma/client'
import { NodeEditor } from '@/components/dashboard/node-editor'
import { NodeInspector } from '@/components/portfolio/node-inspector'
import { InteractiveTree } from '@/components/portfolio/interactive-tree'
import { ConfirmationDialog } from '@/components/dashboard/confirmation-dialog'
import { LayoutSelector, LayoutType } from '@/components/portfolio/layout-selector'
import { TimelineLayout } from '@/components/portfolio/timeline-layout'
import { KanbanLayout } from '@/components/portfolio/kanban-layout'
import { GridLayout } from '@/components/portfolio/grid-layout'
import { AnimatedBackground } from '@/components/ui/animated-background'
import { PlusIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'

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

    const handleNodeAdd = (parentId?: string) => {
        setSelectedNode(null)
        setParentNodeId(parentId || null)
        setIsEditorOpen(true)
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

    const handleNodeSave = async () => {
        await fetchNodes()
        setIsEditorOpen(false)
        setSelectedNode(null)
        setParentNodeId(null)
    }

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg">Loading...</div>
            </div>
        )
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
        <div className="min-h-screen relative">
            <AnimatedBackground variant="dashboard" />

            {/* Modern Header */}
            <div className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-gray-200 relative z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                    Dashboard
                                </h1>
                                <p className="text-sm text-gray-600 mt-1">
                                    Hola {session?.user?.name || session?.user?.username} 👋 Gestiona tu portafolio
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <LayoutSelector
                                currentLayout={currentLayout}
                                onLayoutChange={setCurrentLayout}
                            />
                            <Link
                                href={`/user/${session?.user?.username}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-medium rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                            >
                                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2M6 18L18 6M8 6h10v10" />
                                </svg>
                                Ver Portfolio
                            </Link>
                            <button
                                onClick={() => signOut({ callbackUrl: '/' })}
                                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white text-sm font-medium rounded-lg hover:from-red-600 hover:to-pink-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                                title="Cerrar sesión"
                            >
                                <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                    {/* Portfolio Visualization - Larger area */}
                    <div className="xl:col-span-3">
                        {currentLayout === 'tree' && (
                            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-900">Árbol de Portfolio</h2>
                                            <p className="text-sm text-gray-600 mt-1">Haz hover sobre los nodos para ver las acciones</p>
                                        </div>
                                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                                            <div className="flex items-center space-x-1">
                                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                                <span>Visible</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                                                <span>Privado</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    {nodes.length > 0 ? (
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
                                    ) : (
                                        <div className="text-center py-20">
                                            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                                <svg className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                </svg>
                                            </div>
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                Tu Portfolio Está Vacío
                                            </h3>
                                            <p className="text-gray-600 mb-6">
                                                Comienza agregando tu primer proyecto, experiencia o habilidad
                                            </p>
                                            <button
                                                onClick={() => handleNodeAdd()}
                                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                            >
                                                <PlusIcon className="h-5 w-5 mr-2" />
                                                Agregar Primer Elemento
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {currentLayout === 'timeline' && (
                            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                                <div className="p-6">
                                    <TimelineLayout
                                        nodes={nodes}
                                        onNodeClick={handleNodeClick}
                                        isOwner={isOwner}
                                    />
                                </div>
                            </div>
                        )}

                        {currentLayout === 'kanban' && (
                            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                                <div className="p-6">
                                    <KanbanLayout
                                        nodes={nodes}
                                        onNodeClick={handleNodeClick}
                                        isOwner={isOwner}
                                    />
                                </div>
                            </div>
                        )}

                        {currentLayout === 'grid' && (
                            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                                <div className="p-6">
                                    <GridLayout
                                        nodes={nodes}
                                        onNodeClick={handleNodeClick}
                                        isOwner={isOwner}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="xl:col-span-1">
                        <div className="space-y-6">
                            {/* Add New Node */}
                            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg mr-3">
                                        <PlusIcon className="h-5 w-5 text-white" />
                                    </div>
                                    Agregar Contenido
                                </h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    Expande tu portfolio con nuevos proyectos, experiencias y habilidades
                                </p>
                                <button
                                    onClick={() => handleNodeAdd()}
                                    className="w-full inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                >
                                    <PlusIcon className="h-5 w-5 mr-2" />
                                    Nuevo Elemento
                                </button>
                            </div>

                            {/* Statistics */}
                            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <div className="p-2 bg-gradient-to-r from-purple-500 to-violet-600 rounded-lg mr-3">
                                        <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    Estadísticas
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                            <span className="text-sm font-medium text-gray-700">Elementos Totales</span>
                                        </div>
                                        <span className="text-lg font-bold text-blue-600">{nodes.length}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            <span className="text-sm font-medium text-gray-700">Públicos</span>
                                        </div>
                                        <span className="text-lg font-bold text-green-600">{nodes.filter(n => n.isVisible).length}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                            <span className="text-sm font-medium text-gray-700">Proyectos</span>
                                        </div>
                                        <span className="text-lg font-bold text-purple-600">{nodes.filter(n => n.type === 'PROJECT').length}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg mr-3">
                                        <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    Acciones Rápidas
                                </h3>
                                <div className="space-y-3">
                                    <Link
                                        href={`/user/${session?.user?.username}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-medium rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200"
                                    >
                                        <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2M6 18L18 6M8 6h10v10" />
                                        </svg>
                                        Ver Portfolio Público
                                    </Link>
                                    <Link
                                        href="/explore"
                                        className="w-full inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200"
                                    >
                                        <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        Explorar Portfolios
                                    </Link>
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
                onClose={() => setIsEditorOpen(false)}
                onSave={handleNodeSave}
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
        </div>
    )
}