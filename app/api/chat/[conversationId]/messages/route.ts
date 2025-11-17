import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Message from "@/models/Message"

export async function GET(
  req: Request,
  { params }: { params: { conversationId: string } }
) {
  try {
    const { conversationId } = params
    if (!conversationId) return NextResponse.json({ error: "conversationId required" }, { status: 400 })

    await dbConnect()

    const messages = await Message.find({ conversation: conversationId })
      .populate("sender", "name image")
      .sort({ createdAt: 1 })
      .lean()

    return NextResponse.json(messages, { status: 200 })
  } catch (error) {
    console.error("GET /api/chat/[conversationId]/messages error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
