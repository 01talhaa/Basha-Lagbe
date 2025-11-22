import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Reply from "@/models/Reply"
import { auth } from "@/lib/auth"

/**
 * POST /api/replies/[id]/dislike - Dislike or remove dislike from a reply
 */

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    await dbConnect()

    const reply = await Reply.findById(params.id)

    if (!reply) {
      return NextResponse.json({ error: "Reply not found" }, { status: 404 })
    }

    const userId = session.user.id

    // Check if user already disliked
    const dislikeIndex = reply.dislikes.findIndex(
      (dislike: any) => dislike.userId.toString() === userId
    )

    // Check if user liked
    const likeIndex = reply.likes.findIndex(
      (like: any) => like.userId.toString() === userId
    )

    // Remove like if exists
    if (likeIndex !== -1) {
      reply.likes.splice(likeIndex, 1)
    }

    if (dislikeIndex !== -1) {
      // Remove dislike
      reply.dislikes.splice(dislikeIndex, 1)
    } else {
      // Add dislike
      reply.dislikes.push({ userId, timestamp: new Date() })
    }

    await reply.save()

    const updatedReply = await Reply.findById(params.id)
      .populate("author", "name email role")
      .lean()

    return NextResponse.json({
      success: true,
      reply: updatedReply,
      message: dislikeIndex !== -1 ? "Dislike removed" : "Reply disliked",
    })
  } catch (error) {
    console.error("Dislike reply error:", error)
    return NextResponse.json({ error: "Failed to dislike reply" }, { status: 500 })
  }
}
