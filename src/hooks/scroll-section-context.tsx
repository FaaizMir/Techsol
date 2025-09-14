"use client"

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react'

export type Section = 'hero' | 'about' | 'services' | 'projects' | 'testimonials' | 'cta'

type ScrollSectionContextType = {
  currentSection: Section
  scrollY: number
  viewportHeight: number
}

const ScrollSectionContext = createContext<ScrollSectionContextType>({
  currentSection: 'hero',
  scrollY: 0,
  viewportHeight: 0
})

export function ScrollSectionProvider({ children }: { children: ReactNode }) {
  const [currentSection, setCurrentSection] = useState<Section>('hero')
  const [scrollY, setScrollY] = useState(0)
  const [viewportHeight, setViewportHeight] = useState(0)

  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return
    
    // Initialize viewport height
    setViewportHeight(window.innerHeight)

    // Update viewport height on resize
    const handleResize = () => {
      setViewportHeight(window.innerHeight)
    }

    // Handle scroll events
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    // Add event listeners
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)

    // Initial call
    handleScroll()
    handleResize()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return
    
    // Determine current section based on scroll position
    const sections = document.querySelectorAll('[data-section]')
    
    // Find which section is currently in view
    const currentSectionElement = Array.from(sections).find((section) => {
      const rect = section.getBoundingClientRect()
      // Consider a section in view when it's top is between 0 and 1/3 of viewport height
      return rect.top <= viewportHeight / 3 && rect.bottom > 0
    })

    if (currentSectionElement) {
      const sectionId = currentSectionElement.getAttribute('data-section') as Section
      if (sectionId && sectionId !== currentSection) {
        setCurrentSection(sectionId)
      }
    }
  }, [scrollY, viewportHeight, currentSection])

  return (
    <ScrollSectionContext.Provider value={{ currentSection, scrollY, viewportHeight }}>
      {children}
    </ScrollSectionContext.Provider>
  )
}

export function useScrollSection() {
  const context = useContext(ScrollSectionContext)
  if (context === undefined) {
    throw new Error('useScrollSection must be used within a ScrollSectionProvider')
  }
  return context
}
