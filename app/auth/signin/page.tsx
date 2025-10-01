'use client'

import { signIn, getProviders } from "next-auth/react"
import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Squares2X2Icon } from "@heroicons/react/24/outline"

interface Provider {
    id: string
    name: string
    type: string
    signinUrl: string
    callbackUrl: string
}

function SignInContent() {
    const [providers, setProviders] = useState<Record<string, Provider> | null>(null)
    const [loading, setLoading] = useState(true)
    const searchParams = useSearchParams()
    const error = searchParams.get('error')
    const callbackUrl = searchParams.get('callbackUrl') || '/'

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
                    {providers && Object.values(providers).map((provider: Provider) => {
                        if (provider.id === 'credentials') {
                            return (
                                <CredentialsForm key={provider.id} callbackUrl={callbackUrl} />
                            )
                        }

                        return (
                            <div key={provider.name}>
                                <button
                                    onClick={() => signIn(provider.id, { callbackUrl })}
                                    className="group relative w-full flex justify-center items-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                >
                                    {provider.id === 'github' && (
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                        </svg>
                                    )}
                                    Continue with {provider.name}
                                </button>
                            </div>
                        )
                    })}

                    {providers && Object.values(providers).some((p: Provider) => p.id !== 'credentials') && (
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-gray-50 text-gray-500">Or continue with email</span>
                            </div>
                        </div>
                    )}
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

export default function SignInPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-lg">Loading...</div>
            </div>
        }>
            <SignInContent />
        </Suspense>
    )
}