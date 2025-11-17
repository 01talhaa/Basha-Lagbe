import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import { getCurrentUser } from "@/lib/session"
import Conversation from "@/models/Conversation"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json([], { status: 200 })

    await dbConnect()

    const convs = await Conversation.find({ participants: user.id })
      .populate("lastMessage")
      .populate("participants", "name image")
      .sort({ updatedAt: -1 })
      .lean()

    return NextResponse.json(convs, { status: 200 })
  } catch (error) {
    console.error("GET /api/chat/conversations error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
