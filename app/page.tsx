"use client"

import { Button } from "@/components/ui/button"
import { useTranslation } from "@/hooks/use-translation"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, Code, Github, Globe, Trophy, Users, Zap, Sparkles, Rocket } from "lucide-react"
import Link from "next/link"
import { TestimonialCard } from "@/components/testimonial-card"
import { useTheme } from "next-themes"
import { useEffect, useRef, useState } from "react"
import { TypewriterEffect } from "@/components/ui/typewriter-effect"
import { SparklesCore } from "@/components/ui/sparkles"
import { BackgroundBeams } from "@/components/ui/background-beams"
import { HeroParallax } from "@/components/ui/hero-parallax"
import { LoginButton } from "@/components/login-button"
import { useAuth } from "@/components/auth-provider"

export default function Home() {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { user } = useAuth()
  const [mounted, setMounted] = useState(false)
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  useEffect(() => {
    setMounted(true)
  }, [])

  const words = [
    {
      text: "Build",
    },
    {
      text: "together.",
      className: "text-primary",
    },
    {
      text: "Learn",
    },
    {
      text: "together.",
      className: "text-primary",
    },
    {
      text: "Grow",
    },
    {
      text: "together.",
      className: "text-primary",
    },
  ]

  const features = [
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Global Collaboration",
      description: "Connect with developers from around the world with real-time translation in over 10 languages.",
      color: "from-blue-500 to-cyan-400",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Smart Matchmaking",
      description: "Find the perfect project partners based on skills, interests, and compatibility scores.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <Trophy className="h-8 w-8" />,
      title: "Gamified Learning",
      description: "Earn XP, unlock achievements, and climb leaderboards as you contribute to open source.",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: <Code className="h-8 w-8" />,
      title: "Live Code Collaboration",
      description: "Code together in real-time with integrated IDE, version control, and code reviews.",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "AI-Powered Assistance",
      description: "Get intelligent suggestions, code explanations, and learning resources tailored to your needs.",
      color: "from-violet-600 to-indigo-600",
    },
    {
      icon: <Github className="h-8 w-8" />,
      title: "Open Source First",
      description: "Built for open source contributors with GitHub integration and contribution tracking.",
      color: "from-gray-700 to-gray-900",
    },
  ]

  const testimonials = [
    {
      name: "Alex Johnson",
      role: "Computer Science Student",
      content:
        "Collab-Sphere X transformed how I contribute to open source. The matchmaking feature helped me find the perfect project for my skills!",
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 5,
    },
    {
      name: "Priya Sharma",
      role: "Open Source Contributor",
      content:
        "The multilingual features broke down barriers for me. Now I collaborate with developers worldwide without language limitations.",
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 5,
    },
    {
      name: "Miguel Rodriguez",
      role: "Junior Developer",
      content:
        "The gamification elements make contributing fun! I've learned so much while earning badges and climbing the leaderboard.",
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 4,
    },
  ]

  const stats = [
    { value: "10K+", label: "Active Users" },
    { value: "5K+", label: "Projects" },
    { value: "120+", label: "Countries" },
    { value: "1M+", label: "Contributions" },
  ]

  const parallaxProjects = [
    {
      title: "Code Arena",
      link: "/code-arena",
      thumbnail: "/placeholder.svg?height=600&width=800",
    },
    {
      title: "Hackathon Finder",
      link: "/hackathon-finder",
      thumbnail: "/placeholder.svg?height=600&width=800",
    },
    {
      title: "Team Matcher",
      link: "/team-matcher",
      thumbnail: "/placeholder.svg?height=600&width=800",
    },
    {
      title: "Live Collaboration",
      link: "/live-room",
      thumbnail: "/placeholder.svg?height=600&width=800",
    },
    {
      title: "Resume Builder",
      link: "/resume-builder",
      thumbnail: "/placeholder.svg?height=600&width=800",
    },
    {
      title: "Avatar Creator",
      link: "/avatar-generator",
      thumbnail: "/placeholder.svg?height=600&width=800",
    },
  ]

  if (!mounted) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden" ref={ref}>
        <BackgroundBeams className="opacity-20" />

        <motion.div style={{ y, opacity }} className="container relative z-10">
          <div className="flex flex-col items-center text-center mb-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse-shadow"></div>
                <div className="relative w-full h-full flex items-center justify-center">
                  <Sparkles className="h-12 w-12 text-primary" />
                </div>
              </div>

              <div className="mb-8">
                <TypewriterEffect words={words} className="text-4xl md:text-6xl font-bold" />
              </div>

              <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
                The next-generation platform for open source collaboration, connecting developers worldwide through
                code, community, and creativity.
              </p>
            </motion.div>

            <motion.div
              className="flex flex-wrap gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              {user ? (
                <Button size="lg" className="rounded-full" asChild>
                  <Link href="/dashboard">
                    Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <LoginButton size="lg" className="rounded-full">
                  Get Started <Rocket className="ml-2 h-4 w-4" />
                </LoginButton>
              )}
              <Button size="lg" variant="outline" className="rounded-full" asChild>
                <Link href="/explore">Explore Projects</Link>
              </Button>
            </motion.div>
          </div>

          <motion.div
            className="mt-12 relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <div className="terminal mx-auto max-w-3xl">
              <div className="terminal-header">
                <div className="terminal-dot terminal-dot-red"></div>
                <div className="terminal-dot terminal-dot-yellow"></div>
                <div className="terminal-dot terminal-dot-green"></div>
              </div>
              <div className="terminal-body">
                <div className="terminal-line">
                  <span className="terminal-prompt">$</span>
                  <span className="typing">npm install @collab-sphere/x</span>
                </div>
                <div className="terminal-line">
                  <span className="terminal-prompt">$</span>
                  <span>{"Connecting to global developer network..."}</span>
                </div>
                <div className="terminal-line">
                  <span className="terminal-prompt">$</span>
                  <span>{"Finding perfect project matches..."}</span>
                </div>
                <div className="terminal-line">
                  <span className="terminal-prompt">$</span>
                  <span className="text-yellow-400">{"Ready to collaborate! Let's build something amazing."}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary/5 relative overflow-hidden">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <h3 className="text-4xl font-bold gradient-text">{stat.value}</h3>
                <p className="text-muted-foreground mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
        <SparklesCore
          id="tsparticles"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full absolute inset-0 opacity-50"
          particleColor="#8b5cf6"
        />
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Supercharge Your Collaboration</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to find projects, connect with developers, and build amazing things together.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="hover-card h-full bg-card rounded-xl border p-6 relative overflow-hidden group">
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                  ></div>
                  <div className="mb-4 p-2 rounded-full bg-primary/10 w-fit">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Showcase */}
      <section className="py-24 bg-muted/30">
        <div className="container mb-12">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Discover Our Platform</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore the powerful tools and features that make Collab-Sphere X the ultimate developer collaboration
              platform.
            </p>
          </motion.div>
        </div>

        <HeroParallax products={parallaxProjects} />
      </section>

      {/* Testimonials Section */}
      <section className="py-24">
        <div className="container">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Loved by Developers</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of developers who are already collaborating and growing with Collab-Sphere X.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <TestimonialCard
                  name={testimonial.name}
                  role={testimonial.role}
                  content={testimonial.content}
                  avatar={testimonial.avatar}
                  rating={testimonial.rating}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-purple-900/30 z-0" />
        <BackgroundBeams className="opacity-20" />

        <div className="container relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Ready to Transform Your Collaboration?</h2>
            <p className="mt-4 text-xl text-muted-foreground mb-8">
              Join our community of developers and start building amazing projects together today.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              {user ? (
                <Button size="lg" className="rounded-full" asChild>
                  <Link href="/dashboard">
                    Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <LoginButton size="lg" className="rounded-full">
                  Get Started <Rocket className="ml-2 h-4 w-4" />
                </LoginButton>
              )}
              <Button size="lg" variant="outline" className="rounded-full" asChild>
                <Link href="/explore">Explore Projects</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-muted/30 border-t">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Platform</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/project-matcher"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Project Matcher
                  </Link>
                </li>
                <li>
                  <Link href="/matchmaking" className="text-muted-foreground hover:text-foreground transition-colors">
                    Matchmaking
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/code-arena" className="text-muted-foreground hover:text-foreground transition-colors">
                    Code Arena
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/learning-tracks"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Learning Tracks
                  </Link>
                </li>
                <li>
                  <Link href="/discussions" className="text-muted-foreground hover:text-foreground transition-colors">
                    Discussions
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="text-muted-foreground hover:text-foreground transition-colors">
                    Documentation
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-muted-foreground hover:text-foreground transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/press" className="text-muted-foreground hover:text-foreground transition-colors">
                    Press
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="text-muted-foreground hover:text-foreground transition-colors">
                    Cookies
                  </Link>
                </li>
                <li>
                  <Link href="/licenses" className="text-muted-foreground hover:text-foreground transition-colors">
                    Licenses
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center">
                <Sparkles className="h-6 w-6 text-primary mr-2" />
                <p className="text-muted-foreground">
                  &copy; {new Date().getFullYear()} Collab-Sphere X. All rights reserved.
                </p>
              </div>
              <div className="flex space-x-4 mt-4 md:mt-0">
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d={
                        "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      }
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d={
                        "M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      }
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d={
                        "M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"
                      }
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
