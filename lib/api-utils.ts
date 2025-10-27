import { mockListings } from "@/data/listings"
import { mockUsers } from "@/data/users"
import { mockReviews } from "@/data/reviews"
import { mockBookings } from "@/data/bookings"
import type { Listing, SearchFilters, Review, Booking, User } from "@/data/types"

// Listings API
export async function getListings(): Promise<Listing[]> {
  return mockListings
}

export async function getListingById(id: string): Promise<Listing | null> {
  return mockListings.find((listing) => listing.id === id) || null
}

export async function searchListings(filters: SearchFilters): Promise<Listing[]> {
  let results = [...mockListings]

  if (filters.location) {
    results = results.filter(
      (listing) =>
        listing.location.city.toLowerCase().includes(filters.location!.toLowerCase()) ||
        listing.location.address.toLowerCase().includes(filters.location!.toLowerCase()),
    )
  }

  if (filters.priceMin !== undefined) {
    results = results.filter((listing) => listing.pricePerNight >= filters.priceMin!)
  }

  if (filters.priceMax !== undefined) {
    results = results.filter((listing) => listing.pricePerNight <= filters.priceMax!)
  }

  if (filters.bedrooms !== undefined) {
    results = results.filter((listing) => listing.bedrooms >= filters.bedrooms!)
  }

  if (filters.propertyType && filters.propertyType.length > 0) {
    results = results.filter((listing) => filters.propertyType!.includes(listing.propertyType))
  }

  // Sort results
  if (filters.sortBy === "price-asc") {
    results.sort((a, b) => a.pricePerNight - b.pricePerNight)
  } else if (filters.sortBy === "price-desc") {
    results.sort((a, b) => b.pricePerNight - a.pricePerNight)
  } else if (filters.sortBy === "rating") {
    results.sort((a, b) => b.rating - a.rating)
  }

  return results
}

// Users API
export async function getUserById(id: string): Promise<User | null> {
  return mockUsers.find((user) => user.id === id) || null
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return mockUsers.find((user) => user.email === email) || null
}

// Reviews API
export async function getReviewsByListingId(listingId: string): Promise<Review[]> {
  return mockReviews.filter((review) => review.listingId === listingId)
}

// Bookings API
export async function getBookingsByUserId(userId: string): Promise<Booking[]> {
  return mockBookings.filter((booking) => booking.renterId === userId)
}

export async function getBookingsByHostId(hostId: string): Promise<Booking[]> {
  return mockBookings.filter((booking) => booking.hostId === hostId)
}

export async function getBookingById(id: string): Promise<Booking | null> {
  return mockBookings.find((booking) => booking.id === id) || null
}
