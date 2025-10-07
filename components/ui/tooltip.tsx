'use client'

import { useState, useRef, useEffect } from 'react'

interface TooltipProps {
    children: React.ReactNode
    content: string
    position?: 'top' | 'bottom' | 'left' | 'right'
    className?: string
}

export function Tooltip({ children, content, position = 'top', className = '' }: TooltipProps) {
    const [isVisible, setIsVisible] = useState(false)
    const [coords, setCoords] = useState({ x: 0, y: 0 })
    const triggerRef = useRef<HTMLDivElement>(null)
    const tooltipRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (isVisible && triggerRef.current && tooltipRef.current) {
            const triggerRect = triggerRef.current.getBoundingClientRect()
            const tooltipRect = tooltipRef.current.getBoundingClientRect()

            let x = 0
            let y = 0

            switch (position) {
                case 'top':
                    x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2
                    y = triggerRect.top - tooltipRect.height - 8
                    break
                case 'bottom':
                    x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2
                    y = triggerRect.bottom + 8
                    break
                case 'left':
                    x = triggerRect.left - tooltipRect.width - 8
                    y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2
                    break
                case 'right':
                    x = triggerRect.right + 8
                    y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2
                    break
            }

            setCoords({ x, y })
        }
    }, [isVisible, position])

    return (
        <div className={`relative inline-block ${className}`}>
            <div
                ref={triggerRef}
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
                onFocus={() => setIsVisible(true)}
                onBlur={() => setIsVisible(false)}
                className="inline-block"
            >
                {children}
            </div>

            {isVisible && (
                <>
                    {/* Portal-like fixed positioning */}
                    <div
                        ref={tooltipRef}
                        className="fixed z-[9999] pointer-events-none"
                        style={{ left: `${coords.x}px`, top: `${coords.y}px` }}
                    >
                        <div className="bg-gray-900 dark:bg-gray-800 text-white text-xs px-3 py-2 rounded-lg shadow-xl border border-gray-700 whitespace-nowrap animate-fade-in">
                            {content}
                            {/* Arrow */}
                            <div
                                className={`absolute w-2 h-2 bg-gray-900 dark:bg-gray-800 border-gray-700 transform rotate-45 ${position === 'top'
                                        ? 'bottom-[-4px] left-1/2 -translate-x-1/2 border-r border-b'
                                        : position === 'bottom'
                                            ? 'top-[-4px] left-1/2 -translate-x-1/2 border-l border-t'
                                            : position === 'left'
                                                ? 'right-[-4px] top-1/2 -translate-y-1/2 border-r border-t'
                                                : 'left-[-4px] top-1/2 -translate-y-1/2 border-l border-b'
                                    }`}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
