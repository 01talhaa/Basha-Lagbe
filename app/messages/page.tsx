"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import ChatInterface from "@/components/chat-interface"
import { MessageCircle, Home } from "lucide-react"

interface Conversation {
  _id: string
  listing: {
    _id: string
    title: string
    images: string[]
    city: string
    area: string
  }
  renter: {
    _id: string
    name: string
    email: string
    image?: string
  }
  owner: {
    _id: string
    name: string
    email: string
    image?: string
  }
  lastMessage: string
  lastMessageAt: string
}

export default function MessagesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [showChat, setShowChat] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      fetchConversations()

      // Poll for new conversations every 5 seconds
      const interval = setInterval(fetchConversations, 5000)
      return () => clearInterval(interval)
    }
  }, [session])

  const fetchConversations = async () => {
    try {
      const res = await fetch("/api/conversations")
      if (res.ok) {
        const data = await res.json()
        setConversations(data)
        setLoading(false)
      }
    } catch (error) {
      console.error("Error fetching conversations:", error)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!session?.user) {
    return null
  }

  const getOtherParticipant = (conversation: Conversation) => {
    return conversation.renter._id === session.user.id ? conversation.owner : conversation.renter
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-neutral-600 mt-2">Manage your conversations</p>
        </div>

        {conversations.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <MessageCircle className="h-16 w-16 mx-auto text-neutral-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No messages yet</h3>
                <p className="text-neutral-600 mb-6">
                  Start a conversation by contacting property owners on their listings
                </p>
                <button
                  onClick={() => router.push("/search")}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Browse Listings
                </button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Conversations List */}
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Conversations</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[600px]">
                    <div className="divide-y">
                      {conversations.map((conversation) => {
                        const otherUser = getOtherParticipant(conversation)
                        return (
                          <div
                            key={conversation._id}
                            onClick={() => setSelectedConversation(conversation)}
                            className={`p-4 hover:bg-neutral-50 cursor-pointer transition-colors ${
                              selectedConversation?._id === conversation._id ? "bg-neutral-100" : ""
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={otherUser.image} />
                                <AvatarFallback>{otherUser.name[0]}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <p className="font-semibold text-sm truncate">{otherUser.name}</p>
                                  <span className="text-xs text-neutral-500">
                                    {new Date(conversation.lastMessageAt).toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 mb-1">
                                  <Home className="h-3 w-3 text-neutral-400" />
                                  <p className="text-xs text-neutral-600 truncate">
                                    {conversation.listing.title}
                                  </p>
                                </div>
                                <p className="text-sm text-neutral-500 truncate">
                                  {conversation.lastMessage || "No messages yet"}
                                </p>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Selected Conversation Details */}
            <div className="md:col-span-2">
              {selectedConversation ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={getOtherParticipant(selectedConversation).image}
                        />
                        <AvatarFallback>
                          {getOtherParticipant(selectedConversation).name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-lg">
                          {getOtherParticipant(selectedConversation).name}
                        </CardTitle>
                        <p className="text-sm text-neutral-600">
                          Re: {selectedConversation.listing.title}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {selectedConversation.renter._id === session.user.id
                          ? "Renter"
                          : "Owner"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <img
                        src={selectedConversation.listing.images[0]}
                        alt={selectedConversation.listing.title}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <div className="mt-3">
                        <h3 className="font-semibold">{selectedConversation.listing.title}</h3>
                        <p className="text-sm text-neutral-600">
                          {selectedConversation.listing.city}, {selectedConversation.listing.area}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowChat(true)}
                      className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                    >
                      Open Chat
                    </button>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="py-12">
                    <div className="text-center text-neutral-500">
                      <MessageCircle className="h-16 w-16 mx-auto mb-4 text-neutral-300" />
                      <p>Select a conversation to view details</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Chat Interface */}
      {showChat && selectedConversation && session?.user && (
        <ChatInterface
          conversationId={selectedConversation._id}
          currentUserId={session.user.id}
          recipientName={getOtherParticipant(selectedConversation).name}
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
  )
}
