'use client'

import { useState, useEffect } from 'react'

interface UseLoadingOptions {
  initialLoading?: boolean
  minLoadingTime?: number // Minimum time to show loading (in ms)
}

export function useLoading(options: UseLoadingOptions = {}) {
  const { initialLoading = true, minLoadingTime = 500 } = options
  const [loading, setLoading] = useState(initialLoading)
  const [startTime, setStartTime] = useState<number | null>(null)

  useEffect(() => {
    if (loading && startTime === null) {
      setStartTime(Date.now())
    }
  }, [loading, startTime])

  const stopLoading = () => {
    if (startTime === null) {
      setLoading(false)
      return
    }

    const elapsed = Date.now() - startTime
    const remaining = minLoadingTime - elapsed

    if (remaining > 0) {
      setTimeout(() => {
        setLoading(false)
        setStartTime(null)
      }, remaining)
    } else {
      setLoading(false)
      setStartTime(null)
    }
  }

  const startLoading = () => {
    setStartTime(Date.now())
    setLoading(true)
  }

  return {
    loading,
    startLoading,
    stopLoading,
    setLoading: (value: boolean) => {
      if (value) {
        startLoading()
      } else {
        stopLoading()
      }
    }
  }
}

// Hook para loading de páginas con suspense
export function usePageLoading() {
  const [isNavigating, setIsNavigating] = useState(false)

  useEffect(() => {
    const handleStart = () => setIsNavigating(true)
    const handleComplete = () => setIsNavigating(false)

    // Listen to route changes
    window.addEventListener('beforeunload', handleStart)
    
    return () => {
      window.removeEventListener('beforeunload', handleStart)
    }
  }, [])

  return isNavigating
}

// Hook para loading con datos
export function useAsyncLoading<T>(
  asyncFunction: () => Promise<T>,
  dependencies: any[] = []
) {
  const { loading, stopLoading, startLoading } = useLoading()
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false

    const loadData = async () => {
      try {
        startLoading()
        setError(null)
        const result = await asyncFunction()
        
        if (!cancelled) {
          setData(result)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Unknown error'))
        }
      } finally {
        if (!cancelled) {
          stopLoading()
        }
      }
    }

    loadData()

    return () => {
      cancelled = true
    }
  }, dependencies)

  const refetch = () => {
    startLoading()
    setError(null)
    
    asyncFunction()
      .then(result => setData(result))
      .catch(err => setError(err instanceof Error ? err : new Error('Unknown error')))
      .finally(() => stopLoading())
  }

  return {
    loading,
    data,
    error,
    refetch
  }
}