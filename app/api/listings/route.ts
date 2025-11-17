import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Listing from "@/models/Listing"
import { auth } from "@/lib/auth"
import { uploadMultipleToCloudinary } from "@/lib/cloudinary"

/**
 * GET /api/listings - Get all listings or filter by query
 * POST /api/listings - Create a new listing
 */

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const hostId = searchParams.get("hostId")
    const city = searchParams.get("city")
    const propertyTypes = searchParams.getAll("propertyType")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const bedrooms = searchParams.get("bedrooms")
    const bathrooms = searchParams.get("bathrooms")
    const amenities = searchParams.get("amenities")

    // Build query
    const query: any = {}

    if (hostId) {
      query.hostId = hostId
    }

    if (city) {
      query["location.city"] = { $regex: city, $options: "i" }
    }

    if (propertyTypes && propertyTypes.length > 0) {
      query.propertyType = { $in: propertyTypes }
    }

    if (minPrice || maxPrice) {
      query.pricePerMonth = {}
      if (minPrice) query.pricePerMonth.$gte = Number(minPrice)
      if (maxPrice) query.pricePerMonth.$lte = Number(maxPrice)
    }

    if (bedrooms) {
      query.bedrooms = { $gte: Number(bedrooms) }
    }

    if (bathrooms) {
      query.bathrooms = { $gte: Number(bathrooms) }
    }

    if (amenities) {
      const amenitiesList = amenities.split(",").map(a => a.trim())
      query.amenities = { $all: amenitiesList }
    }

    const listings = await Listing.find(query).sort({ createdAt: -1 }).lean()

    return NextResponse.json({
      success: true,
      listings,
      count: listings.length,
    })
  } catch (error) {
    console.error("Get listings error:", error)
    return NextResponse.json({ error: "Failed to fetch listings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    if (session.user.role !== "owner") {
      return NextResponse.json({ error: "Only property owners can create listings" }, { status: 403 })
    }

    const body = await request.json()
    const {
      title,
      description,
      location,
      propertyType,
      bedrooms,
      bathrooms,
      maxGuests,
      pricePerMonth,
      securityDeposit,
      maintenanceFee,
      images, // Base64 encoded images
      amenities,
      rules,
      availability,
    } = body

    // Validate required fields
    if (!title || !description || !location || !propertyType || !images || images.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Upload images to Cloudinary
    const uploadedImages = await uploadMultipleToCloudinary(images, "basha-lagbe/listings")

    await dbConnect()

    // Create listing
    const listing = await Listing.create({
      hostId: session.user.id,
      title,
      description,
      location,
      propertyType,
      bedrooms: Number(bedrooms) || 0,
      bathrooms: Number(bathrooms) || 0,
      maxGuests: Number(maxGuests) || 1,
      pricePerMonth: Number(pricePerMonth),
      securityDeposit: Number(securityDeposit),
      maintenanceFee: Number(maintenanceFee) || 0,
      images: uploadedImages.map((img) => img.url),
      amenities: amenities || [],
      rules: rules || [],
      availability: {
        startDate: new Date(availability.startDate),
        endDate: new Date(availability.endDate),
        bookedDates: [],
      },
      rating: 0,
      reviewCount: 0,
    })

    return NextResponse.json({
      success: true,
      listing,
      message: "Listing created successfully",
    })
  } catch (error: any) {
    console.error("Create listing error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create listing" },
      { status: 500 }
    )
  }
}
