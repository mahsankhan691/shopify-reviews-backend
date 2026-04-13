const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: [true, "Product ID is required"],
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Reviewer name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    reviewText: {
      type: String,
      required: false,
      trim: true,
      maxlength: [2000, "Review cannot exceed 2000 characters"],
    },
    isApproved: {
      type: Boolean,
      default: true, // Set to false if you want manual approval before showing reviews
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model("Review", ReviewSchema);
