'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Node } from '@prisma/client'
import { NodeEditor } from '@/components/dashboard/node-editor'
import { InteractiveTree } from '@/components/portfolio/interactive-tree'
import { ConfirmationDialog } from '@/components/dashboard/confirmation-dialog'
import { PlusIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [nodes, setNodes] = useState<Node[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [parentNodeId, setParentNodeId] = useState<string | null>(null)
  const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>(undefined)
  const [isOwner, setIsOwner] = useState(false)
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
    onConfirm: () => {},
    loading: false
  })

  useEffect(() => {
    if (status === 'authenticated') {
      fetchNodes()
      // User is authenticated and on their own dashboard, so they are the owner
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

  const handleCreateNode = (parentId?: string) => {
    setSelectedNode(null)
    setParentNodeId(parentId || null)
    setIsEditorOpen(true)
  }

  const handleEditNode = (node: Node) => {
    setSelectedNode(node)
    setParentNodeId(null)
    setIsEditorOpen(true)
  }

  const handleDeleteNode = async (nodeId: string) => {
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
            setNodes(nodes.filter(node => node.id !== nodeId))
            // Also remove children nodes
            setNodes(prev => prev.filter(node => {
              // Remove the node and any of its descendants
              const isDescendant = (checkNodeId: string, targetNodeId: string): boolean => {
                const nodeToCheck = prev.find(n => n.id === checkNodeId)
                if (!nodeToCheck) return false
                if (nodeToCheck.parentId === targetNodeId) return true
                if (nodeToCheck.parentId) return isDescendant(nodeToCheck.parentId, targetNodeId)
                return false
              }
              return node.id !== nodeId && !isDescendant(node.id, nodeId)
            }))
            
            setSelectedNodeId(undefined)
            setConfirmDialog(prev => ({ ...prev, isOpen: false, loading: false }))
          } else {
            console.error('Failed to delete node')
            setConfirmDialog(prev => ({ ...prev, loading: false }))
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
  }

  const handleSaveNode = async (nodeData: Partial<Node>) => {
    try {
      if (selectedNode) {
        // Update existing node
        const response = await fetch(`/api/nodes/${selectedNode.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(nodeData)
        })

        if (response.ok) {
          const updatedNode = await response.json()
          setNodes(nodes.map(node => 
            node.id === selectedNode.id ? updatedNode : node
          ))
        }
      } else {
        // Create new node
        const response = await fetch('/api/nodes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(nodeData)
        })

        if (response.ok) {
          const newNode = await response.json()
          setNodes([...nodes, newNode])
        }
      }
    } catch (error) {
      console.error('Error saving node:', error)
      throw error
    }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Modern Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Tree Visualization - Larger area */}
          <div className="xl:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
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
                      <span>Oculto</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <InteractiveTree
                  nodes={nodes}
                  username={session?.user?.username || 'User'}
                  isOwner={isOwner}
                  onNodeClick={handleNodeClick}
                  onNodeEdit={handleEditNode}
                  onNodeDelete={handleDeleteNode}
                  onNodeAdd={handleCreateNode}
                  selectedNodeId={selectedNodeId}
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            {/* Quick Actions Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Acciones Rápidas
                </h3>
                <button
                  onClick={() => handleCreateNode()}
                  className="w-full flex items-center gap-3 p-4 text-left border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group"
                >
                  <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <PlusIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 group-hover:text-blue-900">Nuevo Nodo</div>
                    <div className="text-sm text-gray-500">Crear categoría principal</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Statistics Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="h-5 w-5 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Estadísticas
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-200 rounded-lg">
                        <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <span className="font-medium text-gray-700">Total</span>
                    </div>
                    <span className="text-xl font-bold text-blue-600">{nodes.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-200 rounded-lg">
                        <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </div>
                      <span className="font-medium text-gray-700">Visibles</span>
                    </div>
                    <span className="text-xl font-bold text-green-600">{nodes.filter(node => node.isVisible).length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-200 rounded-lg">
                        <svg className="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <span className="font-medium text-gray-700">Proyectos</span>
                    </div>
                    <span className="text-xl font-bold text-purple-600">{nodes.filter(node => node.type === 'PROJECT').length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-orange-200 rounded-lg">
                        <svg className="h-4 w-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                        </svg>
                      </div>
                      <span className="font-medium text-gray-700">Categorías</span>
                    </div>
                    <span className="text-xl font-bold text-orange-600">{nodes.filter(node => node.type === 'CATEGORY').length}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Node Info */}
            {selectedNodeId && (
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-sm border border-indigo-200">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <svg className="h-5 w-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Nodo Seleccionado
                  </h3>
                  <div className="bg-white rounded-lg p-4 border border-indigo-200">
                    <div className="text-lg font-medium text-indigo-900 mb-2">
                      {nodes.find(n => n.id === selectedNodeId)?.title || 'Nodo'}
                    </div>
                    <div className="text-sm text-gray-600">
                      Tipo: {nodes.find(n => n.id === selectedNodeId)?.type || 'Desconocido'}
                    </div>
                    <p className="text-xs text-gray-500 mt-3 bg-gray-50 p-2 rounded">
                      💡 Haz hover sobre los nodos en el árbol para ver las acciones disponibles
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <NodeEditor
        node={selectedNode || undefined}
        parentId={parentNodeId || undefined}
        portfolioId="portfolio-id" // This will be handled by the API
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveNode}
      />

      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
        loading={confirmDialog.loading}
      />
    </div>
  )
}