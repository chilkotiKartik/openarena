"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"

interface TestimonialCardProps {
  name: string
  role: string
  content: string
  avatar: string
}

export function TestimonialCard({ name, role, content, avatar }: TestimonialCardProps) {
  return (
    <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
      <Card className="h-full">
        <CardContent className="pt-6 flex flex-col h-full">
          <div className="mb-4 flex items-center">
            <Avatar className="h-10 w-10 mr-4">
              <AvatarImage src={avatar || "/placeholder.svg"} alt={name} />
              <AvatarFallback>{name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{name}</p>
              <p className="text-sm text-muted-foreground">{role}</p>
            </div>
          </div>
          <div className="flex-1">
            <p className="italic text-muted-foreground">&ldquo;{content}&rdquo;</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
