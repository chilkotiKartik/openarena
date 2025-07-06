"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "@/hooks/use-translation"
import { motion } from "framer-motion"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockProjects, mockUsers } from "@/lib/mock-data"
import { BarChart } from "@/components/ui/chart"
import { useState } from "react"

export default function Dashboard() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("overview")

  const user = mockUsers[0]

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

  const activityData = [
    { name: "Mon", commits: 4, prs: 1, issues: 2 },
    { name: "Tue", commits: 3, prs: 0, issues: 1 },
    { name: "Wed", commits: 7, prs: 2, issues: 3 },
    { name: "Thu", commits: 5, prs: 1, issues: 0 },
    { name: "Fri", commits: 6, prs: 1, issues: 2 },
    { name: "Sat", commits: 2, prs: 0, issues: 1 },
    { name: "Sun", commits: 1, prs: 0, issues: 0 },
  ]

  const skillsData = [
    { name: "JavaScript", value: 85 },
    { name: "React", value: 70 },
    { name: "CSS", value: 60 },
    { name: "Node.js", value: 50 },
    { name: "Python", value: 40 },
  ]

  const badges = [
    {
      id: 1,
      name: "First Contribution",
      icon: "🌱",
      description: "Made your first open source contribution",
      earned: true,
    },
    { id: 2, name: "Code Reviewer", icon: "👀", description: "Reviewed 10 pull requests", earned: true },
    { id: 3, name: "Bug Hunter", icon: "🐛", description: "Found and fixed 5 bugs", earned: true },
    { id: 4, name: "Documentation Hero", icon: "📚", description: "Improved project documentation", earned: true },
    {
      id: 5,
      name: "Team Player",
      icon: "🤝",
      description: "Collaborated with 5 different contributors",
      earned: false,
    },
    { id: 6, name: "Feature Creator", icon: "✨", description: "Implemented a major feature", earned: false },
    { id: 7, name: "Mentor", icon: "👨‍🏫", description: "Helped 3 new contributors", earned: false },
    { id: 8, name: "Project Lead", icon: "👑", description: "Led a project to completion", earned: false },
  ]

  const leaderboard = [
    { id: 1, name: "Alex Johnson", avatar: "/placeholder.svg?height=40&width=40", xp: 1250, rank: 1 },
    { id: 2, name: "Priya Sharma", avatar: "/placeholder.svg?height=40&width=40", xp: 1120, rank: 2 },
    { id: 3, name: "Miguel Rodriguez", avatar: "/placeholder.svg?height=40&width=40", xp: 980, rank: 3 },
    { id: 4, name: "Sarah Kim", avatar: "/placeholder.svg?height=40&width=40", xp: 920, rank: 4 },
    { id: 5, name: "David Chen", avatar: "/placeholder.svg?height=40&width=40", xp: 850, rank: 5 },
  ]

  return (
    <div className="container py-8">
      <motion.div
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">{t("dashboard.title")}</h1>
          <p className="mt-2 text-xl text-muted-foreground">{t("dashboard.subtitle")}</p>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList>
            <TabsTrigger value="overview">{t("dashboard.tabs.overview")}</TabsTrigger>
            <TabsTrigger value="badges">{t("dashboard.tabs.badges")}</TabsTrigger>
            <TabsTrigger value="leaderboard">{t("dashboard.tabs.leaderboard")}</TabsTrigger>
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
                <CardTitle>{t("dashboard.overview.activity.title")}</CardTitle>
                <CardDescription>{t("dashboard.overview.activity.description")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <BarChart
                    data={activityData}
                    index="name"
                    categories={["commits", "prs", "issues"]}
                    colors={["#2563eb", "#16a34a", "#dc2626"]}
                    valueFormatter={(value) =>
                      `${value} ${value === 1 ? t("dashboard.overview.activity.singular") : t("dashboard.overview.activity.plural")}`
                    }
                    yAxisWidth={30}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>{t("dashboard.overview.profile.title")}</CardTitle>
                <CardDescription>{t("dashboard.overview.profile.description")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-bold">{user.name}</h3>
                  <p className="text-muted-foreground">{user.role}</p>

                  <div className="mt-6 w-full">
                    <div className="flex justify-between text-sm mb-1">
                      <span>{t("dashboard.overview.profile.level")}</span>
                      <span>12</span>
                    </div>
                    <Progress value={75} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1 text-right">750/1000 XP</p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-6 w-full">
                    <div className="flex flex-col items-center">
                      <div className="text-2xl font-bold">24</div>
                      <div className="text-xs text-muted-foreground">
                        {t("dashboard.overview.profile.contributions")}
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-2xl font-bold">5</div>
                      <div className="text-xs text-muted-foreground">{t("dashboard.overview.profile.projects")}</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-2xl font-bold">4</div>
                      <div className="text-xs text-muted-foreground">{t("dashboard.overview.profile.badges")}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href="/profile">{t("dashboard.overview.profile.viewProfile")}</Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>{t("dashboard.overview.skills.title")}</CardTitle>
                <CardDescription>{t("dashboard.overview.skills.description")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {skillsData.map((skill) => (
                    <div key={skill.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{skill.name}</span>
                        <span>{skill.value}%</span>
                      </div>
                      <Progress value={skill.value} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/learning-tracks">{t("dashboard.overview.skills.improve")}</Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} className="md:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>{t("dashboard.overview.projects.title")}</CardTitle>
                <CardDescription>{t("dashboard.overview.projects.description")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockProjects.slice(0, 3).map((project) => (
                    <div key={project.id} className="flex items-start gap-4 p-3 rounded-lg border">
                      <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                        <span className="text-xl">{project.emoji}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{project.name}</h3>
                          <Badge
                            variant={
                              project.difficulty === "beginner"
                                ? "secondary"
                                : project.difficulty === "intermediate"
                                  ? "default"
                                  : "destructive"
                            }
                          >
                            {t(`dashboard.overview.projects.difficulty.${project.difficulty}`)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{project.description}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {project.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                          {project.tags.length > 3 && <Badge variant="outline">+{project.tags.length - 3}</Badge>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/project-matcher">{t("dashboard.overview.projects.findMore")}</Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </motion.div>
      )}

      {activeTab === "badges" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <Card>
            <CardHeader>
              <CardTitle>{t("dashboard.badges.title")}</CardTitle>
              <CardDescription>{t("dashboard.badges.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {badges.map((badge) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className={`flex flex-col items-center text-center p-4 rounded-lg border ${
                      badge.earned ? "bg-primary/5" : "bg-muted/50 opacity-60"
                    }`}
                  >
                    <div className="text-4xl mb-2">{badge.icon}</div>
                    <h3 className="font-medium">{badge.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{badge.description}</p>
                    {badge.earned ? (
                      <Badge className="mt-3" variant="secondary">
                        {t("dashboard.badges.earned")}
                      </Badge>
                    ) : (
                      <Badge className="mt-3" variant="outline">
                        {t("dashboard.badges.locked")}
                      </Badge>
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                {badges.filter((b) => b.earned).length} / {badges.length} {t("dashboard.badges.completed")}
              </div>
              <Button variant="outline" asChild>
                <Link href="/learning-tracks">{t("dashboard.badges.earnMore")}</Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}

      {activeTab === "leaderboard" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <Card>
            <CardHeader>
              <CardTitle>{t("dashboard.leaderboard.title")}</CardTitle>
              <CardDescription>{t("dashboard.leaderboard.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboard.map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    className={`flex items-center gap-4 p-4 rounded-lg border ${
                      index === 0
                        ? "bg-yellow-500/10"
                        : index === 1
                          ? "bg-gray-300/10"
                          : index === 2
                            ? "bg-amber-600/10"
                            : ""
                    }`}
                  >
                    <div className="font-bold text-xl w-8 text-center">#{user.rank}</div>
                    <Avatar>
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.xp} XP</div>
                    </div>
                    {index < 3 && <div className="text-2xl">{index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}</div>}
                  </motion.div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link href="/matchmaking">{t("dashboard.leaderboard.findTeammates")}</Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
