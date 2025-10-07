'use client'

import { useState, useEffect } from 'react'
import { ArrowUpIcon } from '@heroicons/react/24/outline'

export function BackToTop() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true)
            } else {
                setIsVisible(false)
            }
        }

        window.addEventListener('scroll', toggleVisibility)

        return () => window.removeEventListener('scroll', toggleVisibility)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }

    return (
        <>
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 z-50 p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 group"
                    aria-label="Volver arriba"
                >
                    <ArrowUpIcon className="h-5 w-5 group-hover:-translate-y-1 transition-transform duration-300" />
                </button>
            )}
        </>
    )
}
