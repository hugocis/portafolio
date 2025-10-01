'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Node } from '@prisma/client'
import { NodeEditor } from '@/components/dashboard/node-editor'
import { InteractiveTree } from '@/components/portfolio/interactive-tree'
import { PlusIcon } from '@heroicons/react/24/outline'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [nodes, setNodes] = useState<Node[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [parentNodeId, setParentNodeId] = useState<string | null>(null)
  const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (status === 'authenticated') {
      fetchNodes()
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
      }
    } catch (error) {
      console.error('Error deleting node:', error)
    }
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Portfolio Dashboard</h1>
              <p className="mt-2 text-gray-600">
                Gestiona tu portafolio de forma interactiva
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href={`/user/${session?.user?.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Ver Portfolio Público
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <InteractiveTree
              nodes={nodes}
              username={session?.user?.username || 'User'}
              isOwner={true}
              onNodeClick={handleNodeClick}
              onNodeEdit={handleEditNode}
              onNodeDelete={handleDeleteNode}
              onNodeAdd={handleCreateNode}
              selectedNodeId={selectedNodeId}
            />
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Acciones Rápidas</h2>
              <div className="space-y-3">
                <button
                  onClick={() => handleCreateNode()}
                  className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <PlusIcon className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium">Nuevo Nodo Raíz</div>
                    <div className="text-sm text-gray-500">Crear nueva categoría principal</div>
                  </div>
                </button>

                <div className="border-t pt-3">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Estadísticas</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Total Nodos:</span>
                      <span className="font-medium">{nodes.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Nodos Visibles:</span>
                      <span className="font-medium">
                        {nodes.filter(node => node.isVisible).length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Proyectos:</span>
                      <span className="font-medium">
                        {nodes.filter(node => node.type === 'PROJECT').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Categorías:</span>
                      <span className="font-medium">
                        {nodes.filter(node => node.type === 'CATEGORY').length}
                      </span>
                    </div>
                  </div>
                </div>
                
                {selectedNodeId && (
                  <div className="border-t pt-3">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Nodo Seleccionado</h3>
                    <div className="text-sm text-blue-600">
                      {nodes.find(n => n.id === selectedNodeId)?.title || 'Nodo'}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Haz hover sobre los nodos para ver las acciones disponibles
                    </p>
                  </div>
                )}
              </div>
            </div>
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
    </div>
  )
}