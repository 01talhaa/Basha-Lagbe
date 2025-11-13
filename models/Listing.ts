import mongoose, { Schema, Document } from "mongoose"

export interface IListing extends Document {
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
  propertyType: "apartment" | "house" | "studio" | "condo" | "townhouse"
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

const ListingSchema = new Schema<IListing>(
  {
    hostId: {
      type: String,
      required: [true, "Host ID is required"],
      index: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [2000, "Description cannot be more than 2000 characters"],
    },
    location: {
      address: {
        type: String,
        required: [true, "Address is required"],
      },
      city: {
        type: String,
        required: [true, "City is required"],
      },
      state: {
        type: String,
        required: [true, "State is required"],
      },
      zipCode: {
        type: String,
        required: [true, "Zip code is required"],
      },
      latitude: {
        type: Number,
        required: [true, "Latitude is required"],
      },
      longitude: {
        type: Number,
        required: [true, "Longitude is required"],
      },
    },
    propertyType: {
      type: String,
      required: [true, "Property type is required"],
      enum: {
        values: ["apartment", "house", "studio", "condo", "townhouse"],
        message: "{VALUE} is not a valid property type",
      },
    },
    bedrooms: {
      type: Number,
      required: [true, "Number of bedrooms is required"],
      min: [0, "Bedrooms cannot be negative"],
    },
    bathrooms: {
      type: Number,
      required: [true, "Number of bathrooms is required"],
      min: [0, "Bathrooms cannot be negative"],
    },
    maxGuests: {
      type: Number,
      required: [true, "Maximum guests is required"],
      min: [1, "Must allow at least 1 guest"],
    },
    pricePerMonth: {
      type: Number,
      required: [true, "Price per month is required"],
      min: [0, "Price cannot be negative"],
    },
    securityDeposit: {
      type: Number,
      required: [true, "Security deposit is required"],
      min: [0, "Security deposit cannot be negative"],
    },
    maintenanceFee: {
      type: Number,
      default: 0,
      min: [0, "Maintenance fee cannot be negative"],
    },
    images: {
      type: [String],
      required: [true, "At least one image is required"],
      validate: {
        validator: function (v: string[]) {
          return v && v.length > 0
        },
        message: "At least one image is required",
      },
    },
    amenities: {
      type: [String],
      default: [],
    },
    rules: {
      type: [String],
      default: [],
    },
    availability: {
      startDate: {
        type: Date,
        required: [true, "Start date is required"],
      },
      endDate: {
        type: Date,
        required: [true, "End date is required"],
      },
      bookedDates: {
        type: [Date],
        default: [],
      },
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, "Rating cannot be negative"],
      max: [5, "Rating cannot exceed 5"],
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: [0, "Review count cannot be negative"],
    },
  },
  {
    timestamps: true,
  }
)

// Indexes for better query performance
ListingSchema.index({ hostId: 1, createdAt: -1 })
ListingSchema.index({ "location.city": 1, "location.state": 1 })
ListingSchema.index({ propertyType: 1 })
ListingSchema.index({ pricePerMonth: 1 })
ListingSchema.index({ rating: -1 })

// Prevent model recompilation in development
const Listing = mongoose.models.Listing || mongoose.model<IListing>("Listing", ListingSchema)

export default Listing
