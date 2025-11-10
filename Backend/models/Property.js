const mongoose = require("mongoose");

const PropertySchema = new mongoose.Schema(
  {
    // Owner Information
    ownerId: {
      type: String,
      required: true,
      index: true,
    },

    // Step 1: Property Type & Basic Info
    propertyType: {
      type: String,
      required: true,
      enum: ["PG", "FLAT", "ROOM"],
    },
    propertySubType: {
      type: String,
      required: true,
    },
    propertyTitle: {
      type: String,
      required: true,
      maxlength: 100,
    },
    propertyDescription: {
      type: String,
      required: true,
      maxlength: 1000,
    },

    // Step 2: Location Details
    address: {
      street: {
        type: String,
        required: true,
      },
      area: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      pincode: {
        type: String,
        required: true,
        match: /^\d{6}$/,
      },
      landmark: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    nearbyPlaces: {
      metro: [String],
      hospital: [String],
      school: [String],
      market: [String],
      office: [String],
    },

    // Step 3: Property Details
    propertyDetails: {
      totalRooms: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
      },
      availableRooms: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
      },
      bathrooms: {
        type: Number,
        required: true,
        min: 1,
        max: 6,
      },
      balconies: {
        type: Number,
        default: 0,
        min: 0,
        max: 4,
      },
      floor: String,
      totalFloors: Number,
      builtUpArea: Number,
      carpetArea: Number,
      furnishingStatus: {
        type: String,
        required: true,
        enum: ["Fully Furnished", "Semi Furnished", "Unfurnished"],
      },
      ageOfProperty: {
        type: String,
        enum: [
          "Under Construction",
          "0-1 years",
          "1-5 years",
          "5-10 years",
          "10-20 years",
          "20+ years",
        ],
      },
      parking: {
        type: String,
        enum: ["No Parking", "Bike Parking", "Car Parking", "Both"],
      },
    },

    // Step 4: Amenities & Features
    amenities: {
      basic: [String],
      safety: [String],
      recreational: [String],
      services: [String],
    },
    rules: {
      gender: {
        type: String,
        required: true,
        enum: ["Male Only", "Female Only", "Both"],
      },
      smoking: {
        type: Boolean,
        default: false,
      },
      drinking: {
        type: Boolean,
        default: false,
      },
      pets: {
        type: Boolean,
        default: false,
      },
      guestsAllowed: {
        type: Boolean,
        default: false,
      },
      foodRestrictions: {
        type: String,
        enum: ["", "Vegetarian Only", "No Non-Veg Cooking", "Jain Food Only"],
      },
      timing: {
        entry: String,
        exit: String,
      },
    },

    // Step 5: Pricing & Availability
    pricing: {
      rentAmount: {
        type: Number,
        required: true,
        min: 0,
      },
      securityDeposit: {
        type: Number,
        required: true,
        min: 0,
      },
      maintenanceCharges: {
        type: Number,
        default: 0,
        min: 0,
      },
      electricityCharges: {
        type: String,
        enum: ["", "Included in Rent", "As per Meter", "Fixed Amount"],
      },
      additionalCharges: [String],
      rentNegotiable: {
        type: Boolean,
        default: false,
      },
    },
    availability: {
      availableFrom: {
        type: Date,
        required: true,
      },
      minimumStay: String,
      maximumStay: String,
      noticePeriod: String,
    },

    // Step 6: Photos & Videos
    media: {
      images: [
        {
          id: String,
          name: String,
          url: String,
          _id: false,
        },
      ],
      virtualTourLink: String,
      videoLink: String,
    },

    // Step 7: Contact & Final Details
    contactInfo: {
      contactPerson: {
        type: String,
        required: true,
      },
      phoneNumber: {
        type: String,
        required: true,
        match: /^[6-9]\d{9}$/,
      },
      alternateNumber: {
        type: String,
        match: /^[6-9]\d{9}$/,
      },
      email: {
        type: String,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      },
      preferredContactTime: String,
      showContactInfo: {
        type: Boolean,
        default: true,
      },
    },

    // Publishing Status
    publishStatus: {
      type: String,
      enum: ["draft", "published", "inactive"],
      default: "draft",
    },

    // Additional fields for management
    verified: {
      type: Boolean,
      default: false,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    inquiries: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
PropertySchema.index({ "address.city": 1, "address.area": 1 });
PropertySchema.index({ propertyType: 1, publishStatus: 1 });
PropertySchema.index({ "pricing.rentAmount": 1 });
PropertySchema.index({ createdAt: -1 });
PropertySchema.index({ ownerId: 1, publishStatus: 1 });

// Virtual for full address
PropertySchema.virtual("fullAddress").get(function () {
  return `${this.address.street}, ${this.address.area}, ${this.address.city}, ${this.address.state} - ${this.address.pincode}`;
});

// Method to increment views
PropertySchema.methods.incrementViews = function () {
  this.views += 1;
  return this.save();
};

// Method to increment inquiries
PropertySchema.methods.incrementInquiries = function () {
  this.inquiries += 1;
  return this.save();
};

// Static method to find published properties
PropertySchema.statics.findPublished = function (filters = {}) {
  return this.find({
    publishStatus: "published",
    isActive: true,
    ...filters,
  }).sort({ createdAt: -1 });
};

// Static method for search functionality
PropertySchema.statics.searchProperties = function (searchQuery, filters = {}) {
  const query = {
    publishStatus: "published",
    isActive: true,
    ...filters,
  };

  if (searchQuery) {
    query.$or = [
      { propertyTitle: { $regex: searchQuery, $options: "i" } },
      { propertyDescription: { $regex: searchQuery, $options: "i" } },
      { "address.city": { $regex: searchQuery, $options: "i" } },
      { "address.area": { $regex: searchQuery, $options: "i" } },
      { "address.landmark": { $regex: searchQuery, $options: "i" } },
    ];
  }

  return this.find(query).sort({ createdAt: -1 });
};

module.exports = mongoose.model("Property", PropertySchema);
