import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Comment from "@/models/Comment"
import Post from "@/models/Post"
import { requireAuth } from "@/lib/session"

export async function POST(req: Request) {
  try {
    const user = await requireAuth()
    await dbConnect()

    const body = await req.json()
    const { post: postId, text } = body

    if (!postId || !text) {
      return NextResponse.json({ error: "Post and text are required" }, { status: 400 })
    }

    // Create comment
    const comment = await Comment.create({ post: postId, author: user.id, text })

    // Add comment ID to Post.comments
    try {
      await Post.findByIdAndUpdate(postId, { $push: { comments: comment._id } })
    } catch (err) {
      console.warn("Could not push comment id to post.comments", err)
    }

    const populated = await Comment.findById(comment._id).populate("author", "name image").lean()

    return NextResponse.json(populated, { status: 201 })
  } catch (error: any) {
    if (error?.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("POST /api/comments error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
