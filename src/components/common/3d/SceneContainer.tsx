"use client"

import { useRef, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { type Section } from '@/hooks/scroll-section-context'

// Dynamically import Three.js components to avoid SSR issues
const Canvas = dynamic(() => import('@react-three/fiber').then(mod => mod.Canvas), {
  ssr: false,
  loading: () => <div className="fixed inset-0 w-full h-screen z-0"></div>
})

const OrbitControls = dynamic(() => import('@react-three/drei').then(mod => mod.OrbitControls), {
  ssr: false
})

const Environment = dynamic(() => import('@react-three/drei').then(mod => mod.Environment), {
  ssr: false
})

// Dynamically import our scene component
const EnhancedScene = dynamic(() => import('./EnhancedScene'), {
  ssr: false
})

// Import light components from drei instead of creating our own
const Lights = dynamic(() => 
  import('@react-three/drei').then(() => 
    function Lights() {
      return (
        <>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00ffff" />
        </>
      )
    }
  ), 
  { ssr: false }
)

interface SceneContainerProps {
  currentSection: Section
}

export default function SceneContainer({ currentSection }: SceneContainerProps) {
  const [hasMounted, setHasMounted] = useState(false)
  
  // Only mount on client-side
  useEffect(() => {
    setHasMounted(true)
    return () => setHasMounted(false)
  }, [])
  
  // Return nothing until client-side hydration is complete
  if (!hasMounted) {
    return <div className="fixed inset-0 w-full h-screen z-0"></div>
  }
  
  return (
    <div className="fixed inset-0 w-full h-screen pointer-events-none z-0">
      {/* <Canvas 
        camera={{ position: [0, 0, 10], fov: 60 }}
        dpr={[1, 1.5]} // Reduced for better performance
        frameloop="demand" // Only render when needed
      >
        <Environment preset="night" />
        <Lights />
        
        {currentSection && <EnhancedScene currentSection={currentSection} />}
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate 
          autoRotateSpeed={0.5} 
          enableRotate={false}
        />
      </Canvas> */}
    </div>
  )
}