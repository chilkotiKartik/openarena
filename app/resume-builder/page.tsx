"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "@/hooks/use-translation"
import { motion } from "framer-motion"
import { Download, Plus, Save, Trash, FileText, Palette, ArrowRight } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import html2canvas from "html2canvas"
import { jsPDF } from "jspdf"
import { mockUsers } from "@/lib/mock-data"

export default function ResumeBuilder() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const resumeRef = useRef(null)
  const user = mockUsers[0]

  // Resume templates
  const templates = [
    { id: "minimal", name: "Minimal", color: "#2563eb" },
    { id: "creative", name: "Creative", color: "#16a34a" },
    { id: "developer", name: "Developer", color: "#9333ea" },
    { id: "hacker", name: "Hacker", color: "#000000" },
  ]

  // Resume data
  const [resumeData, setResumeData] = useState({
    template: "minimal",
    color: "#2563eb",
    personal: {
      name: user.name,
      title: user.role,
      email: "alex.johnson@example.com",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      website: "alexjohnson.dev",
      summary:
        "Open source enthusiast and full-stack developer passionate about building collaborative tools and learning new technologies.",
    },
    skills: user.skills,
    experience: [
      {
        id: 1,
        title: "Senior Developer",
        company: "TechCorp Inc.",
        location: "San Francisco, CA",
        startDate: "2020-01",
        endDate: "Present",
        description:
          "Led a team of 5 developers to build and maintain a collaborative platform for remote teams. Implemented real-time features using WebSockets and optimized database queries for better performance.",
      },
      {
        id: 2,
        title: "Full Stack Developer",
        company: "WebSolutions",
        location: "San Francisco, CA",
        startDate: "2018-03",
        endDate: "2019-12",
        description:
          "Developed and maintained multiple client websites using React, Node.js, and MongoDB. Collaborated with designers to implement responsive UI components and improved site performance by 40%.",
      },
    ],
    education: [
      {
        id: 1,
        degree: "Bachelor of Science in Computer Science",
        institution: "University of California",
        location: "Berkeley, CA",
        startDate: "2014-09",
        endDate: "2018-05",
        description: "Graduated with honors. Specialized in software engineering and artificial intelligence.",
      },
    ],
    projects: [
      {
        id: 1,
        title: "Collab-Sphere X",
        technologies: ["React", "Node.js", "MongoDB", "WebSockets"],
        description:
          "A collaborative platform for open-source enthusiasts with real-time features and gamification elements.",
        link: "https://github.com/alexjohnson/collab-sphere",
      },
      {
        id: 2,
        title: "Code Mentor",
        technologies: ["Vue.js", "Express", "PostgreSQL"],
        description:
          "A mentorship platform connecting beginner developers with experienced mentors for code reviews and guidance.",
        link: "https://github.com/alexjohnson/code-mentor",
      },
    ],
  })

  // Add new item to a section
  const addItem = (section) => {
    const newItem = {
      id: Date.now(),
    }

    if (section === "experience") {
      newItem.title = "Job Title"
      newItem.company = "Company Name"
      newItem.location = "Location"
      newItem.startDate = ""
      newItem.endDate = ""
      newItem.description = "Job description"
    } else if (section === "education") {
      newItem.degree = "Degree"
      newItem.institution = "Institution"
      newItem.location = "Location"
      newItem.startDate = ""
      newItem.endDate = ""
      newItem.description = "Education description"
    } else if (section === "projects") {
      newItem.title = "Project Title"
      newItem.technologies = []
      newItem.description = "Project description"
      newItem.link = ""
    }

    setResumeData({
      ...resumeData,
      [section]: [...resumeData[section], newItem],
    })
  }

  // Remove item from a section
  const removeItem = (section, id) => {
    setResumeData({
      ...resumeData,
      [section]: resumeData[section].filter((item) => item.id !== id),
    })
  }

  // Handle input change for personal info
  const handlePersonalChange = (e) => {
    const { name, value } = e.target
    setResumeData({
      ...resumeData,
      personal: {
        ...resumeData.personal,
        [name]: value,
      },
    })
  }

  // Handle input change for sections
  const handleSectionChange = (section, id, field, value) => {
    setResumeData({
      ...resumeData,
      [section]: resumeData[section].map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value }
        }
        return item
      }),
    })
  }

  // Handle skills change
  const handleSkillChange = (e) => {
    const skills = e.target.value.split(",").map((skill) => skill.trim())
    setResumeData({
      ...resumeData,
      skills,
    })
  }

  // Handle template change
  const handleTemplateChange = (template) => {
    const selectedTemplate = templates.find((t) => t.id === template)
    setResumeData({
      ...resumeData,
      template,
      color: selectedTemplate.color,
    })
  }

  // Handle color change
  const handleColorChange = (color) => {
    setResumeData({
      ...resumeData,
      color,
    })
  }

  // Save resume to localStorage
  const saveResume = () => {
    localStorage.setItem("userResume", JSON.stringify(resumeData))

    toast({
      title: t("resumeBuilder.toast.save.title"),
      description: t("resumeBuilder.toast.save.description"),
    })
  }

  // Download resume as PDF
  const downloadResume = async () => {
    if (resumeRef.current) {
      try {
        const canvas = await html2canvas(resumeRef.current, {
          scale: 2,
          useCORS: true,
          logging: false,
        })

        const imgData = canvas.toDataURL("image/jpeg", 1.0)
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "px",
          format: [canvas.width, canvas.height],
        })

        pdf.addImage(imgData, "JPEG", 0, 0, canvas.width, canvas.height)
        pdf.save("resume.pdf")

        toast({
          title: t("resumeBuilder.toast.download.title"),
          description: t("resumeBuilder.toast.download.description"),
        })
      } catch (error) {
        console.error("Error downloading resume:", error)

        toast({
          title: t("resumeBuilder.toast.error.title"),
          description: t("resumeBuilder.toast.error.description"),
          variant: "destructive",
        })
      }
    }
  }

  // Load saved resume from localStorage on initial render
  useEffect(() => {
    const savedResume = localStorage.getItem("userResume")
    if (savedResume) {
      try {
        setResumeData(JSON.parse(savedResume))
      } catch (error) {
        console.error("Error loading saved resume:", error)
      }
    }
  }, [])

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

  // Format date for display
  const formatDate = (dateString) => {
    if (dateString === "Present") return dateString
    if (!dateString) return ""

    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short" })
  }

  return (
    <div className="container py-8">
      <motion.div
        className="max-w-3xl mx-auto text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold">{t("resumeBuilder.title")}</h1>
        <p className="mt-4 text-xl text-muted-foreground">{t("resumeBuilder.subtitle")}</p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>{t("resumeBuilder.editor.title")}</CardTitle>
              <CardDescription>{t("resumeBuilder.editor.description")}</CardDescription>
            </CardHeader>
            <CardContent className="max-h-[800px] overflow-y-auto">
              <Tabs defaultValue="personal">
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="personal">{t("resumeBuilder.editor.tabs.personal")}</TabsTrigger>
                  <TabsTrigger value="experience">{t("resumeBuilder.editor.tabs.experience")}</TabsTrigger>
                  <TabsTrigger value="education">{t("resumeBuilder.editor.tabs.education")}</TabsTrigger>
                  <TabsTrigger value="projects">{t("resumeBuilder.editor.tabs.projects")}</TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t("resumeBuilder.editor.personal.name")}</Label>
                      <Input id="name" name="name" value={resumeData.personal.name} onChange={handlePersonalChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="title">{t("resumeBuilder.editor.personal.title")}</Label>
                      <Input
                        id="title"
                        name="title"
                        value={resumeData.personal.title}
                        onChange={handlePersonalChange}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">{t("resumeBuilder.editor.personal.email")}</Label>
                      <Input
                        id="email"
                        name="email"
                        value={resumeData.personal.email}
                        onChange={handlePersonalChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t("resumeBuilder.editor.personal.phone")}</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={resumeData.personal.phone}
                        onChange={handlePersonalChange}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">{t("resumeBuilder.editor.personal.location")}</Label>
                      <Input
                        id="location"
                        name="location"
                        value={resumeData.personal.location}
                        onChange={handlePersonalChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">{t("resumeBuilder.editor.personal.website")}</Label>
                      <Input
                        id="website"
                        name="website"
                        value={resumeData.personal.website}
                        onChange={handlePersonalChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="summary">{t("resumeBuilder.editor.personal.summary")}</Label>
                    <Textarea
                      id="summary"
                      name="summary"
                      value={resumeData.personal.summary}
                      onChange={handlePersonalChange}
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skills">{t("resumeBuilder.editor.personal.skills")}</Label>
                    <Textarea
                      id="skills"
                      value={resumeData.skills.join(", ")}
                      onChange={handleSkillChange}
                      placeholder="JavaScript, React, Node.js, etc."
                      rows={2}
                    />
                    <p className="text-xs text-muted-foreground">{t("resumeBuilder.editor.personal.skillsHint")}</p>
                  </div>

                  <div className="space-y-2">
                    <Label>{t("resumeBuilder.editor.personal.template")}</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {templates.map((template) => (
                        <button
                          key={template.id}
                          className={`p-2 rounded-md border-2 transition-all ${
                            resumeData.template === template.id
                              ? "border-primary"
                              : "border-border hover:border-primary/50"
                          }`}
                          onClick={() => handleTemplateChange(template.id)}
                        >
                          <div className="aspect-[8.5/11] rounded-sm" style={{ backgroundColor: template.color }}></div>
                          <p className="text-xs mt-1 text-center">{template.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>{t("resumeBuilder.editor.personal.color")}</Label>
                    <div className="flex flex-wrap gap-2">
                      {["#2563eb", "#16a34a", "#9333ea", "#dc2626", "#f59e0b", "#0891b2", "#000000"].map((color) => (
                        <button
                          key={color}
                          className={`w-8 h-8 rounded-full border-2 ${
                            resumeData.color === color ? "border-primary" : "border-transparent"
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => handleColorChange(color)}
                        />
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="experience" className="space-y-6">
                  {resumeData.experience.map((exp, index) => (
                    <div key={exp.id} className="p-4 border rounded-md space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">
                          {t("resumeBuilder.editor.experience.entry")} {index + 1}
                        </h3>
                        <Button variant="ghost" size="sm" onClick={() => removeItem("experience", exp.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`exp-title-${exp.id}`}>{t("resumeBuilder.editor.experience.title")}</Label>
                          <Input
                            id={`exp-title-${exp.id}`}
                            value={exp.title}
                            onChange={(e) => handleSectionChange("experience", exp.id, "title", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`exp-company-${exp.id}`}>
                            {t("resumeBuilder.editor.experience.company")}
                          </Label>
                          <Input
                            id={`exp-company-${exp.id}`}
                            value={exp.company}
                            onChange={(e) => handleSectionChange("experience", exp.id, "company", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`exp-location-${exp.id}`}>
                            {t("resumeBuilder.editor.experience.location")}
                          </Label>
                          <Input
                            id={`exp-location-${exp.id}`}
                            value={exp.location}
                            onChange={(e) => handleSectionChange("experience", exp.id, "location", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`exp-start-${exp.id}`}>
                            {t("resumeBuilder.editor.experience.startDate")}
                          </Label>
                          <Input
                            id={`exp-start-${exp.id}`}
                            type="month"
                            value={exp.startDate}
                            onChange={(e) => handleSectionChange("experience", exp.id, "startDate", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`exp-end-${exp.id}`}>{t("resumeBuilder.editor.experience.endDate")}</Label>
                          <Input
                            id={`exp-end-${exp.id}`}
                            type="month"
                            value={exp.endDate !== "Present" ? exp.endDate : ""}
                            onChange={(e) =>
                              handleSectionChange("experience", exp.id, "endDate", e.target.value || "Present")
                            }
                          />
                          <div className="flex items-center gap-2 mt-1">
                            <input
                              type="checkbox"
                              id={`exp-current-${exp.id}`}
                              checked={exp.endDate === "Present"}
                              onChange={(e) => {
                                handleSectionChange("experience", exp.id, "endDate", e.target.checked ? "Present" : "")
                              }}
                            />
                            <Label htmlFor={`exp-current-${exp.id}`} className="text-xs">
                              {t("resumeBuilder.editor.experience.current")}
                            </Label>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`exp-desc-${exp.id}`}>{t("resumeBuilder.editor.experience.description")}</Label>
                        <Textarea
                          id={`exp-desc-${exp.id}`}
                          value={exp.description}
                          onChange={(e) => handleSectionChange("experience", exp.id, "description", e.target.value)}
                          rows={3}
                        />
                      </div>
                    </div>
                  ))}

                  <Button onClick={() => addItem("experience")} className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    {t("resumeBuilder.editor.experience.add")}
                  </Button>
                </TabsContent>

                <TabsContent value="education" className="space-y-6">
                  {resumeData.education.map((edu, index) => (
                    <div key={edu.id} className="p-4 border rounded-md space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">
                          {t("resumeBuilder.editor.education.entry")} {index + 1}
                        </h3>
                        <Button variant="ghost" size="sm" onClick={() => removeItem("education", edu.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`edu-degree-${edu.id}`}>{t("resumeBuilder.editor.education.degree")}</Label>
                          <Input
                            id={`edu-degree-${edu.id}`}
                            value={edu.degree}
                            onChange={(e) => handleSectionChange("education", edu.id, "degree", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`edu-institution-${edu.id}`}>
                            {t("resumeBuilder.editor.education.institution")}
                          </Label>
                          <Input
                            id={`edu-institution-${edu.id}`}
                            value={edu.institution}
                            onChange={(e) => handleSectionChange("education", edu.id, "institution", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`edu-location-${edu.id}`}>
                            {t("resumeBuilder.editor.education.location")}
                          </Label>
                          <Input
                            id={`edu-location-${edu.id}`}
                            value={edu.location}
                            onChange={(e) => handleSectionChange("education", edu.id, "location", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`edu-start-${edu.id}`}>{t("resumeBuilder.editor.education.startDate")}</Label>
                          <Input
                            id={`edu-start-${edu.id}`}
                            type="month"
                            value={edu.startDate}
                            onChange={(e) => handleSectionChange("education", edu.id, "startDate", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`edu-end-${edu.id}`}>{t("resumeBuilder.editor.education.endDate")}</Label>
                          <Input
                            id={`edu-end-${edu.id}`}
                            type="month"
                            value={edu.endDate !== "Present" ? edu.endDate : ""}
                            onChange={(e) =>
                              handleSectionChange("education", edu.id, "endDate", e.target.value || "Present")
                            }
                          />
                          <div className="flex items-center gap-2 mt-1">
                            <input
                              type="checkbox"
                              id={`edu-current-${edu.id}`}
                              checked={edu.endDate === "Present"}
                              onChange={(e) => {
                                handleSectionChange("education", edu.id, "endDate", e.target.checked ? "Present" : "")
                              }}
                            />
                            <Label htmlFor={`edu-current-${edu.id}`} className="text-xs">
                              {t("resumeBuilder.editor.education.current")}
                            </Label>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`edu-desc-${edu.id}`}>{t("resumeBuilder.editor.education.description")}</Label>
                        <Textarea
                          id={`edu-desc-${edu.id}`}
                          value={edu.description}
                          onChange={(e) => handleSectionChange("education", edu.id, "description", e.target.value)}
                          rows={3}
                        />
                      </div>
                    </div>
                  ))}

                  <Button onClick={() => addItem("education")} className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    {t("resumeBuilder.editor.education.add")}
                  </Button>
                </TabsContent>

                <TabsContent value="projects" className="space-y-6">
                  {resumeData.projects.map((project, index) => (
                    <div key={project.id} className="p-4 border rounded-md space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">
                          {t("resumeBuilder.editor.projects.entry")} {index + 1}
                        </h3>
                        <Button variant="ghost" size="sm" onClick={() => removeItem("projects", project.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`proj-title-${project.id}`}>{t("resumeBuilder.editor.projects.title")}</Label>
                        <Input
                          id={`proj-title-${project.id}`}
                          value={project.title}
                          onChange={(e) => handleSectionChange("projects", project.id, "title", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`proj-tech-${project.id}`}>
                          {t("resumeBuilder.editor.projects.technologies")}
                        </Label>
                        <Input
                          id={`proj-tech-${project.id}`}
                          value={project.technologies.join(", ")}
                          onChange={(e) => {
                            const technologies = e.target.value.split(",").map((tech) => tech.trim())
                            handleSectionChange("projects", project.id, "technologies", technologies)
                          }}
                        />
                        <p className="text-xs text-muted-foreground">
                          {t("resumeBuilder.editor.projects.technologiesHint")}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`proj-desc-${project.id}`}>
                          {t("resumeBuilder.editor.projects.description")}
                        </Label>
                        <Textarea
                          id={`proj-desc-${project.id}`}
                          value={project.description}
                          onChange={(e) => handleSectionChange("projects", project.id, "description", e.target.value)}
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`proj-link-${project.id}`}>{t("resumeBuilder.editor.projects.link")}</Label>
                        <Input
                          id={`proj-link-${project.id}`}
                          value={project.link}
                          onChange={(e) => handleSectionChange("projects", project.id, "link", e.target.value)}
                        />
                      </div>
                    </div>
                  ))}

                  <Button onClick={() => addItem("projects")} className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    {t("resumeBuilder.editor.projects.add")}
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={saveResume}>
                <Save className="mr-2 h-4 w-4" />
                {t("resumeBuilder.actions.save")}
              </Button>
              <Button onClick={downloadResume}>
                <Download className="mr-2 h-4 w-4" />
                {t("resumeBuilder.actions.download")}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>{t("resumeBuilder.preview.title")}</CardTitle>
              <CardDescription>{t("resumeBuilder.preview.description")}</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="bg-muted/50 p-4 flex justify-center">
                <div
                  ref={resumeRef}
                  className="w-full max-w-[600px] aspect-[8.5/11] bg-white shadow-lg overflow-hidden"
                >
                  {/* Minimal Template */}
                  {resumeData.template === "minimal" && (
                    <div className="h-full flex flex-col p-8">
                      <div className="mb-6">
                        <h1 className="text-2xl font-bold" style={{ color: resumeData.color }}>
                          {resumeData.personal.name}
                        </h1>
                        <p className="text-lg text-gray-600">{resumeData.personal.title}</p>
                        <div className="flex flex-wrap gap-2 mt-2 text-sm text-gray-600">
                          {resumeData.personal.email && <span>{resumeData.personal.email}</span>}
                          {resumeData.personal.phone && <span>• {resumeData.personal.phone}</span>}
                          {resumeData.personal.location && <span>• {resumeData.personal.location}</span>}
                          {resumeData.personal.website && <span>• {resumeData.personal.website}</span>}
                        </div>
                      </div>

                      {resumeData.personal.summary && (
                        <div className="mb-6">
                          <h2 className="text-lg font-semibold mb-2" style={{ color: resumeData.color }}>
                            Summary
                          </h2>
                          <p className="text-sm text-gray-700">{resumeData.personal.summary}</p>
                        </div>
                      )}

                      {resumeData.skills.length > 0 && (
                        <div className="mb-6">
                          <h2 className="text-lg font-semibold mb-2" style={{ color: resumeData.color }}>
                            Skills
                          </h2>
                          <div className="flex flex-wrap gap-1">
                            {resumeData.skills.map((skill, index) => (
                              <span key={index} className="text-sm bg-gray-100 px-2 py-1 rounded">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {resumeData.experience.length > 0 && (
                        <div className="mb-6">
                          <h2 className="text-lg font-semibold mb-2" style={{ color: resumeData.color }}>
                            Experience
                          </h2>
                          <div className="space-y-4">
                            {resumeData.experience.map((exp) => (
                              <div key={exp.id}>
                                <div className="flex justify-between">
                                  <h3 className="text-sm font-medium">{exp.title}</h3>
                                  <span className="text-xs text-gray-600">
                                    {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600">
                                  {exp.company}, {exp.location}
                                </p>
                                <p className="text-xs text-gray-700 mt-1">{exp.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {resumeData.education.length > 0 && (
                        <div className="mb-6">
                          <h2 className="text-lg font-semibold mb-2" style={{ color: resumeData.color }}>
                            Education
                          </h2>
                          <div className="space-y-4">
                            {resumeData.education.map((edu) => (
                              <div key={edu.id}>
                                <div className="flex justify-between">
                                  <h3 className="text-sm font-medium">{edu.degree}</h3>
                                  <span className="text-xs text-gray-600">
                                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600">
                                  {edu.institution}, {edu.location}
                                </p>
                                <p className="text-xs text-gray-700 mt-1">{edu.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {resumeData.projects.length > 0 && (
                        <div>
                          <h2 className="text-lg font-semibold mb-2" style={{ color: resumeData.color }}>
                            Projects
                          </h2>
                          <div className="space-y-4">
                            {resumeData.projects.map((project) => (
                              <div key={project.id}>
                                <div className="flex justify-between">
                                  <h3 className="text-sm font-medium">{project.title}</h3>
                                  {project.link && (
                                    <span className="text-xs" style={{ color: resumeData.color }}>
                                      {project.link.replace(/^https?:\/\//, "")}
                                    </span>
                                  )}
                                </div>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {project.technologies.map((tech, index) => (
                                    <span key={index} className="text-xs bg-gray-100 px-1 rounded">
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                                <p className="text-xs text-gray-700 mt-1">{project.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Creative Template */}
                  {resumeData.template === "creative" && (
                    <div className="h-full flex flex-col">
                      <div className="p-8" style={{ backgroundColor: resumeData.color, color: "white" }}>
                        <h1 className="text-2xl font-bold">{resumeData.personal.name}</h1>
                        <p className="text-lg opacity-90">{resumeData.personal.title}</p>
                        <div className="flex flex-wrap gap-2 mt-2 text-sm opacity-80">
                          {resumeData.personal.email && <span>{resumeData.personal.email}</span>}
                          {resumeData.personal.phone && <span>• {resumeData.personal.phone}</span>}
                          {resumeData.personal.location && <span>• {resumeData.personal.location}</span>}
                          {resumeData.personal.website && <span>• {resumeData.personal.website}</span>}
                        </div>
                      </div>

                      <div className="flex flex-1">
                        <div className="w-1/3 p-4 bg-gray-100">
                          {resumeData.personal.summary && (
                            <div className="mb-6">
                              <h2 className="text-lg font-semibold mb-2" style={{ color: resumeData.color }}>
                                About Me
                              </h2>
                              <p className="text-sm text-gray-700">{resumeData.personal.summary}</p>
                            </div>
                          )}

                          {resumeData.skills.length > 0 && (
                            <div className="mb-6">
                              <h2 className="text-lg font-semibold mb-2" style={{ color: resumeData.color }}>
                                Skills
                              </h2>
                              <div className="space-y-1">
                                {resumeData.skills.map((skill, index) => (
                                  <p key={index} className="text-sm text-gray-700">
                                    • {skill}
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}

                          {resumeData.education.length > 0 && (
                            <div>
                              <h2 className="text-lg font-semibold mb-2" style={{ color: resumeData.color }}>
                                Education
                              </h2>
                              <div className="space-y-4">
                                {resumeData.education.map((edu) => (
                                  <div key={edu.id}>
                                    <h3 className="text-sm font-medium">{edu.degree}</h3>
                                    <p className="text-sm text-gray-600">{edu.institution}</p>
                                    <p className="text-xs text-gray-600">
                                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="w-2/3 p-4">
                          {resumeData.experience.length > 0 && (
                            <div className="mb-6">
                              <h2 className="text-lg font-semibold mb-2" style={{ color: resumeData.color }}>
                                Experience
                              </h2>
                              <div className="space-y-4">
                                {resumeData.experience.map((exp) => (
                                  <div key={exp.id}>
                                    <div className="flex justify-between">
                                      <h3 className="text-sm font-medium">{exp.title}</h3>
                                      <span className="text-xs text-gray-600">
                                        {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                      {exp.company}, {exp.location}
                                    </p>
                                    <p className="text-xs text-gray-700 mt-1">{exp.description}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {resumeData.projects.length > 0 && (
                            <div>
                              <h2 className="text-lg font-semibold mb-2" style={{ color: resumeData.color }}>
                                Projects
                              </h2>
                              <div className="space-y-4">
                                {resumeData.projects.map((project) => (
                                  <div key={project.id}>
                                    <div className="flex justify-between">
                                      <h3 className="text-sm font-medium">{project.title}</h3>
                                      {project.link && (
                                        <span className="text-xs" style={{ color: resumeData.color }}>
                                          {project.link.replace(/^https?:\/\//, "")}
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {project.technologies.map((tech, index) => (
                                        <span key={index} className="text-xs bg-gray-100 px-1 rounded">
                                          {tech}
                                        </span>
                                      ))}
                                    </div>
                                    <p className="text-xs text-gray-700 mt-1">{project.description}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Developer Template */}
                  {resumeData.template === "developer" && (
                    <div className="h-full flex flex-col p-6">
                      <div className="mb-6 border-b-2 pb-4" style={{ borderColor: resumeData.color }}>
                        <h1 className="text-2xl font-bold" style={{ color: resumeData.color }}>
                          {resumeData.personal.name}
                        </h1>
                        <p className="text-lg text-gray-600">{resumeData.personal.title}</p>
                        <div className="flex flex-wrap gap-2 mt-2 text-sm text-gray-600">
                          {resumeData.personal.email && (
                            <span className="flex items-center gap-1">
                              <span className="text-xs">📧</span> {resumeData.personal.email}
                            </span>
                          )}
                          {resumeData.personal.phone && (
                            <span className="flex items-center gap-1">
                              <span className="text-xs">📱</span> {resumeData.personal.phone}
                            </span>
                          )}
                          {resumeData.personal.location && (
                            <span className="flex items-center gap-1">
                              <span className="text-xs">📍</span> {resumeData.personal.location}
                            </span>
                          )}
                          {resumeData.personal.website && (
                            <span className="flex items-center gap-1">
                              <span className="text-xs">🌐</span> {resumeData.personal.website}
                            </span>
                          )}
                        </div>
                      </div>

                      {resumeData.personal.summary && (
                        <div className="mb-6">
                          <h2
                            className="text-lg font-semibold mb-2 flex items-center gap-2"
                            style={{ color: resumeData.color }}
                          >
                            <span className="text-sm">👨‍💻</span> About Me
                          </h2>
                          <p className="text-sm text-gray-700">{resumeData.personal.summary}</p>
                        </div>
                      )}

                      {resumeData.skills.length > 0 && (
                        <div className="mb-6">
                          <h2
                            className="text-lg font-semibold mb-2 flex items-center gap-2"
                            style={{ color: resumeData.color }}
                          >
                            <span className="text-sm">🛠️</span> Technical Skills
                          </h2>
                          <div className="flex flex-wrap gap-1">
                            {resumeData.skills.map((skill, index) => (
                              <span
                                key={index}
                                className="text-sm px-2 py-1 rounded"
                                style={{ backgroundColor: `${resumeData.color}20` }}
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {resumeData.experience.length > 0 && (
                        <div className="mb-6">
                          <h2
                            className="text-lg font-semibold mb-2 flex items-center gap-2"
                            style={{ color: resumeData.color }}
                          >
                            <span className="text-sm">💼</span> Experience
                          </h2>
                          <div className="space-y-4">
                            {resumeData.experience.map((exp) => (
                              <div key={exp.id}>
                                <div className="flex justify-between">
                                  <h3 className="text-sm font-medium">{exp.title}</h3>
                                  <span className="text-xs text-gray-600">
                                    {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600">
                                  {exp.company}, {exp.location}
                                </p>
                                <p className="text-xs text-gray-700 mt-1">{exp.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {resumeData.projects.length > 0 && (
                        <div className="mb-6">
                          <h2
                            className="text-lg font-semibold mb-2 flex items-center gap-2"
                            style={{ color: resumeData.color }}
                          >
                            <span className="text-sm">🚀</span> Projects
                          </h2>
                          <div className="space-y-4">
                            {resumeData.projects.map((project) => (
                              <div key={project.id}>
                                <div className="flex justify-between">
                                  <h3 className="text-sm font-medium">{project.title}</h3>
                                  {project.link && (
                                    <span className="text-xs" style={{ color: resumeData.color }}>
                                      {project.link.replace(/^https?:\/\//, "")}
                                    </span>
                                  )}
                                </div>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {project.technologies.map((tech, index) => (
                                    <span
                                      key={index}
                                      className="text-xs px-1 rounded"
                                      style={{ backgroundColor: `${resumeData.color}20` }}
                                    >
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                                <p className="text-xs text-gray-700 mt-1">{project.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {resumeData.education.length > 0 && (
                        <div>
                          <h2
                            className="text-lg font-semibold mb-2 flex items-center gap-2"
                            style={{ color: resumeData.color }}
                          >
                            <span className="text-sm">🎓</span> Education
                          </h2>
                          <div className="space-y-4">
                            {resumeData.education.map((edu) => (
                              <div key={edu.id}>
                                <div className="flex justify-between">
                                  <h3 className="text-sm font-medium">{edu.degree}</h3>
                                  <span className="text-xs text-gray-600">
                                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600">
                                  {edu.institution}, {edu.location}
                                </p>
                                <p className="text-xs text-gray-700 mt-1">{edu.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Hacker Template */}
                  {resumeData.template === "hacker" && (
                    <div className="h-full flex flex-col p-6 bg-black text-green-500 font-mono">
                      <div className="mb-6 border-b border-green-500 pb-4">
                        <h1 className="text-2xl font-bold">{resumeData.personal.name}</h1>
                        <p className="text-lg opacity-90">{resumeData.personal.title}</p>
                        <div className="flex flex-wrap gap-2 mt-2 text-sm opacity-80">
                          {resumeData.personal.email && <span>{resumeData.personal.email}</span>}
                          {resumeData.personal.phone && <span>| {resumeData.personal.phone}</span>}
                          {resumeData.personal.location && <span>| {resumeData.personal.location}</span>}
                          {resumeData.personal.website && <span>| {resumeData.personal.website}</span>}
                        </div>
                      </div>

                      {resumeData.personal.summary && (
                        <div className="mb-6">
                          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                            <span>{">"}</span> README.md
                          </h2>
                          <p className="text-sm">{resumeData.personal.summary}</p>
                        </div>
                      )}

                      {resumeData.skills.length > 0 && (
                        <div className="mb-6">
                          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                            <span>{">"}</span> skills.json
                          </h2>
                          <div className="flex flex-wrap gap-1">
                            {resumeData.skills.map((skill, index) => (
                              <span key={index} className="text-sm border border-green-500 px-2 py-1 rounded">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {resumeData.experience.length > 0 && (
                        <div className="mb-6">
                          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                            <span>{">"}</span> experience.log
                          </h2>
                          <div className="space-y-4">
                            {resumeData.experience.map((exp) => (
                              <div key={exp.id}>
                                <div className="flex justify-between">
                                  <h3 className="text-sm font-medium">{exp.title}</h3>
                                  <span className="text-xs">
                                    {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                                  </span>
                                </div>
                                <p className="text-sm opacity-90">
                                  {exp.company}, {exp.location}
                                </p>
                                <p className="text-xs mt-1">{exp.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {resumeData.projects.length > 0 && (
                        <div className="mb-6">
                          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                            <span>{">"}</span> projects.sh
                          </h2>
                          <div className="space-y-4">
                            {resumeData.projects.map((project) => (
                              <div key={project.id}>
                                <div className="flex justify-between">
                                  <h3 className="text-sm font-medium">{project.title}</h3>
                                  {project.link && (
                                    <span className="text-xs">{project.link.replace(/^https?:\/\//, "")}</span>
                                  )}
                                </div>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {project.technologies.map((tech, index) => (
                                    <span key={index} className="text-xs border border-green-500 px-1 rounded">
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                                <p className="text-xs mt-1">{project.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {resumeData.education.length > 0 && (
                        <div>
                          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                            <span>{">"}</span> education.txt
                          </h2>
                          <div className="space-y-4">
                            {resumeData.education.map((edu) => (
                              <div key={edu.id}>
                                <div className="flex justify-between">
                                  <h3 className="text-sm font-medium">{edu.degree}</h3>
                                  <span className="text-xs">
                                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                                  </span>
                                </div>
                                <p className="text-sm opacity-90">
                                  {edu.institution}, {edu.location}
                                </p>
                                <p className="text-xs mt-1">{edu.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {t("resumeBuilder.preview.template")}: {templates.find((t) => t.id === resumeData.template)?.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-muted-foreground" />
                <div className="h-4 w-4 rounded-full" style={{ backgroundColor: resumeData.color }}></div>
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
            <CardTitle>{t("resumeBuilder.features.title")}</CardTitle>
            <CardDescription>{t("resumeBuilder.features.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <FileText className="h-4 w-4" />
                  </div>
                  <h3 className="font-medium">{t("resumeBuilder.features.feature1.title")}</h3>
                </div>
                <p className="text-muted-foreground text-sm">{t("resumeBuilder.features.feature1.description")}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Palette className="h-4 w-4" />
                  </div>
                  <h3 className="font-medium">{t("resumeBuilder.features.feature2.title")}</h3>
                </div>
                <p className="text-muted-foreground text-sm">{t("resumeBuilder.features.feature2.description")}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Download className="h-4 w-4" />
                  </div>
                  <h3 className="font-medium">{t("resumeBuilder.features.feature3.title")}</h3>
                </div>
                <p className="text-muted-foreground text-sm">{t("resumeBuilder.features.feature3.description")}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                {t("resumeBuilder.features.cta")} <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
