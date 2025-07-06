"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSidebar } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

// Icons
import {
  Home,
  Users,
  BarChart2,
  Video,
  User,
  Search,
  Award,
  Calendar,
  MessageSquare,
  Settings,
  Headphones,
  FileText,
  ImageIcon,
} from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
  badge?: string
}

export function AppSidebar() {
  const pathname = usePathname()
  const { isOpen } = useSidebar()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const navItems: NavItem[] = [
    {
      title: "Home",
      href: "/",
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <BarChart2 className="h-5 w-5" />,
      badge: "New",
    },
    {
      title: "Project Matcher",
      href: "/project-matcher",
      icon: <Search className="h-5 w-5" />,
    },
    {
      title: "Collaboration",
      href: "/collaboration",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Matchmaking",
      href: "/matchmaking",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Live Room",
      href: "/live-room",
      icon: <Video className="h-5 w-5" />,
    },
    {
      title: "Profile",
      href: "/profile",
      icon: <User className="h-5 w-5" />,
    },
    {
      title: "Hackathon Finder",
      href: "/hackathon-finder",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      title: "Team Matcher",
      href: "/team-matcher",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Avatar Generator",
      href: "/avatar-generator",
      icon: <ImageIcon className="h-5 w-5" />,
    },
    {
      title: "Resume Builder",
      href: "/resume-builder",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "Mentors",
      href: "/mentors",
      icon: <Headphones className="h-5 w-5" />,
      badge: "New",
    },
    {
      title: "Chatbot",
      href: "/chatbot",
      icon: <MessageSquare className="h-5 w-5" />,
      badge: "AI",
    },
    {
      title: "Settings",
      href: "/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  if (!mounted) {
    return null
  }

  return (
    <div
      className={cn(
        "fixed inset-y-0 z-30 flex flex-col border-r bg-background transition-all duration-300",
        isOpen ? "w-64" : "w-[70px]",
      )}
    >
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2">
          {isOpen ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
              <Award className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">Collab-Sphere X</span>
            </motion.div>
          ) : (
            <Award className="h-6 w-6 text-primary" />
          )}
        </Link>
      </div>
      <ScrollArea className="flex-1 py-2">
        <nav className="grid gap-1 px-2">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent hover:text-accent-foreground",
              )}
            >
              {item.icon}
              {isOpen && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1">
                  {item.title}
                </motion.span>
              )}
              {isOpen && item.badge && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="ml-auto rounded-full bg-primary/20 px-2 py-0.5 text-xs font-semibold"
                >
                  {item.badge}
                </motion.span>
              )}
            </Link>
          ))}
        </nav>
      </ScrollArea>
      <div className="border-t p-2">
        <Button variant="outline" size="sm" className="w-full justify-start gap-2" asChild>
          <Link href="/profile">
            <User className="h-4 w-4" />
            {isOpen && <span>Profile</span>}
          </Link>
        </Button>
      </div>
    </div>
  )
}
