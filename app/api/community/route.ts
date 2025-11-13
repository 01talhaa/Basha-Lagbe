import { NextResponse, NextRequest } from "next/server"
import dbConnect from "@/lib/mongodb"
import Community from "@/models/Community"

export async function POST(req: Request) {
  try {
    await dbConnect()

    const { name, description } = await req.json()

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    // Check if exists
    const exists = await Community.findOne({ name })
    if (exists) {
      return NextResponse.json(
        { error: "Community already exists" },
        { status: 409 }
      )
    }

    const community = await Community.create({
      name,
      description,
    })

    return NextResponse.json(community, { status: 201 })

  } catch (error) {
    console.error("COMMUNITY CREATE ERROR:", error)
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    await dbConnect()

    const communities = await Community.find().sort({ createdAt: -1 })

    return NextResponse.json(communities, { status: 200 })
  } catch (error) {
    console.error("FETCH COMMUNITY ERROR:", error)
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}

