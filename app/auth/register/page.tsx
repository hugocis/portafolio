'use client'

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
    EyeIcon,
    EyeSlashIcon,
    UserPlusIcon,
    SparklesIcon,
    CheckIcon,
    XMarkIcon,
    UserIcon,
    AtSymbolIcon,
    LockClosedIcon
} from "@heroicons/react/24/outline"
import {
    Squares2X2Icon as Squares2X2IconSolid,
} from "@heroicons/react/24/solid"

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [passwordStrength, setPasswordStrength] = useState(0)
    const router = useRouter()

    const checkPasswordStrength = (password: string) => {
        let strength = 0
        if (password.length >= 6) strength++
        if (password.length >= 8) strength++
        if (/[A-Z]/.test(password)) strength++
        if (/[0-9]/.test(password)) strength++
        if (/[^A-Za-z0-9]/.test(password)) strength++
        return strength
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))

        if (name === 'password') {
            setPasswordStrength(checkPasswordStrength(value))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden')
            setLoading(false)
            return
        }

        if (formData.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres')
            setLoading(false)
            return
        }

        if (!formData.username.match(/^[a-zA-Z0-9_]+$/)) {
            setError('El nombre de usuario solo puede contener letras, números y guiones bajos')
            setLoading(false)
            return
        }

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    username: formData.username,
                    password: formData.password,
                }),
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || 'Something went wrong')
            }

            // Automatically sign in after registration
            const result = await signIn('credentials', {
                email: formData.email,
                password: formData.password,
                redirect: false,
            })

            if (result?.ok) {
                router.push('/dashboard')
            } else {
                setError('Registro exitoso, pero falló el inicio de sesión. Por favor inicia sesión manualmente.')
            }
        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : 'Ocurrió un error')
        } finally {
            setLoading(false)
        }
    }

    const getPasswordStrengthColor = () => {
        if (passwordStrength <= 2) return 'bg-red-500'
        if (passwordStrength <= 3) return 'bg-yellow-500'
        return 'bg-green-500'
    }

    const getPasswordStrengthText = () => {
        if (passwordStrength <= 2) return 'Débil'
        if (passwordStrength <= 3) return 'Media'
        return 'Fuerte'
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
                                Crea tu
                            </span>
                            <br />
                            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                cuenta gratis
                            </span>
                        </h1>

                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            ¿Ya tienes cuenta?{' '}
                            <Link href="/auth/signin" className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                                Inicia sesión aquí
                            </Link>
                        </p>
                    </div>

                    {/* Main Card */}
                    <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200 dark:border-slate-700 p-8">
                        <form onSubmit={handleSubmit}>
                            {error && (
                                <div className="rounded-2xl bg-red-50 dark:bg-red-900/20 p-4 mb-6 border border-red-200 dark:border-red-800">
                                    <div className="flex items-center">
                                        <XMarkIcon className="h-5 w-5 text-red-500 mr-2" />
                                        <div className="text-sm text-red-700 dark:text-red-400 font-medium">{error}</div>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-6">
                                {/* Name Field */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Nombre completo
                                    </label>
                                    <div className="relative">
                                        <UserIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-slate-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white text-base transition-all duration-300"
                                            placeholder="Tu nombre completo"
                                        />
                                    </div>
                                </div>

                                {/* Username Field */}
                                <div>
                                    <label htmlFor="username" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Nombre de usuario
                                    </label>
                                    <div className="relative">
                                        <AtSymbolIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            id="username"
                                            name="username"
                                            type="text"
                                            required
                                            value={formData.username}
                                            onChange={handleChange}
                                            className="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-slate-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white text-base transition-all duration-300"
                                            placeholder="username"
                                        />
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        Tu URL será: portfolio-tree.com/user/{formData.username || 'username'}
                                    </p>
                                </div>

                                {/* Email Field */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Correo electrónico
                                    </label>
                                    <div className="relative">
                                        <AtSymbolIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-slate-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white text-base transition-all duration-300"
                                            placeholder="tu@email.com"
                                        />
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div>
                                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Contraseña
                                    </label>
                                    <div className="relative">
                                        <LockClosedIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            autoComplete="new-password"
                                            required
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="block w-full pl-12 pr-12 py-3 border-2 border-gray-200 dark:border-slate-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white text-base transition-all duration-300"
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
                                    {/* Password Strength */}
                                    {formData.password && (
                                        <div className="mt-2">
                                            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                                                <span>Fortaleza de la contraseña</span>
                                                <span className={`font-medium ${passwordStrength <= 2 ? 'text-red-500' : passwordStrength <= 3 ? 'text-yellow-500' : 'text-green-500'}`}>
                                                    {getPasswordStrengthText()}
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                                                    style={{ width: `${(passwordStrength / 5) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Confirm Password Field */}
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Confirmar contraseña
                                    </label>
                                    <div className="relative">
                                        <LockClosedIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            autoComplete="new-password"
                                            required
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className="block w-full pl-12 pr-12 py-3 border-2 border-gray-200 dark:border-slate-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white text-base transition-all duration-300"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeSlashIcon className="h-5 w-5" />
                                            ) : (
                                                <EyeIcon className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                    {formData.confirmPassword && (
                                        <div className="mt-1 flex items-center text-xs">
                                            {formData.password === formData.confirmPassword ? (
                                                <>
                                                    <CheckIcon className="h-4 w-4 text-green-500 mr-1" />
                                                    <span className="text-green-600 dark:text-green-400">Las contraseñas coinciden</span>
                                                </>
                                            ) : (
                                                <>
                                                    <XMarkIcon className="h-4 w-4 text-red-500 mr-1" />
                                                    <span className="text-red-600 dark:text-red-400">Las contraseñas no coinciden</span>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="group relative w-full flex justify-center items-center py-4 px-6 border border-transparent text-base font-semibold rounded-2xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                                    >
                                        <UserPlusIcon className="h-5 w-5 mr-3" />
                                        {loading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                                                Creando cuenta...
                                            </>
                                        ) : (
                                            'Crear Cuenta'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
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