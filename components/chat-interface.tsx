"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, X, Loader2, Check, CheckCheck, Minimize2 } from "lucide-react"

interface Message {
  _id: string
  text: string
  sender: {
    _id: string
    name: string
    image?: string
  }
  read: boolean
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
  const [unreadCount, setUnreadCount] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const pollIntervalRef = useRef<NodeJS.Timeout>()

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/messages?conversationId=${conversationId}`)
      if (res.ok) {
        const data = await res.json()
        setMessages(data)
        setLoading(false)
        
        // Count unread messages from recipient
        const unread = data.filter(
          (msg: Message) => !msg.read && msg.sender._id !== currentUserId
        ).length
        setUnreadCount(unread)
        
        // Mark messages as read
        if (unread > 0) {
          markMessagesAsRead()
        }
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
    }
  }

  const markMessagesAsRead = async () => {
    try {
      await fetch(`/api/messages/mark-read`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId }),
      })
    } catch (error) {
      console.error("Error marking messages as read:", error)
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
    <Card className="fixed bottom-4 right-4 w-[420px] h-[650px] shadow-2xl border-0 z-50 flex flex-col bg-white dark:bg-zinc-900 overflow-hidden">
      {/* Professional Header */}
      <CardHeader className="flex flex-row items-center justify-between py-4 px-5 border-b border-zinc-200 dark:border-zinc-800">
        
        {/* LEFT SECTION */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative flex-shrink-0">
            <Avatar className="h-10 w-10 border-2 border-white dark:border-zinc-800 shadow-sm ring-2 ring-zinc-100 dark:ring-zinc-800">
              <AvatarImage src="" />
              <AvatarFallback className="text-sm font-semibold bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                {recipientName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="w-3 h-3 bg-emerald-500 rounded-full absolute bottom-0 right-0 border-2 border-white dark:border-zinc-900 shadow-sm" />
          </div>

          <div className="min-w-0">
            <CardTitle className="text-[15px] font-semibold text-zinc-900 dark:text-zinc-50 truncate">
              {recipientName}
            </CardTitle>
            <p className="text-xs text-emerald-600 dark:text-emerald-500 font-medium truncate mt-0.5">
              Active now
            </p>
          </div>
        </div>

        {/* RIGHT SIDE — CLOSE BUTTON + BADGE */}
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Badge className="bg-red-500 text-white border-0 h-5 px-1.5 text-xs font-bold shadow-sm">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-10 w-10 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-500 rounded-lg"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

      </CardHeader>

      {/* Messages Area */}
      <CardContent className="flex-1 p-0 overflow-hidden bg-zinc-50 dark:bg-zinc-950">
        <ScrollArea className="h-full px-5 py-4" ref={scrollRef}>
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <div className="relative">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                <div className="absolute inset-0 h-10 w-10 animate-ping opacity-20">
                  <Loader2 className="h-10 w-10 text-blue-600" />
                </div>
              </div>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-6">
              <div className="w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center shadow-inner">
                <Send className="h-9 w-9 text-blue-600 dark:text-blue-500" />
              </div>
              <div>
                <p className="font-semibold text-lg text-zinc-900 dark:text-zinc-50 mb-1.5">No messages yet</p>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
                  Start your conversation with {recipientName}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, idx) => {
                const isOwn = message.sender._id === currentUserId
                const showAvatar = idx === 0 || messages[idx - 1].sender._id !== message.sender._id
                const showTimestamp = idx === messages.length - 1 || 
                  messages[idx + 1]?.sender._id !== message.sender._id ||
                  new Date(messages[idx + 1]?.createdAt).getTime() - new Date(message.createdAt).getTime() > 300000
                
                return (
                  <div
                    key={message._id}
                    className={`flex items-end gap-2 ${isOwn ? "flex-row-reverse" : ""} ${!showAvatar && !isOwn ? "ml-11" : ""} ${!showAvatar && isOwn ? "mr-11" : ""}`}
                  >
                    {showAvatar ? (
                      <Avatar className="h-9 w-9 border-2 border-white dark:border-zinc-800 shadow-sm flex-shrink-0">
                        <AvatarImage src={message.sender.image} />
                        <AvatarFallback className="text-xs font-semibold bg-gradient-to-br from-zinc-600 to-zinc-700 dark:from-zinc-700 dark:to-zinc-800 text-white">
                          {message.sender.name[0]}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="w-9 h-9 flex-shrink-0" />
                    )}
                    <div className={`flex flex-col gap-1 ${isOwn ? "items-end" : "items-start"} max-w-[75%]`}>
                      <div
                        className={`rounded-2xl px-4 py-2.5 transition-all ${
                          isOwn 
                            ? "bg-blue-600 text-white shadow-sm rounded-br-md" 
                            : "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-700 shadow-sm rounded-bl-md"
                        }`}
                      >
                        <p className="text-[13.5px] leading-relaxed whitespace-pre-wrap break-words">{message.text}</p>
                      </div>
                      {showTimestamp && (
                        <div className={`flex items-center gap-1.5 px-2 ${isOwn ? "flex-row-reverse" : ""}`}>
                          <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium">
                            {new Date(message.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          {isOwn && (
                            message.read ? (
                              <CheckCheck className="h-3.5 w-3.5 text-emerald-500" />
                            ) : (
                              <Check className="h-3.5 w-3.5 text-zinc-400" />
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>

      {/* Professional Input Area */}
      <CardFooter className="border-t border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900">
        <div className="flex w-full gap-2.5">
          <div className="relative flex-1">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage(e)
                }
              }}
              disabled={sending}
              className="h-11 rounded-xl border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:border-transparent transition-all text-[13.5px] placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
            />
          </div>
          <Button 
            onClick={handleSendMessage}
            size="icon" 
            disabled={sending || !newMessage.trim()}
            className="h-11 w-11 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-200 dark:disabled:bg-zinc-800 shadow-sm hover:shadow-md transition-all disabled:opacity-50"
          >
            {sending ? (
              <Loader2 className="h-4.5 w-4.5 animate-spin" />
            ) : (
              <Send className="h-4.5 w-4.5" />
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}