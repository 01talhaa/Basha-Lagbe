import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Chatbot from "@/components/chatbot"
import SessionProvider from "@/components/session-provider"

const geistSans = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Basha Lagbe - Find Your Perfect Home",
  description: "Discover and book apartments, studios, and rooms worldwide",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.className} flex flex-col min-h-screen`}>
        <SessionProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <Chatbot />
        </SessionProvider>
      </body>
    </html>
  )
}
