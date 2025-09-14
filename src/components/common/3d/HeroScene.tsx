"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Float } from "@react-three/drei"
import FloatingGeometry from "./FloatingGeometry"

export default function HeroScene() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <Environment preset="night" />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00ffff" />

        <Float speed={1} rotationIntensity={1} floatIntensity={2}>
          <FloatingGeometry position={[-4, 2, 0]} geometry="box" color="#00ffff" speed={0.5} />
        </Float>

        <Float speed={1.5} rotationIntensity={1.5} floatIntensity={1}>
          <FloatingGeometry position={[4, -1, -2]} geometry="sphere" color="#8b5cf6" speed={0.8} />
        </Float>

        <Float speed={0.8} rotationIntensity={0.8} floatIntensity={1.5}>
          <FloatingGeometry position={[0, -3, -1]} geometry="torus" color="#06b6d4" speed={1.2} />
        </Float>

        <Float speed={1.2} rotationIntensity={1.2} floatIntensity={0.8}>
          <FloatingGeometry position={[-2, -1, 2]} geometry="box" color="#f59e0b" speed={0.6} />
        </Float>

        <Float speed={0.9} rotationIntensity={0.9} floatIntensity={2.2}>
          <FloatingGeometry position={[3, 3, 1]} geometry="sphere" color="#ef4444" speed={1.1} />
        </Float>

        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  )
}
