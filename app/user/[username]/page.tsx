'use client'

import { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import { InteractiveTree } from '@/components/portfolio/interactive-tree'
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
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState<string>('')
  const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>(undefined)

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
      } catch (error) {
        console.error('Error fetching user:', error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [username])

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
  const nodes = portfolio.nodes as Node[]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        </div>
      </div>

      {/* Portfolio Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <InteractiveTree
              nodes={nodes}
              username={user.username}
              isOwner={false}
              onNodeClick={(node: Node) => {
                setSelectedNodeId(node.id)
                console.log('Node clicked:', node)
              }}
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
    </div>
  )
}