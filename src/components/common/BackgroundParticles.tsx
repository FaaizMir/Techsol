"use client"

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  radius: number
  color: string
  velocity: {
    x: number
    y: number
  }
  alpha: number
}

export default function BackgroundParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Set canvas to full window size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    // Handle resize
    window.addEventListener('resize', setCanvasSize)
    setCanvasSize()
    
    // Particle array
    let particles: Particle[] = []
    
    // Colors for particles
    const colors = ['#00b3ff', '#7928ca', '#0070f3', '#ff4d4d', '#50e3c2']
    
    // Mouse position
    let mouse = {
      x: null as number | null,
      y: null as number | null,
    }
    
    // Track mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.x
      mouse.y = e.y
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    
    // Create particles
    const createParticles = () => {
      const particleCount = Math.min(Math.floor(window.innerWidth / 20), 100)
      
      for (let i = 0; i < particleCount; i++) {
        const radius = Math.random() * 2 + 1
        const x = Math.random() * (canvas.width - radius * 2) + radius
        const y = Math.random() * (canvas.height - radius * 2) + radius
        const color = colors[Math.floor(Math.random() * colors.length)]
        const velocity = {
          x: (Math.random() - 0.5) * 0.5,
          y: (Math.random() - 0.5) * 0.5
        }
        
        particles.push({
          x,
          y,
          radius,
          color,
          velocity,
          alpha: Math.random() * 0.5 + 0.1
        })
      }
    }
    
    // Animate particles
    const animate = () => {
      requestAnimationFrame(animate)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        
        // Draw particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.globalAlpha = p.alpha
        ctx.fillStyle = p.color
        ctx.fill()
        
        // Move particle
        p.x += p.velocity.x
        p.y += p.velocity.y
        
        // Particle boundary check
        if (p.x - p.radius < 0 || p.x + p.radius > canvas.width) {
          p.velocity.x = -p.velocity.x
        }
        
        if (p.y - p.radius < 0 || p.y + p.radius > canvas.height) {
          p.velocity.y = -p.velocity.y
        }
        
        // Connect particles within range
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < 120) {
            const opacity = (1 - distance / 120) * 0.2
            ctx.beginPath()
            ctx.lineWidth = 0.5
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`
            ctx.globalAlpha = opacity
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        }
        
        // Interactive effect with mouse
        if (mouse.x && mouse.y) {
          const dx = p.x - mouse.x
          const dy = p.y - mouse.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < 120) {
            const pushFactor = 0.5
            const directionX = dx / distance
            const directionY = dy / distance
            const force = (120 - distance) / 120
            
            p.x += directionX * force * pushFactor
            p.y += directionY * force * pushFactor
          }
        }
      }
    }
    
    // Initialize
    createParticles()
    animate()
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', setCanvasSize)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-0 opacity-40"
    />
  )
}
