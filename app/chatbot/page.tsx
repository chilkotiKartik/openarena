"use client"

import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Send, Bot, User, Sparkles, Info, ThumbsUp, ThumbsDown, Copy, Bookmark } from "lucide-react"

// Mock data for chatbot conversations
const mockConversations = [
  {
    id: "chat-1",
    title: "Project Recommendations",
    lastMessage: "Here are some project ideas for your skill level...",
    timestamp: "2 hours ago",
    unread: true,
  },
  {
    id: "chat-2",
    title: "Learning Path: Full Stack",
    lastMessage: "Next, you should focus on learning about databases...",
    timestamp: "Yesterday",
    unread: false,
  },
  {
    id: "chat-3",
    title: "Debugging Help",
    lastMessage: "The error in your code might be related to...",
    timestamp: "3 days ago",
    unread: false,
  },
  {
    id: "chat-4",
    title: "Career Advice",
    lastMessage: "For junior developer positions, I recommend...",
    timestamp: "1 week ago",
    unread: false,
  },
]

// Mock data for a conversation
const initialMessages = [
  {
    id: 1,
    role: "bot",
    content:
      "👋 Hello! I'm your Collab-Sphere X assistant. I can help you find projects, connect with collaborators, learn new skills, or answer questions about our platform. What would you like help with today?",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
]

// Mock responses based on user input
const mockResponses = {
  project:
    "I'd be happy to help you find a project! Based on your profile, I see you're interested in web development and have experience with React. Here are some project suggestions:\n\n1. **Community Forum** - A discussion platform with real-time updates\n2. **Portfolio Generator** - Help users create professional portfolios\n3. **Learning Path Tracker** - Track progress through learning resources\n\nWould you like more details about any of these?",

  team: "Looking for teammates? Great! I can help you find collaborators based on your project needs. To get started, could you tell me:\n\n- What kind of project are you working on?\n- What skills are you looking for?\n- What's your preferred collaboration schedule?\n\nOnce I have this information, I can recommend potential teammates from our community.",

  learn:
    "Interested in learning something new? That's great! Based on your profile, here are some learning paths that might interest you:\n\n1. **Advanced React Patterns** - Learn context, hooks, and performance optimization\n2. **Backend Development with Node.js** - Build APIs and server-side applications\n3. **Cloud Deployment** - Learn to deploy applications on AWS or Vercel\n\nWhich area would you like to explore?",

  help: "I'm here to help! Here are some things I can assist you with:\n\n- Finding projects that match your interests and skills\n- Connecting with potential collaborators\n- Recommending learning resources\n- Explaining platform features\n- Providing coding tips and debugging help\n\nJust let me know what you need!",

  feature:
    "Collab-Sphere X has many features to enhance your collaboration experience:\n\n- **Project Matcher**: Find open-source projects that match your skills\n- **Team Finder**: Connect with collaborators who complement your abilities\n- **Live Rooms**: Real-time collaboration spaces with video, chat, and code sharing\n- **Skill Tracking**: Monitor your progress and get personalized recommendations\n- **Hackathon Finder**: Discover upcoming hackathons and form teams\n\nWhich feature would you like to know more about?",

  default:
    "I'm not quite sure how to help with that. Could you provide more details or rephrase your question? I'm here to assist with finding projects, connecting with teammates, learning resources, or explaining platform features.",
}

export default function ChatbotPage() {
  const [activeChat, setActiveChat] = useState("new")
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState("")
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Simulate bot thinking
    setTimeout(() => {
      // Generate response based on keywords in user input
      let responseContent = mockResponses.default

      const lowerInput = input.toLowerCase()
      if (lowerInput.includes("project") || lowerInput.includes("idea")) {
        responseContent = mockResponses.project
      } else if (lowerInput.includes("team") || lowerInput.includes("collaborate") || lowerInput.includes("partner")) {
        responseContent = mockResponses.team
      } else if (lowerInput.includes("learn") || lowerInput.includes("study") || lowerInput.includes("tutorial")) {
        responseContent = mockResponses.learn
      } else if (lowerInput.includes("help") || lowerInput.includes("support") || lowerInput.includes("assist")) {
        responseContent = mockResponses.help
      } else if (
        lowerInput.includes("feature") ||
        lowerInput.includes("function") ||
        lowerInput.includes("what can you do")
      ) {
        responseContent = mockResponses.feature
      }

      const botMessage = {
        id: messages.length + 2,
        role: "bot",
        content: responseContent,
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, botMessage])
    }, 1000)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[calc(100vh-10rem)]">
        {/* Sidebar */}
        <div className="md:col-span-1 border rounded-lg overflow-hidden">
          <div className="p-4 border-b bg-background">
            <h2 className="font-semibold">Conversations</h2>
          </div>
          <ScrollArea className="h-[calc(100%-4rem)]">
            <div className="p-2">
              <Button
                variant={activeChat === "new" ? "default" : "ghost"}
                className="w-full justify-start mb-2"
                onClick={() => {
                  setActiveChat("new")
                  setMessages(initialMessages)
                }}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                New Conversation
              </Button>

              {mockConversations.map((chat) => (
                <Button
                  key={chat.id}
                  variant={activeChat === chat.id ? "default" : "ghost"}
                  className="w-full justify-start mb-1 relative"
                  onClick={() => setActiveChat(chat.id)}
                >
                  <div className="flex flex-col items-start text-left">
                    <div className="flex items-center">
                      <Bot className="h-4 w-4 mr-2" />
                      <span>{chat.title}</span>
                    </div>
                    <span className="text-xs text-muted-foreground truncate w-full">{chat.lastMessage}</span>
                  </div>
                  {chat.unread && <Badge className="absolute right-2 top-2 h-2 w-2 p-0 bg-primary" />}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="md:col-span-3 border rounded-lg flex flex-col overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center bg-background">
            <div>
              <h2 className="font-semibold">
                {activeChat === "new"
                  ? "New Conversation"
                  : mockConversations.find((c) => c.id === activeChat)?.title || "Chat"}
              </h2>
              <p className="text-xs text-muted-foreground">AI assistant trained on Collab-Sphere X data</p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon">
                <Info className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Bookmark className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                    <Avatar className={message.role === "bot" ? "bg-primary/10 text-primary" : "bg-muted"}>
                      {message.role === "bot" ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
                      <AvatarFallback>{message.role === "bot" ? "B" : "U"}</AvatarFallback>
                    </Avatar>

                    <div>
                      <div
                        className={`rounded-lg p-3 ${
                          message.role === "bot" ? "bg-muted text-foreground" : "bg-primary text-primary-foreground"
                        }`}
                      >
                        <div className="whitespace-pre-line">{message.content}</div>
                      </div>
                      <div className="flex items-center mt-1 gap-2">
                        <span className="text-xs text-muted-foreground">{formatTimestamp(message.timestamp)}</span>

                        {message.role === "bot" && (
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <ThumbsUp className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <ThumbsDown className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1"
              />
              <Button onClick={handleSend} disabled={!input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-2 text-xs text-center text-muted-foreground">
              AI responses are generated based on platform data and may not always be accurate.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
