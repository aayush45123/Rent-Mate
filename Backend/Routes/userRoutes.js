// ===== userRoutes.js (Updated) =====
const express = require("express");
const {
  createOrUpdateUser,
  getUser,
  updateUserProfile,
  submitVerification,
  checkOwnerAccess,
  forceApproval,
  searchFlatmates,
  getAllFlatmates,
  proxyProfileImage,
  getUserDetails, // ADD THIS IMPORT
} = require("../controllers/userController");

const router = express.Router();

// Create or update user (Auth0 data)
router.post("/", createOrUpdateUser);

// Get user by auth0Id
router.get("/:auth0Id", getUser);

// Update user profile (editable fields only)
router.put("/:auth0Id/profile", updateUserProfile);

// Submit verification data
router.post("/:auth0Id/verification", submitVerification);

// Check if user can access owner features
router.get("/:auth0Id/owner-access", checkOwnerAccess);

// ADDED: Force approval route for testing
router.post("/:auth0Id/force-approval", forceApproval);

// Search for flatmates with specific keywords
router.get("/:auth0Id/search-flatmates", searchFlatmates);

// Get all flatmates (general browsing)
router.get("/:auth0Id/flatmates", getAllFlatmates);

// Proxy profile image to avoid CORS issues
router.get("/:auth0Id/profile-image", proxyProfileImage);

// NEW: Get user details for public profile (by user ID)
router.get("/details/:userId", getUserDetails);

module.exports = router;
