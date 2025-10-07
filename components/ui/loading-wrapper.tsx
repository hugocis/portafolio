'use client'

import { Suspense, ReactNode } from 'react'
import { PageLoading, ComponentLoading } from '@/components/ui/loading'

interface LoadingWrapperProps {
  children: ReactNode
  fallback?: ReactNode
  type?: 'page' | 'component'
  text?: string
}

export function LoadingWrapper({
  children,
  fallback,
  type = 'component',
  text
}: LoadingWrapperProps) {
  const defaultFallback = type === 'page'
    ? <PageLoading text={text} />
    : <ComponentLoading text={text} />

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  )
}

// Wrapper específico para páginas
export function PageWrapper({
  children,
  text = 'Cargando página...'
}: {
  children: ReactNode
  text?: string
}) {
  return (
    <LoadingWrapper type="page" text={text}>
      {children}
    </LoadingWrapper>
  )
}

// Wrapper específico para componentes
export function ComponentWrapper({
  children,
  text = 'Cargando...'
}: {
  children: ReactNode
  text?: string
}) {
  return (
    <LoadingWrapper type="component" text={text}>
      {children}
    </LoadingWrapper>
  )
}