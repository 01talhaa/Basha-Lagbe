import mongoose from "mongoose"

const bookingSchema = new mongoose.Schema(
  {
    leaseRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LeaseRequest",
      required: true,
    },
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    renter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    monthlyRent: {
      type: Number,
      required: true,
    },
    securityDeposit: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "completed", "cancelled", "expired"],
      default: "active",
    },
    agreementUrl: {
      type: String,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "partial", "paid", "overdue"],
      default: "pending",
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

// Indexes for efficient queries
bookingSchema.index({ renter: 1, status: 1 })
bookingSchema.index({ owner: 1, status: 1 })
bookingSchema.index({ listing: 1, status: 1 })
bookingSchema.index({ leaseRequest: 1 })

export default mongoose.models.Booking || mongoose.model("Booking", bookingSchema)
