"use client"

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  // Create a client
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}