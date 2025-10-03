import { Loading } from '@/components/ui/loading'

export default function LoadingPage() {
  return (
    <Loading 
      variant="gradient" 
      size="xl" 
      text="Cargando..."
      fullScreen 
    />
  )
}