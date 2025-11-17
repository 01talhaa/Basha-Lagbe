import { NextResponse } from "next/server"
import { createStreamForConversation } from "@/lib/sse"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const conversationId = url.searchParams.get("conversationId")
    if (!conversationId) return NextResponse.json({ error: "conversationId required" }, { status: 400 })

    const { readable, close } = createStreamForConversation(conversationId)

    const headers = new Headers({
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache",
    })

    const res = new Response(readable, { headers })

    // Best-effort: close when client disconnects (handled by runtime)
    // We return the response which keeps the stream open
    return res
  } catch (error) {
    console.error("GET /api/chat/stream error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
