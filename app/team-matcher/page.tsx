"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "@/hooks/use-translation"
import { motion } from "framer-motion"
import { ArrowRight, Check, Filter, Search } from "lucide-react"
import { useState, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { mockUsers } from "@/lib/mock-data"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

export default function TeamMatcher() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    skills: [],
    experience: [],
    availability: [1, 40],
    timezone: [],
    interests: [],
    isMentor: false,
    isLookingForTeam: false,
  })
  const [showFilters, setShowFilters] = useState(false)
  const [savedUsers, setSavedUsers] = useState<number[]>([])
  const [filteredUsers, setFilteredUsers] = useState(mockUsers)
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [compatibilityResults, setCompatibilityResults] = useState<any>(null)

  // Load saved users from localStorage on initial render
  useEffect(() => {
    const saved = localStorage.getItem("savedTeammates")
    if (saved) {
      try {
        setSavedUsers(JSON.parse(saved))
      } catch (error) {
        console.error("Error loading saved teammates:", error)
      }
    }
  }, [])

  // Filter users based on search query and filters
  useEffect(() => {
    let filtered = [...mockUsers]

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.role.toLowerCase().includes(query) ||
          user.skills.some((skill) => skill.toLowerCase().includes(query)) ||
          user.interests.some((interest) => interest.toLowerCase().includes(query)),
      )
    }

    // Filter by skills
    if (filters.skills.length > 0) {
      filtered = filtered.filter((user) => user.skills.some((skill) => filters.skills.includes(skill)))
    }

    // Filter by experience
    if (filters.experience.length > 0) {
      filtered = filtered.filter((user) => filters.experience.includes(user.level))
    }

    // Filter by availability
    filtered = filtered.filter(
      (user) => user.availability >= filters.availability[0] && user.availability <= filters.availability[1],
    )

    // Filter by timezone
    if (filters.timezone.length > 0) {
      filtered = filtered.filter((user) => filters.timezone.includes(user.timezone))
    }

    // Filter by interests
    if (filters.interests.length > 0) {
      filtered = filtered.filter((user) => user.interests.some((interest) => filters.interests.includes(interest)))
    }

    // Filter by mentor
    if (filters.isMentor) {
      filtered = filtered.filter((user) => user.isMentor)
    }

    // Filter by looking for team
    if (filters.isLookingForTeam) {
      filtered = filtered.filter((user) => user.isLookingForTeam)
    }

    // Filter by tab
    if (activeTab === "saved") {
      filtered = filtered.filter((user) => savedUsers.includes(user.id))
    }

    setFilteredUsers(filtered)
  }, [searchQuery, filters, activeTab, savedUsers])

  // Toggle save user
  const toggleSaveUser = (id: number) => {
    let newSaved
    if (savedUsers.includes(id)) {
      newSaved = savedUsers.filter((userId) => userId !== id)
      toast({
        title: t("teamMatcher.toast.removed.title"),
        description: t("teamMatcher.toast.removed.description"),
      })
    } else {
      newSaved = [...savedUsers, id]
      toast({
        title: t("teamMatcher.toast.saved.title"),
        description: t("teamMatcher.toast.saved.description"),
      })
    }
    setSavedUsers(newSaved)
    localStorage.setItem("savedTeammates", JSON.stringify(newSaved))
  }

  // Toggle select user for compatibility check
  const toggleSelectUser = (id: number) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter((userId) => userId !== id))
    } else {
      if (selectedUsers.length < 2) {
        setSelectedUsers([...selectedUsers, id])
      } else {
        toast({
          title: t("teamMatcher.toast.tooMany.title"),
          description: t("teamMatcher.toast.tooMany.description"),
          variant: "destructive",
        })
      }
    }
  }

  // Check compatibility between selected users
  const checkCompatibility = () => {
    if (selectedUsers.length !== 2) {
      toast({
        title: t("teamMatcher.toast.needTwo.title"),
        description: t("teamMatcher.toast.needTwo.description"),
        variant: "destructive",
      })
      return
    }

    const user1 = mockUsers.find((user) => user.id === selectedUsers[0])
    const user2 = mockUsers.find((user) => user.id === selectedUsers[1])

    if (!user1 || !user2) return

    // Calculate skill match percentage
    const skillsMatch = user1.skills.filter((skill) => user2.skills.includes(skill)).length
    const skillsMatchPercentage = Math.round((skillsMatch / Math.max(user1.skills.length, user2.skills.length)) * 100)

    // Calculate interests match percentage
    const interestsMatch = user1.interests.filter((interest) => user2.interests.includes(interest)).length
    const interestsMatchPercentage = Math.round(
      (interestsMatch / Math.max(user1.interests.length, user2.interests.length)) * 100,
    )

    // Calculate timezone compatibility
    const timezoneMatch = user1.timezone === user2.timezone
    const timezoneMatchPercentage = timezoneMatch ? 100 : 50

    // Calculate availability compatibility
    const availabilityDiff = Math.abs(user1.availability - user2.availability)
    const availabilityMatchPercentage = Math.round(100 - (availabilityDiff / 40) * 100)

    // Calculate overall compatibility
    const overallCompatibility = Math.round(
      (skillsMatchPercentage + interestsMatchPercentage + timezoneMatchPercentage + availabilityMatchPercentage) / 4,
    )

    setCompatibilityResults({
      user1,
      user2,
      skillsMatch: {
        count: skillsMatch,
        percentage: skillsMatchPercentage,
        skills: user1.skills.filter((skill) => user2.skills.includes(skill)),
      },
      interestsMatch: {
        count: interestsMatch,
        percentage: interestsMatchPercentage,
        interests: user1.interests.filter((interest) => user2.interests.includes(interest)),
      },
      timezoneMatch: {
        isMatch: timezoneMatch,
        percentage: timezoneMatchPercentage,
      },
      availabilityMatch: {
        difference: availabilityDiff,
        percentage: availabilityMatchPercentage,
      },
      overallCompatibility,
    })

    toast({
      title: t("teamMatcher.toast.compatibility.title"),
      description: t("teamMatcher.toast.compatibility.description", { percentage: overallCompatibility }),
    })
  }

  // Reset compatibility results
  const resetCompatibility = () => {
    setSelectedUsers([])
    setCompatibilityResults(null)
  }

  // Reset filters
  const resetFilters = () => {
    setFilters({
      skills: [],
      experience: [],
      availability: [1, 40],
      timezone: [],
      interests: [],
      isMentor: false,
      isLookingForTeam: false,
    })
    setSearchQuery("")
    toast({
      title: t("teamMatcher.toast.reset.title"),
      description: t("teamMatcher.toast.reset.description"),
    })
  }

  // Handle filter change
  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  // Toggle filter for array type filters
  const toggleFilter = (key: string, value: string) => {
    setFilters((prev) => {
      const current = prev[key as keyof typeof prev] as string[]
      return {
        ...prev,
        [key]: current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
      }
    })
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

  // Available skills
  const skills = [
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Python",
    "Java",
    "Go",
    "Rust",
    "C++",
    "HTML",
    "CSS",
    "Design",
    "Documentation",
    "Testing",
    "DevOps",
    "Mobile",
    "AI",
    "Data",
    "Blockchain",
  ]

  // Available experience levels
  const experienceLevels = ["Beginner", "Intermediate", "Advanced"]

  // Available timezones
  const timezones = ["PST", "MST", "CST", "EST", "GMT", "CET", "IST", "JST", "AEST"]

  // Available interests
  const interests = [
    "Web Development",
    "Mobile Development",
    "AI/ML",
    "Data Science",
    "DevOps",
    "Blockchain",
    "Game Development",
    "UI/UX Design",
    "Open Source",
    "Hackathons",
  ]

  // Helper function to get compatibility color
  const getCompatibilityColor = (percentage: number) => {
    if (percentage >= 80) return "#22c55e" // green-500
    if (percentage >= 60) return "#eab308" // yellow-500
    if (percentage >= 40) return "#f97316" // orange-500
    return "#ef4444" // red-500
  }

  // Helper function to get compatibility message
  const getCompatibilityMessage = (percentage: number) => {
    if (percentage >= 80) {
      return "Excellent match! These developers would make a great team with complementary skills and compatible working styles."
    }
    if (percentage >= 60) {
      return "Good match! These developers have several compatible traits and could work well together with some adjustments."
    }
    if (percentage >= 40) {
      return "Fair match. There are some compatibility challenges, but collaboration is still possible with good communication."
    }
    return "Limited compatibility. These developers might face challenges working together due to different skills, interests, or schedules."
  }

  return (
    <div className="container py-8">
      <motion.div
        className="max-w-3xl mx-auto text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold">{t("teamMatcher.title")}</h1>
        <p className="mt-4 text-xl text-muted-foreground">{t("teamMatcher.subtitle")}</p>
      </motion.div>

      {compatibilityResults ? (
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{t("teamMatcher.compatibility.title")}</CardTitle>
                <Button variant="outline" size="sm" onClick={resetCompatibility}>
                  {t("teamMatcher.compatibility.reset")}
                </Button>
              </div>
              <CardDescription>{t("teamMatcher.compatibility.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage
                      src={compatibilityResults.user1.avatar || "/placeholder.svg"}
                      alt={compatibilityResults.user1.name}
                    />
                    <AvatarFallback>{compatibilityResults.user1.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-bold">{compatibilityResults.user1.name}</h3>
                  <p className="text-muted-foreground">{compatibilityResults.user1.role}</p>
                  <div className="flex flex-wrap gap-1 mt-2 justify-center">
                    {compatibilityResults.user1.skills.slice(0, 5).map((skill: string) => (
                      <Badge key={skill} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage
                      src={compatibilityResults.user2.avatar || "/placeholder.svg"}
                      alt={compatibilityResults.user2.name}
                    />
                    <AvatarFallback>{compatibilityResults.user2.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-bold">{compatibilityResults.user2.name}</h3>
                  <p className="text-muted-foreground">{compatibilityResults.user2.role}</p>
                  <div className="flex flex-wrap gap-1 mt-2 justify-center">
                    {compatibilityResults.user2.skills.slice(0, 5).map((skill: string) => (
                      <Badge key={skill} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col items-center">
                <div className="relative w-48 h-48">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="text-6xl font-bold"
                      style={{ color: getCompatibilityColor(compatibilityResults.overallCompatibility) }}
                    >
                      {compatibilityResults.overallCompatibility}%
                    </div>
                  </div>
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeLinecap="round"
                      className="text-muted/20"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke={getCompatibilityColor(compatibilityResults.overallCompatibility)}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${(compatibilityResults.overallCompatibility / 100) * 283} 283`}
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mt-4">{t("teamMatcher.compatibility.overallScore")}</h3>
                <p className="text-muted-foreground text-center max-w-md mt-2">
                  {getCompatibilityMessage(compatibilityResults.overallCompatibility)}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="space-y-4">
                  <h3 className="font-medium">{t("teamMatcher.compatibility.skillsMatch")}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>
                        {compatibilityResults.skillsMatch.count} {t("teamMatcher.compatibility.common")}
                      </span>
                      <span>{compatibilityResults.skillsMatch.percentage}%</span>
                    </div>
                    <Progress value={compatibilityResults.skillsMatch.percentage} className="h-2" />
                    <div className="flex flex-wrap gap-1 mt-2">
                      {compatibilityResults.skillsMatch.skills.map((skill: string) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-medium">{t("teamMatcher.compatibility.interestsMatch")}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>
                        {compatibilityResults.interestsMatch.count} {t("teamMatcher.compatibility.common")}
                      </span>
                      <span>{compatibilityResults.interestsMatch.percentage}%</span>
                    </div>
                    <Progress value={compatibilityResults.interestsMatch.percentage} className="h-2" />
                    <div className="flex flex-wrap gap-1 mt-2">
                      {compatibilityResults.interestsMatch.interests.map((interest: string) => (
                        <Badge key={interest} variant="secondary">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-medium">{t("teamMatcher.compatibility.timezoneMatch")}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>
                        {compatibilityResults.timezoneMatch.isMatch
                          ? t("teamMatcher.compatibility.sameTimezone")
                          : t("teamMatcher.compatibility.differentTimezone")}
                      </span>
                      <span>{compatibilityResults.timezoneMatch.percentage}%</span>
                    </div>
                    <Progress value={compatibilityResults.timezoneMatch.percentage} className="h-2" />
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">{compatibilityResults.user1.timezone}</Badge>
                      {compatibilityResults.timezoneMatch.isMatch ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <span>→</span>
                      )}
                      <Badge variant="outline">{compatibilityResults.user2.timezone}</Badge>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-medium">{t("teamMatcher.compatibility.availabilityMatch")}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>
                        {t("teamMatcher.compatibility.hoursDifference", {
                          hours: compatibilityResults.availabilityMatch.difference,
                        })}
                      </span>
                      <span>{compatibilityResults.availabilityMatch.percentage}%</span>
                    </div>
                    <Progress value={compatibilityResults.availabilityMatch.percentage} className="h-2" />
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">
                        {compatibilityResults.user1.availability} {t("teamMatcher.compatibility.hours")}
                      </Badge>
                      <span>↔</span>
                      <Badge variant="outline">
                        {compatibilityResults.user2.availability} {t("teamMatcher.compatibility.hours")}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                {t("teamMatcher.compatibility.connect")} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={t("teamMatcher.search.placeholder")}
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2"
                  >
                    <Filter className="h-4 w-4" />
                    {t("teamMatcher.filters.toggle")}
                  </Button>
                  <Button variant="outline" onClick={resetFilters}>
                    {t("teamMatcher.filters.reset")}
                  </Button>
                </div>
              </div>
            </CardHeader>
            {showFilters && (
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>{t("teamMatcher.filters.skills")}</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2 max-h-48 overflow-y-auto">
                        {skills.map((skill) => (
                          <div key={skill} className="flex items-center gap-2">
                            <Checkbox
                              id={`skill-${skill}`}
                              checked={filters.skills.includes(skill)}
                              onCheckedChange={() => toggleFilter("skills", skill)}
                            />
                            <Label htmlFor={`skill-${skill}`} className="text-sm font-normal cursor-pointer">
                              {skill}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label>{t("teamMatcher.filters.availability")}</Label>
                      <div className="pt-4 px-2">
                        <Slider
                          min={1}
                          max={40}
                          step={1}
                          value={filters.availability}
                          onValueChange={(value) => handleFilterChange("availability", value)}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-2">
                          <span>1</span>
                          <span>
                            {filters.availability[0]} - {filters.availability[1]} {t("teamMatcher.filters.hours")}
                          </span>
                          <span>40+</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label>{t("teamMatcher.filters.experience")}</Label>
                      <div className="grid grid-cols-1 gap-2 mt-2">
                        {experienceLevels.map((level) => (
                          <div key={level} className="flex items-center gap-2">
                            <Checkbox
                              id={`level-${level}`}
                              checked={filters.experience.includes(level)}
                              onCheckedChange={() => toggleFilter("experience", level)}
                            />
                            <Label htmlFor={`level-${level}`} className="text-sm font-normal cursor-pointer">
                              {level}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label>{t("teamMatcher.filters.timezone")}</Label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {timezones.map((timezone) => (
                          <div key={timezone} className="flex items-center gap-2">
                            <Checkbox
                              id={`timezone-${timezone}`}
                              checked={filters.timezone.includes(timezone)}
                              onCheckedChange={() => toggleFilter("timezone", timezone)}
                            />
                            <Label htmlFor={`timezone-${timezone}`} className="text-sm font-normal cursor-pointer">
                              {timezone}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label>{t("teamMatcher.filters.interests")}</Label>
                      <div className="grid grid-cols-1 gap-2 mt-2 max-h-48 overflow-y-auto">
                        {interests.map((interest) => (
                          <div key={interest} className="flex items-center gap-2">
                            <Checkbox
                              id={`interest-${interest}`}
                              checked={filters.interests.includes(interest)}
                              onCheckedChange={() => toggleFilter("interests", interest)}
                            />
                            <Label htmlFor={`interest-${interest}`} className="text-sm font-normal cursor-pointer">
                              {interest}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Switch
                          id="mentor"
                          checked={filters.isMentor}
                          onCheckedChange={(checked) => handleFilterChange("isMentor", checked)}
                        />
                        <Label htmlFor="mentor" className="text-sm font-normal cursor-pointer">
                          {t("teamMatcher.filters.mentors")}
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          id="looking-for-team"
                          checked={filters.isLookingForTeam}
                          onCheckedChange={(checked) => handleFilterChange("isLookingForTeam", checked)}
                        />
                        <Label htmlFor="looking-for-team" className="text-sm font-normal cursor-pointer">
                          {t("teamMatcher.filters.lookingForTeam")}
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
            <CardFooter className="pt-0">
              <div className="w-full">
                <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab as any} className="w-full">
                  <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="all">{t("teamMatcher.tabs.all")}</TabsTrigger>
                    <TabsTrigger value="saved">{t("teamMatcher.tabs.saved")}</TabsTrigger>
                  </TabsList>
                </Tabs>
                {selectedUsers.length > 0 && (
                  <div className="flex justify-between items-center mt-4">
                    <div className="text-sm">
                      {selectedUsers.length} {t("teamMatcher.selected")}
                    </div>
                    <Button size="sm" onClick={checkCompatibility} disabled={selectedUsers.length !== 2}>
                      {t("teamMatcher.checkCompatibility")}
                    </Button>
                  </div>
                )}
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      )}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <motion.div key={user.id} variants={itemVariants}>
              <Card
                className={`h-full flex flex-col overflow-hidden group ${
                  selectedUsers.includes(user.id) ? "ring-2 ring-primary" : ""
                }`}
              >
                <div className="relative">
                  <div
                    className="h-24 bg-gradient-to-r"
                    style={{
                      backgroundImage: `linear-gradient(to right, ${user.gradientFrom || "#4f46e5"}, ${user.gradientTo || "#9333ea"})`,
                    }}
                  />
                  <Avatar className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 h-20 w-20 border-4 border-background">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20"
                      onClick={() => toggleSaveUser(user.id)}
                    >
                      {savedUsers.includes(user.id) ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                          />
                        </svg>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20"
                      onClick={() => toggleSelectUser(user.id)}
                    >
                      {selectedUsers.includes(user.id) ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            fillRule="evenodd"
                            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      )}
                    </Button>
                  </div>
                </div>
                <CardContent className="pt-12 flex-1">
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold">{user.name}</h3>
                    <p className="text-muted-foreground">{user.role}</p>
                    {user.isMentor && (
                      <Badge variant="secondary" className="mt-2">
                        {t("teamMatcher.card.mentor")}
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">{t("teamMatcher.card.skills")}</h4>
                      <div className="flex flex-wrap gap-1">
                        {user.skills.slice(0, 5).map((skill) => (
                          <Badge key={skill} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                        {user.skills.length > 5 && <Badge variant="outline">+{user.skills.length - 5}</Badge>}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">{t("teamMatcher.card.interests")}</h4>
                      <div className="flex flex-wrap gap-1">
                        {user.interests.slice(0, 3).map((interest) => (
                          <Badge key={interest} variant="secondary">
                            {interest}
                          </Badge>
                        ))}
                        {user.interests.length > 3 && <Badge variant="secondary">+{user.interests.length - 3}</Badge>}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">{t("teamMatcher.card.level")}:</span>{" "}
                        <span className="font-medium">{user.level}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">{t("teamMatcher.card.timezone")}:</span>{" "}
                        <span className="font-medium">{user.timezone}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">{t("teamMatcher.card.availability")}:</span>{" "}
                        <span className="font-medium">
                          {user.availability} {t("teamMatcher.card.hours")}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">{t("teamMatcher.card.languages")}:</span>{" "}
                        <span className="font-medium">{user.languages?.join(", ") || "English"}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t p-4">
                  <Button className="w-full">
                    {t("teamMatcher.card.viewProfile")} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))
        ) : (
          <motion.div
            className="col-span-full flex flex-col items-center justify-center py-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-4">
              <Search className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium">{t("teamMatcher.empty.title")}</h3>
            <p className="text-muted-foreground mt-2 max-w-md">{t("teamMatcher.empty.description")}</p>
            <Button className="mt-4" onClick={resetFilters}>
              {t("teamMatcher.empty.reset")}
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
