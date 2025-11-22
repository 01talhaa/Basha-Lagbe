import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Comment from "@/models/Comment"
import Post from "@/models/Post"
import { auth } from "@/lib/auth"
import { uploadToCloudinary } from "@/lib/cloudinary"

/**
 * GET /api/posts/[id]/comments - Get all comments for a post
 * POST /api/posts/[id]/comments - Create a new comment
 */

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    const comments = await Comment.find({ post: params.id })
      .sort({ createdAt: -1 })
      .populate("author", "name email role")
      .lean()

    return NextResponse.json({
      success: true,
      comments,
    })
  } catch (error) {
    console.error("Get comments error:", error)
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    await dbConnect()

    // Check if post exists
    const post = await Post.findById(params.id)
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    const body = await request.json()
    const { content, images } = body

    if (!content || !content.trim()) {
      return NextResponse.json({ error: "Comment content is required" }, { status: 400 })
    }

    // Upload images to Cloudinary if provided
    let uploadedImages: string[] = []
    if (images && images.length > 0) {
      const uploadPromises = images.map((image: string) =>
        uploadToCloudinary(image, "basha-lagbe/community/comments")
      )
      const results = await Promise.all(uploadPromises)
      uploadedImages = results.map((r) => r.url)
    }

    const comment = await Comment.create({
      post: params.id,
      author: session.user.id,
      authorName: session.user.name || session.user.email,
      content,
      images: uploadedImages,
      likes: [],
      dislikes: [],
      likeCount: 0,
      dislikeCount: 0,
      replyCount: 0,
    })

    // Update post comment count
    post.commentCount = (post.commentCount || 0) + 1
    await post.save()

    const populatedComment = await Comment.findById(comment._id)
      .populate("author", "name email role")
      .lean()

    return NextResponse.json({
      success: true,
      comment: populatedComment,
      message: "Comment created successfully",
    })
  } catch (error) {
    console.error("Create comment error:", error)
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 })
  }
}
