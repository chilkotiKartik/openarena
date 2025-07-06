"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CalendarIcon, HeartIcon, EyeIcon } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

interface ProjectCardProps {
  id: string
  title: string
  description: string
  image: string
  tags: string[]
  progress: number
  status: string
  deadline: string
  likes: number
  views: number
}

export function ProjectCard({
  id,
  title,
  description,
  image,
  tags,
  progress,
  status,
  deadline,
  likes,
  views,
}: ProjectCardProps) {
  return (
    <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
      <Link href={`/project/${id}`}>
        <Card className="h-full overflow-hidden">
          <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} />
          <CardHeader className="pb-2">
            <CardTitle>{title}</CardTitle>
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-muted-foreground line-clamp-2">{description}</p>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>{status}</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between text-sm text-muted-foreground pt-2">
            <div className="flex items-center">
              <CalendarIcon className="mr-1 h-4 w-4" />
              <span>Due {new Date(deadline).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                <HeartIcon className="mr-1 h-4 w-4" />
                <span>{likes}</span>
              </div>
              <div className="flex items-center">
                <EyeIcon className="mr-1 h-4 w-4" />
                <span>{views}</span>
              </div>
            </div>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  )
}
