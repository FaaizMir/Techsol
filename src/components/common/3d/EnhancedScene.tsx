"use client"

import { useRef, useState, useEffect } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { 
  MeshDistortMaterial, 
  MeshWobbleMaterial, 
  Float, 
  useTexture, 
  Sphere, 
  Box, 
  Torus, 
  Text3D, 
  Sparkles,
  RoundedBox,
  MeshReflectorMaterial
} from "@react-three/drei"
import { Color, Vector3, MathUtils, Mesh, Object3D } from "three"
import { useSpring, animated, config } from "@react-spring/three"
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'
import { SpringValue } from "@react-spring/three"
import { type Section } from '../../../hooks/scroll-section-context'

// Define props interface for components
interface GeometryProps {
  position: [number, number, number]
  color: string
  hover?: boolean
  section: Section
  currentSection: Section
  [key: string]: any
}

interface TextProps {
  text: string
  position: [number, number, number]
  section: Section
  currentSection: Section
  [key: string]: any
}

interface ParticleFieldProps {
  density?: number
  section: Section
  currentSection: Section
}

interface EnhancedSceneProps {
  currentSection: Section
}

// Create an animated mesh using react-spring
const AnimatedMesh = animated.mesh

function FancyBox({ position, color, hover, section, currentSection, ...props }: GeometryProps) {
  const ref = useRef<Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const [active, setActive] = useState(false)
  const isCurrentSection = currentSection === section

  // Spring animation for scale
  const { scale } = useSpring({
    scale: active ? 1.5 : 1,
    config: config.wobbly
  })

  // Spring animation for position and rotation based on scroll
  const { positionZ, rotationY } = useSpring({
    positionZ: isCurrentSection ? 0 : 20,
    rotationY: isCurrentSection ? 0 : Math.PI * 2,
    config: config.molasses
  })

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x += 0.01
      ref.current.rotation.y += 0.01
    }
  })

  return (
    <AnimatedMesh
      ref={ref}
      position-x={position[0]}
      position-y={position[1]}
      position-z={positionZ}
      rotation-y={rotationY}
      scale={scale}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      {...props}
    >
      <boxGeometry args={[1, 1, 1]} />
      <MeshDistortMaterial 
        color={hovered ? "#ff00ff" : color} 
        speed={hover ? 5 : 2} 
        distort={hover ? 0.6 : 0.2} 
        radius={hover ? 1.5 : 1}
      />
    </AnimatedMesh>
  )
}

function FancySphere({ position, color, hover, section, currentSection, ...props }: GeometryProps) {
  const ref = useRef<Mesh>(null)
  const [hovered, setHovered] = useState(false)

  const isCurrentSection = currentSection === section

  // Spring animation for position and rotation based on scroll
  const { positionZ, rotationY } = useSpring({
    positionZ: isCurrentSection ? 0 : -20,
    rotationY: isCurrentSection ? 0 : Math.PI * 2,
    config: config.molasses
  })

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.01
    }
  })

  return (
    <AnimatedMesh
      ref={ref}
      position-x={position[0]}
      position-y={position[1]}
      position-z={positionZ}
      rotation-y={rotationY}
      {...props}
    >
      <sphereGeometry args={[0.7, 64, 64]} />
      <MeshWobbleMaterial 
        color={hovered ? "#00ffff" : color} 
        factor={hover ? 1 : 0.4} 
        speed={hover ? 2 : 1}
        metalness={0.8}
        roughness={0.2}
      />
    </AnimatedMesh>
  )
}

// Add event handlers to the mesh instead of the material
const meshEvents = {
  onPointerOver: (e: any) => {
    e.stopPropagation();
    if (e.object) {
      const material = e.object.material;
      if (material) {
        material.color.set("#00ffff");
      }
    }
  },
  onPointerOut: (e: any) => {
    e.stopPropagation();
    if (e.object) {
      const material = e.object.material;
      if (material) {
        material.color.set("#ff0080");
      }
    }
  }
};

// Floating text that appears when the section is active
function FloatingText({ text, position, section, currentSection, ...props }: TextProps) {
  const isCurrentSection = currentSection === section
  
  // Spring animation for text appearance
  const { opacity, positionY } = useSpring({
    opacity: isCurrentSection ? 1 : 0,
    positionY: isCurrentSection ? position[1] : position[1] - 5,
    config: config.molasses
  })

  return (
    <animated.group position-x={position[0]} position-y={positionY} position-z={position[2]} {...props}>
      <animated.mesh visible={opacity.to(o => o > 0.1)}>
        <Text3D
          font="/fonts/inter_bold.json"
          size={0.8}
          height={0.1}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
        >
          {text}
          <MeshDistortMaterial 
            color="#ffffff" 
            speed={2} 
            distort={0.2} 
            radius={1}
            emissive={new Color("#5000ff")}
            emissiveIntensity={0.5}
          />
        </Text3D>
      </animated.mesh>
    </animated.group>
  )
}

