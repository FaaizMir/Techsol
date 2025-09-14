import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  
  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return
    
    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      if (!isVisible) setIsVisible(true)
    }
    
    // Track mouse clicks
    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)
    
    // Hide cursor when mouse leaves window
    const handleMouseLeave = () => setIsVisible(false)
    const handleMouseEnter = () => setIsVisible(true)
    
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('mouseenter', handleMouseEnter)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [isVisible])
  
  // Only render on client and when cursor is visible
  if (!isVisible) return null
  
  return (
    <motion.div
      className="fixed z-50 pointer-events-none mix-blend-difference"
      animate={{
        x: mousePosition.x,
        y: mousePosition.y,
        scale: isClicking ? 0.8 : 1,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{
        type: "spring",
        mass: 0.1,
        stiffness: 180,
        damping: 20,
        x: { duration: 0 },
        y: { duration: 0 },
      }}
    >
      <motion.div 
        className="relative w-8 h-8 rounded-full"  // Removed bg-white
        animate={{
          scale: isClicking ? 0.8 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 15,
        }}
      />
    </motion.div>
  )
}
