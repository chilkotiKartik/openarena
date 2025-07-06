"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ReactNode } from "react"
import { motion } from "framer-motion"

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-primary/10 text-primary">{icon}</div>
            <CardTitle>{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
