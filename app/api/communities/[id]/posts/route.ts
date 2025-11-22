import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Post from "@/models/Post"
import Comment from "@/models/Comment"
import Community from "@/models/Community"
import { auth } from "@/lib/auth"
import { uploadToCloudinary } from "@/lib/cloudinary"

/**
 * GET /api/communities/[id]/posts - Get all posts for a community
 * POST /api/communities/[id]/posts - Create a new post
 */

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    const posts = await Post.find({ community: params.id })
      .sort({ createdAt: -1 })
      .populate("author", "name email role")
      .lean()

    return NextResponse.json({
      success: true,
      posts,
    })
  } catch (error) {
    console.error("Get posts error:", error)
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    await dbConnect()

    // Check if user is a member of the community
    const community = await Community.findById(params.id)
    if (!community) {
      return NextResponse.json({ error: "Community not found" }, { status: 404 })
    }

    const isMember = community.members?.some(
      (member: any) => member.userId.toString() === session.user.id
    ) || false

    if (!isMember) {
      return NextResponse.json(
        { error: "You must be a member to post in this community" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { content, images } = body

    if (!content || !content.trim()) {
      return NextResponse.json({ error: "Post content is required" }, { status: 400 })
    }

    // Upload images to Cloudinary if provided
    let uploadedImages: string[] = []
    if (images && images.length > 0) {
      const uploadPromises = images.map((image: string) =>
        uploadToCloudinary(image, "basha-lagbe/community/posts")
      )
      const results = await Promise.all(uploadPromises)
      uploadedImages = results.map((r) => r.url)
    }

    const post = await Post.create({
      community: params.id,
      author: session.user.id,
      authorName: session.user.name || session.user.email,
      content,
      images: uploadedImages,
      likes: [],
      dislikes: [],
      likeCount: 0,
      dislikeCount: 0,
      commentCount: 0,
    })

    const populatedPost = await Post.findById(post._id)
      .populate("author", "name email role")
      .lean()

    return NextResponse.json({
      success: true,
      post: populatedPost,
      message: "Post created successfully",
    })
  } catch (error) {
    console.error("Create post error:", error)
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
  }
}
