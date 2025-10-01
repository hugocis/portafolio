'use client'

import { useState } from 'react'
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

    return (
        <div className={`relative ${className}`}>
            {/* Toggle Button */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl px-4 py-2 hover:bg-white transition-all duration-200 shadow-sm"
            >
                <div className={`p-1 rounded-lg bg-gradient-to-r ${layouts.find(l => l.id === currentLayout)?.gradient}`}>
                    {(() => {
                        const CurrentIcon = layouts.find(l => l.id === currentLayout)?.icon || Squares2X2Icon
                        return <CurrentIcon className="h-4 w-4 text-white" />
                    })()}
                </div>
                <span className="font-medium text-gray-700">
                    {layouts.find(l => l.id === currentLayout)?.name}
                </span>
                <svg
                    className={`h-4 w-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown */}
            {isExpanded && (
                <div className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50 min-w-64">
                    <div className="p-2">
                        <div className="text-xs font-medium text-gray-500 px-3 py-2 border-b border-gray-100">
                            Cambiar Vista
                        </div>
                        {layouts.map((layout) => {
                            const IconComponent = layout.icon
                            const isActive = currentLayout === layout.id

                            return (
                                <button
                                    key={layout.id}
                                    onClick={() => {
                                        onLayoutChange(layout.id)
                                        setIsExpanded(false)
                                    }}
                                    className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 ${isActive
                                            ? 'bg-gradient-to-r ' + layout.gradient + ' text-white shadow-md'
                                            : 'hover:bg-gray-50 text-gray-700'
                                        }`}
                                >
                                    <div className={`p-2 rounded-lg ${isActive
                                            ? 'bg-white/20'
                                            : 'bg-gradient-to-r ' + layout.gradient
                                        }`}>
                                        <IconComponent className={`h-4 w-4 ${isActive ? 'text-white' : 'text-white'
                                            }`} />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <div className="font-medium">{layout.name}</div>
                                        <div className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-500'
                                            }`}>
                                            {layout.description}
                                        </div>
                                    </div>
                                    {isActive && (
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                    )}
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}