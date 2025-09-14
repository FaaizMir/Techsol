"use client"

import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'

export default function ScrollProgress() {
  const [mounted, setMounted] = useState(false)
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { 
    stiffness: 100, 
    damping: 30, 
    restDelta: 0.001 
  })
  
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])
  
  if (!mounted) return null
  
  return (
    <motion.div 
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 z-50"
      style={{ scaleX, transformOrigin: '0%' }}
    />
  )
}
