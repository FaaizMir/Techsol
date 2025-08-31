"use client"

import { useState, useEffect } from 'react'

export type Section = 'hero' | 'about' | 'services' | 'projects' | 'testimonials' | 'cta'

// Create a safe version of the hook that can handle being imported in various contexts
function createScrollSectionHook() {
  // This will only create the hook function, but won't execute any hooks until it's called
  return function useScrollSectionHook() {
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

    return { currentSection, scrollY, viewportHeight }
  }
}

// Export the hook factory
export default createScrollSectionHook()