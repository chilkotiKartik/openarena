"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "@/hooks/use-translation"
import { motion, useMotionValue, useTransform } from "framer-motion"
import { ArrowRight, Check, Code, Heart, Star, X, Clock } from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { mockProjects, mockUsers } from "@/lib/mock-data"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

export default function Matchmaking() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<"projects" | "users">("projects")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState<"left" | "right" | null>(null)
  const [matches, setMatches] = useState<any[]>([])

  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-30, 30])
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0])

  const items = activeTab === "projects" ? mockProjects : mockUsers
  const currentItem = items[currentIndex % items.length]

  const handleSwipe = (direction: "left" | "right") => {
    setDirection(direction)

    if (direction === "right") {
      // Add to matches
      setMatches((prev) => [...prev, currentItem])

      toast({
        title: t("matchmaking.toast.match.title"),
        description:
          activeTab === "projects"
            ? t("matchmaking.toast.match.projectDescription", { name: currentItem.name })
            : t("matchmaking.toast.match.userDescription", { name: currentItem.name }),
      })
    }

    // Reset after animation completes
    setTimeout(() => {
      setDirection(null)
      setCurrentIndex((prev) => prev + 1)
      x.set(0)
    }, 300)
  }

  const handleDragEnd = (_, info) => {
    if (info.offset.x > 100) {
      handleSwipe("right")
    } else if (info.offset.x < -100) {
      handleSwipe("left")
    }
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
        className="max-w-3xl mx-auto text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold">{t("matchmaking.title")}</h1>
        <p className="mt-4 text-xl text-muted-foreground">{t("matchmaking.subtitle")}</p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="md:col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <Tabs defaultValue="projects" onValueChange={(value) => setActiveTab(value as "projects" | "users")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="projects">{t("matchmaking.tabs.projects")}</TabsTrigger>
                  <TabsTrigger value="users">{t("matchmaking.tabs.users")}</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-center">
              <div className="relative w-full max-w-md aspect-[3/4] mx-auto">
                <motion.div
                  className="absolute inset-0"
                  style={{
                    x,
                    rotate,
                    opacity,
                  }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={handleDragEnd}
                  animate={
                    direction === "left"
                      ? { x: -300, opacity: 0, rotate: -30 }
                      : direction === "right"
                        ? { x: 300, opacity: 0, rotate: 30 }
                        : {}
                  }
                >
                  <Card className="h-full overflow-hidden border-2 cursor-grab active:cursor-grabbing">
                    <div className="relative h-1/2 bg-gradient-to-b from-primary/20 to-background">
                      {activeTab === "projects" ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-6xl">{currentItem.emoji}</div>
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Avatar className="h-32 w-32">
                            <AvatarImage src={currentItem.avatar || "/placeholder.svg"} alt={currentItem.name} />
                            <AvatarFallback>{currentItem.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold">{currentItem.name}</h3>
                          {activeTab === "projects" ? (
                            <p className="text-muted-foreground">{currentItem.mentor}</p>
                          ) : (
                            <p className="text-muted-foreground">{currentItem.role}</p>
                          )}
                        </div>
                        <Badge
                          variant={
                            activeTab === "projects"
                              ? currentItem.difficulty === "beginner"
                                ? "secondary"
                                : currentItem.difficulty === "intermediate"
                                  ? "default"
                                  : "destructive"
                              : "outline"
                          }
                        >
                          {activeTab === "projects"
                            ? t(`matchmaking.difficulty.${currentItem.difficulty}`)
                            : currentItem.level}
                        </Badge>
                      </div>

                      <p className="mb-4">{currentItem.description}</p>

                      <div className="space-y-4">
                        {activeTab === "projects" ? (
                          <>
                            <div>
                              <div className="text-sm font-medium mb-1">{t("matchmaking.card.project.tags")}</div>
                              <div className="flex flex-wrap gap-2">
                                {currentItem.tags.map((tag: string) => (
                                  <Badge key={tag} variant="outline">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-medium mb-1">{t("matchmaking.card.project.time")}</div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>
                                  {currentItem.timeCommitment} {t("matchmaking.card.project.hours")}
                                </span>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              <div className="text-sm font-medium mb-1">{t("matchmaking.card.user.skills")}</div>
                              <div className="flex flex-wrap gap-2">
                                {currentItem.skills.map((skill: string) => (
                                  <Badge key={skill} variant="outline">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-medium mb-1">{t("matchmaking.card.user.interests")}</div>
                              <div className="flex flex-wrap gap-2">
                                {currentItem.interests.map((interest: string) => (
                                  <Badge key={interest} variant="secondary">
                                    {interest}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center gap-4">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full h-16 w-16 p-0"
                onClick={() => handleSwipe("left")}
              >
                <X className="h-8 w-8" />
                <span className="sr-only">{t("matchmaking.actions.skip")}</span>
              </Button>
              <Button
                size="lg"
                className="rounded-full h-16 w-16 p-0 bg-green-500 hover:bg-green-600"
                onClick={() => handleSwipe("right")}
              >
                <Heart className="h-8 w-8" />
                <span className="sr-only">{t("matchmaking.actions.like")}</span>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>{t("matchmaking.matches.title")}</CardTitle>
              <CardDescription>{t("matchmaking.matches.description")}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              {matches.length > 0 ? (
                <div className="space-y-4">
                  {matches.map((match) => (
                    <div key={match.id} className="flex items-center gap-3 p-3 rounded-lg border">
                      <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                        {match.emoji ? (
                          <span className="text-xl">{match.emoji}</span>
                        ) : (
                          <Avatar>
                            <AvatarImage src={match.avatar || "/placeholder.svg"} alt={match.name} />
                            <AvatarFallback>{match.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{match.name}</div>
                        <div className="text-sm text-muted-foreground truncate">{match.mentor || match.role}</div>
                      </div>
                      <Button size="sm" variant="ghost" asChild>
                        <Link href={match.mentor ? `/project/${match.id}` : `/profile/${match.id}`}>
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-4">
                  <div className="text-4xl mb-4">❤️</div>
                  <h3 className="text-lg font-medium">{t("matchmaking.matches.empty.title")}</h3>
                  <p className="text-muted-foreground mt-1">{t("matchmaking.matches.empty.description")}</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <div className="w-full">
                <div className="flex justify-between text-sm mb-1">
                  <span>{t("matchmaking.progress.title")}</span>
                  <span>
                    {Math.min(currentIndex, items.length)} / {items.length}
                  </span>
                </div>
                <Progress value={(currentIndex / items.length) * 100} />
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div
        className="mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>{t("matchmaking.tips.title")}</CardTitle>
            <CardDescription>{t("matchmaking.tips.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Check className="h-4 w-4" />
                  </div>
                  <h3 className="font-medium">{t("matchmaking.tips.tip1.title")}</h3>
                </div>
                <p className="text-muted-foreground text-sm">{t("matchmaking.tips.tip1.description")}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Star className="h-4 w-4" />
                  </div>
                  <h3 className="font-medium">{t("matchmaking.tips.tip2.title")}</h3>
                </div>
                <p className="text-muted-foreground text-sm">{t("matchmaking.tips.tip2.description")}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Code className="h-4 w-4" />
                  </div>
                  <h3 className="font-medium">{t("matchmaking.tips.tip3.title")}</h3>
                </div>
                <p className="text-muted-foreground text-sm">{t("matchmaking.tips.tip3.description")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
