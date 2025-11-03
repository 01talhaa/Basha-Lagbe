import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "")

export async function POST(request: Request) {
  try {
    const { query } = await request.json()

    if (!query) {
      return Response.json({ error: "Query is required" }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const prompt = `You are an apartment rental assistant for Basha Lagbe. Your job is to understand what apartment the user is looking for and extract search parameters.

User query: "${query}"

Extract and return ONLY a JSON object (no markdown, no extra text, no explanations) with these fields:
- location: string (city name if mentioned, otherwise null)
- priceMin: number (minimum monthly price if mentioned, otherwise null)
- priceMax: number (maximum monthly price if mentioned, otherwise null)
- bedrooms: number (number of bedrooms if mentioned, otherwise null)
- bathrooms: number (number of bathrooms if mentioned, otherwise null)
- propertyType: array of strings (apartment, house, room, studio - only if mentioned)
- amenities: array of strings (amenities mentioned like wifi, parking, gym, pool, furnished, etc.)
- moveInDate: string (ISO date if mentioned, otherwise null)
- leaseDuration: number (lease length in months if mentioned, otherwise null)

Examples:
- "I need a 2 bedroom apartment in New York under $2000" → {"location":"New York","bedrooms":2,"priceMax":2000,"propertyType":["apartment"]}
- "Looking for a studio in Miami with parking and gym" → {"location":"Miami","propertyType":["studio"],"amenities":["parking","gym"]}
- "3 bed house in Austin, $1500-2500/month" → {"location":"Austin","bedrooms":3,"priceMin":1500,"priceMax":2500,"propertyType":["house"]}
- "Furnished apartment in LA, 1 bed, around 1500" → {"location":"LA","bedrooms":1,"priceMax":1500,"amenities":["furnished"],"propertyType":["apartment"]}

Return ONLY the JSON object, nothing else. Do not include markdown formatting.`

    const result = await model.generateContent(prompt)
    const responseText = result.response.text()

    // Parse the JSON response
    const filters = JSON.parse(responseText)

    return Response.json({ filters })
  } catch (error) {
    console.error("[v0] Error parsing query with Gemini:", error)
    return Response.json({ error: "Failed to parse query", filters: {} }, { status: 500 })
  }
}
