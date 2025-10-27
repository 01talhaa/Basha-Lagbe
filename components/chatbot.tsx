"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { searchListings } from "@/lib/api-utils"
import type { Listing } from "@/data/types"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm your ApartmentHub assistant. I can help you find the perfect apartment. What are you looking for?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const parseUserQuery = async (query: string) => {
    // Simple NLP to extract search parameters
    const lowerQuery = query.toLowerCase()

    const filters: any = {}

    // Extract location
    const cities = ["new york", "los angeles", "miami", "chicago", "san francisco"]
    for (const city of cities) {
      if (lowerQuery.includes(city)) {
        filters.location = city
        break
      }
    }

    // Extract price range
    const priceMatch = query.match(/\$?(\d+)\s*-\s*\$?(\d+)/)
    if (priceMatch) {
      filters.priceMin = Number.parseInt(priceMatch[1])
      filters.priceMax = Number.parseInt(priceMatch[2])
    } else {
      const singlePrice = query.match(/under\s*\$?(\d+)|less than\s*\$?(\d+)/)
      if (singlePrice) {
        filters.priceMax = Number.parseInt(singlePrice[1] || singlePrice[2])
      }
    }

    // Extract bedrooms
    const bedroomMatch = query.match(/(\d+)\s*-?\s*bedroom/)
    if (bedroomMatch) {
      filters.bedrooms = Number.parseInt(bedroomMatch[1])
    }

    // Extract property type
    if (lowerQuery.includes("studio")) filters.propertyType = ["studio"]
    if (lowerQuery.includes("house")) filters.propertyType = ["house"]
    if (lowerQuery.includes("apartment")) filters.propertyType = ["apartment"]

    return filters
  }

  const generateBotResponse = (listings: Listing[], query: string): string => {
    if (listings.length === 0) {
      return "I couldn't find any apartments matching your criteria. Would you like to try different filters? For example, you could search for a different price range or location."
    }

    if (listings.length === 1) {
      const listing = listings[0]
      return `Great! I found a perfect match for you: "${listing.title}" in ${listing.location.city}. It's a ${listing.bedrooms}-bedroom apartment priced at $${listing.pricePerNight}/night with a rating of ${listing.rating}⭐. Would you like to see more details?`
    }

    return `Excellent! I found ${listings.length} apartments that match your criteria. The prices range from $${Math.min(...listings.map((l) => l.pricePerNight))}/night to $${Math.max(...listings.map((l) => l.pricePerNight))}/night. Would you like me to show you the top-rated options or the most affordable ones?`
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      // Parse user query and search
      const filters = await parseUserQuery(input)
      const results = await searchListings(filters)

      // Generate bot response
      const botResponse = generateBotResponse(results, input)

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I encountered an error. Please try again.",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Chatbot Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-40 hover:scale-110"
        aria-label="Open chatbot"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        )}
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-96 bg-white rounded-lg shadow-2xl flex flex-col z-40 border border-neutral-200">
          {/* Header */}
          <div className="bg-primary text-white p-4 rounded-t-lg">
            <h3 className="font-semibold">ApartmentHub Assistant</h3>
            <p className="text-sm text-neutral-100">Powered by AI</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.sender === "user"
                      ? "bg-primary text-white rounded-br-none"
                      : "bg-neutral-100 text-neutral-900 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-neutral-100 text-neutral-900 px-4 py-2 rounded-lg rounded-bl-none">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="border-t border-neutral-200 p-4 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  )
}
