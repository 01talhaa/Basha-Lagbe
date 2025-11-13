import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Listing from "@/models/Listing"
import { auth } from "@/lib/auth"
import { uploadMultipleToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary"

/**
 * GET /api/listings/[id] - Get a specific listing
 * PUT /api/listings/[id] - Update a listing
 * DELETE /api/listings/[id] - Delete a listing
 */

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    const listing = await Listing.findById(params.id).lean()

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      listing,
    })
  } catch (error) {
    console.error("Get listing error:", error)
    return NextResponse.json({ error: "Failed to fetch listing" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    if (session.user.role !== "owner") {
      return NextResponse.json({ error: "Only property owners can update listings" }, { status: 403 })
    }

    await dbConnect()

    // Check if listing exists and belongs to the user
    const existingListing = await Listing.findById(params.id)

    if (!existingListing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 })
    }

    if (existingListing.hostId !== session.user.id) {
      return NextResponse.json({ error: "You can only update your own listings" }, { status: 403 })
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
      images, // Can be URLs (existing) or base64 (new)
      amenities,
      rules,
      availability,
    } = body

    // Handle images - upload new ones if they're base64
    let finalImages = existingListing.images
    if (images && images.length > 0) {
      const newImages: string[] = []
      const existingImages: string[] = []

      for (const img of images) {
        if (img.startsWith("data:")) {
          // It's a base64 image, upload it
          newImages.push(img)
        } else {
          // It's an existing URL
          existingImages.push(img)
        }
      }

      if (newImages.length > 0) {
        const uploadedImages = await uploadMultipleToCloudinary(newImages, "basha-lagbe/listings")
        finalImages = [...existingImages, ...uploadedImages.map((img) => img.url)]
      } else {
        finalImages = existingImages
      }
    }

    // Update listing
    const updatedListing = await Listing.findByIdAndUpdate(
      params.id,
      {
        title,
        description,
        location,
        propertyType,
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        maxGuests: Number(maxGuests),
        pricePerMonth: Number(pricePerMonth),
        securityDeposit: Number(securityDeposit),
        maintenanceFee: Number(maintenanceFee) || 0,
        images: finalImages,
        amenities: amenities || [],
        rules: rules || [],
        availability: {
          startDate: new Date(availability.startDate),
          endDate: new Date(availability.endDate),
          bookedDates: availability.bookedDates || [],
        },
      },
      { new: true, runValidators: true }
    )

    return NextResponse.json({
      success: true,
      listing: updatedListing,
      message: "Listing updated successfully",
    })
  } catch (error: any) {
    console.error("Update listing error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to update listing" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    if (session.user.role !== "owner") {
      return NextResponse.json({ error: "Only property owners can delete listings" }, { status: 403 })
    }

    await dbConnect()

    // Check if listing exists and belongs to the user
    const listing = await Listing.findById(params.id)

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 })
    }

    if (listing.hostId !== session.user.id) {
      return NextResponse.json({ error: "You can only delete your own listings" }, { status: 403 })
    }

    // Delete listing
    await Listing.findByIdAndDelete(params.id)

    // Note: You can optionally delete images from Cloudinary here
    // But keeping them won't hurt as they're in your account

    return NextResponse.json({
      success: true,
      message: "Listing deleted successfully",
    })
  } catch (error) {
    console.error("Delete listing error:", error)
    return NextResponse.json({ error: "Failed to delete listing" }, { status: 500 })
  }
}
