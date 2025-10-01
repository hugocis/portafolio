'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { Squares2X2Icon, UserIcon, CogIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'

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
                    Mi Portfolio
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 flex items-center gap-1"
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4" />
                    Salir
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register"
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
              href="/auth/register"
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
              Tres Formas de Empezar
            </h2>
            <p className="text-lg text-gray-600">
              Elige la opción que más te convenga
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <UserIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Registro Manual</h3>
              <p className="text-gray-600 mb-4">
                Crea tu cuenta con email, nombre de usuario y contraseña personalizada.
              </p>
              <Link
                href="/auth/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 inline-block"
              >
                Registrarse
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Login con GitHub</h3>
              <p className="text-gray-600 mb-4">
                Usa tu cuenta de GitHub. Username generado automáticamente.
              </p>
              <Link
                href="/auth/signin"
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 inline-block"
              >
                Conectar GitHub
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <CogIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">¿Ya tienes cuenta?</h3>
              <p className="text-gray-600 mb-4">
                Inicia sesión con tu email y contraseña o GitHub.
              </p>
              <Link
                href="/auth/signin"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 inline-block"
              >
                Iniciar Sesión
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Configuración de GitHub OAuth</h3>
              <p className="text-gray-600 mb-4">
                Para habilitar el login con GitHub, necesitas configurar una OAuth App
              </p>
              <div className="bg-gray-50 rounded-lg p-4 text-left max-w-2xl mx-auto">
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                  <li>Ve a <a href="https://github.com/settings/applications/new" target="_blank" rel="noopener" className="text-blue-600 hover:text-blue-800">GitHub Developer Settings</a></li>
                  <li>Crea una nueva OAuth App con:
                    <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                      <li><strong>Homepage URL:</strong> http://localhost:3000</li>
                      <li><strong>Callback URL:</strong> http://localhost:3000/api/auth/callback/github</li>
                    </ul>
                  </li>
                  <li>Copia el Client ID y Client Secret al archivo .env</li>
                  <li>Reinicia el servidor de desarrollo</li>
                </ol>
              </div>
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
