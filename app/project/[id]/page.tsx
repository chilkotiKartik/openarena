"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "@/hooks/use-translation"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockProjects } from "@/lib/mock-data"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

export default function ProjectDetails({ params }) {
  const { t } = useTranslation()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [isInterested, setIsInterested] = useState(false)
  const [message, setMessage] = useState("")

  // Find project by ID
  const project = mockProjects.find((p) => p.id.toString() === params.id) || mockProjects[0]

  const handleInterestToggle = () => {
    setIsInterested(!isInterested)

    if (!isInterested) {
      toast({
        title: t("project.toast.interested.title"),
        description: t("project.toast.interested.description", { name: project.name }),
      })
    }
  }

  const handleSendMessage = () => {
    if (!message.trim()) return

    toast({
      title: t("project.toast.message.title"),
      description: t("project.toast.message.description", { name: project.mentor }),
    })

    setMessage("")
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  }

  return (
    <div className="container py-8">
      <motion.div
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/project-matcher">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">{t("project.back")}</span>
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{project.emoji}</span>
              <h1 className="text-3xl md:text-4xl font-bold">{project.name}</h1>
              <Badge
                variant={
                  project.difficulty === "beginner"
                    ? "secondary"
                    : project.difficulty === "intermediate"
                      ? "default"
                      : "destructive"
                }
              >
                {t(`project.difficulty.${project.difficulty}`)}
              </Badge>
            </div>
            <p className="mt-2 text-muted-foreground">
              {t("project.mentorBy")} <span className="font-medium">{project.mentor}</span>
            </p>
          </div>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList>
            <TabsTrigger value="overview">{t("project.tabs.overview")}</TabsTrigger>
            <TabsTrigger value="contributors">{t("project.tabs.contributors")}</TabsTrigger>
            <TabsTrigger value="discussions">{t("project.tabs.discussions")}</TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.div>

      {activeTab === "overview" && (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="md:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>{t("project.overview.about.title")}</CardTitle>
                <CardDescription>{t("project.overview.about.description")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-3">{t("project.overview.about.description")}</h3>
                    <p className="text-muted-foreground">{project.description}</p>
                    <p className="text-muted-foreground mt-4">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia,
                      nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies
                      lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium mb-3">{t("project.overview.about.tags")}</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
