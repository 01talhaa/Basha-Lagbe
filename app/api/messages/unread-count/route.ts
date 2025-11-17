import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Message from "@/models/Message"
import Conversation from "@/models/Conversation"
import { requireAuth } from "@/lib/session"

// GET unread message count for current user
export async function GET(req: Request) {
  try {
    const user = await requireAuth()
    await dbConnect()

    // Get all conversations where user is a participant
    const conversations = await Conversation.find({
      $or: [{ renter: user.id }, { owner: user.id }],
    }).select("_id")

    const conversationIds = conversations.map((conv) => conv._id)

    // Count unread messages in all user's conversations
    const count = await Message.countDocuments({
      conversation: { $in: conversationIds },
      sender: { $ne: user.id },
      read: false,
    })

    return NextResponse.json({ count }, { status: 200 })
  } catch (error: any) {
    if (error?.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("GET /api/messages/unread-count error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
