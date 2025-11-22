import mongoose from "mongoose"

const CommentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
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
      required: [true, "Comment content is required"],
      maxlength: [2000, "Comment cannot exceed 2000 characters"],
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
    replyCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

// Update counts before saving
CommentSchema.pre("save", function (next) {
  this.likeCount = this.likes.length
  this.dislikeCount = this.dislikes.length
  next()
})

export default mongoose.models.Comment || mongoose.model("Comment", CommentSchema)
