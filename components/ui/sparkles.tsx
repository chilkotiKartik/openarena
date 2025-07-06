"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export const SparklesCore = ({
  id,
  background,
  minSize,
  maxSize,
  speed,
  particleColor,
  className,
  particleDensity,
}: {
  id?: string
  background?: string
  minSize?: number
  maxSize?: number
  speed?: number
  particleColor?: string
  className?: string
  particleDensity?: number
}) => {
  const [particles, setParticles] = useState<
    Array<{
      x: number
      y: number
      size: number
      delay: number
    }>
  >([])

  useEffect(() => {
    const particleCount = particleDensity || 50
    const newParticles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * (maxSize || 4) + (minSize || 1),
      delay: Math.random() * 2,
    }))
    setParticles(newParticles)
  }, [maxSize, minSize, particleDensity])

  return (
    <div
      id={id}
      className={cn("h-full w-full flex items-center justify-center overflow-hidden", className)}
      style={{
        background: background || "transparent",
      }}
    >
      {particles.map((particle, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: particleColor || "#fff",
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: speed || 2,
            repeat: Number.POSITIVE_INFINITY,
            delay: particle.delay,
          }}
        />
      ))}
    </div>
  )
}
