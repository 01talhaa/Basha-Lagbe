import type { Review } from "./types"

export const mockReviews: Review[] = [
  {
    id: "review-1",
    listingId: "listing-1",
    bookingId: "booking-1",
    authorId: "user-1",
    rating: 5,
    comment: "Amazing apartment! Clean, well-maintained, and the host was very responsive. Highly recommend!",
    createdAt: new Date("2024-09-15"),
  },
  {
    id: "review-2",
    listingId: "listing-1",
    bookingId: "booking-2",
    authorId: "user-2",
    rating: 4,
    comment: "Great location and comfortable space. Only minor issue with the WiFi speed.",
    createdAt: new Date("2024-08-20"),
  },
  {
    id: "review-3",
    listingId: "listing-2",
    bookingId: "booking-3",
    authorId: "user-3",
    rating: 5,
    comment: "Perfect studio for a short stay. Cozy, clean, and in a vibrant neighborhood.",
    createdAt: new Date("2024-07-10"),
  },
]
