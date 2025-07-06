"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "@/hooks/use-translation"
import { motion } from "framer-motion"
import { Calendar, Filter, MapPin, Search, Users, Clock, ArrowRight, ExternalLink } from "lucide-react"
import { useState, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { mockHackathons } from "@/lib/mock-data"
import Link from "next/link"

export default function HackathonFinder() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    theme: [],
    teamSize: [1, 10],
    format: [],
    region: [],
    difficulty: [],
    isBeginnerFriendly: false,
    isPrizeAvailable: false,
    isRemote: false,
  })
  const [showFilters, setShowFilters] = useState(false)
  const [savedHackathons, setSavedHackathons] = useState<number[]>([])
  const [filteredHackathons, setFilteredHackathons] = useState(mockHackathons)

  // Load saved hackathons from localStorage on initial render
  useEffect(() => {
    const saved = localStorage.getItem("savedHackathons")
    if (saved) {
      try {
        setSavedHackathons(JSON.parse(saved))
      } catch (error) {
        console.error("Error loading saved hackathons:", error)
      }
    }
  }, [])

  // Filter hackathons based on search query and filters
  useEffect(() => {
    let filtered = [...mockHackathons]

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (hackathon) =>
          hackathon.name.toLowerCase().includes(query) ||
          hackathon.description.toLowerCase().includes(query) ||
          hackathon.organizer.toLowerCase().includes(query) ||
          hackathon.location.toLowerCase().includes(query) ||
          hackathon.themes.some((theme) => theme.toLowerCase().includes(query)),
      )
    }

    // Filter by theme
    if (filters.theme.length > 0) {
      filtered = filtered.filter(
        (hackathon) => hackathon.themes && hackathon.themes.some((theme) => filters.theme.includes(theme)),
      )
    }

    // Filter by team size
    filtered = filtered.filter(
      (hackathon) => hackathon.teamSize >= filters.teamSize[0] && hackathon.teamSize <= filters.teamSize[1],
    )

    // Filter by format
    if (filters.format.length > 0) {
      filtered = filtered.filter((hackathon) => filters.format.includes(hackathon.format))
    }

    // Filter by region
    if (filters.region.length > 0) {
      filtered = filtered.filter((hackathon) => filters.region.includes(hackathon.region))
    }

    // Filter by difficulty
    if (filters.difficulty.length > 0) {
      filtered = filtered.filter((hackathon) => filters.difficulty.includes(hackathon.difficulty))
    }

    // Filter by beginner friendly
    if (filters.isBeginnerFriendly) {
      filtered = filtered.filter((hackathon) => hackathon.isBeginnerFriendly)
    }

    // Filter by prize available
    if (filters.isPrizeAvailable) {
      filtered = filtered.filter((hackathon) => hackathon.isPrizeAvailable)
    }

    // Filter by remote
    if (filters.isRemote) {
      filtered = filtered.filter((hackathon) => hackathon.format === "Online")
    }

    // Filter by tab
    if (activeTab === "saved") {
      filtered = filtered.filter((hackathon) => savedHackathons.includes(hackathon.id))
    } else if (activeTab === "upcoming") {
      const now = new Date()
      filtered = filtered.filter((hackathon) => new Date(hackathon.startDate) > now)
    } else if (activeTab === "ongoing") {
      const now = new Date()
      filtered = filtered.filter(
        (hackathon) => new Date(hackathon.startDate) <= now && new Date(hackathon.endDate) >= now,
      )
    } else if (activeTab === "past") {
      const now = new Date()
      filtered = filtered.filter((hackathon) => new Date(hackathon.endDate) < now)
    }

    setFilteredHackathons(filtered)
  }, [searchQuery, filters, activeTab, savedHackathons])

  // Toggle save hackathon
  const toggleSaveHackathon = (id: number) => {
    let newSaved
    if (savedHackathons.includes(id)) {
      newSaved = savedHackathons.filter((hackathonId) => hackathonId !== id)
      toast({
        title: t("hackathonFinder.toast.removed.title"),
        description: t("hackathonFinder.toast.removed.description"),
      })
    } else {
      newSaved = [...savedHackathons, id]
      toast({
        title: t("hackathonFinder.toast.saved.title"),
        description: t("hackathonFinder.toast.saved.description"),
      })
    }
    setSavedHackathons(newSaved)
    localStorage.setItem("savedHackathons", JSON.stringify(newSaved))
  }

  // Reset filters
  const resetFilters = () => {
    setFilters({
      theme: [],
      teamSize: [1, 10],
      format: [],
      region: [],
      difficulty: [],
      isBeginnerFriendly: false,
      isPrizeAvailable: false,
      isRemote: false,
    })
    setSearchQuery("")
    toast({
      title: t("hackathonFinder.toast.reset.title"),
      description: t("hackathonFinder.toast.reset.description"),
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

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  }

  // Calculate days remaining
  const getDaysRemaining = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Get status badge
  const getStatusBadge = (hackathon: any) => {
    const now = new Date()
    const startDate = new Date(hackathon.startDate)
    const endDate = new Date(hackathon.endDate)

    if (now < startDate) {
      const daysRemaining = getDaysRemaining(hackathon.startDate)
      return (
        <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
          {t("hackathonFinder.status.upcoming")} ({daysRemaining} {t("hackathonFinder.status.days")})
        </Badge>
      )
    } else if (now >= startDate && now <= endDate) {
      return (
        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
          {t("hackathonFinder.status.ongoing")}
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/20">
          {t("hackathonFinder.status.past")}
        </Badge>
      )
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

  // Available themes
  const themes = [
    "AI",
    "Web3",
    "Social Good",
    "Open Source",
    "Climate",
    "Health",
    "Education",
    "Finance",
    "Gaming",
    "Mobile",
  ]

  // Available formats
  const formats = ["Online", "In-person", "Hybrid"]

  // Available regions
  const regions = ["Global", "North America", "Europe", "Asia", "Africa", "South America", "Oceania", "India"]

  // Available difficulties
  const difficulties = ["Beginner", "Intermediate", "Advanced"]

  return (
    <div className="container py-8">
      <motion.div
        className="max-w-3xl mx-auto text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold">{t("hackathonFinder.title")}</h1>
        <p className="mt-4 text-xl text-muted-foreground">{t("hackathonFinder.subtitle")}</p>
      </motion.div>

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
                    placeholder={t("hackathonFinder.search.placeholder")}
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
                  {t("hackathonFinder.filters.toggle")}
                </Button>
                <Button variant="outline" onClick={resetFilters}>
                  {t("hackathonFinder.filters.reset")}
                </Button>
              </div>
            </div>
          </CardHeader>
          {showFilters && (
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>{t("hackathonFinder.filters.themes")}</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {themes &&
                        themes.map((theme) => (
                          <div key={theme} className="flex items-center gap-2">
                            <Checkbox
                              id={`theme-${theme}`}
                              checked={filters.theme.includes(theme)}
                              onCheckedChange={() => toggleFilter("theme", theme)}
                            />
                            <Label htmlFor={`theme-${theme}`} className="text-sm font-normal cursor-pointer">
                              {theme}
                            </Label>
                          </div>
                        ))}
                    </div>
                  </div>
                  <div>
                    <Label>{t("hackathonFinder.filters.teamSize")}</Label>
                    <div className="pt-4 px-2">
                      <Slider
                        min={1}
                        max={10}
                        step={1}
                        value={filters.teamSize}
                        onValueChange={(value) => handleFilterChange("teamSize", value)}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-2">
                        <span>1</span>
                        <span>
                          {filters.teamSize[0]} - {filters.teamSize[1]} {t("hackathonFinder.filters.members")}
                        </span>
                        <span>10+</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label>{t("hackathonFinder.filters.format")}</Label>
                    <div className="grid grid-cols-1 gap-2 mt-2">
                      {formats &&
                        formats.map((format) => (
                          <div key={format} className="flex items-center gap-2">
                            <Checkbox
                              id={`format-${format}`}
                              checked={filters.format.includes(format)}
                              onCheckedChange={() => toggleFilter("format", format)}
                            />
                            <Label htmlFor={`format-${format}`} className="text-sm font-normal cursor-pointer">
                              {format}
                            </Label>
                          </div>
                        ))}
                    </div>
                  </div>
                  <div>
                    <Label>{t("hackathonFinder.filters.difficulty")}</Label>
                    <div className="grid grid-cols-1 gap-2 mt-2">
                      {difficulties &&
                        difficulties.map((difficulty) => (
                          <div key={difficulty} className="flex items-center gap-2">
                            <Checkbox
                              id={`difficulty-${difficulty}`}
                              checked={filters.difficulty.includes(difficulty)}
                              onCheckedChange={() => toggleFilter("difficulty", difficulty)}
                            />
                            <Label htmlFor={`difficulty-${difficulty}`} className="text-sm font-normal cursor-pointer">
                              {difficulty}
                            </Label>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label>{t("hackathonFinder.filters.region")}</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {regions &&
                        regions.map((region) => (
                          <div key={region} className="flex items-center gap-2">
                            <Checkbox
                              id={`region-${region}`}
                              checked={filters.region.includes(region)}
                              onCheckedChange={() => toggleFilter("region", region)}
                            />
                            <Label htmlFor={`region-${region}`} className="text-sm font-normal cursor-pointer">
                              {region}
                            </Label>
                          </div>
                        ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Switch
                        id="beginner-friendly"
                        checked={filters.isBeginnerFriendly}
                        onCheckedChange={(checked) => handleFilterChange("isBeginnerFriendly", checked)}
                      />
                      <Label htmlFor="beginner-friendly" className="text-sm font-normal cursor-pointer">
                        {t("hackathonFinder.filters.beginnerFriendly")}
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        id="prize-available"
                        checked={filters.isPrizeAvailable}
                        onCheckedChange={(checked) => handleFilterChange("isPrizeAvailable", checked)}
                      />
                      <Label htmlFor="prize-available" className="text-sm font-normal cursor-pointer">
                        {t("hackathonFinder.filters.prizeAvailable")}
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        id="remote"
                        checked={filters.isRemote}
                        onCheckedChange={(checked) => handleFilterChange("isRemote", checked)}
                      />
                      <Label htmlFor="remote" className="text-sm font-normal cursor-pointer">
                        {t("hackathonFinder.filters.remoteOnly")}
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          )}
          <CardFooter className="pt-0">
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab as any} className="w-full">
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="all">{t("hackathonFinder.tabs.all")}</TabsTrigger>
                <TabsTrigger value="upcoming">{t("hackathonFinder.tabs.upcoming")}</TabsTrigger>
                <TabsTrigger value="ongoing">{t("hackathonFinder.tabs.ongoing")}</TabsTrigger>
                <TabsTrigger value="saved">{t("hackathonFinder.tabs.saved")}</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardFooter>
        </Card>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredHackathons && filteredHackathons.length > 0 ? (
          filteredHackathons.map((hackathon) => (
            <motion.div key={hackathon.id} variants={itemVariants}>
              <Card className="h-full flex flex-col overflow-hidden group">
                <div
                  className="h-32 bg-gradient-to-r relative"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${hackathon.gradientFrom}, ${hackathon.gradientTo})`,
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-2xl font-bold text-white">{hackathon.name}</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 text-white hover:bg-white/20"
                    onClick={() => toggleSaveHackathon(hackathon.id)}
                  >
                    {savedHackathons.includes(hackathon.id) ? (
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
                </div>
                <CardContent className="flex-1 pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">{hackathon.organizer}</div>
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span>{hackathon.location}</span>
                      </div>
                    </div>
                    {getStatusBadge(hackathon)}
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{hackathon.description}</p>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {formatDate(hackathon.startDate)} - {formatDate(hackathon.endDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {t("hackathonFinder.card.teamSize")}: {hackathon.teamSize}{" "}
                        {hackathon.teamSize === 1 ? t("hackathonFinder.card.person") : t("hackathonFinder.card.people")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {t("hackathonFinder.card.duration")}: {hackathon.duration}{" "}
                        {hackathon.duration === 1 ? t("hackathonFinder.card.day") : t("hackathonFinder.card.days")}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-4">
                    {hackathon.themes &&
                      hackathon.themes.map((theme) => (
                        <Badge key={theme} variant="secondary" className="text-xs">
                          {theme}
                        </Badge>
                      ))}
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {hackathon.isBeginnerFriendly && (
                      <Badge variant="outline" className="text-xs bg-green-500/10 text-green-500 border-green-500/20">
                        {t("hackathonFinder.card.beginnerFriendly")}
                      </Badge>
                    )}
                    {hackathon.isPrizeAvailable && (
                      <Badge
                        variant="outline"
                        className="text-xs bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                      >
                        {t("hackathonFinder.card.prizes")}
                      </Badge>
                    )}
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        hackathon.difficulty === "Beginner"
                          ? "bg-green-500/10 text-green-500 border-green-500/20"
                          : hackathon.difficulty === "Intermediate"
                            ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                            : "bg-red-500/10 text-red-500 border-red-500/20"
                      }`}
                    >
                      {hackathon.difficulty}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        hackathon.format === "Online"
                          ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                          : hackathon.format === "In-person"
                            ? "bg-purple-500/10 text-purple-500 border-purple-500/20"
                            : "bg-indigo-500/10 text-indigo-500 border-indigo-500/20"
                      }`}
                    >
                      {hackathon.format}
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <div className="flex gap-2 w-full">
                    <Button variant="outline" className="flex-1" asChild>
                      <a href={hackathon.website} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        {t("hackathonFinder.card.website")}
                      </a>
                    </Button>
                    <Button className="flex-1">
                      {t("hackathonFinder.card.details")}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
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
            <h3 className="text-xl font-medium">{t("hackathonFinder.empty.title")}</h3>
            <p className="text-muted-foreground mt-2 max-w-md">{t("hackathonFinder.empty.description")}</p>
            <Button className="mt-4" onClick={resetFilters}>
              {t("hackathonFinder.empty.reset")}
            </Button>
          </motion.div>
        )}
      </motion.div>

      <motion.div
        className="mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>{t("hackathonFinder.features.title")}</CardTitle>
            <CardDescription>{t("hackathonFinder.features.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Filter className="h-4 w-4" />
                  </div>
                  <h3 className="font-medium">{t("hackathonFinder.features.feature1.title")}</h3>
                </div>
                <p className="text-muted-foreground text-sm">{t("hackathonFinder.features.feature1.description")}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <h3 className="font-medium">{t("hackathonFinder.features.feature2.title")}</h3>
                </div>
                <p className="text-muted-foreground text-sm">{t("hackathonFinder.features.feature2.description")}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Users className="h-4 w-4" />
                  </div>
                  <h3 className="font-medium">{t("hackathonFinder.features.feature3.title")}</h3>
                </div>
                <p className="text-muted-foreground text-sm">{t("hackathonFinder.features.feature3.description")}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/team-matcher">
                {t("hackathonFinder.features.cta")} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
