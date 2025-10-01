'use client'

import { signIn, getProviders } from "next-auth/react"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Squares2X2Icon } from "@heroicons/react/24/outline"

export default function SignIn() {
  const [providers, setProviders] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  const error = searchParams.get('error')

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders()
      setProviders(res)
      setLoading(false)
    }
    fetchProviders()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <Link href="/" className="flex items-center">
              <Squares2X2Icon className="h-12 w-12 text-blue-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">Portfolio Tree</span>
            </Link>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/" className="font-medium text-blue-600 hover:text-blue-500">
              go back to homepage
            </Link>
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">
              {error === 'CredentialsSignin' && 'Invalid credentials. Please try again.'}
              {error === 'OAuthSignin' && 'Error with OAuth provider. Please try again.'}
              {error === 'OAuthCallback' && 'Error with OAuth callback. Please try again.'}
              {error === 'OAuthCreateAccount' && 'Could not create OAuth account. Please try again.'}
              {error === 'EmailCreateAccount' && 'Could not create email account. Please try again.'}
              {error === 'Callback' && 'Error in callback. Please try again.'}
              {error === 'OAuthAccountNotLinked' && 'Email already associated with another account.'}
              {error === 'EmailSignin' && 'Check your email for a sign in link.'}
              {error === 'SessionRequired' && 'Please sign in to access this page.'}
              {!['CredentialsSignin', 'OAuthSignin', 'OAuthCallback', 'OAuthCreateAccount', 'EmailCreateAccount', 'Callback', 'OAuthAccountNotLinked', 'EmailSignin', 'SessionRequired'].includes(error) && 'An error occurred. Please try again.'}
            </div>
          </div>
        )}

        <div className="space-y-4">
          {providers && Object.values(providers).map((provider: any) => {
            if (provider.id === 'credentials') {
              return (
                <CredentialsForm key={provider.id} callbackUrl={callbackUrl} />
              )
            }
            
            return (
              <div key={provider.name}>
                <button
                  onClick={() => signIn(provider.id, { callbackUrl })}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Sign in with {provider.name}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function CredentialsForm({ callbackUrl }: { callbackUrl: string }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await signIn('credentials', {
        email,
        password,
        callbackUrl,
      })
    } catch (error) {
      console.error('Sign in error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email" className="sr-only">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
          placeholder="Email address"
        />
      </div>
      <div>
        <label htmlFor="password" className="sr-only">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
          placeholder="Password"
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing in...' : 'Sign in with Email'}
        </button>
      </div>
    </form>
  )
}