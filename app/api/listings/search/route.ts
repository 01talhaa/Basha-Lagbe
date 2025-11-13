import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/mongodb";
import Listing from "@/models/Listing";

export async function GET(req:Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);

    const city = searchParams.get("city");
    const area = searchParams.get("area");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const type = searchParams.get("type");
    const bedrooms = searchParams.get("bedrooms");
    const moveInDate = searchParams.get("moveInDate");

    // Build dynamic filter object
    const filter: any = {};

    if (city) filter.city = city;
    if (area) filter.area = area;
    if (type) filter.type = type;
    if (bedrooms) filter.bedrooms = Number(bedrooms);
    if (moveInDate) filter.moveInDate = new Date(moveInDate);

    // Price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Move-in date range
    if (moveInDate) {
      const date = new Date(moveInDate);
      filter.moveInDate = { $lte: date };
    }

    const listings = await Listing.find(filter);

    // Return empty array if no matches (not error)
    return NextResponse.json(listings, { status: 200 });

  } catch (err: any) {
    console.error("SEARCH ERROR:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
