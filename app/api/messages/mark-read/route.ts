import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Message from "@/models/Message"
import Conversation from "@/models/Conversation"
import { requireAuth } from "@/lib/session"

// POST mark messages as read
export async function POST(req: Request) {
  try {
    const user = await requireAuth()
    await dbConnect()

    const body = await req.json()
    const { conversationId } = body

    if (!conversationId) {
      return NextResponse.json({ error: "conversationId is required" }, { status: 400 })
    }

    // Verify user is part of the conversation
    const conversation = await Conversation.findById(conversationId)
    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
    }

    if (
      conversation.renter.toString() !== user.id &&
      conversation.owner.toString() !== user.id
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Mark all messages from other user as read
    await Message.updateMany(
      {
        conversation: conversationId,
        sender: { $ne: user.id },
        read: false,
      },
      {
        read: true,
      }
    )

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    if (error?.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("POST /api/messages/mark-read error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
