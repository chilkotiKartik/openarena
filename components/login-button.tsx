"use client"

import { Button, type ButtonProps } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export const LoginButton = ({ children, ...props }: ButtonProps) => {
  const { toast } = useToast()
  const router = useRouter()

  const handleLogin = async () => {
    // Simulate login
    toast({
      title: "Login",
      description: "Simulating login...",
    })

    // Redirect to dashboard after successful login
    router.push("/dashboard")
  }

  return (
    <Button onClick={handleLogin} {...props}>
      {children}
    </Button>
  )
}
