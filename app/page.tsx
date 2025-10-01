'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Squares2X2Icon, UserIcon, CogIcon } from '@heroicons/react/24/outline'

export default function Home() {
  const { data: session, status } = useSession()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Squares2X2Icon className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Portfolio Tree</span>
            </div>
            <div className="flex items-center space-x-4">
              {status === 'authenticated' ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                  >
                    <CogIcon className="h-4 w-4 mr-1" />
                    Dashboard
                  </Link>
                  <Link
                    href={`/user/${session.user?.username}`}
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                  >
                    <UserIcon className="h-4 w-4 mr-1" />
                    My Portfolio
                  </Link>
                  <button
                    onClick={() => {
                      window.location.href = '/api/auth/signout'
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/api/auth/signin"
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/api/auth/signin"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Showcase Your Work in a
            <span className="text-blue-600"> Tree Structure</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Create a beautiful, organized portfolio that grows like a tree. 
            Branch out your skills, projects, and experiences in an intuitive, 
            visual format that tells your professional story.
          </p>
          
          {status === 'authenticated' ? (
            <div className="flex justify-center space-x-4">
              <Link
                href="/dashboard"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Go to Dashboard
              </Link>
              <Link
                href={`/user/${session.user?.username}`}
                className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-green-700 transition-colors"
              >
                View My Portfolio
              </Link>
            </div>
          ) : (
            <Link
              href="/api/auth/signin"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors inline-block"
            >
              Start Building Your Portfolio
            </Link>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Squares2X2Icon className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Tree Structure</h3>
            <p className="text-gray-600">
              Organize your portfolio in a hierarchical tree structure. 
              Create categories, subcategories, and showcase individual projects.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CogIcon className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Easy Management</h3>
            <p className="text-gray-600">
              Simple dashboard to create, edit, and organize your portfolio content. 
              Drag and drop to reorder, edit in-place, and manage visibility.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <UserIcon className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Professional Sharing</h3>
            <p className="text-gray-600">
              Share your portfolio with a clean, professional URL. 
              Perfect for job applications, networking, and showcasing your work.
            </p>
          </div>
        </div>
      </div>

      {/* Demo Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              See How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Create branches for different aspects of your professional life
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center text-gray-500">
              <Squares2X2Icon className="h-24 w-24 mx-auto mb-4" />
              <p className="text-lg">
                Interactive portfolio tree preview would go here
              </p>
              <p className="text-sm mt-2">
                Sign up to create your own portfolio tree!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Squares2X2Icon className="h-6 w-6 text-blue-400" />
            <span className="ml-2 text-lg font-bold">Portfolio Tree</span>
          </div>
          <p className="text-gray-400">
            Build and share your professional story in a beautiful tree structure.
          </p>
        </div>
      </footer>
    </div>
  )
}
