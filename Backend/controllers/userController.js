const User = require("../models/User");
const axios = require("axios");

// Helper function to check if profile is 100% complete
const checkProfileCompletion = (user) => {
  const requiredFields = [
    user.phone,
    user.address,
    user.bio,
    user.socialMedia?.instagram,
    user.socialMedia?.twitter,
    user.socialMedia?.facebook,
    user.socialMedia?.linkedin,
  ];
  return requiredFields.every((field) => field && field.trim() !== "");
};

// Create or update user (Auth0 data)
const createOrUpdateUser = async (req, res) => {
  try {
    const { auth0Id, name, email, picture } = req.body;

    if (!auth0Id) {
      return res.status(400).json({ error: "auth0Id is required" });
    }

    let user = await User.findOne({ auth0Id });

    if (user) {
      user.name = name || user.name;
      user.email = email || user.email;

      // Only update picture if it's different and valid
      if (picture && picture !== user.picture) {
        user.picture = picture;
      }

      await user.save();

      const needsVerification = !user.userType || !user.isVerified;

      res.status(200).json({
        message: "User updated successfully",
        user,
        needsVerification,
        isExistingUser: true,
      });
    } else {
      user = new User({
        auth0Id,
        name,
        email,
        picture: picture || "",
      });
      await user.save();

      res.status(201).json({
        message: "User created successfully",
        user,
        needsVerification: true,
        isExistingUser: false,
      });
    }
  } catch (error) {
    console.error("Error in createOrUpdateUser:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get user by auth0Id
const getUser = async (req, res) => {
  try {
    const { auth0Id } = req.params;
    const user = await User.findOne({ auth0Id });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isProfileComplete = checkProfileCompletion(user);

    res.status(200).json({
      ...user.toObject(),
      isProfileComplete,
    });
  } catch (error) {
    console.error("Error in getUser:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update user profile (editable fields only)
const updateUserProfile = async (req, res) => {
  try {
    const { auth0Id } = req.params;
    const updateData = req.body;

    const allowedUpdates = ["phone", "address", "bio", "socialMedia"];

    const filteredUpdates = Object.keys(updateData)
      .filter((key) => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = updateData[key];
        return obj;
      }, {});

    const user = await User.findOneAndUpdate({ auth0Id }, filteredUpdates, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isProfileComplete = checkProfileCompletion(user);

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        ...user.toObject(),
        isProfileComplete,
      },
    });
  } catch (error) {
    console.error("Error in updateUserProfile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Submit verification
const submitVerification = async (req, res) => {
  try {
    const { auth0Id } = req.params;
    const verificationData = req.body;

    if (!verificationData.userType) {
      return res.status(400).json({ error: "userType is required" });
    }

    if (!verificationData.verificationData) {
      return res.status(400).json({ error: "verificationData is required" });
    }

    const user = await User.findOne({ auth0Id });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.isVerified && user.verificationStatus === "APPROVED") {
      return res.status(409).json({
        error: "Already verified",
        message: "Your account is already verified. No need to resubmit.",
        user: {
          userType: user.userType,
          verificationStatus: user.verificationStatus,
          isVerified: user.isVerified,
          approvedAt: user.approvedAt,
        },
      });
    }

    const { verificationData: vData } = verificationData;
    if (!vData.fullName || !vData.phoneNumber) {
      return res.status(400).json({
        error: "Missing required fields: fullName and phoneNumber",
      });
    }

    if (!vData.address?.street || !vData.address?.city) {
      return res.status(400).json({
        error: "Missing required address fields",
      });
    }

    if (!vData.emergencyContact?.name || !vData.emergencyContact?.phone) {
      return res.status(400).json({
        error: "Missing emergency contact fields",
      });
    }

    user.userType = verificationData.userType;
    user.verificationData = verificationData.verificationData;
    user.verificationStatus = "APPROVED";
    user.isVerified = true;
    user.submittedAt = user.submittedAt || new Date();
    user.approvedAt = new Date();

    await user.save();

    res.status(200).json({
      message:
        "Verification approved successfully! You now have access to all features.",
      user: {
        userType: user.userType,
        verificationStatus: user.verificationStatus,
        isVerified: user.isVerified,
        submittedAt: user.submittedAt,
        approvedAt: user.approvedAt,
      },
    });
  } catch (error) {
    console.error("Error in submitVerification:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: "Validation error",
        details: Object.keys(error.errors).map((key) => ({
          field: key,
          message: error.errors[key].message,
        })),
      });
    }

    res.status(500).json({
      error: "Internal server error",
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Something went wrong",
    });
  }
};

// Check if user can access owner features
const checkOwnerAccess = async (req, res) => {
  try {
    const { auth0Id } = req.params;
    const user = await User.findOne({ auth0Id });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const hasCompletedVerification = !!(user.userType && user.verificationData);
    const isOwnerType =
      user.userType === "PG_OWNER" || user.userType === "FLAT_OWNER";
    const isApproved =
      user.verificationStatus === "APPROVED" ||
      user.verificationStatus === "VERIFIED";

    const canAccess =
      hasCompletedVerification && user.isVerified && isApproved && isOwnerType;

    res.status(200).json({
      canAccess,
      userType: user.userType,
      isVerified: user.isVerified,
      verificationStatus: user.verificationStatus,
      hasCompletedVerification,
      isOwnerType,
    });
  } catch (error) {
    console.error("Error in checkOwnerAccess:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Force approval endpoint
const forceApproval = async (req, res) => {
  try {
    const { auth0Id } = req.params;

    const user = await User.findOne({ auth0Id });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.verificationStatus = "APPROVED";
    user.isVerified = true;
    user.approvedAt = new Date();

    if (!user.submittedAt) {
      user.submittedAt = new Date();
    }

    await user.save();

    res.json({
      message: "User approved successfully",
      user: {
        userType: user.userType,
        verificationStatus: user.verificationStatus,
        isVerified: user.isVerified,
        approvedAt: user.approvedAt,
      },
    });
  } catch (error) {
    console.error("Error in force approval:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Search for flatmates
const searchFlatmates = async (req, res) => {
  try {
    const { auth0Id } = req.params;
    const { keywords, location } = req.query;

    const requestingUser = await User.findOne({ auth0Id });
    if (!requestingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    let searchQuery = {
      auth0Id: { $ne: auth0Id },
      $or: [{ userType: "LOOKING_FOR_PG" }, { userType: { $exists: false } }],
    };

    if (keywords) {
      const keywordRegex = new RegExp(keywords, "i");
      searchQuery.$and = searchQuery.$and || [];
      searchQuery.$and.push({
        $or: [
          { name: keywordRegex },
          { bio: keywordRegex },
          { address: keywordRegex },
        ],
      });
    }

    if (location) {
      const locationRegex = new RegExp(location, "i");
      searchQuery.$and = searchQuery.$and || [];
      searchQuery.$and.push({ address: locationRegex });
    }

    const flatmates = await User.find(searchQuery)
      .select(
        "name email picture bio address phone createdAt userType socialMedia"
      )
      .limit(20);

    res.status(200).json({
      flatmates,
      total: flatmates.length,
    });
  } catch (error) {
    console.error("Error in searchFlatmates:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all flatmates
const getAllFlatmates = async (req, res) => {
  try {
    const { auth0Id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const requestingUser = await User.findOne({ auth0Id });
    if (!requestingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const flatmates = await User.find({
      auth0Id: { $ne: auth0Id },
      $or: [{ userType: "LOOKING_FOR_PG" }, { userType: { $exists: false } }],
    })
      .select(
        "name email picture bio address phone createdAt userType socialMedia"
      )
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const totalCount = await User.countDocuments({
      auth0Id: { $ne: auth0Id },
      $or: [{ userType: "LOOKING_FOR_PG" }, { userType: { $exists: false } }],
    });

    res.status(200).json({
      flatmates,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalCount,
        hasNextPage: skip + parseInt(limit) < totalCount,
        hasPrevPage: parseInt(page) > 1,
      },
    });
  } catch (error) {
    console.error("Error in getAllFlatmates:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// FIXED: Enhanced proxy with better error handling and no CORS issues
const proxyProfileImage = async (req, res) => {
  try {
    const { auth0Id } = req.params;

    console.log("🖼️ Proxy request for auth0Id:", auth0Id);

    const user = await User.findOne({
      $or: [{ auth0Id }, { _id: auth0Id }],
    });

    if (!user) {
      console.error("❌ User not found for proxy request");
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.picture) {
      console.error("❌ No picture URL for user");
      return res.status(404).json({ error: "Picture not found" });
    }

    console.log("🖼️ User picture URL:", user.picture);

    // If already base64, return directly
    if (user.picture.startsWith("data:")) {
      console.log("✅ Returning base64 image directly");
      return res.json({ imageUrl: user.picture });
    }

    // Check if it's a Google image
    const isGoogleImage =
      user.picture.includes("googleusercontent.com") ||
      user.picture.includes("googleapis.com");

    if (!isGoogleImage) {
      // For non-Google images, return URL directly
      console.log("✅ Non-Google image, returning URL directly");
      return res.json({ imageUrl: user.picture });
    }

    // For Google images, try to fetch and convert
    console.log("🔄 Fetching Google image...");

    try {
      const imageResponse = await axios.get(user.picture, {
        responseType: "arraybuffer",
        timeout: 15000,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          Accept: "image/webp,image/apng,image/*,*/*;q=0.8",
          "Accept-Encoding": "gzip, deflate, br",
          "Accept-Language": "en-US,en;q=0.9",
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Referer: "https://accounts.google.com/",
        },
        maxRedirects: 5,
        validateStatus: (status) => status < 500,
      });

      if (imageResponse.status === 200 && imageResponse.data) {
        console.log("✅ Image fetched successfully");
        console.log("📊 Image size:", imageResponse.data.length, "bytes");

        const base64Image = Buffer.from(imageResponse.data).toString("base64");
        const contentType =
          imageResponse.headers["content-type"] || "image/jpeg";
        const dataUrl = `data:${contentType};base64,${base64Image}`;

        console.log("✅ Returning proxied image as base64");
        return res.json({ imageUrl: dataUrl });
      } else {
        console.log("⚠️ Non-200 status, returning original URL");
        return res.json({ imageUrl: user.picture });
      }
    } catch (fetchError) {
      console.error("⚠️ Error fetching image:", fetchError.message);
      // Return original URL as fallback
      return res.json({ imageUrl: user.picture });
    }
  } catch (error) {
    console.error("❌ Error in proxyProfileImage:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get user details by ID
const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({
      $or: [{ _id: userId }, { auth0Id: userId }],
    }).select(
      "name email picture bio address phone createdAt userType socialMedia verificationStatus isVerified"
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const publicUserData = {
      _id: user._id,
      auth0Id: user.auth0Id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      bio: user.bio,
      address: user.address,
      phone: user.phone,
      socialMedia: user.socialMedia,
      userType: user.userType,
      isVerified: user.isVerified,
      memberSince: user.createdAt,
      profileCompletion: calculateProfileCompletion(user),
    };

    res.status(200).json({
      success: true,
      user: publicUserData,
    });
  } catch (error) {
    console.error("Error in getUserDetails:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// Helper function to calculate profile completion percentage
const calculateProfileCompletion = (user) => {
  const fields = [
    user.name,
    user.email,
    user.picture,
    user.bio,
    user.address,
    user.phone,
    user.socialMedia?.instagram,
    user.socialMedia?.facebook,
    user.socialMedia?.linkedin,
    user.socialMedia?.twitter,
  ];

  const completedFields = fields.filter(
    (field) => field && (typeof field === "string" ? field.trim() !== "" : true)
  ).length;

  return Math.round((completedFields / fields.length) * 100);
};

module.exports = {
  createOrUpdateUser,
  getUser,
  updateUserProfile,
  submitVerification,
  checkOwnerAccess,
  forceApproval,
  searchFlatmates,
  getAllFlatmates,
  proxyProfileImage,
  getUserDetails,
  calculateProfileCompletion,
};
