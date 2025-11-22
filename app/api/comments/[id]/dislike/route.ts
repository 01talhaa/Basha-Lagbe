import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Comment from "@/models/Comment"
import { auth } from "@/lib/auth"

/**
 * POST /api/comments/[id]/dislike - Dislike or remove dislike from a comment
 */

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    await dbConnect()

    const comment = await Comment.findById(params.id)

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 })
    }

    const userId = session.user.id

    // Check if user already disliked
    const dislikeIndex = comment.dislikes.findIndex(
      (dislike: any) => dislike.userId.toString() === userId
    )

    // Check if user liked
    const likeIndex = comment.likes.findIndex(
      (like: any) => like.userId.toString() === userId
    )

    // Remove like if exists
    if (likeIndex !== -1) {
      comment.likes.splice(likeIndex, 1)
    }

    if (dislikeIndex !== -1) {
      // Remove dislike
      comment.dislikes.splice(dislikeIndex, 1)
    } else {
      // Add dislike
      comment.dislikes.push({ userId, timestamp: new Date() })
    }

    await comment.save()

    const updatedComment = await Comment.findById(params.id)
      .populate("author", "name email role")
      .lean()

    return NextResponse.json({
      success: true,
      comment: updatedComment,
      message: dislikeIndex !== -1 ? "Dislike removed" : "Comment disliked",
    })
  } catch (error) {
    console.error("Dislike comment error:", error)
    return NextResponse.json({ error: "Failed to dislike comment" }, { status: 500 })
  }
}
