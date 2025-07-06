"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

type User = {
  id: string
  name: string
  email: string
  image?: string
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  signup: (email: string, password: string, name: string) => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  signup: async () => {},
  isLoading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Demo account
    const demoUser = {
      id: "user-1",
      name: "Demo User",
      email: email,
      image: "/placeholder.svg?height=40&width=40",
    }

    setUser(demoUser)
    localStorage.setItem("user", JSON.stringify(demoUser))
    setIsLoading(false)
  }

  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Demo account
    const demoUser = {
      id: "user-1",
      name: name,
      email: email,
      image: "/placeholder.svg?height=40&width=40",
    }

    setUser(demoUser)
    localStorage.setItem("user", JSON.stringify(demoUser))
    setIsLoading(false)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ user, login, logout, signup, isLoading }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
