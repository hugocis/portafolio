'use client'

import { useEffect, useState } from 'react'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'primary' | 'gradient' | 'minimal' | 'dots' | 'pulse'
  text?: string
  fullScreen?: boolean
  className?: string
}

export function Loading({
  size = 'md',
  variant = 'gradient',
  text = 'Cargando...',
  fullScreen = false,
  className = ''
}: LoadingProps) {
  const [dots, setDots] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.')
    }, 500)
    return () => clearInterval(interval)
  }, [])

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }

  const containerClasses = fullScreen
    ? 'fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50'
    : 'flex items-center justify-center p-8'

  if (variant === 'minimal') {
    return (
      <div className={`${containerClasses} ${className}`}>
        <div className="flex items-center space-x-3">
          <div className={`${sizeClasses[size]} border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin`} />
          {text && <span className={`${textSizeClasses[size]} text-gray-600`}>{text}{dots}</span>}
        </div>
      </div>
    )
  }

  if (variant === 'dots') {
    return (
      <div className={`${containerClasses} ${className}`}>
        <div className="flex flex-col items-center space-y-4">
          <div className="flex space-x-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`${sizeClasses[size]} bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-bounce`}
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
          {text && <span className={`${textSizeClasses[size]} text-gray-600 font-medium`}>{text}</span>}
        </div>
      </div>
    )
  }

  if (variant === 'pulse') {
    return (
      <div className={`${containerClasses} ${className}`}>
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className={`${sizeClasses[size]} bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse`} />
            <div className={`absolute inset-0 ${sizeClasses[size]} bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-ping opacity-30`} />
          </div>
          {text && <span className={`${textSizeClasses[size]} text-gray-600 font-medium`}>{text}</span>}
        </div>
      </div>
    )
  }

  if (variant === 'primary') {
    return (
      <div className={`${containerClasses} ${className}`}>
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className={`${sizeClasses[size]} border-4 border-blue-200 rounded-full animate-spin`}>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-blue-600 rounded-full" />
            </div>
          </div>
          {text && <span className={`${textSizeClasses[size]} text-gray-600 font-medium`}>{text}{dots}</span>}
        </div>
      </div>
    )
  }

  // Gradient variant (default)
  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="flex flex-col items-center space-y-6">
        {/* Main spinner */}
        <div className="relative">
          <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-spin`}>
            <div className="absolute inset-1 bg-white rounded-full" />
          </div>

          {/* Pulsing rings */}
          <div className="absolute inset-0 -m-2">
            <div className={`w-full h-full border-2 border-blue-300 rounded-full animate-ping opacity-20`} />
          </div>
          <div className="absolute inset-0 -m-4">
            <div className={`w-full h-full border-2 border-purple-300 rounded-full animate-ping opacity-10`}
              style={{ animationDelay: '0.5s' }} />
          </div>
        </div>

        {/* Text with animated dots */}
        {text && (
          <div className="text-center">
            <h3 className={`${textSizeClasses[size]} font-semibold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent`}>
              {text}
            </h3>
            <div className="flex justify-center mt-2">
              <span className="text-gray-400 font-mono tracking-wider min-w-[2rem]">
                {dots}
              </span>
            </div>
          </div>
        )}

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-200 rounded-full blur-3xl opacity-20 animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-200 rounded-full blur-3xl opacity-20 animate-pulse"
            style={{ animationDelay: '1s' }} />
        </div>
      </div>
    </div>
  )
}

// Specialized loading components for different use cases
export function PageLoading({ text = 'Cargando página...' }: { text?: string }) {
  return <Loading variant="gradient" size="lg" text={text} fullScreen />
}

export function ComponentLoading({ text, size = 'md' }: { text?: string; size?: 'sm' | 'md' | 'lg' }) {
  return <Loading variant="primary" size={size} text={text} />
}

export function ButtonLoading({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  return <Loading variant="minimal" size={size} text="" />
}

export function DotsLoading({ text }: { text?: string }) {
  return <Loading variant="dots" size="sm" text={text} />
}

// Loading skeleton for content
export function LoadingSkeleton({
  lines = 3,
  className = '',
  animated = true
}: {
  lines?: number
  className?: string
  animated?: boolean
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className={`h-4 bg-gray-200 rounded w-full ${animated ? 'animate-pulse' : ''}`} />
          {i === 0 && (
            <div className={`h-4 bg-gray-200 rounded w-3/4 ${animated ? 'animate-pulse' : ''}`} />
          )}
        </div>
      ))}
    </div>
  )
}

// Card loading skeleton
export function LoadingCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 shadow-sm ${className}`}>
      <div className="animate-pulse">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
        <LoadingSkeleton lines={3} />
      </div>
    </div>
  )
}