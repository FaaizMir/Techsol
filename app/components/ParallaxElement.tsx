"use client"

import { ReactNode, useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface ParallaxElementProps {
  children: ReactNode
  speed?: number
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right'
}

export default function ParallaxElement({ 
  children, 
  speed = 0.2, 
  className = "", 
  direction = 'up' 
}: ParallaxElementProps) {
  const ref = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    // Register ScrollTrigger plugin
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger)
      
      const element = ref.current
      if (!element) return
      
      let xTo = 0
      let yTo = 0
      
      // Set direction of parallax movement
      if (direction === 'up') {
        yTo = -50 * speed
      } else if (direction === 'down') {
        yTo = 50 * speed
      } else if (direction === 'left') {
        xTo = -50 * speed
      } else if (direction === 'right') {
        xTo = 50 * speed
      }
      
      // Create the parallax animation
      const animation = gsap.fromTo(
        element,
        { y: 0, x: 0 },
        {
          y: yTo,
          x: xTo,
          ease: 'none',
          scrollTrigger: {
            trigger: element,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        }
      )
      
      return () => {
        // Cleanup animation
        if (animation.scrollTrigger) {
          animation.scrollTrigger.kill()
        }
        animation.kill()
      }
    }
  }, [direction, speed])
  
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
