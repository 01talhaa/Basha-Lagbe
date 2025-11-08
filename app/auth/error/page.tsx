"use client"

import { useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const error = searchParams.get("error")

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "Configuration":
        return "There is a problem with the server configuration."
      case "AccessDenied":
        return "You do not have permission to sign in."
      case "Verification":
        return "The verification token has expired or has already been used."
      case "OAuthSignin":
        return "Error in constructing an authorization URL."
      case "OAuthCallback":
        return "Error in handling the response from the OAuth provider."
      case "OAuthCreateAccount":
        return "Could not create OAuth provider user in the database."
      case "EmailCreateAccount":
        return "Could not create email provider user in the database."
      case "Callback":
        return "Error in the OAuth callback handler route."
      case "OAuthAccountNotLinked":
        return "The email on the account is already linked, but not with this OAuth account."
      case "EmailSignin":
        return "Sending the e-mail with the verification token failed."
      case "CredentialsSignin":
        return "The credentials you provided are incorrect."
      case "SessionRequired":
        return "Please sign in to access this page."
      default:
        return "An error occurred during authentication. Please try again."
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Error Icon */}
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-center mb-3 text-neutral-900">
            Authentication Error
          </h1>

          <p className="text-neutral-600 text-center mb-6">
            {getErrorMessage(error)}
          </p>

          {error && (
            <div className="mb-6 p-3 bg-neutral-100 rounded-lg">
              <p className="text-xs text-neutral-500 text-center">
                Error Code: <span className="font-mono font-semibold">{error}</span>
              </p>
            </div>
          )}

          <div className="space-y-3">
            <Link
              href="/login"
              className="block w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-semibold text-center transition-colors"
            >
              Try Login Again
            </Link>
            <Link
              href="/signup"
              className="block w-full py-3 bg-neutral-200 hover:bg-neutral-300 text-neutral-900 rounded-lg font-semibold text-center transition-colors"
            >
              Create New Account
            </Link>
            <Link
              href="/"
              className="block w-full py-3 text-neutral-600 hover:text-primary text-center font-medium transition-colors"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
