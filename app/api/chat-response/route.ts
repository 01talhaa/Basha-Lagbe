import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "")

export async function POST(request: Request) {
  try {
    const { query, listingCount } = await request.json()

    if (!query) {
      return Response.json({ error: "Query is required" }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const prompt = `You are a friendly and helpful Basha Lagbe assistant. A user just asked about finding apartments. Generate a SHORT, natural, conversational response (1-2 sentences max) that acknowledges their request and tells them you found listings.

User query: "${query}"
Number of listings found: ${listingCount}

Guidelines:
- Be conversational and friendly, like talking to a friend
- Keep it SHORT (1-2 sentences)
- Don't mention specific apartment details - just acknowledge you found results
- If no listings found, suggest they adjust their search
- Use natural language, not robotic responses
- Don't use emojis

Examples of good responses:
- "Perfect! I found some great options for you. Check these out!"
- "Nice! I've got ${listingCount} apartments that match what you're looking for."
- "Awesome! Here are some places I think you'll love."
- "Great! I found ${listingCount} listings that fit your criteria. Take a look!"

Generate ONLY the response text, nothing else.`

    const result = await model.generateContent(prompt)
    const response = result.response.text().trim()

    return Response.json({ response })
  } catch (error) {
    console.error("[v0] Error generating chat response:", error)
    return Response.json({ error: "Failed to generate response", response: "" }, { status: 500 })
  }
}
