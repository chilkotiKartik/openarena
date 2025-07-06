"use client"
import type React from "react"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

export const BackgroundBeams = ({ className }: { className?: string }) => {
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  })

  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect()
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        })
      }
    }

    const element = ref.current
    if (element) {
      element.addEventListener("mousemove", handleMouseMove)
    }

    return () => {
      if (element) {
        element.removeEventListener("mousemove", handleMouseMove)
      }
    }
  }, [])

  return (
    <div
      ref={ref}
      className={cn("h-full w-full overflow-hidden [--x:0px] [--y:0px]", className)}
      style={
        {
          "--x": `${mousePosition.x}px`,
          "--y": `${mousePosition.y}px`,
        } as React.CSSProperties
      }
    >
      <div className="relative h-full w-full">
        <div
          className="pointer-events-none absolute inset-0 z-0 h-full w-full bg-[radial-gradient(circle_at_var(--x)_var(--y),rgba(120,119,198,0.3)_0%,transparent_80%)]"
          style={{
            backgroundPosition: `${mousePosition.x}px ${mousePosition.y}px`,
          }}
        ></div>
      </div>
    </div>
  )
}
