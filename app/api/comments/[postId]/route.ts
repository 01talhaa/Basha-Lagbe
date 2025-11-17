import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Comment from "@/models/Comment"

export async function GET(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const { postId } = params
    if (!postId) return NextResponse.json({ error: "postId required" }, { status: 400 })

    await dbConnect()

    const comments = await Comment.find({ post: postId })
      .populate("author", "name image")
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json(comments, { status: 200 })
  } catch (error) {
    console.error("GET /api/comments/[postId] error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
