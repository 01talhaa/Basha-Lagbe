import { NextResponse, NextRequest } from "next/server"
import dbConnect from "@/lib/mongodb"
import Post from "@/models/Post"

export async function GET(
  req: Request,
  { params }: { params: { commId: string } }
) {
  try {
    const { commId } = params
    if (!commId) {
      return NextResponse.json({ error: "Community id is required" }, { status: 400 })
    }

    await dbConnect()

    const posts = await Post.find({ community: commId })
      .populate("author", "name image")
      .populate("likes", "_id")
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json(posts, { status: 200 })
  } catch (error) {
    console.error("GET /api/posts/[commId] error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
