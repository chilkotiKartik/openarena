"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type LanguageContextType = {
  language: string
  setLanguage: (language: string) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState("en")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language")
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  return <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>
}

export const useLanguage = () => useContext(LanguageContext)
