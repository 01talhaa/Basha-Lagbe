"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { searchListings } from "@/lib/api-utils"
import type { Listing } from "@/data/types"
import ChatbotListingCard from "./chatbot-listing-card"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
  listings?: Listing[]
}

export default function HomepageChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hey there! 👋 I'm your Basha Lagbe assistant. I can help you find the perfect apartment for your long-term stay. Just tell me what you're looking for - like your budget, preferred location, number of bedrooms, or any specific amenities you need. What's your ideal apartment?",
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
    try {
      const response = await fetch("/api/parse-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      })

      if (!response.ok) throw new Error("Failed to parse query")
      const data = await response.json()
      return data.filters
    } catch (error) {
      console.error("[v0] Error parsing query:", error)
      return {}
    }
  }

  const generateBotResponse = (listings: Listing[], query: string): string => {
    if (listings.length === 0) {
      return "Hmm, I couldn't find any apartments matching those criteria. Try adjusting your search - maybe a different price range, location, or number of bedrooms?"
    }

    return "Here are some great options for you!"
  }

  const isApartmentRelatedQuery = (query: string): boolean => {
    const apartmentKeywords = [
      "apartment",
      "rent",
      "lease",
      "bedroom",
      "bed",
      "bath",
      "bathroom",
      "price",
      "cost",
      "location",
      "city",
      "amenities",
      "wifi",
      "parking",
      "gym",
      "pool",
      "furnished",
      "unfurnished",
      "studio",
      "house",
      "room",
      "move",
      "looking for",
      "find",
      "search",
      "need",
      "want",
    ]

    const lowerQuery = query.toLowerCase()
    return apartmentKeywords.some((keyword) => lowerQuery.includes(keyword))
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    if (!isApartmentRelatedQuery(input)) {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: input,
        sender: "user",
        timestamp: new Date(),
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm specifically designed to help you find apartments and rentals. What kind of apartment are you looking for?",
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMessage, botMessage])
      setInput("")
      return
    }

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
      const filters = await parseUserQuery(input)
      const results = await searchListings(filters)

      const topResults = results.sort((a, b) => b.rating - a.rating).slice(0, 3)
      const botResponse = generateBotResponse(topResults, input)

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
        listings: topResults,
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error("[v0] Error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Oops! Something went wrong. Could you rephrase what you're looking for?",
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
        <div className="fixed bottom-24 right-6 w-96 max-h-[600px] bg-white rounded-lg shadow-2xl flex flex-col z-40 border border-neutral-200">
          {/* Header */}
          <div className="bg-primary text-white p-4 rounded-t-lg">
            <h3 className="font-semibold">Basha Lagbe Assistant</h3>
            <p className="text-sm text-neutral-100">Find your perfect apartment</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id}>
                <div className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
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

                {message.listings && message.listings.length > 0 && (
                  <div className="mt-3 grid grid-cols-1 gap-2">
                    {message.listings.map((listing) => (
                      <ChatbotListingCard key={listing.id} listing={listing} />
                    ))}
                  </div>
                )}
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
              placeholder="Tell me what you're looking for..."
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
