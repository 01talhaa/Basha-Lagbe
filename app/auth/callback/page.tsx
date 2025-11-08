"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

export default function AuthCallbackPage() {
  const router = useRouter()
  const { data: session, status, update } = useSession()
  const [isProcessing, setIsProcessing] = useState(true)

  useEffect(() => {
    const handleCallback = async () => {
      if (status === "loading") return

      if (status === "unauthenticated") {
        // Not authenticated, redirect to login
        router.push("/login")
        return
      }

      if (status === "authenticated" && session) {
        try {
          // Check if there's a pending role from signup
          const pendingRole = localStorage.getItem("pendingRole")
          
          if (pendingRole && (pendingRole === "renter" || pendingRole === "owner")) {
            console.log("Updating user role to:", pendingRole)
            
            // Update user role in database
            const response = await fetch("/api/auth/update-role", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ role: pendingRole }),
            })

            if (response.ok) {
              console.log("Role updated successfully in database")
              
              // Clear the pending role
              localStorage.removeItem("pendingRole")
              
              // Force session update to get the new role
              await update()
              
              // Wait a bit for session to update
              await new Promise(resolve => setTimeout(resolve, 500))
              
              // Redirect based on the role
              const redirectUrl = pendingRole === "owner" ? "/host/listings" : "/dashboard"
              console.log("Redirecting to:", redirectUrl)
              router.push(redirectUrl)
            } else {
              const errorData = await response.json()
              console.error("Failed to update role:", errorData)
              // If update failed, use session role
              const redirectUrl = session.user?.role === "owner" ? "/host/listings" : "/dashboard"
              router.push(redirectUrl)
            }
          } else {
            console.log("No pending role, using session role:", session.user?.role)
            // No pending role, use session role for redirect
            const redirectUrl = session.user?.role === "owner" ? "/host/listings" : "/dashboard"
            router.push(redirectUrl)
          }
        } catch (error) {
          console.error("Callback error:", error)
          // Fallback redirect
          router.push("/dashboard")
        } finally {
          setIsProcessing(false)
        }
      }
    }

    handleCallback()
  }, [status, session, router, update])

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-neutral-900 font-semibold mb-2">Setting up your account...</p>
        <p className="text-neutral-600 text-sm">Please wait while we complete the process</p>
      </div>
    </div>
  )
}
