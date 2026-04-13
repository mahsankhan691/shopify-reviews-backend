const express = require("express");
const router = express.Router();
const Review = require("../models/Review");

// ──────────────────────────────────────────────
// GET /api/reviews?productId=<id>
// Fetch all approved reviews for a product
// ──────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const { productId } = req.query;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "productId query parameter is required",
      });
    }

    const reviews = await Review.find({
      productId: productId,
      isApproved: true,
    }).sort({ createdAt: -1 }); // Newest first

    // Calculate average rating
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating =
      reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;

    res.status(200).json({
      success: true,
      count: reviews.length,
      averageRating: parseFloat(averageRating),
      reviews: reviews,
    });
  } catch (error) {
    console.error("GET /reviews error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching reviews",
    });
  }
});

// ──────────────────────────────────────────────
// POST /api/reviews
// Submit a new review
// ──────────────────────────────────────────────
router.post("/", async (req, res) => {
  try {
    const { productId, name, rating, reviewText } = req.body;

    // Basic validation
    if (!productId || !name || !rating) {
      return res.status(400).json({
        success: false,
        message: "Key fields are required: productId, name, rating",
      });
    }

    // Rating range check
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const newReview = new Review({
      productId,
      name: name.trim(),
      rating: parseInt(rating),
      reviewText: reviewText ? reviewText.trim() : "",
    });

    const savedReview = await newReview.save();

    res.status(201).json({
      success: true,
      message: "Review submitted successfully!",
      review: savedReview,
    });
  } catch (error) {
    console.error("POST /reviews error:", error);

    // Mongoose validation error
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while saving review",
    });
  }
});

// ──────────────────────────────────────────────
// DELETE /api/reviews/:id  (Admin use only)
// Delete a review by its ID
// ──────────────────────────────────────────────
router.delete("/:id", async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /reviews error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting review",
    });
  }
});

// ──────────────────────────────────────────────
// PATCH /api/reviews/:id/approve  (Admin use only)
// Approve or disapprove a review
// ──────────────────────────────────────────────
router.patch("/:id/approve", async (req, res) => {
  try {
    const { isApproved } = req.body;

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved: isApproved },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Review ${isApproved ? "approved" : "hidden"} successfully`,
      review: review,
    });
  } catch (error) {
    console.error("PATCH /reviews/approve error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating review",
    });
  }
});

module.exports = router;
