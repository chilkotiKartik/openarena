"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useTranslation } from "@/hooks/use-translation"
import { motion } from "framer-motion"
import { ArrowRight, Globe, MessageSquare, Send } from "lucide-react"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { mockUsers } from "@/lib/mock-data"
import { useLanguage } from "@/hooks/use-language"

export default function Collaboration() {
  const { t } = useTranslation()
  const { language, setLanguage, languages = [] } = useLanguage()
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: mockUsers[0],
      content: "Hello everyone! I'm excited to collaborate on this project.",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      language: "english",
    },
    {
      id: 2,
      sender: mockUsers[1],
      content: "नमस्ते! मैं इस प्रोजेक्ट पर काम करने के लिए उत्साहित हूँ।",
      originalContent: "Hello! I'm excited to work on this project.",
      timestamp: new Date(Date.now() - 2400000).toISOString(),
      language: "hindi",
    },
    {
      id: 3,
      sender: mockUsers[2],
      content: "¡Hola a todos! Tengo algunas ideas para la interfaz de usuario.",
      originalContent: "Hello everyone! I have some ideas for the user interface.",
      timestamp: new Date(Date.now() - 1200000).toISOString(),
      language: "spanish",
    },
  ])

  const handleSendMessage = () => {
    if (!message.trim()) return

    const newMessage = {
      id: messages.length + 1,
      sender: mockUsers[0],
      content: message,
      timestamp: new Date().toISOString(),
      language: language,
    }

    setMessages([...messages, newMessage])
    setMessage("")

    // Simulate response after a delay
    setTimeout(() => {
      const responseMessage = {
        id: messages.length + 2,
        sender: mockUsers[Math.floor(Math.random() * (mockUsers.length - 1)) + 1],
        content: getRandomResponse(language),
        originalContent: "That's a great idea! Let's discuss it further.",
        timestamp: new Date().toISOString(),
        language:
          languages && languages.length > 0 ? languages[Math.floor(Math.random() * languages.length)].value : "english",
      }

      setMessages((prev) => [...prev, responseMessage])
    }, 2000)
  }

  const getRandomResponse = (lang: string) => {
    const responses = {
      english: [
        "That's a great idea! Let's discuss it further.",
        "I agree with your approach. How should we implement it?",
        "Interesting perspective! Have you considered alternative solutions?",
        "Thanks for sharing. I'll look into this and get back to you.",
      ],
      hindi: [
        "यह एक अच्छा विचार है! इस पर और चर्चा करें।",
        "मैं आपके दृष्टिकोण से सहमत हूं। हमें इसे कैसे लागू करना चाहिए?",
        "दिलचस्प परिप्रेक्ष्य! क्या आपने वैकल्पिक समाधानों पर विचार किया है?",
        "साझा करने के लिए धन्यवाद। मैं इसकी जांच करूंगा और आपको वापस बताऊंगा।",
      ],
      spanish: [
        "¡Es una gran idea! Discutámoslo más a fondo.",
        "Estoy de acuerdo con tu enfoque. ¿Cómo deberíamos implementarlo?",
        "¡Perspectiva interesante! ¿Has considerado soluciones alternativas?",
        "Gracias por compartir. Investigaré esto y te responderé.",
      ],
      tamil: [
        "அது ஒரு சிறந்த யோசனை! அதைப் பற்றி மேலும் விவாதிப்போம்.",
        "உங்கள் அணுகுமுறையை நான் ஒப்புக்கொள்கிறேன். நாம் எப்படி செயல்படுத்துவது?",
        "சுவாரஸ்யமான கண்ணோட்டம்! மாற்று தீர்வுகளை நீங்கள் பரிசீலித்துள்ளீர்களா?",
        "பகிர்ந்தமைக்கு நன்றி. நான் இதைப் பார்த்து உங்களுக்குத் தெரிவிப்பேன்.",
      ],
      french: [
        "C'est une excellente idée ! Discutons-en davantage.",
        "Je suis d'accord avec votre approche. Comment devrions-nous la mettre en œuvre ?",
        "Perspective intéressante ! Avez-vous envisagé des solutions alternatives ?",
        "Merci pour le partage. Je vais examiner cela et vous revenir.",
      ],
    }

    const availableResponses = responses[lang as keyof typeof responses] || responses.english
    return availableResponses[Math.floor(Math.random() * availableResponses.length)]
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
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
        <h1 className="text-3xl md:text-4xl font-bold">{t("collaboration.title")}</h1>
        <p className="mt-4 text-xl text-muted-foreground">{t("collaboration.subtitle")}</p>
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
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>{t("collaboration.chat.title")}</CardTitle>
                  <CardDescription>{t("collaboration.chat.description")}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder={t("collaboration.language.select")} />
                    </SelectTrigger>
                    <SelectContent>
                      {languages &&
                        languages.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value}>
                            {lang.label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
              <div className="h-[500px] overflow-y-auto space-y-4 p-2">
                {messages.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className={`flex ${msg.sender.id === mockUsers[0].id ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex gap-2 max-w-[80%] ${msg.sender.id === mockUsers[0].id ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={msg.sender.avatar || "/placeholder.svg"} alt={msg.sender.name} />
                        <AvatarFallback>{msg.sender.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div
                          className={`rounded-lg p-3 ${
                            msg.sender.id === mockUsers[0].id ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium">{msg.sender.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {(languages && languages.find((l) => l.value === msg.language)?.label) || msg.language}
                            </Badge>
                          </div>
                          <p>{msg.content}</p>
                          {msg.originalContent && msg.language !== language && (
                            <div className="mt-2 pt-2 border-t border-border/30 text-sm opacity-80">
                              <p className="italic">
                                {t("collaboration.chat.translated")}: {msg.originalContent}
                              </p>
                            </div>
                          )}
                        </div>
                        <div
                          className={`text-xs text-muted-foreground mt-1 ${
                            msg.sender.id === mockUsers[0].id ? "text-right" : "text-left"
                          }`}
                        >
                          {formatTime(msg.timestamp)}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex w-full gap-2">
                <Textarea
                  placeholder={t("collaboration.chat.placeholder")}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                />
                <Button onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                  <span className="sr-only">{t("collaboration.chat.send")}</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>{t("collaboration.participants.title")}</CardTitle>
              <CardDescription>{t("collaboration.participants.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockUsers &&
                  mockUsers.map((user) => (
                    <div key={user.id} className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.role}</div>
                      </div>
                      <Badge variant="outline" className="ml-auto">
                        {(languages && languages.find((l) => l.value === user.language)?.label) || user.language}
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
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
            <CardTitle>{t("collaboration.features.title")}</CardTitle>
            <CardDescription>{t("collaboration.features.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="translation">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="translation">{t("collaboration.features.tabs.translation")}</TabsTrigger>
                <TabsTrigger value="realtime">{t("collaboration.features.tabs.realtime")}</TabsTrigger>
                <TabsTrigger value="ai">{t("collaboration.features.tabs.ai")}</TabsTrigger>
              </TabsList>
              <TabsContent value="translation" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">{t("collaboration.features.translation.title")}</h3>
                    <p className="text-muted-foreground mb-4">{t("collaboration.features.translation.description")}</p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <Badge variant="outline" className="h-6 w-6 rounded-full p-0 flex items-center justify-center">
                          1
                        </Badge>
                        <span>{t("collaboration.features.translation.point1")}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge variant="outline" className="h-6 w-6 rounded-full p-0 flex items-center justify-center">
                          2
                        </Badge>
                        <span>{t("collaboration.features.translation.point2")}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge variant="outline" className="h-6 w-6 rounded-full p-0 flex items-center justify-center">
                          3
                        </Badge>
                        <span>{t("collaboration.features.translation.point3")}</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-6 flex items-center justify-center">
                    <div className="text-center">
                      <Globe className="h-16 w-16 mx-auto mb-4 text-primary" />
                      <h4 className="text-lg font-medium">{t("collaboration.features.translation.supported")}</h4>
                      <div className="flex flex-wrap gap-2 justify-center mt-4">
                        {languages &&
                          languages.map((lang) => (
                            <Badge key={lang.value} variant="secondary">
                              {lang.label}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="realtime" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">{t("collaboration.features.realtime.title")}</h3>
                    <p className="text-muted-foreground mb-4">{t("collaboration.features.realtime.description")}</p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <Badge variant="outline" className="h-6 w-6 rounded-full p-0 flex items-center justify-center">
                          1
                        </Badge>
                        <span>{t("collaboration.features.realtime.point1")}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge variant="outline" className="h-6 w-6 rounded-full p-0 flex items-center justify-center">
                          2
                        </Badge>
                        <span>{t("collaboration.features.realtime.point2")}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge variant="outline" className="h-6 w-6 rounded-full p-0 flex items-center justify-center">
                          3
                        </Badge>
                        <span>{t("collaboration.features.realtime.point3")}</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-6 flex items-center justify-center">
                    <div className="text-center">
                      <MessageSquare className="h-16 w-16 mx-auto mb-4 text-primary" />
                      <h4 className="text-lg font-medium">{t("collaboration.features.realtime.features")}</h4>
                      <div className="flex flex-wrap gap-2 justify-center mt-4">
                        <Badge variant="secondary">{t("collaboration.features.realtime.typing")}</Badge>
                        <Badge variant="secondary">{t("collaboration.features.realtime.presence")}</Badge>
                        <Badge variant="secondary">{t("collaboration.features.realtime.notifications")}</Badge>
                        <Badge variant="secondary">{t("collaboration.features.realtime.sync")}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="ai" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">{t("collaboration.features.ai.title")}</h3>
                    <p className="text-muted-foreground mb-4">{t("collaboration.features.ai.description")}</p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <Badge variant="outline" className="h-6 w-6 rounded-full p-0 flex items-center justify-center">
                          1
                        </Badge>
                        <span>{t("collaboration.features.ai.point1")}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge variant="outline" className="h-6 w-6 rounded-full p-0 flex items-center justify-center">
                          2
                        </Badge>
                        <span>{t("collaboration.features.ai.point2")}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge variant="outline" className="h-6 w-6 rounded-full p-0 flex items-center justify-center">
                          3
                        </Badge>
                        <span>{t("collaboration.features.ai.point3")}</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-6 flex items-center justify-center">
                    <div className="text-center">
                      <div className="h-16 w-16 mx-auto mb-4 text-primary flex items-center justify-center">
                        <span className="text-4xl">🤖</span>
                      </div>
                      <h4 className="text-lg font-medium">{t("collaboration.features.ai.capabilities")}</h4>
                      <div className="flex flex-wrap gap-2 justify-center mt-4">
                        <Badge variant="secondary">{t("collaboration.features.ai.summarization")}</Badge>
                        <Badge variant="secondary">{t("collaboration.features.ai.translation")}</Badge>
                        <Badge variant="secondary">{t("collaboration.features.ai.suggestions")}</Badge>
                        <Badge variant="secondary">{t("collaboration.features.ai.moderation")}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/live-room">
                {t("collaboration.features.cta")} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
