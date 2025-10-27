export interface User {
  id: string
  email: string
  password: string
  name: string
  profileImage?: string
  phone?: string
  bio?: string
  role: "renter" | "host" | "admin"
  createdAt: Date
  updatedAt: Date
}

export interface Listing {
  id: string
  hostId: string
  title: string
  description: string
  location: {
    address: string
    city: string
    state: string
    zipCode: string
    latitude: number
    longitude: number
  }
  propertyType: "apartment" | "house" | "room" | "studio"
  bedrooms: number
  bathrooms: number
  maxGuests: number
  pricePerMonth: number
  securityDeposit: number
  maintenanceFee: number
  images: string[]
  amenities: string[]
  rules: string[]
  availability: {
    startDate: Date
    endDate: Date
    bookedDates: Date[]
  }
  rating: number
  reviewCount: number
  createdAt: Date
  updatedAt: Date
}

export interface Booking {
  id: string
  listingId: string
  renterId: string
  hostId: string
  moveInDate: Date
  leaseEndDate: Date
  numberOfGuests: number
  totalPrice: number
  priceBreakdown: {
    monthlyRate: number
    months: number
    subtotal: number
    securityDeposit: number
    maintenanceFee: number
    total: number
  }
  status: "pending" | "confirmed" | "cancelled" | "completed"
  paymentStatus: "pending" | "completed" | "refunded"
  createdAt: Date
  updatedAt: Date
}

export interface Review {
  id: string
  listingId: string
  bookingId: string
  authorId: string
  rating: number
  comment: string
  createdAt: Date
}

export interface SearchFilters {
  location?: string
  moveInDate?: Date
  guests?: number
  priceMin?: number
  priceMax?: number
  bedrooms?: number
  bathrooms?: number
  propertyType?: string[]
  amenities?: string[]
  sortBy?: "price-asc" | "price-desc" | "rating" | "newest"
}
