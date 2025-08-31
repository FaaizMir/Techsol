"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import './globals.css'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import CustomCursor from './components/CustomCursor'
// const CustomCursor = dynamic(() => import('./components/CustomCursor'), { ssr: false })

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
    
    // Simulate loading delay for a smoother transition
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-900 text-white overflow-x-hidden">
        {/* Only render custom cursor on client */}
        {isMounted && <CustomCursor />}
        
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loader"
              className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  TECH SOLUTIONS
                </div>
                <div className="w-48 h-1.5 bg-gray-800 rounded-full overflow-hidden mx-auto">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                  />
                </div>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
        
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-black z-[-2]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-gray-900/0 to-transparent z-[-1]" />
        
        <Navigation />
        <main>
          <AnimatePresence mode="wait">
            {!isLoading && (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {children}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
        <Footer />
      </body>
    </html>
  )
}
