const User = require("../models/User");

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

  const filledFields = requiredFields.filter(
    (field) => field && field.trim() !== ""
  ).length;

  return filledFields === requiredFields.length;
};

// Search for flatmates based on keywords
const searchFlatmates = async (req, res) => {
  try {
    const { auth0Id } = req.params;
    const { keywords } = req.query;

    if (!auth0Id) {
      return res.status(400).json({ error: "auth0Id is required" });
    }

    // Get current user
    const currentUser = await User.findOne({ auth0Id });
    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if current user's profile is 100% complete
    const isProfileComplete = checkProfileCompletion(currentUser);
    if (!isProfileComplete) {
      return res.status(400).json({
        error: "Complete your profile first to search for flatmates",
        completionStatus: false,
      });
    }

    // Build search query
    let searchQuery = {
      auth0Id: { $ne: auth0Id }, // Exclude current user
      bio: { $exists: true, $ne: "" }, // Must have bio
    };

    // Add keyword search if provided
    if (keywords) {
      const keywordArray = keywords
        .split(",")
        .map((k) => k.trim().toLowerCase());
      const regexPattern = keywordArray.join("|");

      searchQuery.bio = {
        ...searchQuery.bio,
        $regex: new RegExp(regexPattern, "i"),
      };
    } else {
      // Default search for common flatmate keywords
      const defaultKeywords = [
        "searching.*pg",
        "searching.*flatmate",
        "looking.*flatmate",
        "need.*roommate",
        "sharing.*flat",
        "searching.*roommate",
        "looking.*og",
        "flat.*mate",
        "room.*mate",
        "need.*og",
        "want.*flatmate",
      ];

      searchQuery.bio = {
        ...searchQuery.bio,
        $regex: new RegExp(defaultKeywords.join("|"), "i"),
      };
    }

    // Find matching users
    const potentialFlatmates = await User.find(searchQuery).select(
      "name email picture phone address bio socialMedia createdAt"
    );

    // Filter users with complete profiles only
    const completeFlatmates = potentialFlatmates.filter((user) =>
      checkProfileCompletion(user)
    );

    res.status(200).json({
      message: "Flatmates found successfully",
      count: completeFlatmates.length,
      flatmates: completeFlatmates,
      searchQuery: keywords || "default keywords",
    });
  } catch (error) {
    console.error("Backend error in searchFlatmates:", error);
    res.status(500).json({ error: error.message });
  }
};
// Get all users with complete profiles (for general flatmate browsing)
const getAllFlatmates = async (req, res) => {
  try {
    const { auth0Id } = req.params;
    console.log("🔍 getAllFlatmates called with auth0Id:", auth0Id);

    if (!auth0Id) {
      return res.status(400).json({ error: "auth0Id is required" });
    }

    // Get current user
    const currentUser = await User.findOne({ auth0Id });
    console.log("👤 Current user found:", currentUser ? "Yes" : "No");

    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if current user's profile is complete
    const isProfileComplete = checkProfileCompletion(currentUser);
    console.log("✅ Current user profile complete:", isProfileComplete);

    if (!isProfileComplete) {
      return res.status(400).json({
        error: "Complete your profile first to view flatmates",
        completionStatus: false,
      });
    }

    // Get all users except current user
    const allUsers = await User.find({
      auth0Id: { $ne: auth0Id },
      bio: { $exists: true, $ne: "" },
    }).select("name email picture phone address bio socialMedia createdAt");

    console.log("📊 Total users found (excluding current):", allUsers.length);

    // Filter users with complete profiles only
    const completeFlatmates = allUsers.filter((user) => {
      const isComplete = checkProfileCompletion(user);
      console.log(`👥 User ${user.name} profile complete:`, isComplete);
      return isComplete;
    });

    console.log("🎯 Complete flatmates found:", completeFlatmates.length);

    res.status(200).json({
      message: "All flatmates retrieved successfully",
      count: completeFlatmates.length,
      flatmates: completeFlatmates,
      debug: {
        currentUserId: auth0Id,
        totalUsersInDB: allUsers.length,
        completeFlatmates: completeFlatmates.length,
      },
    });
  } catch (error) {
    console.error("Backend error in getAllFlatmates:", error);
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  searchFlatmates,
  getAllFlatmates,
};
