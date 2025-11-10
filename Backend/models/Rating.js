const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      maxlength: 500,
      default: "",
    },
    userName: {
      type: String,
      required: true,
      default: "Anonymous",
    },
    userEmail: {
      type: String,
      default: "",
    },
    auth0Id: {
      type: String,
      default: "",
    },
    userPicture: {
      type: String,
      default: "",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    userType: {
      type: String,
      enum: ["LOOKING_FOR_PG", "PG_OWNER", "FLAT_OWNER", null],
      default: null,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
ratingSchema.index({ rating: 1, createdAt: -1 });
ratingSchema.index({ status: 1, isFeatured: 1 });
ratingSchema.index({ userEmail: 1 }); // For user-specific queries
ratingSchema.index({ auth0Id: 1 }); // For Auth0 user queries

module.exports = mongoose.model("Rating", ratingSchema);
