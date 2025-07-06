"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "@/hooks/use-translation"
import { motion } from "framer-motion"
import { ArrowRight, Download, Edit, Github, Globe, Mail, MapPin, Upload, Clock, Check } from "lucide-react"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockProjects, mockUsers } from "@/lib/mock-data"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

export default function Profile() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [isEditing, setIsEditing] = useState(false)
  const [resumeUploaded, setResumeUploaded] = useState(false)

  const user = mockUsers[0]

  const [formData, setFormData] = useState({
    name: user.name,
    role: user.role,
    bio: "Open source enthusiast and full-stack developer passionate about building collaborative tools and learning new technologies.",
    location: "San Francisco, CA",
    email: "alex.johnson@example.com",
    github: "github.com/alexjohnson",
    website: "alexjohnson.dev",
    skills: user.skills,
    interests: user.interests,
    availability: "20",
    timezone: "PST",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSaveProfile = () => {
    setIsEditing(false)

    toast({
      title: t("profile.toast.saved.title"),
      description: t("profile.toast.saved.description"),
    })
  }

  const handleResumeUpload = (e) => {
    const file = e.target.files?.[0]

    if (file) {
      // Simulate resume parsing
      setTimeout(() => {
        setResumeUploaded(true)

        // Update skills based on "parsed" resume
        setFormData({
          ...formData,
          skills: [...formData.skills, "TypeScript", "GraphQL"],
        })

        toast({
          title: t("profile.toast.resume.title"),
          description: t("profile.toast.resume.description"),
        })
      }, 1500)
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
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">{t("profile.title")}</h1>
          <p className="mt-2 text-xl text-muted-foreground">{t("profile.subtitle")}</p>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList>
            <TabsTrigger value="overview">{t("profile.tabs.overview")}</TabsTrigger>
            <TabsTrigger value="projects">{t("profile.tabs.projects")}</TabsTrigger>
            <TabsTrigger value="resume">{t("profile.tabs.resume")}</TabsTrigger>
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
          <motion.div variants={itemVariants}>
            <Card className="h-full">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{t("profile.overview.info.title")}</CardTitle>
                  {!isEditing && (
                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      {t("profile.overview.info.edit")}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {!isEditing ? (
                  <div className="space-y-6">
                    <div className="flex flex-col items-center text-center">
                      <Avatar className="h-24 w-24 mb-4">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={formData.name} />
                        <AvatarFallback>{formData.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <h3 className="text-xl font-bold">{formData.name}</h3>
                      <p className="text-muted-foreground">{formData.role}</p>

                      <div className="flex items-center gap-1 mt-2">
                        <Badge variant="secondary">Level 12</Badge>
                        <Badge variant="outline">750 XP</Badge>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p>{formData.bio}</p>

                      <div className="grid grid-cols-1 gap-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{formData.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{formData.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Github className="h-4 w-4 text-muted-foreground" />
                          <a
                            href={`https://${formData.github}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {formData.github}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <a
                            href={`https://${formData.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {formData.website}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex flex-col items-center text-center">
                      <Avatar className="h-24 w-24 mb-4">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={formData.name} />
                        <AvatarFallback>{formData.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <Button variant="outline" size="sm">
                        {t("profile.overview.info.changePhoto")}
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">{t("profile.overview.info.form.name")}</Label>
                        <Input id="name" name="name" value={formData.name} onChange={handleInputChange} />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="role">{t("profile.overview.info.form.role")}</Label>
                        <Input id="role" name="role" value={formData.role} onChange={handleInputChange} />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="bio">{t("profile.overview.info.form.bio")}</Label>
                        <Textarea id="bio" name="bio" value={formData.bio} onChange={handleInputChange} rows={4} />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="location">{t("profile.overview.info.form.location")}</Label>
                        <Input id="location" name="location" value={formData.location} onChange={handleInputChange} />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="email">{t("profile.overview.info.form.email")}</Label>
                        <Input id="email" name="email" value={formData.email} onChange={handleInputChange} />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="github">{t("profile.overview.info.form.github")}</Label>
                        <Input id="github" name="github" value={formData.github} onChange={handleInputChange} />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="website">{t("profile.overview.info.form.website")}</Label>
                        <Input id="website" name="website" value={formData.website} onChange={handleInputChange} />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              {isEditing && (
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    {t("profile.overview.info.form.cancel")}
                  </Button>
                  <Button onClick={handleSaveProfile}>{t("profile.overview.info.form.save")}</Button>
                </CardFooter>
              )}
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} className="md:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>{t("profile.overview.skills.title")}</CardTitle>
                <CardDescription>{t("profile.overview.skills.description")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-3">{t("profile.overview.skills.technical")}</h3>
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-3">{t("profile.overview.skills.interests")}</h3>
                    <div className="flex flex-wrap gap-2">
                      {formData.interests.map((interest) => (
                        <Badge key={interest} variant="outline">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium mb-3">{t("profile.overview.skills.availability")}</h3>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {formData.availability} {t("profile.overview.skills.hoursPerWeek")}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-3">{t("profile.overview.skills.timezone")}</h3>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span>{formData.timezone}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium mb-3">{t("profile.overview.skills.progress")}</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{t("profile.overview.skills.level")}</span>
                          <span>12</span>
                        </div>
                        <Progress value={75} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1 text-right">750/1000 XP</p>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="flex flex-col items-center">
                          <div className="text-2xl font-bold">24</div>
                          <div className="text-xs text-muted-foreground">
                            {t("profile.overview.skills.contributions")}
                          </div>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="text-2xl font-bold">5</div>
                          <div className="text-xs text-muted-foreground">{t("profile.overview.skills.projects")}</div>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="text-2xl font-bold">4</div>
                          <div className="text-xs text-muted-foreground">{t("profile.overview.skills.badges")}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild>
                  <Link href="/learning-tracks">{t("profile.overview.skills.improve")}</Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </motion.div>
      )}

      {activeTab === "projects" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <Card>
            <CardHeader>
              <CardTitle>{t("profile.projects.title")}</CardTitle>
              <CardDescription>{t("profile.projects.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3">{t("profile.projects.active")}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mockProjects.slice(0, 2).map((project) => (
                      <div key={project.id} className="flex items-start gap-4 p-4 rounded-lg border">
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
                              {t(`profile.projects.difficulty.${project.difficulty}`)}
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
                          <div className="mt-3">
                            <Button size="sm" asChild>
                              <Link href={`/project/${project.id}`}>{t("profile.projects.view")}</Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-3">{t("profile.projects.completed")}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mockProjects.slice(2, 4).map((project) => (
                      <div key={project.id} className="flex items-start gap-4 p-4 rounded-lg border">
                        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                          <span className="text-xl">{project.emoji}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between">
                            <h3 className="font-medium">{project.name}</h3>
                            <Badge variant="outline">{t("profile.projects.completed")}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{project.description}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {project.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="outline">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="mt-3">
                            <Button size="sm" variant="outline" asChild>
                              <Link href={`/project/${project.id}`}>{t("profile.projects.view")}</Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-3">{t("profile.projects.recommended")}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {mockProjects.slice(4, 7).map((project) => (
                      <div key={project.id} className="flex flex-col p-4 rounded-lg border">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">{project.emoji}</span>
                          <h3 className="font-medium">{project.name}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{project.description}</p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {project.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="mt-auto">
                          <Button size="sm" variant="outline" className="w-full" asChild>
                            <Link href={`/project/${project.id}`}>{t("profile.projects.explore")}</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href="/project-matcher">
                  {t("profile.projects.findMore")} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}

      {activeTab === "resume" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <Card>
            <CardHeader>
              <CardTitle>{t("profile.resume.title")}</CardTitle>
              <CardDescription>{t("profile.resume.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  {!resumeUploaded ? (
                    <div className="space-y-4">
                      <div className="flex justify-center">
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <Upload className="h-8 w-8" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">{t("profile.resume.upload.title")}</h3>
                        <p className="text-muted-foreground mt-1">{t("profile.resume.upload.description")}</p>
                      </div>
                      <div>
                        <Label htmlFor="resume-upload" className="cursor-pointer">
                          <div className="flex items-center justify-center">
                            <Button>
                              <Upload className="mr-2 h-4 w-4" />
                              {t("profile.resume.upload.button")}
                            </Button>
                          </div>
                          <Input
                            id="resume-upload"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            className="hidden"
                            onChange={handleResumeUpload}
                          />
                        </Label>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-center">
                        <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                          <Check className="h-8 w-8" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">{t("profile.resume.uploaded.title")}</h3>
                        <p className="text-muted-foreground mt-1">{t("profile.resume.uploaded.description")}</p>
                      </div>
                      <div className="flex justify-center gap-4">
                        <Button variant="outline">
                          <Download className="mr-2 h-4 w-4" />
                          {t("profile.resume.uploaded.download")}
                        </Button>
                        <Button variant="outline">
                          <Edit className="mr-2 h-4 w-4" />
                          {t("profile.resume.uploaded.replace")}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {resumeUploaded && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">{t("profile.resume.parsed.title")}</h3>
                      <p className="text-muted-foreground">{t("profile.resume.parsed.description")}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-2">{t("profile.resume.parsed.skills")}</h4>
                        <div className="flex flex-wrap gap-2">
                          {formData.skills.map((skill) => (
                            <Badge key={skill} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">{t("profile.resume.parsed.experience")}</h4>
                        <div className="space-y-3">
                          <div className="p-3 rounded-lg border">
                            <div className="font-medium">Senior Developer</div>
                            <div className="text-sm text-muted-foreground">TechCorp Inc. • 2020-Present</div>
                          </div>
                          <div className="p-3 rounded-lg border">
                            <div className="font-medium">Full Stack Developer</div>
                            <div className="text-sm text-muted-foreground">WebSolutions • 2018-2020</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">{t("profile.resume.parsed.projects")}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {mockProjects.slice(0, 3).map((project) => (
                          <div key={project.id} className="p-3 rounded-lg border">
                            <div className="font-medium">{project.name}</div>
                            <div className="text-sm text-muted-foreground line-clamp-2 mt-1">{project.description}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                {resumeUploaded ? t("profile.resume.footer.updated") : t("profile.resume.footer.noResume")}
              </div>
              <Button asChild>
                <Link href="/project-matcher">{t("profile.resume.footer.findProjects")}</Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
