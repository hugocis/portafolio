'use client'

interface AnimatedBackgroundProps {
  variant?: 'dashboard' | 'public' | 'auth' | 'minimal'
  className?: string
}

export function AnimatedBackground({ variant = 'dashboard', className = '' }: AnimatedBackgroundProps) {
  const getBackgroundPattern = () => {
    switch (variant) {
      case 'dashboard':
        return (
          <div className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}>
            {/* Base gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/80 to-indigo-100/60"></div>

            {/* Animated circles */}
            <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-32 right-16 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-16 left-40 w-80 h-80 bg-gradient-to-r from-indigo-400/20 to-blue-400/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
                                 radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.15) 0%, transparent 50%),
                                 radial-gradient(circle at 75% 25%, rgba(16, 185, 129, 0.15) 0%, transparent 50%),
                                 radial-gradient(circle at 25% 75%, rgba(245, 158, 11, 0.15) 0%, transparent 50%)`
              }}></div>
            </div>

            {/* Floating particles */}
            <div className="absolute inset-0">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className={`absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-60 animate-float`}
                  style={{
                    left: `${15 + (i * 15)}%`,
                    top: `${20 + (i * 10)}%`,
                    animationDelay: `${i * 0.5}s`,
                    animationDuration: `${3 + (i * 0.5)}s`
                  }}
                ></div>
              ))}
            </div>
          </div>
        )

      case 'public':
        return (
          <div className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}>
            {/* Base gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/50 to-indigo-100/40"></div>

            {/* Subtle animated shapes */}
            <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-r from-blue-300/10 to-purple-300/10 rounded-full mix-blend-multiply filter blur-2xl opacity-80 animate-pulse"></div>
            <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-r from-indigo-300/10 to-blue-300/10 rounded-full mix-blend-multiply filter blur-2xl opacity-80 animate-pulse animation-delay-3000"></div>

            {/* Mesh gradient overlay */}
            <div className="absolute inset-0 opacity-40">
              <div className="absolute inset-0" style={{
                backgroundImage: `linear-gradient(45deg, rgba(59, 130, 246, 0.05) 25%, transparent 25%),
                                 linear-gradient(-45deg, rgba(147, 51, 234, 0.05) 25%, transparent 25%),
                                 linear-gradient(45deg, transparent 75%, rgba(16, 185, 129, 0.05) 75%),
                                 linear-gradient(-45deg, transparent 75%, rgba(245, 158, 11, 0.05) 75%)`,
                backgroundSize: '60px 60px',
                backgroundPosition: '0 0, 0 30px, 30px -30px, -30px 0px'
              }}></div>
            </div>
          </div>
        )

      case 'auth':
        return (
          <div className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}>
            {/* Dramatic gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900"></div>

            {/* Overlay for readability */}
            <div className="absolute inset-0 bg-black/20"></div>

            {/* Animated orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-r from-indigo-600/30 to-blue-600/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

            {/* Stars effect */}
            <div className="absolute inset-0">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full opacity-60 animate-twinkle"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${2 + Math.random() * 2}s`
                  }}
                ></div>
              ))}
            </div>
          </div>
        )

      case 'minimal':
        return (
          <div className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}>
            {/* Clean gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white"></div>

            {/* Subtle pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 70%)`
              }}></div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <>
      {getBackgroundPattern()}

      {/* Custom animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </>
  )
}