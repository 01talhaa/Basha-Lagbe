import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Reply from "@/models/Reply"
import Comment from "@/models/Comment"
import { auth } from "@/lib/auth"
import { uploadToCloudinary } from "@/lib/cloudinary"

/**
 * GET /api/comments/[id]/replies - Get all replies for a comment
 * POST /api/comments/[id]/replies - Create a new reply
 */

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    const replies = await Reply.find({ comment: params.id })
      .sort({ createdAt: -1 })
      .populate("author", "name email role")
      .lean()

    return NextResponse.json({
      success: true,
      replies,
    })
  } catch (error) {
    console.error("Get replies error:", error)
    return NextResponse.json({ error: "Failed to fetch replies" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    await dbConnect()

    // Check if comment exists
    const comment = await Comment.findById(params.id)
    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 })
    }

    const body = await request.json()
    const { content, images } = body

    if (!content || !content.trim()) {
      return NextResponse.json({ error: "Reply content is required" }, { status: 400 })
    }

    // Upload images to Cloudinary if provided
    let uploadedImages: string[] = []
    if (images && images.length > 0) {
      const uploadPromises = images.map((image: string) =>
        uploadToCloudinary(image, "basha-lagbe/community/replies")
      )
      const results = await Promise.all(uploadPromises)
      uploadedImages = results.map((r) => r.url)
    }

    const reply = await Reply.create({
      comment: params.id,
      author: session.user.id,
      authorName: session.user.name || session.user.email,
      content,
      images: uploadedImages,
      likes: [],
      dislikes: [],
      likeCount: 0,
      dislikeCount: 0,
    })

    // Update comment reply count
    ;(comment as any).replyCount = ((comment as any).replyCount || 0) + 1
    await comment.save()

    const populatedReply = await Reply.findById(reply._id)
      .populate("author", "name email role")
      .lean()

    return NextResponse.json({
      success: true,
      reply: populatedReply,
      message: "Reply created successfully",
    })
  } catch (error) {
    console.error("Create reply error:", error)
    return NextResponse.json({ error: "Failed to create reply" }, { status: 500 })
  }
}
