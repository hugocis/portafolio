'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { notFound } from 'next/navigation'
import { InteractiveTree } from '@/components/portfolio/interactive-tree'
import { NodeInspector } from '@/components/portfolio/node-inspector'
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
  const [isInspectorOpen, setIsInspectorOpen] = useState(false)

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

  const handleNodeClick = (node: Node) => {
    setSelectedNodeId(node.id)
    setSelectedNode(node)
    // Public profiles always use inspector, even for owners
    setIsInspectorOpen(true)
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Modern Hero Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-12">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-6 lg:space-y-0">
              <div className="flex items-center space-x-6">
                {user.image ? (
                  <div className="relative">
                    <img
                      src={user.image}
                      alt={user.name || user.username}
                      className="h-24 w-24 rounded-2xl object-cover shadow-lg ring-4 ring-white"
                    />
                    <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                ) : (
                  <div className="h-24 w-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-3xl font-bold text-white">
                      {(user.name || user.username).charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent">
                      {user.name || user.username}
                    </h1>
                    <div className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-sm font-medium rounded-full">
                      Portfolio
                    </div>
                  </div>
                  {user.bio && (
                    <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">{user.bio}</p>
                  )}
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    {user.location && (
                      <span className="flex items-center space-x-2">
                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{user.location}</span>
                      </span>
                    )}
                    {user.website && (
                      <a
                        href={user.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                        </svg>
                        <span>Website</span>
                      </a>
                    )}
                    <div className="flex items-center space-x-2">
                      <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <span>{nodes.filter(n => n.isVisible).length} proyectos públicos</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {isOwner && (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
                  <a
                    href="/dashboard"
                    className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Editar Portfolio
                  </a>
                  <div className="px-4 py-2 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-lg">
                    ✨ Este es tu portfolio público
                  </div>
                </div>
              )}
            </div>
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
              isOwner={false} // Public profiles are always read-only for tree interactions
              onNodeClick={handleNodeClick}
              onNodeEdit={undefined} // No editing in public view
              onNodeDelete={undefined} // No deleting in public view
              onNodeAdd={undefined} // No adding in public view
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

      {/* Node Inspector Modal - For all public viewing (owners and visitors) */}
      <NodeInspector
        node={selectedNode}
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
      />

      {/* No confirmation dialog needed since no editing is allowed in public view */}
    </div>
  )

    </div>
  )
}