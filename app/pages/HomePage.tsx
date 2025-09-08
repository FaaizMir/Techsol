"use client"

import { useState, useEffect } from 'react'
import { ArrowRight, Code, Cloud, Network, Palette, Shield, Users, ChevronDown, MousePointer } from "lucide-react"
import Link from "next/link"
import { motion, useScroll, useTransform } from 'framer-motion'
import dynamic from 'next/dynamic'
import Button from "../components/Button"
import Card from "../components/Card"
import AnimatedSection from "../components/AnimatedSection"
import { AnimatedTitle, AnimatedSubtitle, AnimatedItem, AnimatedFadeIn, AnimatedScaleIn } from "../components/AnimatedElements"
import ParallaxElement from "../components/ParallaxElement"
import ScrollProgress from "../components/ScrollProgress"
import { useScrollSection } from "../../hooks/scroll-section-context"

// Import components dynamically to prevent SSR issues
const BackgroundParticles = dynamic(() => import('../components/BackgroundParticles'), { ssr: false })
const SceneContainer = dynamic(() => import('../components/3d/SceneContainer'), { ssr: false })

export default function HomePage() {
  const { currentSection } = useScrollSection()
  const { scrollYProgress } = useScroll()
  const [mounted, setMounted] = useState(false)
  
  // Parallax effects for hero text
  const heroTitleY = useTransform(scrollYProgress, [0, 0.1], [0, -100])
  const heroSubtitleY = useTransform(scrollYProgress, [0, 0.1], [0, -50])
  const heroButtonsOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])

  useEffect(() => {
    setMounted(true)
  }, [])

  const services = [
    {
      icon: <Code className="h-8 w-8" />,
      title: "Web & Mobile Apps",
      description: "Custom applications with stunning 3D interfaces",
    },
    {
      icon: <Cloud className="h-8 w-8" />,
      title: "Cloud & DevOps",
      description: "Scalable infrastructure and automation solutions",
    },
    {
      icon: <Network className="h-8 w-8" />,
      title: "Virtualization",
      description: "VMware expertise and virtual infrastructure",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Network & Security",
      description: "Robust connectivity and security solutions",
    },
    {
      icon: <Palette className="h-8 w-8" />,
      title: "3D Interactive Design",
      description: "Immersive WebGL and Three.js experiences",
    },
    {
      icon: <Palette className="h-8 w-8" />,
      title: "Data Science & AI",
      description: "Predictive analytics and machine learning solutions",
    },
  ]

  const projects = [
    {
      title: "E-commerce Platform",
      description: "React-based shopping platform with 3D product views",
      tech: "React, Node.js, Three.js, AWS",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      title: "Cloud Migration",
      description: "Enterprise infrastructure modernization",
      tech: "AWS, Docker, Kubernetes, Terraform",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      title: "Interactive Dashboard",
      description: "Real-time data visualization with 3D charts",
      tech: "React, D3.js, WebGL, Node.js",
      image: "/placeholder.svg?height=200&width=300",
    },
  ]

  const testimonials = [
    {
      quote:
        "TechCraft transformed our vision into an incredible interactive experience. The 3D elements blew our clients away!",
      author: "Sarah Johnson",
      company: "InnovateCorp",
    },
    {
      quote: "Their cloud expertise saved us months of development time. Absolutely professional and innovative.",
      author: "Mike Chen",
      company: "TechStart",
    },
    {
      quote: "The attention to detail and creative solutions exceeded our expectations. Highly recommended!",
      author: "Lisa Rodriguez",
      company: "DesignHub",
    },
  ]

  if (!mounted) {
    return null
  }

  return (
    <>
      <ScrollProgress />
      
      {/* Interactive background particles */}
      <BackgroundParticles />
      
      {/* 3D Scene that changes based on scroll position */}
      {mounted && <SceneContainer currentSection={currentSection} />}
      
      <div className="pt-16 relative z-10">
        {/* Hero Section */}
        <AnimatedSection 
          sectionId="hero" 
          className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
        >
          <motion.div 
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 animate-bounce"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
          >
            <div className="flex flex-col items-center text-white/70">
              <MousePointer className="h-5 w-5 mb-2" />
              <ChevronDown className="h-5 w-5" />
              <p className="text-sm mt-1">Scroll to explore</p>
            </div>
          </motion.div>
          
          <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
            <motion.h1 
              style={{ y: heroTitleY }}
              className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
            >
              Next-Gen Digital Solutions
            </motion.h1>
            
            <motion.p 
              style={{ y: heroSubtitleY }}
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto"
            >
              For Modern Businesses Ready to Embrace the Future
            </motion.p>
            
            <motion.div 
              style={{ opacity: heroButtonsOpacity }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/contact">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto" 
                  icon={<ArrowRight className="h-5 w-5" />} 
                  iconPosition="right"
                >
                  Get Started
                </Button>
              </Link>
              <Link href="/portfolio">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto bg-transparent backdrop-blur-sm"
                >
                  View Our Work
                </Button>
              </Link>
            </motion.div>
          </div>
        </AnimatedSection>

        {/* About Intro */}
        <AnimatedSection 
          sectionId="about" 
          className="py-20 px-4"
        >
          <ParallaxElement className="max-w-4xl mx-auto text-center" speed={0.3}>
            <AnimatedTitle className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Innovation Meets Excellence
            </AnimatedTitle>
            <AnimatedSubtitle className="text-lg text-gray-300 leading-relaxed">
              At TechCraft Solutions, we specialize in transforming your vision into reality using cutting-edge web, app,
              and cloud technologies. Whether you need a custom website, an interactive web app, or a robust cloud
              platform, we deliver top-notch quality with a futuristic approach to digital innovation.
            </AnimatedSubtitle>
          </ParallaxElement>
        </AnimatedSection>

        {/* Services Overview */}
        <AnimatedSection 
          sectionId="services" 
          className="py-20 px-4 bg-gray-800/30 backdrop-blur-sm"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <AnimatedTitle className="text-3xl md:text-4xl font-bold mb-4 text-white">
                Our Expertise
              </AnimatedTitle>
              <AnimatedSubtitle className="text-lg text-gray-300">
                Comprehensive solutions for your digital transformation
              </AnimatedSubtitle>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <AnimatedItem key={index} index={index} className="h-full">
                  <Card className="text-center h-full transform transition-transform duration-500 hover:scale-105 hover:shadow-[0_0_15px_rgba(0,255,255,0.3)]">
                    <div className="text-cyan-400 mb-4 flex justify-center">{service.icon}</div>
                    <h3 className="text-xl font-semibold mb-3 text-white">{service.title}</h3>
                    <p className="text-gray-300">{service.description}</p>
                  </Card>
                </AnimatedItem>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Featured Projects */}
        <AnimatedSection 
          sectionId="projects" 
          className="py-20 px-4"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <AnimatedTitle className="text-3xl md:text-4xl font-bold mb-4 text-white">
                Featured Projects
              </AnimatedTitle>
              <AnimatedSubtitle className="text-lg text-gray-300">
                Showcasing our latest innovations
              </AnimatedSubtitle>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <AnimatedScaleIn key={index} delay={0.2 + index * 0.1}>
                  <Card className="h-full transform transition-all duration-500 hover:translate-y-[-10px]">
                    <div className="overflow-hidden rounded-lg mb-4">
                      <motion.img
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.5 }}
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-white">{project.title}</h3>
                    <p className="text-gray-300 mb-3">{project.description}</p>
                    <p className="text-sm text-cyan-400">{project.tech}</p>
                  </Card>
                </AnimatedScaleIn>
              ))}
            </div>

            <AnimatedFadeIn className="text-center mt-12">
              <Link href="/portfolio">
                <Button 
                  variant="outline" 
                  className="backdrop-blur-sm"
                  icon={<ArrowRight className="h-5 w-5" />} 
                  iconPosition="right"
                >
                  View All Projects
                </Button>
              </Link>
            </AnimatedFadeIn>
          </div>
        </AnimatedSection>

        {/* Testimonials */}
        <AnimatedSection 
          sectionId="testimonials" 
          className="py-20 px-4 bg-gray-800/30 backdrop-blur-sm"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <AnimatedTitle className="text-3xl md:text-4xl font-bold mb-4 text-white">
                Client Success Stories
              </AnimatedTitle>
              <AnimatedSubtitle className="text-lg text-gray-300">
                What our clients say about working with us
              </AnimatedSubtitle>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <AnimatedItem key={index} index={index}>
                  <Card className="h-full backdrop-blur-sm bg-opacity-50 transform transition-all duration-500 hover:shadow-[0_0_25px_rgba(79,70,229,0.3)]">
                    <div className="text-cyan-400 mb-4">
                      <Users className="h-8 w-8" />
                    </div>
                    <p className="text-gray-300 mb-4 italic">"{testimonial.quote}"</p>
                    <div>
                      <p className="text-white font-semibold">{testimonial.author}</p>
                      <p className="text-gray-400 text-sm">{testimonial.company}</p>
                    </div>
                  </Card>
                </AnimatedItem>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* CTA Section */}
        <AnimatedSection sectionId="cta" className="py-20 px-4">
  <div className="max-w-4xl mx-auto text-center">
    <AnimatedTitle className="text-3xl md:text-4xl font-bold mb-6 text-white">
      Ready to Transform Your Digital Presence?
    </AnimatedTitle>
    <AnimatedSubtitle className="text-lg text-gray-300 mb-8">
      Get your free consultation and discover how we can bring your vision to life
    </AnimatedSubtitle>

    {/* Flex container for buttons */}
    <div className="flex justify-center gap-4">
      <AnimatedFadeIn>
        <Link href="/contact">
          <Button 
            size="lg" 
            className="animate-pulse hover:animate-none"
            icon={<ArrowRight className="h-5 w-5" />} 
            iconPosition="right"
          >
            Start Your Project
          </Button>
        </Link>
      </AnimatedFadeIn>

      <AnimatedFadeIn>
        <Link href="/login">
          <Button 
            size="lg" 
            className="animate-pulse hover:animate-none"
            icon={<ArrowRight className="h-5 w-5" />} 
            iconPosition="right"
          >
            Custom Quote
          </Button>
        </Link>
      </AnimatedFadeIn>
    </div>
  </div>
</AnimatedSection>

      </div>
    </>
  )
}
