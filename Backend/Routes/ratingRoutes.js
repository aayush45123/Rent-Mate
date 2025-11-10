const express = require("express");
const router = express.Router();
const {
  submitRating,
  getRatings,
  getRatingStats,
  getTrustStats,
  getUserRating,
  getFeaturedTestimonials,
  updateRatingStatus,
} = require("../controllers/ratingController");

// Public routes
router.post("/submit", submitRating);
router.get("/", getRatings);
router.get("/stats", getRatingStats);
router.get("/trust-stats", getTrustStats);
router.get("/user-rating", getUserRating); // Get user's previous rating
router.get("/featured-testimonials", getFeaturedTestimonials); // For testimonials section

// Admin routes (optional - for moderation)
router.patch("/:ratingId/status", updateRatingStatus);

module.exports = router;
