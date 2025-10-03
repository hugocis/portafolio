'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import {
    Squares2X2Icon,
    QueueListIcon,
    CalendarDaysIcon,
    ViewColumnsIcon
} from '@heroicons/react/24/outline'

export type LayoutType = 'tree' | 'timeline' | 'kanban' | 'grid'

interface LayoutSelectorProps {
    currentLayout: LayoutType
    onLayoutChange: (layout: LayoutType) => void
    className?: string
}

const layouts = [
    {
        id: 'tree' as LayoutType,
        name: 'Árbol',
        description: 'Vista jerárquica tradicional',
        icon: QueueListIcon,
        gradient: 'from-green-500 to-emerald-600'
    },
    {
        id: 'timeline' as LayoutType,
        name: 'Timeline',
        description: 'Cronología temporal',
        icon: CalendarDaysIcon,
        gradient: 'from-blue-500 to-cyan-600'
    },
    {
        id: 'kanban' as LayoutType,
        name: 'Kanban',
        description: 'Tablero por categorías',
        icon: ViewColumnsIcon,
        gradient: 'from-purple-500 to-violet-600'
    },
    {
        id: 'grid' as LayoutType,
        name: 'Grid',
        description: 'Rejilla de proyectos',
        icon: Squares2X2Icon,
        gradient: 'from-orange-500 to-red-600'
    }
]

export function LayoutSelector({ currentLayout, onLayoutChange, className = '' }: LayoutSelectorProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [buttonRect, setButtonRect] = useState<DOMRect | null>(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (!isExpanded) {
            const rect = event.currentTarget.getBoundingClientRect()
            setButtonRect(rect)
        }
        setIsExpanded(!isExpanded)
    }

    return (
        <div className={`relative ${className}`}>
            {/* Main button - always visible */}
            <button
                onClick={handleToggle}
                className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl px-4 py-2 hover:bg-white hover:shadow-md transition-all duration-300 shadow-sm group"
            >
                <div className={`p-1 rounded-lg bg-gradient-to-r ${layouts.find(l => l.id === currentLayout)?.gradient} transition-transform duration-300 group-hover:scale-110`}>
                    {(() => {
                        const CurrentIcon = layouts.find(l => l.id === currentLayout)?.icon || Squares2X2Icon
                        return <CurrentIcon className="h-4 w-4 text-white" />
                    })()}
                </div>
                <span className="font-medium text-gray-700 transition-colors duration-300 group-hover:text-gray-900">
                    {layouts.find(l => l.id === currentLayout)?.name}
                </span>
                <svg
                    className={`h-4 w-4 text-gray-400 transition-all duration-300 group-hover:text-gray-600 ${
                        isExpanded ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown menu using React Portal */}
            {isExpanded && mounted && buttonRect && createPortal(
                <>
                    {/* Overlay to close dropdown when clicking outside */}
                    <div 
                        className="fixed inset-0" 
                        style={{ zIndex: 99998 }}
                        onClick={() => setIsExpanded(false)}
                    />
                    
                    {/* Dropdown content */}
                    <div 
                        className="fixed bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden min-w-64"
                        style={{
                            zIndex: 99999,
                            top: buttonRect.bottom + 8,
                            left: buttonRect.right - 256 // 256px = 16rem = min-w-64
                        }}
                    >
                        <div className="p-2">
                            <div className="text-xs font-medium text-gray-500 px-3 py-2 border-b border-gray-100">
                                Cambiar Vista
                            </div>
                            {layouts.map((layout, index) => {
                                const IconComponent = layout.icon
                                const isActive = currentLayout === layout.id

                                return (
                                    <div
                                        key={layout.id}
                                        className="animate-item-in"
                                        style={{
                                            animationDelay: `${index * 50}ms`
                                        }}
                                    >
                                        <button
                                            onClick={() => {
                                                onLayoutChange(layout.id)
                                                setIsExpanded(false)
                                            }}
                                            className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                                                isActive
                                                    ? `bg-gradient-to-r ${layout.gradient} text-white shadow-md`
                                                    : 'hover:bg-gray-50 text-gray-700 hover:shadow-sm'
                                            }`}
                                        >
                                            <div className={`p-2 rounded-lg transition-all duration-200 ${
                                                isActive
                                                    ? 'bg-white/20'
                                                    : `bg-gradient-to-r ${layout.gradient} group-hover:scale-110`
                                            }`}>
                                                <IconComponent className="h-4 w-4 text-white" />
                                            </div>
                                            <div className="flex-1 text-left">
                                                <div className="font-medium">{layout.name}</div>
                                                <div className={`text-xs ${
                                                    isActive ? 'text-white/80' : 'text-gray-500'
                                                }`}>
                                                    {layout.description}
                                                </div>
                                            </div>
                                            {isActive && (
                                                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                            )}
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </>,
                document.body
            )}
        </div>
    )
}