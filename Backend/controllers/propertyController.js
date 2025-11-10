const Property = require("../models/Property");

// Create a new property listing
const createProperty = async (req, res) => {
  try {
    const propertyData = req.body;

    // Validate required fields
    if (!propertyData.ownerId) {
      return res.status(400).json({
        success: false,
        error: "Owner ID is required",
      });
    }

    // Create new property
    const property = new Property(propertyData);
    await property.save();

    res.status(201).json({
      success: true,
      message: "Property created successfully",
      property: property,
    });
  } catch (error) {
    console.error("Create property error:", error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Get all published properties for Find Your Stay
const getAllProperties = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      city,
      area,
      propertyType,
      minRent,
      maxRent,
      gender,
      furnishing,
      sortBy = "createdAt",
      sortOrder = "desc",
      search,
    } = req.query;

    // Build filter object
    const filters = {};

    if (city) filters["address.city"] = new RegExp(city, "i");
    if (area) filters["address.area"] = new RegExp(area, "i");
    if (propertyType) filters.propertyType = propertyType;
    if (gender) filters["rules.gender"] = { $in: [gender, "Both"] };
    if (furnishing) filters["propertyDetails.furnishingStatus"] = furnishing;

    // Rent range filter
    if (minRent || maxRent) {
      filters["pricing.rentAmount"] = {};
      if (minRent) filters["pricing.rentAmount"].$gte = parseInt(minRent);
      if (maxRent) filters["pricing.rentAmount"].$lte = parseInt(maxRent);
    }

    // Search functionality
    let query;
    if (search) {
      query = Property.searchProperties(search, filters);
    } else {
      query = Property.findPublished(filters);
    }

    // Apply sorting
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;
    query = query.sort(sortOptions);

    // Apply pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    query = query.skip(skip).limit(parseInt(limit));

    // Execute query and get total count
    const [properties, totalProperties] = await Promise.all([
      query.exec(),
      Property.countDocuments({
        publishStatus: "published",
        isActive: true,
        ...filters,
      }),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalProperties / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPreviousPage = parseInt(page) > 1;

    res.status(200).json({
      success: true,
      data: {
        properties,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalProperties,
          hasNextPage,
          hasPreviousPage,
          limit: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error("Get all properties error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get a single property by ID
const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({
        success: false,
        error: "Property not found",
      });
    }

    // Increment view count
    await property.incrementViews();

    res.status(200).json({
      success: true,
      data: property,
    });
  } catch (error) {
    console.error("Get property by ID error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get properties by owner
const getPropertiesByOwner = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const { status = "all" } = req.query;

    let filters = { ownerId };

    if (status !== "all") {
      filters.publishStatus = status;
    }

    const properties = await Property.find(filters).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: properties,
    });
  } catch (error) {
    console.error("Get properties by owner error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Update property
const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({
        success: false,
        error: "Property not found",
      });
    }

    // Check if user is the owner
    if (property.ownerId !== updateData.ownerId && updateData.ownerId) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to update this property",
      });
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Property updated successfully",
      data: updatedProperty,
    });
  } catch (error) {
    console.error("Update property error:", error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Delete property
const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const { ownerId } = req.body;

    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({
        success: false,
        error: "Property not found",
      });
    }

    // Check if user is the owner
    if (property.ownerId !== ownerId) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to delete this property",
      });
    }

    await Property.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Property deleted successfully",
    });
  } catch (error) {
    console.error("Delete property error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Toggle property active status
const togglePropertyStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { ownerId } = req.body;

    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({
        success: false,
        error: "Property not found",
      });
    }

    // Check if user is the owner
    if (property.ownerId !== ownerId) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to modify this property",
      });
    }

    property.isActive = !property.isActive;
    await property.save();

    res.status(200).json({
      success: true,
      message: `Property ${
        property.isActive ? "activated" : "deactivated"
      } successfully`,
      data: property,
    });
  } catch (error) {
    console.error("Toggle property status error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get property statistics
const getPropertyStats = async (req, res) => {
  try {
    const { ownerId } = req.params;

    const stats = await Property.aggregate([
      { $match: { ownerId } },
      {
        $group: {
          _id: null,
          totalProperties: { $sum: 1 },
          publishedProperties: {
            $sum: { $cond: [{ $eq: ["$publishStatus", "published"] }, 1, 0] },
          },
          draftProperties: {
            $sum: { $cond: [{ $eq: ["$publishStatus", "draft"] }, 1, 0] },
          },
          totalViews: { $sum: "$views" },
          totalInquiries: { $sum: "$inquiries" },
          averageRent: { $avg: "$pricing.rentAmount" },
        },
      },
    ]);

    const result = stats[0] || {
      totalProperties: 0,
      publishedProperties: 0,
      draftProperties: 0,
      totalViews: 0,
      totalInquiries: 0,
      averageRent: 0,
    };

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Get property stats error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Record property inquiry
const recordInquiry = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({
        success: false,
        error: "Property not found",
      });
    }

    await property.incrementInquiries();

    res.status(200).json({
      success: true,
      message: "Inquiry recorded successfully",
    });
  } catch (error) {
    console.error("Record inquiry error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get featured properties
const getFeaturedProperties = async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const properties = await Property.findPublished({ featured: true })
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: properties,
    });
  } catch (error) {
    console.error("Get featured properties error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get recent properties
const getRecentProperties = async (req, res) => {
  try {
    const { limit = 8 } = req.query;

    const properties = await Property.findPublished()
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: properties,
    });
  } catch (error) {
    console.error("Get recent properties error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  createProperty,
  getAllProperties,
  getPropertyById,
  getPropertiesByOwner,
  updateProperty,
  deleteProperty,
  togglePropertyStatus,
  getPropertyStats,
  recordInquiry,
  getFeaturedProperties,
  getRecentProperties,
};
