import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Comment from "@/models/Comment"
import { auth } from "@/lib/auth"

/**
 * POST /api/comments/[id]/like - Like or unlike a comment
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

    // Check if user already liked
    const likeIndex = comment.likes.findIndex(
      (like: any) => like.userId.toString() === userId
    )

    // Check if user disliked
    const dislikeIndex = comment.dislikes.findIndex(
      (dislike: any) => dislike.userId.toString() === userId
    )

    // Remove dislike if exists
    if (dislikeIndex !== -1) {
      comment.dislikes.splice(dislikeIndex, 1)
    }

    if (likeIndex !== -1) {
      // Unlike: remove like
      comment.likes.splice(likeIndex, 1)
    } else {
      // Like: add like
      comment.likes.push({ userId, timestamp: new Date() })
    }

    await comment.save()

    const updatedComment = await Comment.findById(params.id)
      .populate("author", "name email role")
      .lean()

    return NextResponse.json({
      success: true,
      comment: updatedComment,
      message: likeIndex !== -1 ? "Comment unliked" : "Comment liked",
    })
  } catch (error) {
    console.error("Like comment error:", error)
    return NextResponse.json({ error: "Failed to like comment" }, { status: 500 })
  }
}
