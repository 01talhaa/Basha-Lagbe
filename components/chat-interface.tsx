"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, X, Loader2, Check, CheckCheck } from "lucide-react"

interface Message {
  _id: string
  text: string
  sender: {
    _id: string
    name: string
    image?: string
  }
  createdAt: string
}

interface ChatInterfaceProps {
  conversationId: string
  currentUserId: string
  recipientName: string
  onClose: () => void
}

export default function ChatInterface({
  conversationId,
  currentUserId,
  recipientName,
  onClose,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const pollIntervalRef = useRef<NodeJS.Timeout>()

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/messages?conversationId=${conversationId}`)
      if (res.ok) {
        const data = await res.json()
        setMessages(data)
        setLoading(false)
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
    }
  }

  useEffect(() => {
    fetchMessages()

    // Poll for new messages every 3 seconds
    pollIntervalRef.current = setInterval(() => {
      fetchMessages()
    }, 3000)

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
      }
    }
  }, [conversationId])

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    setSending(true)
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          text: newMessage.trim(),
        }),
      })

      if (res.ok) {
        const message = await res.json()
        setMessages((prev) => [...prev, message])
        setNewMessage("")
        // Trigger immediate fetch to get latest messages
        fetchMessages()
      }
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setSending(false)
    }
  }

  return (
    <Card className="fixed bottom-4 right-4 w-[420px] h-[650px] shadow-2xl border-2 z-50 flex flex-col bg-gradient-to-b from-background to-muted/20 backdrop-blur-sm">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3 border-b bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-2 h-2 bg-green-500 rounded-full absolute -top-0.5 -right-0.5 border-2 border-background animate-pulse" />
            <Badge variant="secondary" className="font-semibold px-3 py-1">
              💬 Chat
            </Badge>
          </div>
          <div>
            <CardTitle className="text-lg font-bold">{recipientName}</CardTitle>
            <p className="text-xs text-muted-foreground">Usually replies instantly</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-destructive/10 hover:text-destructive">
          <X className="h-5 w-5" />
        </Button>
      </CardHeader>

      <CardContent className="flex-1 p-0 overflow-hidden bg-gradient-to-b from-muted/10 to-background">
        <ScrollArea className="h-full p-4" ref={scrollRef}>
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground text-sm">Loading conversation...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Send className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-lg mb-1">Start the conversation!</p>
                <p className="text-muted-foreground text-sm">Send a message to begin chatting with {recipientName}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((message, idx) => {
                const isOwn = message.sender._id === currentUserId
                const showAvatar = idx === 0 || messages[idx - 1].sender._id !== message.sender._id
                return (
                  <div
                    key={message._id}
                    className={`flex items-end gap-2 ${isOwn ? "flex-row-reverse" : ""} ${!showAvatar && !isOwn ? "ml-10" : ""} ${!showAvatar && isOwn ? "mr-10" : ""}`}
                  >
                    {showAvatar && (
                      <Avatar className="h-8 w-8 border-2 border-background shadow-sm">
                        <AvatarImage src={message.sender.image} />
                        <AvatarFallback className="text-xs font-semibold bg-gradient-to-br from-primary to-primary/60 text-primary-foreground">
                          {message.sender.name[0]}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    {!showAvatar && <div className="w-8 h-8" />}
                    <div className={`flex flex-col ${isOwn ? "items-end" : "items-start"} max-w-[75%]`}>
                      <div
                        className={`rounded-2xl px-4 py-2.5 shadow-sm ${
                          isOwn 
                            ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-br-sm" 
                            : "bg-white dark:bg-muted border shadow-md rounded-bl-sm"
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.text}</p>
                      </div>
                      <div className={`flex items-center gap-1 mt-1 px-1 ${isOwn ? "flex-row-reverse" : ""}`}>
                        <span className="text-xs text-muted-foreground font-medium">
                          {new Date(message.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {isOwn && (
                          <CheckCheck className="h-3 w-3 text-primary" />
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>

      <CardFooter className="border-t p-4 bg-muted/30">
        <form onSubmit={handleSendMessage} className="flex w-full gap-2">
          <div className="relative flex-1">
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={sending}
              className="pr-12 h-11 rounded-full border-2 focus:border-primary transition-all shadow-sm"
            />
          </div>
          <Button 
            type="submit" 
            size="icon" 
            disabled={sending || !newMessage.trim()}
            className="h-11 w-11 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:scale-100"
          >
            {sending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
