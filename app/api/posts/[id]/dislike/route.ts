import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Post from "@/models/Post"
import { auth } from "@/lib/auth"

/**
 * POST /api/posts/[id]/dislike - Dislike or remove dislike from a post
 */

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    await dbConnect()

    const post = await Post.findById(params.id)

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    const userId = session.user.id

    // Check if user already disliked
    const dislikeIndex = post.dislikes.findIndex(
      (dislike: any) => dislike.userId.toString() === userId
    )

    // Check if user liked
    const likeIndex = post.likes.findIndex(
      (like: any) => like.userId.toString() === userId
    )

    // Remove like if exists
    if (likeIndex !== -1) {
      post.likes.splice(likeIndex, 1)
    }

    if (dislikeIndex !== -1) {
      // Remove dislike
      post.dislikes.splice(dislikeIndex, 1)
    } else {
      // Add dislike
      post.dislikes.push({ userId, timestamp: new Date() })
    }

    await post.save()

    const updatedPost = await Post.findById(params.id)
      .populate("author", "name email role")
      .lean()

    return NextResponse.json({
      success: true,
      post: updatedPost,
      message: dislikeIndex !== -1 ? "Dislike removed" : "Post disliked",
    })
  } catch (error) {
    console.error("Dislike post error:", error)
    return NextResponse.json({ error: "Failed to dislike post" }, { status: 500 })
  }
}
