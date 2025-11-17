import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import { requireAuth } from "@/lib/session"
import Conversation from "@/models/Conversation"
import Message from "@/models/Message"
import { broadcastToConversation } from "@/lib/sse"

export async function POST(req: Request) {
  try {
    const user = await requireAuth()
    const body = await req.json()
    const { conversationId, recipientId, text } = body

    if (!text || (!conversationId && !recipientId)) {
      return NextResponse.json({ error: "conversationId or recipientId and text required" }, { status: 400 })
    }

    await dbConnect()

    let convId = conversationId

    if (!convId) {
      // find or create a direct conversation between user and recipient
      const participants = [String(user.id), String(recipientId)].sort()
      let conv = await Conversation.findOne({ participants: participants })
      if (!conv) {
        conv = await Conversation.create({ participants })
      }
      convId = String(conv._id)
    }

    const message = await Message.create({
      conversation: convId,
      sender: user.id,
      text,
    })

    // update conversation lastMessage
    await Conversation.findByIdAndUpdate(convId, { lastMessage: message._id })

    const populated = await Message.findById(message._id).populate("sender", "name image").lean()

    // broadcast to SSE clients (best-effort)
    try {
      await broadcastToConversation(convId, JSON.stringify(populated))
    } catch (e) {
      console.warn("SSE broadcast failed", e)
    }

    return NextResponse.json(populated, { status: 201 })
  } catch (error: any) {
    if (error?.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("POST /api/chat/send error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
