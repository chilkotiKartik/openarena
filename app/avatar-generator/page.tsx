"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "@/hooks/use-translation"
import { motion } from "framer-motion"
import { Download, Save, Shuffle } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import html2canvas from "html2canvas"
import { Badge } from "@/components/ui/badge"

export default function AvatarGenerator() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const avatarRef = useRef(null)

  // Avatar customization options
  const [avatarOptions, setAvatarOptions] = useState({
    face: 1,
    hair: 1,
    eyes: 1,
    mouth: 1,
    accessories: 1,
    background: 1,
  })

  // Available options count
  const optionCounts = {
    face: 5,
    hair: 8,
    eyes: 6,
    mouth: 6,
    accessories: 8,
    background: 6,
  }

  // Colors for the avatar
  const [colors, setColors] = useState({
    skin: "#F8D5C2",
    hair: "#5E3B28",
    background: "#E2F0FF",
  })

  const colorOptions = {
    skin: ["#F8D5C2", "#FFDFC4", "#F0C8C8", "#DEB887", "#A67358", "#6A4C3B"],
    hair: ["#5E3B28", "#000000", "#FFCC00", "#FF6600", "#663399", "#FF3366", "#CCCCCC", "#FFFFFF"],
    background: ["#E2F0FF", "#FFE2E2", "#E2FFE2", "#FFE2FF", "#FFFDE2", "#E2FFFF", "#2D3250"],
  }

  // Generate a random avatar
  const generateRandomAvatar = () => {
    const newOptions = {}
    Object.keys(optionCounts).forEach((part) => {
      newOptions[part] = Math.floor(Math.random() * optionCounts[part]) + 1
    })
    setAvatarOptions(newOptions)

    // Random colors
    const newColors = {}
    Object.keys(colorOptions).forEach((part) => {
      const randomIndex = Math.floor(Math.random() * colorOptions[part].length)
      newColors[part] = colorOptions[part][randomIndex]
    })
    setColors(newColors)

    toast({
      title: t("avatarGenerator.toast.random.title"),
      description: t("avatarGenerator.toast.random.description"),
    })
  }

  // Change a specific part of the avatar
  const changePart = (part, direction) => {
    setAvatarOptions((prev) => {
      const currentValue = prev[part]
      const maxValue = optionCounts[part]

      let newValue
      if (direction === "next") {
        newValue = currentValue === maxValue ? 1 : currentValue + 1
      } else {
        newValue = currentValue === 1 ? maxValue : currentValue - 1
      }

      return { ...prev, [part]: newValue }
    })
  }

  // Change a color
  const changeColor = (part, color) => {
    setColors((prev) => ({ ...prev, [part]: color }))
  }

  // Save avatar to localStorage
  const saveAvatar = () => {
    const avatarData = {
      options: avatarOptions,
      colors: colors,
    }

    localStorage.setItem("userAvatar", JSON.stringify(avatarData))

    toast({
      title: t("avatarGenerator.toast.save.title"),
      description: t("avatarGenerator.toast.save.description"),
    })
  }

  // Download avatar as PNG
  const downloadAvatar = async () => {
    if (avatarRef.current) {
      try {
        const canvas = await html2canvas(avatarRef.current, {
          backgroundColor: null,
        })

        const image = canvas.toDataURL("image/png")
        const link = document.createElement("a")
        link.href = image
        link.download = "collab-sphere-avatar.png"
        link.click()

        toast({
          title: t("avatarGenerator.toast.download.title"),
          description: t("avatarGenerator.toast.download.description"),
        })
      } catch (error) {
        console.error("Error downloading avatar:", error)

        toast({
          title: t("avatarGenerator.toast.error.title"),
          description: t("avatarGenerator.toast.error.description"),
          variant: "destructive",
        })
      }
    }
  }

  // Load saved avatar from localStorage on initial render
  useEffect(() => {
    const savedAvatar = localStorage.getItem("userAvatar")
    if (savedAvatar) {
      try {
        const { options, colors: savedColors } = JSON.parse(savedAvatar)
        setAvatarOptions(options)
        setColors(savedColors)
      } catch (error) {
        console.error("Error loading saved avatar:", error)
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

  return (
    <div className="container py-8">
      <motion.div
        className="max-w-3xl mx-auto text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold">{t("avatarGenerator.title")}</h1>
        <p className="mt-4 text-xl text-muted-foreground">{t("avatarGenerator.subtitle")}</p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="md:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>{t("avatarGenerator.preview.title")}</CardTitle>
              <CardDescription>{t("avatarGenerator.preview.description")}</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center items-center p-8">
              <motion.div
                ref={avatarRef}
                className="relative w-64 h-64 rounded-full overflow-hidden"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {/* Background */}
                <div className="absolute inset-0" style={{ backgroundColor: colors.background }} />

                {/* Face */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 rounded-full" style={{ backgroundColor: colors.skin }} />
                </div>

                {/* Eyes */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {avatarOptions.eyes === 1 && (
                    <div className="relative w-48 h-48">
                      <div className="absolute left-[30%] top-[40%] w-4 h-4 rounded-full bg-black"></div>
                      <div className="absolute right-[30%] top-[40%] w-4 h-4 rounded-full bg-black"></div>
                    </div>
                  )}
                  {avatarOptions.eyes === 2 && (
                    <div className="relative w-48 h-48">
                      <div className="absolute left-[30%] top-[40%] w-4 h-2 rounded-full bg-black"></div>
                      <div className="absolute right-[30%] top-[40%] w-4 h-2 rounded-full bg-black"></div>
                    </div>
                  )}
                  {avatarOptions.eyes === 3 && (
                    <div className="relative w-48 h-48">
                      <div className="absolute left-[30%] top-[40%] w-4 h-4 rounded-full bg-white border-2 border-black">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-1 h-1 rounded-full bg-black"></div>
                        </div>
                      </div>
                      <div className="absolute right-[30%] top-[40%] w-4 h-4 rounded-full bg-white border-2 border-black">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-1 h-1 rounded-full bg-black"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  {avatarOptions.eyes === 4 && (
                    <div className="relative w-48 h-48">
                      <div className="absolute left-[28%] top-[38%] w-6 h-6 rounded-full bg-white border-2 border-black">
                        <div className="absolute bottom-0 right-0">
                          <div className="w-3 h-3 rounded-full bg-black"></div>
                        </div>
                      </div>
                      <div className="absolute right-[28%] top-[38%] w-6 h-6 rounded-full bg-white border-2 border-black">
                        <div className="absolute bottom-0 left-0">
                          <div className="w-3 h-3 rounded-full bg-black"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  {avatarOptions.eyes === 5 && (
                    <div className="relative w-48 h-48">
                      <div className="absolute left-[28%] top-[40%] w-6 h-3 bg-black"></div>
                      <div className="absolute right-[28%] top-[40%] w-6 h-3 bg-black"></div>
                    </div>
                  )}
                  {avatarOptions.eyes === 6 && (
                    <div className="relative w-48 h-48">
                      <div className="absolute left-[28%] top-[38%] w-6 h-6 rounded-full bg-white border-2 border-black flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-black"></div>
                      </div>
                      <div className="absolute right-[28%] top-[38%] w-6 h-6 rounded-full bg-white border-2 border-black flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-black"></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Mouth */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {avatarOptions.mouth === 1 && (
                    <div className="relative w-48 h-48">
                      <div className="absolute left-[35%] top-[60%] w-14 h-3 rounded-full bg-black"></div>
                    </div>
                  )}
                  {avatarOptions.mouth === 2 && (
                    <div className="relative w-48 h-48">
                      <div className="absolute left-[35%] top-[60%] w-14 h-6 rounded-b-full bg-black"></div>
                    </div>
                  )}
                  {avatarOptions.mouth === 3 && (
                    <div className="relative w-48 h-48">
                      <div className="absolute left-[35%] top-[60%] w-14 h-6 rounded-t-full bg-black"></div>
                    </div>
                  )}
                  {avatarOptions.mouth === 4 && (
                    <div className="relative w-48 h-48">
                      <div className="absolute left-[35%] top-[60%] w-14 h-1 bg-black"></div>
                    </div>
                  )}
                  {avatarOptions.mouth === 5 && (
                    <div className="relative w-48 h-48">
                      <div className="absolute left-[35%] top-[58%] w-14 h-8 rounded-full bg-white border-2 border-black">
                        <div className="absolute left-[20%] top-[50%] w-8 h-1 bg-black"></div>
                      </div>
                    </div>
                  )}
                  {avatarOptions.mouth === 6 && (
                    <div className="relative w-48 h-48">
                      <div className="absolute left-[40%] top-[60%] w-8 h-8 rounded-full border-2 border-black flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full bg-black"></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Hair */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {avatarOptions.hair === 1 && (
                    <div className="relative w-64 h-64">
                      <div
                        className="absolute left-[15%] top-[10%] w-44 h-20 rounded-t-full"
                        style={{ backgroundColor: colors.hair }}
                      ></div>
                    </div>
                  )}
                  {avatarOptions.hair === 2 && (
                    <div className="relative w-64 h-64">
                      <div
                        className="absolute left-[10%] top-0 w-52 h-28 rounded-t-full"
                        style={{ backgroundColor: colors.hair }}
                      ></div>
                    </div>
                  )}
                  {avatarOptions.hair === 3 && (
                    <div className="relative w-64 h-64">
                      <div
                        className="absolute left-[5%] top-[5%] right-[5%] h-16 rounded-t-full"
                        style={{ backgroundColor: colors.hair }}
                      ></div>
                      <div
                        className="absolute left-[5%] top-[5%] w-8 h-32"
                        style={{ backgroundColor: colors.hair }}
                      ></div>
                      <div
                        className="absolute right-[5%] top-[5%] w-8 h-32"
                        style={{ backgroundColor: colors.hair }}
                      ></div>
                    </div>
                  )}
                  {avatarOptions.hair === 4 && (
                    <div className="relative w-64 h-64">
                      <div
                        className="absolute left-[15%] top-[5%] w-44 h-16 rounded-t-full"
                        style={{ backgroundColor: colors.hair }}
                      ></div>
                      <div
                        className="absolute left-[25%] top-[15%] w-6 h-10 rounded-full"
                        style={{ backgroundColor: colors.hair }}
                      ></div>
                      <div
                        className="absolute right-[25%] top-[15%] w-6 h-10 rounded-full"
                        style={{ backgroundColor: colors.hair }}
                      ></div>
                    </div>
                  )}
                  {avatarOptions.hair === 5 && (
                    <div className="relative w-64 h-64">
                      <div
                        className="absolute left-[10%] top-[5%] w-52 h-20"
                        style={{ backgroundColor: colors.hair }}
                      ></div>
                    </div>
                  )}
                  {avatarOptions.hair === 6 && (
                    <div className="relative w-64 h-64">
                      <div
                        className="absolute left-[5%] top-[5%] w-[90%] h-12 rounded-t-full"
                        style={{ backgroundColor: colors.hair }}
                      ></div>
                      <div
                        className="absolute left-[15%] top-[15%] w-8 h-8 rounded-full"
                        style={{ backgroundColor: colors.hair }}
                      ></div>
                      <div
                        className="absolute right-[15%] top-[15%] w-8 h-8 rounded-full"
                        style={{ backgroundColor: colors.hair }}
                      ></div>
                    </div>
                  )}
                  {avatarOptions.hair === 7 && (
                    <div className="relative w-64 h-64">
                      <div
                        className="absolute left-[5%] top-0 w-[90%] h-16"
                        style={{ backgroundColor: colors.hair }}
                      ></div>
                      <div
                        className="absolute left-[5%] top-[15%] w-4 h-16"
                        style={{ backgroundColor: colors.hair }}
                      ></div>
                      <div
                        className="absolute right-[5%] top-[15%] w-4 h-16"
                        style={{ backgroundColor: colors.hair }}
                      ></div>
                    </div>
                  )}
                  {avatarOptions.hair === 8 && (
                    <div className="relative w-64 h-64">
                      <div
                        className="absolute left-[10%] top-[5%] w-52 h-8 rounded-t-full"
                        style={{ backgroundColor: colors.hair }}
                      ></div>
                    </div>
                  )}
                </div>

                {/* Accessories */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {avatarOptions.accessories === 1 && <div className="relative w-64 h-64">{/* No accessories */}</div>}
                  {avatarOptions.accessories === 2 && (
                    <div className="relative w-64 h-64">
                      <div className="absolute left-[25%] top-[30%] w-32 h-8 bg-black rounded-full"></div>
                      <div className="absolute left-[30%] top-[30%] w-6 h-8 bg-transparent border-l-2 border-r-2 border-gray-300"></div>
                      <div className="absolute right-[30%] top-[30%] w-6 h-8 bg-transparent border-l-2 border-r-2 border-gray-300"></div>
                    </div>
                  )}
                  {avatarOptions.accessories === 3 && (
                    <div className="relative w-64 h-64">
                      <div className="absolute left-[25%] top-[25%] w-32 h-16 rounded-t-full border-2 border-black"></div>
                    </div>
                  )}
                  {avatarOptions.accessories === 4 && (
                    <div className="relative w-64 h-64">
                      <div className="absolute left-[20%] top-[20%] w-40 h-4 bg-red-500"></div>
                    </div>
                  )}
                  {avatarOptions.accessories === 5 && (
                    <div className="relative w-64 h-64">
                      <div className="absolute left-[30%] top-[30%] w-24 h-6 bg-blue-500 rounded-full"></div>
                      <div className="absolute left-[35%] top-[30%] w-4 h-6 bg-transparent border-l-2 border-r-2 border-gray-300"></div>
                      <div className="absolute right-[35%] top-[30%] w-4 h-6 bg-transparent border-l-2 border-r-2 border-gray-300"></div>
                    </div>
                  )}
                  {avatarOptions.accessories === 6 && (
                    <div className="relative w-64 h-64">
                      <div className="absolute left-[25%] top-[15%] w-32 h-8 bg-green-500 rounded-full"></div>
                    </div>
                  )}
                  {avatarOptions.accessories === 7 && (
                    <div className="relative w-64 h-64">
                      <div className="absolute left-[35%] top-[25%] w-20 h-20 rounded-full border-4 border-yellow-500 border-dashed"></div>
                    </div>
                  )}
                  {avatarOptions.accessories === 8 && (
                    <div className="relative w-64 h-64">
                      <div className="absolute left-[30%] top-[20%] w-24 h-6 bg-purple-500"></div>
                    </div>
                  )}
                </div>
              </motion.div>
            </CardContent>
            <CardFooter className="flex justify-center gap-4">
              <Button onClick={generateRandomAvatar}>
                <Shuffle className="mr-2 h-4 w-4" />
                {t("avatarGenerator.actions.random")}
              </Button>
              <Button onClick={saveAvatar}>
                <Save className="mr-2 h-4 w-4" />
                {t("avatarGenerator.actions.save")}
              </Button>
              <Button onClick={downloadAvatar}>
                <Download className="mr-2 h-4 w-4" />
                {t("avatarGenerator.actions.download")}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>{t("avatarGenerator.customize.title")}</CardTitle>
              <CardDescription>{t("avatarGenerator.customize.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="parts">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="parts">{t("avatarGenerator.customize.tabs.parts")}</TabsTrigger>
                  <TabsTrigger value="colors">{t("avatarGenerator.customize.tabs.colors")}</TabsTrigger>
                </TabsList>
                <TabsContent value="parts" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{t("avatarGenerator.customize.face")}</span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => changePart("face", "prev")}>
                          ←
                        </Button>
                        <Badge variant="outline">
                          {avatarOptions.face}/{optionCounts.face}
                        </Badge>
                        <Button variant="outline" size="sm" onClick={() => changePart("face", "next")}>
                          →
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{t("avatarGenerator.customize.hair")}</span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => changePart("hair", "prev")}>
                          ←
                        </Button>
                        <Badge variant="outline">
                          {avatarOptions.hair}/{optionCounts.hair}
                        </Badge>
                        <Button variant="outline" size="sm" onClick={() => changePart("hair", "next")}>
                          →
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{t("avatarGenerator.customize.eyes")}</span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => changePart("eyes", "prev")}>
                          ←
                        </Button>
                        <Badge variant="outline">
                          {avatarOptions.eyes}/{optionCounts.eyes}
                        </Badge>
                        <Button variant="outline" size="sm" onClick={() => changePart("eyes", "next")}>
                          →
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{t("avatarGenerator.customize.mouth")}</span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => changePart("mouth", "prev")}>
                          ←
                        </Button>
                        <Badge variant="outline">
                          {avatarOptions.mouth}/{optionCounts.mouth}
                        </Badge>
                        <Button variant="outline" size="sm" onClick={() => changePart("mouth", "next")}>
                          →
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{t("avatarGenerator.customize.accessories")}</span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => changePart("accessories", "prev")}>
                          ←
                        </Button>
                        <Badge variant="outline">
                          {avatarOptions.accessories}/{optionCounts.accessories}
                        </Badge>
                        <Button variant="outline" size="sm" onClick={() => changePart("accessories", "next")}>
                          →
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{t("avatarGenerator.customize.background")}</span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => changePart("background", "prev")}>
                          ←
                        </Button>
                        <Badge variant="outline">
                          {avatarOptions.background}/{optionCounts.background}
                        </Badge>
                        <Button variant="outline" size="sm" onClick={() => changePart("background", "next")}>
                          →
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="colors" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <span className="font-medium">{t("avatarGenerator.customize.skinColor")}</span>
                    <div className="flex flex-wrap gap-2">
                      {colorOptions.skin.map((color) => (
                        <button
                          key={color}
                          className={`w-8 h-8 rounded-full border-2 ${
                            colors.skin === color ? "border-primary" : "border-transparent"
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => changeColor("skin", color)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="font-medium">{t("avatarGenerator.customize.hairColor")}</span>
                    <div className="flex flex-wrap gap-2">
                      {colorOptions.hair.map((color) => (
                        <button
                          key={color}
                          className={`w-8 h-8 rounded-full border-2 ${
                            colors.hair === color ? "border-primary" : "border-transparent"
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => changeColor("hair", color)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="font-medium">{t("avatarGenerator.customize.backgroundColor")}</span>
                    <div className="flex flex-wrap gap-2">
                      {colorOptions.background.map((color) => (
                        <button
                          key={color}
                          className={`w-8 h-8 rounded-full border-2 ${
                            colors.background === color ? "border-primary" : "border-transparent"
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => changeColor("background", color)}
                        />
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">{t("avatarGenerator.customize.tip")}</p>
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
            <CardTitle>{t("avatarGenerator.features.title")}</CardTitle>
            <CardDescription>{t("avatarGenerator.features.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="text-xl">🎨</span>
                  </div>
                  <h3 className="font-medium">{t("avatarGenerator.features.feature1.title")}</h3>
                </div>
                <p className="text-muted-foreground text-sm">{t("avatarGenerator.features.feature1.description")}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="text-xl">💾</span>
                  </div>
                  <h3 className="font-medium">{t("avatarGenerator.features.feature2.title")}</h3>
                </div>
                <p className="text-muted-foreground text-sm">{t("avatarGenerator.features.feature2.description")}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="text-xl">🔄</span>
                  </div>
                  <h3 className="font-medium">{t("avatarGenerator.features.feature3.title")}</h3>
                </div>
                <p className="text-muted-foreground text-sm">{t("avatarGenerator.features.feature3.description")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
