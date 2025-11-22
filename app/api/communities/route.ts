import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Community from "@/models/Community"
import { auth } from "@/lib/auth"

/**
 * GET /api/communities - Get all communities with optional filters
 * POST /api/communities - Create a new community
 */

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const category = searchParams.get("category")
    const userId = searchParams.get("userId")

    const query: any = {}

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ]
    }

    if (category && category !== "all") {
      query.category = category
    }

    if (userId) {
      query.creator = userId
    }

    const communities = await Community.find(query)
      .sort({ createdAt: -1 })
      .populate("creator", "name email")
      .lean()

    return NextResponse.json({
      success: true,
      communities,
      count: communities.length,
    })
  } catch (error) {
    console.error("Get communities error:", error)
    return NextResponse.json({ error: "Failed to fetch communities" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, category, image, isPrivate, rules, tags } = body

    if (!name || !description || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await dbConnect()

    const community = await Community.create({
      name,
      description,
      category,
      image: image || "",
      creator: session.user.id,
      creatorName: session.user.name || session.user.email,
      isPrivate: isPrivate || false,
      rules: rules || [],
      tags: tags || [],
      members: [
        {
          userId: session.user.id,
          name: session.user.name || session.user.email,
          joinedAt: new Date(),
        },
      ],
      memberCount: 1,
    })

    return NextResponse.json({
      success: true,
      community,
      message: "Community created successfully",
    })
  } catch (error) {
    console.error("Create community error:", error)
    return NextResponse.json({ error: "Failed to create community" }, { status: 500 })
  }
}
