import mongoose from "mongoose"

const ReplySchema = new mongoose.Schema(
  {
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    authorName: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: [true, "Reply content is required"],
      maxlength: [1000, "Reply cannot exceed 1000 characters"],
    },
    images: [
      {
        type: String,
      },
    ],
    likes: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    dislikes: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    likeCount: {
      type: Number,
      default: 0,
    },
    dislikeCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

// Update counts before saving
ReplySchema.pre("save", function (next) {
  this.likeCount = this.likes.length
  this.dislikeCount = this.dislikes.length
  next()
})

export default mongoose.models.Reply || mongoose.model("Reply", ReplySchema)
