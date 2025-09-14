"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import type { Mesh } from "three"

interface FloatingGeometryProps {
  position: [number, number, number]
  geometry: "box" | "sphere" | "torus"
  color: string
  speed?: number
}

export default function FloatingGeometry({ position, geometry, color, speed = 1 }: FloatingGeometryProps) {
  const meshRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01 * speed
      meshRef.current.rotation.y += 0.01 * speed
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.5
    }
  })

  const renderGeometry = () => {
    switch (geometry) {
      case "box":
        return <boxGeometry args={[1, 1, 1]} />
      case "sphere":
        return <sphereGeometry args={[0.5, 32, 32]} />
      case "torus":
        return <torusGeometry args={[0.5, 0.2, 16, 100]} />
      default:
        return <boxGeometry args={[1, 1, 1]} />
    }
  }

  return (
    <mesh ref={meshRef} position={position}>
      {renderGeometry()}
      <meshStandardMaterial color={color} />
    </mesh>
  )
}