// Particle system that reacts to scroll
function ParticleField({ density = 50, section, currentSection }: ParticleFieldProps) {
  const isCurrentSection = currentSection === section
  
  // Spring animation for particles
  const { size } = useSpring({
    size: isCurrentSection ? 0.5 : 0.1,
    config: config.molasses
  })

  // Convert the spring value to a regular number for Sparkles
  const particleSize = size.to(value => value)

  return (
    <animated.group>
      <Sparkles 
        count={density} 
        scale={12} 
        size={particleSize.get()} 
        speed={0.3} 
        color={isCurrentSection ? "#00ffff" : "#ffffff"} 
      />
    </animated.group>
  )
}

export default function EnhancedScene({ currentSection }: EnhancedSceneProps) {
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  // Don't render on server
  if (!isMounted) return null

  return (
    <>
      {/* Hero Section Objects */}
      <FancyBox position={[-4, 2, 2]} color="#7928ca" hover={true} section="hero" currentSection={currentSection} />
      <FancySphere position={[4, -1, -2]} color="#0070f3" hover={true} section="hero" currentSection={currentSection} />
      <FancyBox position={[-2, -2, 1]} color="#ff4d4d" hover={true} section="hero" currentSection={currentSection} />
      <FancySphere position={[3, 3, -1]} color="#50e3c2" hover={true} section="hero" currentSection={currentSection} />
      <Float speed={3} floatIntensity={4} rotationIntensity={2}>
        <RoundedBox 
          args={[3, 3, 0.2]} 
          radius={0.5} 
          position={[0, 0, -5]}
          visible={currentSection === "hero"}
        >
          <MeshReflectorMaterial 
            color="#000000"
            metalness={0.9}
            roughness={0.1}
            mirror={0.9}
          />
        </RoundedBox>
      </Float>
      <ParticleField density={100} section="hero" currentSection={currentSection} />
      <FloatingText text="TECH SOLUTIONS" position={[0, 3, 0]} section="hero" currentSection={currentSection} />

      {/* About Section Objects */}
      <FancyBox position={[-3, 1, 0]} color="#ff0080" hover={false} section="about" currentSection={currentSection} />
      <FancySphere position={[2, -2, -1]} color="#00b3ff" hover={false} section="about" currentSection={currentSection} />
      <ParticleField density={50} section="about" currentSection={currentSection} />
      <FloatingText text="INNOVATION" position={[-4, 0, 2]} section="about" currentSection={currentSection} />

      {/* Services Section Objects */}
      <FancyBox position={[-2, 3, 1]} color="#f5a623" hover={false} section="services" currentSection={currentSection} />
      <FancySphere position={[4, 0, -2]} color="#7ed321" hover={false} section="services" currentSection={currentSection} />
      <FancyBox position={[0, -3, 0]} color="#bd10e0" hover={false} section="services" currentSection={currentSection} />
      <ParticleField density={70} section="services" currentSection={currentSection} />
      <FloatingText text="EXPERTISE" position={[3, 2, 0]} section="services" currentSection={currentSection} />

      {/* Projects Section Objects */}
      <FancyBox position={[3, 1, 2]} color="#9013fe" hover={false} section="projects" currentSection={currentSection} />
      <FancySphere position={[-3, -1, -1]} color="#ff6b6b" hover={false} section="projects" currentSection={currentSection} />
      <ParticleField density={60} section="projects" currentSection={currentSection} />
      <FloatingText text="PORTFOLIO" position={[-2, -1, 3]} section="projects" currentSection={currentSection} />

      {/* Testimonials Section Objects */}
      <FancyBox position={[2, 2, 0]} color="#0070f3" hover={false} section="testimonials" currentSection={currentSection} />
      <FancySphere position={[-2, 0, -2]} color="#ff0080" hover={false} section="testimonials" currentSection={currentSection} />
      <ParticleField density={40} section="testimonials" currentSection={currentSection} />
      <FloatingText text="CLIENTS" position={[0, 2, 1]} section="testimonials" currentSection={currentSection} />

      {/* CTA Section Objects */}
      <FancyBox position={[-1, 1, 1]} color="#00b3ff" hover={false} section="cta" currentSection={currentSection} />
      <FancySphere position={[1, -1, -1]} color="#7928ca" hover={false} section="cta" currentSection={currentSection} />
      <ParticleField density={80} section="cta" currentSection={currentSection} />
      <FloatingText text="GET STARTED" position={[0, 0, 2]} section="cta" currentSection={currentSection} />

      {/* Post-processing effects */}
      <EffectComposer>
        <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} />
        <ChromaticAberration offset={[0.0005, 0.0005]} />
      </EffectComposer>
    </>
  )
}
