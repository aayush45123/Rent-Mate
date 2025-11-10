const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    auth0Id: {
      type: String,
      unique: true,
      required: true,
    },
    name: String,
    email: String,
    picture: { type: String, default: "" },

    // Additional profile fields (existing)
    phone: String,
    address: String,
    bio: String,
    socialMedia: {
      instagram: String,
      twitter: String,
      facebook: String,
      linkedin: String,
    },

    // New verification fields
    userType: {
      type: String,
      enum: ["PG_OWNER", "FLAT_OWNER", "LOOKING_FOR_PG"],
      default: null, // null means user hasn't selected type yet
    },
    verificationStatus: {
      type: String,
      enum: ["PENDING", "IN_REVIEW", "APPROVED", "VERIFIED", "REJECTED"], // Added APPROVED for auto-approval
      default: "PENDING",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationData: {
      // Common fields
      fullName: String,
      phoneNumber: String,
      alternatePhone: String,
      address: {
        street: String,
        city: String,
        state: String,
        pincode: String,
        landmark: String,
      },

      // Owner-specific fields
      propertyType: String, // 'PG', 'FLAT', 'APARTMENT'
      propertyAddress: {
        street: String,
        city: String,
        state: String,
        pincode: String,
        landmark: String,
      },

      // Identity verification
      identityProof: {
        type: {
          // Changed from proofType to type to match frontend
          type: String,
          enum: ["AADHAR", "PAN", "DRIVING_LICENSE", "PASSPORT"],
          required: false,
        },
        number: String,
        frontImage: String, // URL or base64
        backImage: String, // URL or base64
      },

      // Property ownership proof (for owners)
      ownershipProof: {
        type: {
          // Changed from proofType to type to match frontend
          type: String,
          enum: ["REGISTRY", "LEASE_AGREEMENT", "NOC"],
          required: false,
        },
        documentImage: String, // URL or base64
      },

      // Additional documents
      additionalDocuments: [
        {
          name: String,
          url: String,
          type: String,
        },
      ],

      // Emergency contact
      emergencyContact: {
        name: String,
        relation: String,
        phone: String,
      },

      // Professional details (optional)
      profession: String,
      workAddress: String,
      monthlyIncome: String, // Changed from Number to String to match frontend

      // For PG seekers
      preferences: {
        budget: {
          min: String, // Changed from Number to String to match frontend
          max: String, // Changed from Number to String to match frontend
        },
        location: [String],
        roomType: {
          type: String,
          enum: ["SINGLE", "SHARED", "ANY"],
          default: "ANY", // Added default
        },
        foodPreference: {
          type: String,
          enum: ["VEG", "NON_VEG", "BOTH"],
          default: "BOTH", // Added default
        },
      },
    },
    adminNotes: String,
    submittedAt: Date,
    reviewedAt: Date,
    approvedAt: Date, // Added for tracking approval time
  },
  {
    timestamps: true,
    collection: "users",
  }
);

// Index for better performance
userSchema.index({ auth0Id: 1 });
userSchema.index({ userType: 1 });
userSchema.index({ verificationStatus: 1 });
userSchema.index({ isVerified: 1 });

// Pre-save middleware to handle verification status changes
userSchema.pre("save", function (next) {
  // Auto-set approvedAt and isVerified when status changes to APPROVED
  if (
    this.isModified("verificationStatus") &&
    this.verificationStatus === "APPROVED"
  ) {
    this.approvedAt = new Date();
    this.isVerified = true;
    this.reviewedAt = new Date();
  }

  // Also handle VERIFIED status for backward compatibility
  if (
    this.isModified("verificationStatus") &&
    this.verificationStatus === "VERIFIED"
  ) {
    this.approvedAt = new Date();
    this.isVerified = true;
    this.reviewedAt = new Date();
  }

  // Handle rejection
  if (
    this.isModified("verificationStatus") &&
    this.verificationStatus === "REJECTED"
  ) {
    this.isVerified = false;
    this.reviewedAt = new Date();
  }

  next();
});

// Instance method to check if user can access owner features
userSchema.methods.canAccessOwnerFeatures = function () {
  return (
    this.isVerified &&
    (this.verificationStatus === "APPROVED" ||
      this.verificationStatus === "VERIFIED") &&
    (this.userType === "PG_OWNER" || this.userType === "FLAT_OWNER")
  );
};

// Instance method to check if verification is complete
userSchema.methods.hasCompletedVerification = function () {
  return !!(this.userType && this.verificationData);
};

module.exports = mongoose.model("User", userSchema);
