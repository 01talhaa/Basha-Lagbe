import mongoose, { Schema, Document, Model } from "mongoose"
import "./User"
import "./Listing"

export interface ILeaseRequest extends Document {
  listing: mongoose.Types.ObjectId
  renter: mongoose.Types.ObjectId
  owner: mongoose.Types.ObjectId
  status: "pending" | "approved" | "rejected" | "visit_scheduled" | "agreement_sent" | "agreement_signed" | "completed" | "cancelled"
  message: string
  visitDate?: Date
  agreementUrl?: string
  agreementSignedAt?: Date
  rejectionReason?: string
  createdAt?: Date
  updatedAt?: Date
}

const LeaseRequestSchema = new Schema<ILeaseRequest>(
  {
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
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "visit_scheduled", "agreement_sent", "agreement_signed", "completed", "cancelled"],
      default: "pending",
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    visitDate: {
      type: Date,
    },
    agreementUrl: {
      type: String,
    },
    agreementSignedAt: {
      type: Date,
    },
    rejectionReason: {
      type: String,
    },
  },
  { timestamps: true }
)

// Indexes for faster queries
LeaseRequestSchema.index({ renter: 1, createdAt: -1 })
LeaseRequestSchema.index({ owner: 1, status: 1, createdAt: -1 })
LeaseRequestSchema.index({ listing: 1, renter: 1 })

if (mongoose.models.LeaseRequest) {
  delete mongoose.models.LeaseRequest
}

const LeaseRequest: Model<ILeaseRequest> = mongoose.model<ILeaseRequest>("LeaseRequest", LeaseRequestSchema)

export default LeaseRequest
