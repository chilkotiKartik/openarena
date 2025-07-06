"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { useTranslation } from "@/hooks/use-translation"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ProjectCard } from "@/components/project-card"
import { mockProjects } from "@/lib/mock-data"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const formSchema = z.object({
  skills: z.array(z.string()).min(1, {
    message: "Please select at least one skill.",
  }),
  timeCommitment: z.number().min(1).max(40),
  experience: z.enum(["beginner", "intermediate", "advanced"]),
  goal: z.enum(["learning", "contributing", "mentoring", "building"]),
  languages: z.array(z.string()).optional(),
})

export default function ProjectMatcher() {
  const { t } = useTranslation()
  const [matchedProjects, setMatchedProjects] = useState<any[]>([])
  const [isMatching, setIsMatching] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      skills: [],
      timeCommitment: 5,
      experience: "beginner",
      goal: "learning",
      languages: [],
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsMatching(true)

    // Simulate API call with timeout
    setTimeout(() => {
      // Filter projects based on form values
      const filtered = mockProjects.filter((project) => {
        // Match by experience level
        if (project.difficulty === "beginner" && values.experience !== "beginner") return false
        if (project.difficulty === "intermediate" && values.experience === "beginner") return false
        if (project.difficulty === "advanced" && values.experience === "beginner") return false

        // Match by time commitment
        if (project.timeCommitment > values.timeCommitment) return false

        // Match by skills (at least one skill should match)
        const hasMatchingSkill = project.tags.some((tag) => values.skills.includes(tag.toLowerCase()))

        return hasMatchingSkill
      })

      // Sort by match quality (simple algorithm)
      const sorted = filtered.sort((a, b) => {
        const aMatchCount = a.tags.filter((tag) => values.skills.includes(tag.toLowerCase())).length

        const bMatchCount = b.tags.filter((tag) => values.skills.includes(tag.toLowerCase())).length

        return bMatchCount - aMatchCount
      })

      setMatchedProjects(sorted)
      setIsMatching(false)
      setShowResults(true)
    }, 1500)
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

  const skills = [
    "javascript",
    "typescript",
    "react",
    "nextjs",
    "node",
    "python",
    "java",
    "go",
    "rust",
    "c++",
    "html",
    "css",
    "design",
    "documentation",
    "testing",
    "devops",
    "mobile",
    "ai",
    "data",
    "blockchain",
  ]

  const languages = [
    "english",
    "spanish",
    "hindi",
    "mandarin",
    "french",
    "german",
    "japanese",
    "portuguese",
    "russian",
    "arabic",
  ]

  return (
    <div className="container py-8">
      <motion.div
        className="max-w-3xl mx-auto text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold">{t("projectMatcher.title")}</h1>
        <p className="mt-4 text-xl text-muted-foreground">{t("projectMatcher.subtitle")}</p>
      </motion.div>

      {!showResults ? (
        <motion.div className="max-w-2xl mx-auto" variants={containerVariants} initial="hidden" animate="visible">
          <Card>
            <CardHeader>
              <CardTitle>{t("projectMatcher.form.title")}</CardTitle>
              <CardDescription>{t("projectMatcher.form.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="skills"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel>{t("projectMatcher.form.skills.label")}</FormLabel>
                            <FormDescription>{t("projectMatcher.form.skills.description")}</FormDescription>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {skills.map((skill) => (
                              <FormField
                                key={skill}
                                control={form.control}
                                name="skills"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={skill}
                                      className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(skill)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, skill])
                                              : field.onChange(field.value?.filter((value) => value !== skill))
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal cursor-pointer">
                                        {skill.charAt(0).toUpperCase() + skill.slice(1)}
                                      </FormLabel>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="timeCommitment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("projectMatcher.form.time.label")}</FormLabel>
                          <FormDescription>{t("projectMatcher.form.time.description")}</FormDescription>
                          <FormControl>
                            <div className="space-y-2">
                              <Slider
                                min={1}
                                max={40}
                                step={1}
                                defaultValue={[field.value]}
                                onValueChange={(vals) => field.onChange(vals[0])}
                              />
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>1 {t("projectMatcher.form.time.hours")}</span>
                                <span>
                                  {field.value} {t("projectMatcher.form.time.hours")}
                                </span>
                                <span>40 {t("projectMatcher.form.time.hours")}</span>
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="experience"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>{t("projectMatcher.form.experience.label")}</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="beginner" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  {t("projectMatcher.form.experience.beginner")}
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="intermediate" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  {t("projectMatcher.form.experience.intermediate")}
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="advanced" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  {t("projectMatcher.form.experience.advanced")}
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="goal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("projectMatcher.form.goal.label")}</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t("projectMatcher.form.goal.placeholder")} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="learning">{t("projectMatcher.form.goal.learning")}</SelectItem>
                              <SelectItem value="contributing">{t("projectMatcher.form.goal.contributing")}</SelectItem>
                              <SelectItem value="mentoring">{t("projectMatcher.form.goal.mentoring")}</SelectItem>
                              <SelectItem value="building">{t("projectMatcher.form.goal.building")}</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="languages"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel>{t("projectMatcher.form.languages.label")}</FormLabel>
                            <FormDescription>{t("projectMatcher.form.languages.description")}</FormDescription>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {languages.map((language) => (
                              <FormField
                                key={language}
                                control={form.control}
                                name="languages"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={language}
                                      className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(language)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, language])
                                              : field.onChange(field.value?.filter((value) => value !== language))
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal cursor-pointer">
                                        {language.charAt(0).toUpperCase() + language.slice(1)}
                                      </FormLabel>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants} className="flex justify-end">
                    <Button type="submit" disabled={isMatching}>
                      {isMatching ? (
                        <>
                          <span className="animate-pulse">{t("projectMatcher.form.matching")}</span>
                        </>
                      ) : (
                        <>
                          {t("projectMatcher.form.submit")} <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </motion.div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <div className="mb-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold">{t("projectMatcher.results.title")}</h2>
            <Button variant="outline" onClick={() => setShowResults(false)}>
              {t("projectMatcher.results.back")}
            </Button>
          </div>

          <Tabs defaultValue="all" className="mb-8">
            <TabsList>
              <TabsTrigger value="all">{t("projectMatcher.results.tabs.all")}</TabsTrigger>
              <TabsTrigger value="beginner">{t("projectMatcher.results.tabs.beginner")}</TabsTrigger>
              <TabsTrigger value="intermediate">{t("projectMatcher.results.tabs.intermediate")}</TabsTrigger>
              <TabsTrigger value="advanced">{t("projectMatcher.results.tabs.advanced")}</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matchedProjects.length > 0 ? (
                  matchedProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                    >
                      <ProjectCard project={project} />
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-12">
                    <h3 className="text-xl font-medium">{t("projectMatcher.results.noMatches")}</h3>
                    <p className="text-muted-foreground mt-2">{t("projectMatcher.results.tryAgain")}</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="beginner">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matchedProjects.filter((p) => p.difficulty === "beginner").length > 0 ? (
                  matchedProjects
                    .filter((p) => p.difficulty === "beginner")
                    .map((project, index) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                      >
                        <ProjectCard project={project} />
                      </motion.div>
                    ))
                ) : (
                  <div className="col-span-3 text-center py-12">
                    <h3 className="text-xl font-medium">{t("projectMatcher.results.noMatches")}</h3>
                    <p className="text-muted-foreground mt-2">{t("projectMatcher.results.tryAgain")}</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="intermediate">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matchedProjects.filter((p) => p.difficulty === "intermediate").length > 0 ? (
                  matchedProjects
                    .filter((p) => p.difficulty === "intermediate")
                    .map((project, index) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                      >
                        <ProjectCard project={project} />
                      </motion.div>
                    ))
                ) : (
                  <div className="col-span-3 text-center py-12">
                    <h3 className="text-xl font-medium">{t("projectMatcher.results.noMatches")}</h3>
                    <p className="text-muted-foreground mt-2">{t("projectMatcher.results.tryAgain")}</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="advanced">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matchedProjects.filter((p) => p.difficulty === "advanced").length > 0 ? (
                  matchedProjects
                    .filter((p) => p.difficulty === "advanced")
                    .map((project, index) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                      >
                        <ProjectCard project={project} />
                      </motion.div>
                    ))
                ) : (
                  <div className="col-span-3 text-center py-12">
                    <h3 className="text-xl font-medium">{t("projectMatcher.results.noMatches")}</h3>
                    <p className="text-muted-foreground mt-2">{t("projectMatcher.results.tryAgain")}</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      )}
    </div>
  )
}
