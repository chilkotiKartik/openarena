"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "@/hooks/use-translation"
import { motion } from "framer-motion"
import { ArrowRight, Code, Github, Globe, MessageSquare, Send, Users } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockUsers } from "@/lib/mock-data"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"
import Editor from "@monaco-editor/react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function LiveRoom() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const [message, setMessage] = useState("")
  const [activeTab, setActiveTab] = useState("code")
  const [language, setLanguage] = useState("javascript")
  const [theme, setTheme] = useState("vs-dark")
  const [code, setCode] = useState(`// Welcome to Collab-Sphere X Live Room
// Start coding together in real-time!

function greet(name) {
  return \`Hello, \${name}! Welcome to our collaborative coding session.\`;
}

console.log(greet("Developer"));
`)

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: mockUsers[0],
      content: "I've started working on the authentication feature. Check out the code!",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 2,
      sender: mockUsers[1],
      content: "Looks good! Maybe we should add some error handling for invalid credentials?",
      timestamp: new Date(Date.now() - 2400000).toISOString(),
    },
    {
      id: 3,
      sender: mockUsers[2],
      content: "I can work on that. Also, we should implement rate limiting to prevent brute force attacks.",
      timestamp: new Date(Date.now() - 1200000).toISOString(),
    },
  ])

  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSendMessage = () => {
    if (!message.trim()) return

    const newMessage = {
      id: messages.length + 1,
      sender: mockUsers[0],
      content: message,
      timestamp: new Date().toISOString(),
    }

    setMessages([...messages, newMessage])
    setMessage("")

    // Simulate response after a delay
    setTimeout(() => {
      const responseMessage = {
        id: messages.length + 2,
        sender: mockUsers[Math.floor(Math.random() * (mockUsers.length - 1)) + 1],
        content: getRandomResponse(),
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, responseMessage])
    }, 2000)
  }

  const getRandomResponse = () => {
    const responses = [
      "That's a great idea! Let's implement it.",
      "I see what you're trying to do. Have you considered using a different approach?",
      "I'm working on a similar feature. Let's coordinate to avoid conflicts.",
      "Could you explain your implementation a bit more? I'm not sure I understand the logic.",
      "I found a bug in the previous code. Let me fix it and push the changes.",
    ]

    return responses[Math.floor(Math.random() * responses.length)]
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const handleCodeChange = (value) => {
    setCode(value)

    // Simulate collaborative editing
    if (Math.random() > 0.9) {
      const randomUser = mockUsers[Math.floor(Math.random() * (mockUsers.length - 1)) + 1]

      toast({
        title: t("liveRoom.toast.editing.title"),
        description: t("liveRoom.toast.editing.description", { name: randomUser.name }),
      })
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

  const languageOptions = [
    { value: "javascript", label: "JavaScript" },
    { value: "typescript", label: "TypeScript" },
    { value: "html", label: "HTML" },
    { value: "css", label: "CSS" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "csharp", label: "C#" },
    { value: "cpp", label: "C++" },
    { value: "go", label: "Go" },
    { value: "rust", label: "Rust" },
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
          <div className="flex items-center gap-2">
            <h1 className="text-3xl md:text-4xl font-bold">{t("liveRoom.title")}</h1>
            <Badge variant="outline" className="text-sm">
              {t("liveRoom.badge")}
            </Badge>
          </div>
          <p className="mt-2 text-xl text-muted-foreground">{t("liveRoom.subtitle")}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" />
              {t("liveRoom.github")}
            </a>
          </Button>
          <Button>{t("liveRoom.save")}</Button>
        </div>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 lg:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="lg:col-span-3">
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-2">
              <Tabs defaultValue="code" onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="code">
                    <Code className="mr-2 h-4 w-4" />
                    {t("liveRoom.tabs.code")}
                  </TabsTrigger>
                  <TabsTrigger value="chat">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    {t("liveRoom.tabs.chat")}
                  </TabsTrigger>
                </TabsList>

                <CardContent className="flex-1 p-0">
                  <TabsContent value="code" className="m-0 h-full">
                    <div className="border-b p-2 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Select value={language} onValueChange={setLanguage}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder={t("liveRoom.code.language")} />
                          </SelectTrigger>
                          <SelectContent>
                            {languageOptions.map((lang) => (
                              <SelectItem key={lang.value} value={lang.value}>
                                {lang.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select value={theme} onValueChange={setTheme}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder={t("liveRoom.code.theme")} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="vs-dark">Dark</SelectItem>
                            <SelectItem value="light">Light</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="animate-pulse">
                          <span className="mr-1 h-2 w-2 rounded-full bg-green-500"></span>
                          {t("liveRoom.code.live")}
                        </Badge>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex -space-x-2">
                                {mockUsers.slice(0, 3).map((user) => (
                                  <Avatar key={user.id} className="h-6 w-6 border-2 border-background">
                                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                ))}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{t("liveRoom.code.collaborators", { count: mockUsers.length })}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                    <div className="h-[600px]">
                      <Editor
                        height="100%"
                        language={language}
                        value={code}
                        theme={theme}
                        onChange={handleCodeChange}
                        options={{
                          minimap: { enabled: false },
                          fontSize: 14,
                          wordWrap: "on",
                          automaticLayout: true,
                        }}
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="chat" className="m-0 h-full">
                    <div className="h-[600px] flex flex-col">
                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg) => (
                          <div
                            key={msg.id}
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
                                    msg.sender.id === mockUsers[0].id
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-muted"
                                  }`}
                                >
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-medium">{msg.sender.name}</span>
                                  </div>
                                  <p>{msg.content}</p>
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
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                      <div className="p-4 border-t">
                        <div className="flex gap-2">
                          <Textarea
                            placeholder={t("liveRoom.chat.placeholder")}
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
                            <span className="sr-only">{t("liveRoom.chat.send")}</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </CardContent>
              </Tabs>
            </CardHeader>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>{t("liveRoom.participants.title")}</CardTitle>
              <CardDescription>{t("liveRoom.participants.description")}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-4">
                {mockUsers.map((user) => (
                  <div key={user.id} className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                    </div>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.role}</div>
                    </div>
                    {user.id === mockUsers[0].id && <Badge className="ml-auto">{t("liveRoom.participants.you")}</Badge>}
                  </div>
                ))}
              </div>

              <Separator className="my-6" />

              <div>
                <h3 className="font-medium mb-3">{t("liveRoom.activity.title")}</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-muted-foreground">
                      {mockUsers[1].name} {t("liveRoom.activity.editing")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                    <span className="text-muted-foreground">
                      {mockUsers[2].name} {t("liveRoom.activity.viewing")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    <span className="text-muted-foreground">
                      {mockUsers[3].name} {t("liveRoom.activity.idle")}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button className="w-full" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                {t("liveRoom.participants.invite")}
              </Button>
              <Button className="w-full" asChild>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  {t("liveRoom.participants.viewRepo")}
                </a>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div
        className="mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>{t("liveRoom.features.title")}</CardTitle>
            <CardDescription>{t("liveRoom.features.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Code className="h-4 w-4" />
                  </div>
                  <h3 className="font-medium">{t("liveRoom.features.feature1.title")}</h3>
                </div>
                <p className="text-muted-foreground text-sm">{t("liveRoom.features.feature1.description")}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <h3 className="font-medium">{t("liveRoom.features.feature2.title")}</h3>
                </div>
                <p className="text-muted-foreground text-sm">{t("liveRoom.features.feature2.description")}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Globe className="h-4 w-4" />
                  </div>
                  <h3 className="font-medium">{t("liveRoom.features.feature3.title")}</h3>
                </div>
                <p className="text-muted-foreground text-sm">{t("liveRoom.features.feature3.description")}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/project-matcher">
                {t("liveRoom.features.cta")} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
