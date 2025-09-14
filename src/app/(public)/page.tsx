"use client"

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Import HomePage dynamically to prevent server-side rendering of 3D components
const HomePage = dynamic(() => import('@/components/pages/HomePage'), {
  loading: () => (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="animate-pulse text-xl md:text-2xl text-white">Loading amazing experience...</div>
    </div>
  ),
  ssr: false,
})

export default function Page() {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-pulse text-xl md:text-2xl text-white">Loading amazing experience...</div>
      </div>
    }>
      <HomePage />
    </Suspense>
  )
}