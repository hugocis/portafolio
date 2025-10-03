'use client'

import { signIn, getProviders } from "next-auth/react"
import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { 
    Squares2X2Icon,
    EyeIcon,
    EyeSlashIcon,
    ArrowRightIcon,
    SparklesIcon,
    UserIcon,
    LockClosedIcon
} from "@heroicons/react/24/outline"
import {
    Squares2X2Icon as Squares2X2IconSolid,
    SparklesIcon as SparklesIconSolid
} from "@heroicons/react/24/solid"

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
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mb-6"></div>
                    <div className="text-lg font-medium text-gray-600 dark:text-gray-300">Cargando...</div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-indigo-600/5 dark:from-blue-400/10 dark:via-purple-400/10 dark:to-indigo-400/10"></div>
                <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 dark:bg-purple-700 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 dark:bg-yellow-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 dark:bg-pink-700 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-flex items-center space-x-3 group mb-8">
                            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                                <Squares2X2IconSolid className="h-8 w-8 text-white" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                                Portfolio Tree
                            </span>
                        </Link>

                        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                            <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                                Bienvenido de
                            </span>
                            <br />
                            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                vuelta
                            </span>
                        </h1>
                        
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            ¿No tienes cuenta?{' '}
                            <Link href="/auth/register" className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                                Regístrate aquí
                            </Link>
                        </p>
                    </div>

                    {/* Main Card */}
                    <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200 dark:border-slate-700 p-8">
                        {error && (
                            <div className="rounded-2xl bg-red-50 dark:bg-red-900/20 p-4 mb-6 border border-red-200 dark:border-red-800">
                                <div className="text-sm text-red-700 dark:text-red-400 font-medium">
                                    {error === 'CredentialsSignin' && 'Credenciales inválidas. Inténtalo de nuevo.'}
                                    {error === 'OAuthSignin' && 'Error con el proveedor OAuth. Inténtalo de nuevo.'}
                                    {error === 'OAuthCallback' && 'Error en el callback OAuth. Inténtalo de nuevo.'}
                                    {error === 'OAuthCreateAccount' && 'No se pudo crear la cuenta OAuth. Inténtalo de nuevo.'}
                                    {error === 'EmailCreateAccount' && 'No se pudo crear la cuenta de email. Inténtalo de nuevo.'}
                                    {error === 'Callback' && 'Error en el callback. Inténtalo de nuevo.'}
                                    {error === 'OAuthAccountNotLinked' && 'Email ya asociado con otra cuenta.'}
                                    {error === 'EmailSignin' && 'Revisa tu email para el enlace de acceso.'}
                                    {error === 'SessionRequired' && 'Por favor inicia sesión para acceder a esta página.'}
                                    {!['CredentialsSignin', 'OAuthSignin', 'OAuthCallback', 'OAuthCreateAccount', 'EmailCreateAccount', 'Callback', 'OAuthAccountNotLinked', 'EmailSignin', 'SessionRequired'].includes(error) && 'Ocurrió un error. Inténtalo de nuevo.'}
                                </div>
                            </div>
                        )}

                        <div className="space-y-6">
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
                                            className="group relative w-full flex justify-center items-center py-4 px-6 border-2 border-gray-200 dark:border-slate-600 text-base font-semibold rounded-2xl text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 hover:border-blue-300 dark:hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl"
                                        >
                                            {provider.id === 'github' && (
                                                <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                                </svg>
                                            )}
                                            Continuar con {provider.name}
                                            <ArrowRightIcon className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                                        </button>
                                    </div>
                                )
                            })}

                            {providers && Object.values(providers).some((p: Provider) => p.id !== 'credentials') && (
                                <div className="relative my-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-200 dark:border-slate-600" />
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-4 bg-white/90 dark:bg-slate-800/90 text-gray-500 dark:text-gray-400 font-medium">
                                            O continúa con email
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center mt-8">
                        <Link
                            href="/"
                            className="inline-flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
                        >
                            <SparklesIcon className="h-4 w-4" />
                            <span>Volver al inicio</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

function CredentialsForm({ callbackUrl }: { callbackUrl: string }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

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
            <div className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Correo electrónico
                    </label>
                    <div className="relative">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="block w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white text-base transition-all duration-300"
                            placeholder="tu@email.com"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Contraseña
                    </label>
                    <div className="relative">
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="block w-full px-4 py-3 pr-12 border-2 border-gray-200 dark:border-slate-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white text-base transition-all duration-300"
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                        >
                            {showPassword ? (
                                <EyeSlashIcon className="h-5 w-5" />
                            ) : (
                                <EyeIcon className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <div>
                <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full flex justify-center items-center py-4 px-6 border border-transparent text-base font-semibold rounded-2xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                    <LockClosedIcon className="h-5 w-5 mr-3" />
                    {loading ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                            Iniciando sesión...
                        </>
                    ) : (
                        'Iniciar Sesión'
                    )}
                </button>
            </div>
        </form>
    )
}

export default function SignInPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mb-6"></div>
                    <div className="text-lg font-medium text-gray-600 dark:text-gray-300">Cargando...</div>
                </div>
            </div>
        }>
            <SignInContent />
        </Suspense>
    )
}