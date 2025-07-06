import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Navbar } from "@/components/navbar"
import { Toaster } from "@/components/ui/toaster"
import { LanguageProvider } from "@/components/language-provider"
import { AuthProvider } from "@/components/auth-provider"
import { Suspense } from "react"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Collab-Sphere X | Collaborative Platform for Developers",
  description: "A gamified, multilingual collaboration platform for student open-source enthusiasts and developers",
  keywords: ["collaboration", "open source", "developers", "students", "hackathon", "coding", "projects"],
  authors: [{ name: "Collab-Sphere Team" }],
  creator: "Collab-Sphere X",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://collab-sphere-x.vercel.app/",
    title: "Collab-Sphere X | Collaborative Platform for Developers",
    description: "A gamified, multilingual collaboration platform for student open-source enthusiasts and developers",
    siteName: "Collab-Sphere X",
  },
  twitter: {
    card: "summary_large_image",
    title: "Collab-Sphere X | Collaborative Platform for Developers",
    description: "A gamified, multilingual collaboration platform for student open-source enthusiasts and developers",
    creator: "@collabspherex",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <LanguageProvider>
              <SidebarProvider>
                <Suspense>
                  <div className="flex min-h-screen">
                    <AppSidebar />
                    <div className="flex-1 flex flex-col">
                      <Navbar />
                      <main className="flex-1 overflow-hidden">{children}</main>
                    </div>
                  </div>
                  <Toaster />
                </Suspense>
              </SidebarProvider>
            </LanguageProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
