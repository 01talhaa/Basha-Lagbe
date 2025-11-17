"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation"

interface LoginAlertProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function LoginAlert({ open, onOpenChange }: LoginAlertProps) {
  const router = useRouter()

  const handleLogin = () => {
    router.push("/login")
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-xl">
            🔒 Login Required
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base pt-2">
            You need to be logged in to start a conversation with the property owner. 
            Please log in or create an account to continue.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleLogin} className="bg-primary hover:bg-primary/90">
            Go to Login
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
