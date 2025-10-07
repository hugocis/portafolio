'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
    CheckCircleIcon,
    XCircleIcon,
    ArrowPathIcon,
    ServerIcon,
    CircleStackIcon,
    CloudIcon,
    ClockIcon,
    CodeBracketIcon,
    CpuChipIcon,
    SignalIcon
} from '@heroicons/react/24/outline'
import { Squares2X2Icon as Squares2X2IconSolid } from '@heroicons/react/24/solid'

interface HealthData {
    status: 'ok' | 'error'
    timestamp: string
    database: string
    environment: string
    version: string
    error?: string
}

export default function HealthPage() {
    const [health, setHealth] = useState<HealthData | null>(null)
    const [loading, setLoading] = useState(true)
    const [lastCheck, setLastCheck] = useState<Date>(new Date())

    const fetchHealth = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/health')
            const data = await res.json()
            setHealth(data)
            setLastCheck(new Date())
        } catch (error) {
            setHealth({
                status: 'error',
                timestamp: new Date().toISOString(),
                database: 'unknown',
                environment: 'unknown',
                version: 'unknown',
                error: 'Failed to fetch health status'
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchHealth()
        // Auto-refresh cada 30 segundos
        const interval = setInterval(fetchHealth, 30000)
        return () => clearInterval(interval)
    }, [])

    const getStatusColor = (status: string) => {
        if (status === 'ok' || status === 'connected') {
            return 'text-green-600 dark:text-green-400'
        }
        return 'text-red-600 dark:text-red-400'
    }

    const getStatusBg = (status: string) => {
        if (status === 'ok' || status === 'connected') {
            return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
        }
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
    }

    const getStatusIcon = (status: string) => {
        if (status === 'ok' || status === 'connected') {
            return <CheckCircleIcon className="h-6 w-6 sm:h-8 sm:w-8" />
        }
        return <XCircleIcon className="h-6 w-6 sm:h-8 sm:w-8" />
    }

    const getEnvironmentColor = (env: string) => {
        switch (env) {
            case 'production':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
            case 'development':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
            case 'staging':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-gray-200 dark:border-slate-700 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <Link href="/" className="flex items-center space-x-3 group">
                            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                                <Squares2X2IconSolid className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                                Portfolio Tree
                            </span>
                        </Link>

                        <div className="flex items-center space-x-4">
                            <Link
                                href="/"
                                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                            >
                                Inicio
                            </Link>
                            <Link
                                href="/explore"
                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:scale-105"
                            >
                                Explorar
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl mb-6 animate-pulse">
                            <ServerIcon className="h-12 w-12 text-white" />
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                            System Health Check
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Monitoreo en tiempo real del estado de la aplicación
                        </p>
                    </div>

                    {loading && !health ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="relative">
                                <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
                                <ServerIcon className="h-8 w-8 text-blue-600 dark:text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                            </div>
                        </div>
                    ) : health ? (
                        <div className="space-y-6">
                            {/* Status Principal */}
                            <div className={`${getStatusBg(health.status)} border-2 rounded-2xl p-8 shadow-2xl transform transition-all duration-300 hover:scale-[1.02]`}>
                                <div className="flex items-center justify-between flex-wrap gap-4">
                                    <div className="flex items-center space-x-4">
                                        <div className={getStatusColor(health.status)}>
                                            {getStatusIcon(health.status)}
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                                {health.status === 'ok' ? '¡Sistema Operativo!' : 'Sistema Con Problemas'}
                                            </h2>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Estado: <span className={`font-semibold ${getStatusColor(health.status)}`}>
                                                    {health.status.toUpperCase()}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={fetchHealth}
                                        disabled={loading}
                                        className="flex items-center space-x-2 px-6 py-3 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 border-2 border-gray-200 dark:border-slate-600"
                                    >
                                        <ArrowPathIcon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                                        <span className="font-medium">Actualizar</span>
                                    </button>
                                </div>
                            </div>

                            {/* Grid de Métricas */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Database Status */}
                                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl border-2 border-gray-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-2xl">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg">
                                            <CircleStackIcon className="h-6 w-6 text-white" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            Base de Datos
                                        </h3>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className={`${getStatusColor(health.database)}`}>
                                            {getStatusIcon(health.database)}
                                        </div>
                                        <span className={`text-xl font-bold ${getStatusColor(health.database)}`}>
                                            {health.database === 'connected' ? 'Conectado' : 'Desconectado'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                        {health.database === 'connected'
                                            ? 'PostgreSQL funcionando correctamente'
                                            : 'Error de conexión'}
                                    </p>
                                </div>

                                {/* Environment */}
                                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl border-2 border-gray-200 dark:border-slate-700 hover:border-purple-400 dark:hover:border-purple-600 transition-all duration-300 hover:shadow-2xl">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
                                            <CloudIcon className="h-6 w-6 text-white" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            Entorno
                                        </h3>
                                    </div>
                                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${getEnvironmentColor(health.environment)}`}>
                                        <CpuChipIcon className="h-4 w-4 mr-2" />
                                        {health.environment.charAt(0).toUpperCase() + health.environment.slice(1)}
                                    </span>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                                        Modo de ejecución actual
                                    </p>
                                </div>

                                {/* Version */}
                                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl border-2 border-gray-200 dark:border-slate-700 hover:border-green-400 dark:hover:border-green-600 transition-all duration-300 hover:shadow-2xl">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                                            <CodeBracketIcon className="h-6 w-6 text-white" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            Versión
                                        </h3>
                                    </div>
                                    <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                        v{health.version}
                                    </span>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                        Build actual del sistema
                                    </p>
                                </div>
                            </div>

                            {/* Información Adicional */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Timestamp */}
                                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl border-2 border-gray-200 dark:border-slate-700">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <ClockIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            Última Verificación
                                        </h3>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 font-mono text-sm">
                                        {new Date(health.timestamp).toLocaleString('es-ES', {
                                            dateStyle: 'full',
                                            timeStyle: 'medium'
                                        })}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                                        Actualización automática cada 30 segundos
                                    </p>
                                </div>

                                {/* Uptime Indicator */}
                                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl border-2 border-gray-200 dark:border-slate-700">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <SignalIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            Disponibilidad
                                        </h3>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${health.status === 'ok' ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-orange-500'} transition-all duration-500`}
                                                style={{ width: health.status === 'ok' ? '100%' : '60%' }}
                                            ></div>
                                        </div>
                                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {health.status === 'ok' ? '100%' : '60%'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                                        Servicios operativos
                                    </p>
                                </div>
                            </div>

                            {/* Error Message if exists */}
                            {health.error && (
                                <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-6 shadow-xl">
                                    <div className="flex items-start space-x-3">
                                        <XCircleIcon className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-1">
                                                Error Detectado
                                            </h3>
                                            <p className="text-red-700 dark:text-red-300 font-mono text-sm">
                                                {health.error}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* API Endpoint Info */}
                            <div className="bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-900 dark:to-black rounded-2xl p-6 shadow-2xl border-2 border-slate-700 dark:border-slate-800">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                    <CodeBracketIcon className="h-5 w-5 mr-2" />
                                    API Endpoint
                                </h3>
                                <div className="bg-black/50 rounded-lg p-4 font-mono text-sm">
                                    <div className="text-green-400 mb-2">GET /api/health</div>
                                    <div className="text-gray-400 text-xs">
                                        <pre className="overflow-x-auto">{JSON.stringify(health, null, 2)}</pre>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-gray-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-gray-600 dark:text-gray-400">
                        © 2025 Portfolio Tree. Sistema de monitoreo de salud.
                    </p>
                </div>
            </footer>
        </div>
    )
}
