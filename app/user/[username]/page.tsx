'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { notFound } from 'next/navigation'
import { InteractiveTree } from '@/components/portfolio/interactive-tree'
import { NodeEditor } from '@/components/dashboard/node-editor'
import { NodeInspector } from '@/components/portfolio/node-inspector'
import { ConfirmationDialog } from '@/components/dashboard/confirmation-dialog'
import { Node } from '@prisma/client'

interface UserPageProps {
  params: Promise<{
    username: string
  }>
}

interface UserData {
  id: string
  name: string | null
  username: string
  email: string
  bio: string | null
  website: string | null
  location: string | null
  image: string | null
  portfolio: {
    id: string
    title: string
    subtitle: string | null
    isPublic: boolean
    nodes: Node[]
  } | null
}

export default function UserPage({ params }: UserPageProps) {
  const { data: session } = useSession()
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState<string>('')
  const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>(undefined)
  const [isOwner, setIsOwner] = useState(false)
  const [nodes, setNodes] = useState<Node[]>([])
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [isInspectorOpen, setIsInspectorOpen] = useState(false)
  const [parentNodeId, setParentNodeId] = useState<string | null>(null)
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
    const getParams = async () => {
      const resolvedParams = await params
      setUsername(resolvedParams.username)
    }
    getParams()
  }, [params])

  useEffect(() => {
    if (!username) return

    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${username}`)
        if (!response.ok) {
          if (response.status === 404) {
            notFound()
          }
          throw new Error('Failed to fetch user')
        }
        const userData = await response.json()
        setUser(userData)
        setNodes(userData.portfolio?.nodes || [])
        
        // Check if the current session user is the owner of this portfolio
        if (session?.user?.username === username) {
          setIsOwner(true)
        }
      } catch (error) {
        console.error('Error fetching user:', error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [username, session])

  const handleCreateNode = async (parentId?: string) => {
    if (!isOwner) return
    setSelectedNode(null)
    setParentNodeId(parentId || null)
    setIsEditorOpen(true)
  }

  const handleEditNode = async (node: Node) => {
    if (!isOwner) return
    setSelectedNode(node)
    setParentNodeId(null)
    setIsEditorOpen(true)
  }

  const handleDeleteNode = async (nodeId: string) => {
    if (!isOwner) return
    
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
            // Remove the node and its descendants from local state
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

  const handleSaveNode = async (nodeData: Partial<Node>) => {
    if (!isOwner) return

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

  const handleNodeClick = (node: Node) => {
    setSelectedNodeId(node.id)
    setSelectedNode(node)
    if (!isOwner) {
      setIsInspectorOpen(true)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!user || !user.portfolio?.isPublic) {
    notFound()
  }

  const portfolio = user.portfolio

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {user.image && (
                <img
                  src={user.image}
                  alt={user.name || user.username}
                  className="h-20 w-20 rounded-full object-cover"
                />
              )}
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {user.name || user.username}
                </h1>
                {user.bio && (
                  <p className="mt-2 text-lg text-gray-600">{user.bio}</p>
                )}
                <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                  {user.location && (
                    <span className="flex items-center">
                      📍 {user.location}
                    </span>
                  )}
                  {user.website && (
                    <a
                      href={user.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      🌐 Website
                    </a>
                  )}
                </div>
              </div>
            </div>
            
            {isOwner && (
              <div className="flex items-center space-x-3">
                <a
                  href="/dashboard"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium"
                >
                  Ir al Dashboard
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Portfolio Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <InteractiveTree
              nodes={nodes}
              username={user.username}
              isOwner={isOwner}
              onNodeClick={handleNodeClick}
              onNodeEdit={isOwner ? handleEditNode : undefined}
              onNodeDelete={isOwner ? handleDeleteNode : undefined}
              onNodeAdd={isOwner ? handleCreateNode : undefined}
              selectedNodeId={selectedNodeId}
            />
          </div>

          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Featured Projects */}
              {nodes.filter(node => node.type === 'PROJECT' && node.tags?.includes('featured')).length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold mb-4">Featured Projects</h2>
                  <div className="space-y-4">
                    {nodes
                      .filter(node => node.type === 'PROJECT' && node.tags?.includes('featured'))
                      .slice(0, 3)
                      .map((node) => (
                        <div key={node.id} className="border-l-4 border-blue-500 pl-4">
                          <h3 className="font-medium text-gray-900">{node.title}</h3>
                          {node.description && (
                            <p className="text-sm text-gray-600 mt-1">{node.description}</p>
                          )}
                          <div className="mt-2 flex gap-2">
                            {node.githubUrl && (
                              <a
                                href={node.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:text-blue-800"
                              >
                                GitHub
                              </a>
                            )}
                            {node.demoUrl && (
                              <a
                                href={node.demoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-green-600 hover:text-green-800"
                              >
                                Live Demo
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Skills & Technologies</h2>
                <div className="flex flex-wrap gap-2">
                  {Array.from(
                    new Set(
                      nodes
                        .flatMap(node => node.tags || [])
                        .filter(tag => tag && !['featured'].includes(tag))
                    )
                  ).slice(0, 15).map((tag) => (
                    <span
                      key={tag}
                      className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Get In Touch</h2>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">Email:</span>
                    <span className="ml-2">{user.email}</span>
                  </div>
                  {user.website && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium">Website:</span>
                      <a
                        href={user.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        {user.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Node Editor Modal - Only for owner */}
      {isOwner && (
        <NodeEditor
          node={selectedNode || undefined}
          parentId={parentNodeId || undefined}
          portfolioId={user.portfolio?.id || 'portfolio-id'}
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          onSave={handleSaveNode}
        />
      )}

      {/* Node Inspector Modal - For public viewing */}
      <NodeInspector
        node={selectedNode}
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
      />

      {/* Confirmation Dialog */}
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