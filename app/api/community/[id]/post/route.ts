import { NextResponse, NextRequest } from "next/server"
import dbConnect from "@/lib/mongodb"
import Post from "@/models/Post"

export async function POST(req: Request) {
  try {
    await dbConnect()

    const { text, image, author, community } = await req.json()

    if (!author || !Array.isArray(author) || author.length === 0) {
      return NextResponse.json({ error: "Author is required" }, { status: 400 })
    }

    if (!community) {
      return NextResponse.json({ error: "Community is required" }, { status: 400 })
    }

    const newPost = await Post.create({
      text,
      image: image || [],
      author,
      community,
      likes: []
    })

    return NextResponse.json(newPost, { status: 201 })
  } catch (error) {
    console.error("CREATE POST ERROR:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
