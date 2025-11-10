import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  FaUser,
  FaEdit,
  FaSave,
  FaTimes,
  FaShieldAlt,
  FaCheckCircle,
  FaSearch,
  FaInstagram,
  FaTwitter,
  FaFacebook,
  FaLinkedin,
  FaHome,
  FaLock,
  FaExclamationTriangle,
} from "react-icons/fa";
import { HiLocationMarker, HiMail, HiPhone } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import UserProperties from "../../components/UserProperties/UserProperties";
import styles from "./UserProfile.module.css";

const UserProfile = () => {
  const { user, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  // State management
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [activeSection, setActiveSection] = useState("profile");
  const [formData, setFormData] = useState({
    phone: "",
    address: "",
    bio: "",
    socialMedia: {
      instagram: "",
      twitter: "",
      facebook: "",
      linkedin: "",
    },
  });

  // Avatar color generation
  const getAvatarColor = (name) => {
    if (!name) return "#2563eb";
    const colors = [
      "#2563eb",
      "#7c3aed",
      "#dc2626",
      "#059669",
      "#d97706",
      "#0891b2",
      "#be185d",
      "#4338ca",
      "#65a30d",
      "#c2410c",
    ];
    return colors[name.charCodeAt(0) % colors.length];
  };

  // Image handlers
  const handleImageError = () => setImageError(true);
  const handleImageLoad = () => setImageError(false);

  // Check if user is verified and has verification data
  const isVerified =
    userData?.isVerified && userData?.verificationStatus === "APPROVED";
  const hasVerificationData = userData?.verificationData;

  // Get verified data or fallback to profile data
  const getDisplayData = () => {
    if (hasVerificationData) {
      const vData = userData.verificationData;
      return {
        phone: vData.phoneNumber || userData.phone || "",
        address: vData.address
          ? `${vData.address.street}, ${vData.address.city}, ${vData.address.state} - ${vData.address.pincode}`
          : userData.address || "",
        fullName: vData.fullName || userData.name || "",
        alternatePhone: vData.alternatePhone || "",
        profession: vData.profession || "",
        emergencyContact: vData.emergencyContact || null,
      };
    }
    return {
      phone: userData?.phone || "",
      address: userData?.address || "",
      fullName: userData?.name || "",
      alternatePhone: "",
      profession: "",
      emergencyContact: null,
    };
  };

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated || !user) return;

      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/user/${user.sub}`
        );

        if (response.ok) {
          const data = await response.json();
          setUserData(data);

          // Set form data - only editable fields (bio and social media)
          setFormData({
            phone: data.phone || "",
            address: data.address || "",
            bio: data.bio || "",
            socialMedia: {
              instagram: data.socialMedia?.instagram || "",
              twitter: data.socialMedia?.twitter || "",
              facebook: data.socialMedia?.facebook || "",
              linkedin: data.socialMedia?.linkedin || "",
            },
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isAuthenticated, user]);

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("social.")) {
      const socialPlatform = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        socialMedia: { ...prev.socialMedia, [socialPlatform]: value },
      }));
    } else {
      // Only allow editing of non-verified fields
      if (!isVerified || (name !== "phone" && name !== "address")) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      // Only send editable fields
      const updatePayload = {
        bio: formData.bio,
        socialMedia: formData.socialMedia,
      };

      // Include phone and address only if user is not verified
      if (!isVerified) {
        updatePayload.phone = formData.phone;
        updatePayload.address = formData.address;
      }

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/user/${user.sub}/profile`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatePayload),
        }
      );

      if (response.ok) {
        const updatedUser = await response.json();
        setUserData(updatedUser.user);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (!userData) return;
    setFormData({
      phone: userData.phone || "",
      address: userData.address || "",
      bio: userData.bio || "",
      socialMedia: {
        instagram: userData.socialMedia?.instagram || "",
        twitter: userData.socialMedia?.twitter || "",
        facebook: userData.socialMedia?.facebook || "",
        linkedin: userData.socialMedia?.linkedin || "",
      },
    });
    setIsEditing(false);
  };

  // Utility functions
  const getCompletionPercentage = () => {
    const baseFields = [
      userData?.bio,
      ...Object.values(userData?.socialMedia || {}),
    ];

    // Add verified fields or profile fields
    const displayData = getDisplayData();
    baseFields.push(displayData.phone, displayData.address);

    const filledFields = baseFields.filter(
      (field) => field && field.trim()
    ).length;
    return Math.round((filledFields / baseFields.length) * 100);
  };

  const handleFindFlatmates = () => {
    const completionPercentage = getCompletionPercentage();
    if (completionPercentage === 100) {
      navigate("/find-flatmates");
    } else {
      alert(
        "Please complete your profile (100%) before searching for flatmates!"
      );
    }
  };

  const getMemberSinceYear = () => {
    return userData?.createdAt
      ? new Date(userData.createdAt).getFullYear()
      : new Date().getFullYear();
  };

  // Loading state
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingSpinner}>
          <div className={styles.spinner}></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Authentication check
  if (!isAuthenticated || !userData) {
    return (
      <div className={styles.container}>
        <div className={styles.errorCard}>
          <FaShieldAlt className={styles.errorIcon} />
          <h2>Authentication Required</h2>
          <p>Please log in to access your profile settings.</p>
        </div>
      </div>
    );
  }

  // Component data
  const avatarColor = getAvatarColor(userData.name);
  const initials =
    userData.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";
  const completionPercentage = getCompletionPercentage();
  const shouldShowImage = userData?.picture && !imageError;
  const displayData = getDisplayData();

  // Social media platforms config
  const socialPlatforms = [
    {
      key: "instagram",
      icon: FaInstagram,
      label: "Instagram",
      placeholder: "https://instagram.com/username",
    },
    {
      key: "twitter",
      icon: FaTwitter,
      label: "Twitter",
      placeholder: "https://twitter.com/username",
    },
    {
      key: "facebook",
      icon: FaFacebook,
      label: "Facebook",
      placeholder: "https://facebook.com/username",
    },
    {
      key: "linkedin",
      icon: FaLinkedin,
      label: "LinkedIn",
      placeholder: "https://linkedin.com/in/username",
    },
  ];

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.breadcrumb}>
          <FaHome />
          <span>RentMate</span>
          <span className={styles.separator}>/</span>
          <span>Account</span>
          <span className={styles.separator}>/</span>
          <span className={styles.current}>
            {activeSection === "profile" ? "Profile Settings" : "My Properties"}
          </span>
        </div>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>
            {activeSection === "profile" ? "Profile Settings" : "My Properties"}
          </h1>
          <p className={styles.subtitle}>
            {activeSection === "profile"
              ? isVerified
                ? "Your verified information is protected and cannot be modified"
                : "Complete your profile to connect with potential flatmates"
              : "Manage your property listings and track performance"}
          </p>
        </div>
      </div>

      {/* Section Tabs */}
      <div className={styles.sectionTabs}>
        <button
          className={`${styles.sectionTab} ${
            activeSection === "profile" ? styles.activeSectionTab : ""
          }`}
          onClick={() => setActiveSection("profile")}
        >
          <FaUser />
          Profile
        </button>
        <button
          className={`${styles.sectionTab} ${
            activeSection === "properties" ? styles.activeSectionTab : ""
          }`}
          onClick={() => setActiveSection("properties")}
        >
          <FaHome />
          My Properties
        </button>
      </div>

      {/* Main Content */}
      {activeSection === "profile" ? (
        <div className={styles.grid}>
          {/* Profile Overview Card */}
          <div className={styles.profileCard}>
            {/* Avatar Section */}
            <div className={styles.avatarSection}>
              {shouldShowImage ? (
                <img
                  src={userData.picture}
                  alt="Profile"
                  className={styles.avatar}
                  onError={handleImageError}
                  onLoad={handleImageLoad}
                />
              ) : (
                <div
                  className={styles.avatarFallback}
                  style={{ backgroundColor: avatarColor }}
                >
                  {initials}
                </div>
              )}
              {isVerified ? (
                <div className={styles.verifiedBadge}>
                  <FaCheckCircle />
                  <span>Verified</span>
                </div>
              ) : (
                <div className={styles.unverifiedBadge}>
                  <FaExclamationTriangle />
                  <span>Unverified</span>
                </div>
              )}
            </div>

            {/* User Info */}
            <div className={styles.userInfo}>
              <h2 className={styles.userName}>
                {displayData.fullName || userData.name}
                {isVerified && (
                  <FaLock
                    className={styles.lockIcon}
                    title="Verified information"
                  />
                )}
              </h2>
              <p className={styles.userEmail}>
                <HiMail />
                {userData.email}
              </p>
              <div className={styles.authBadge}>
                <FaShieldAlt />
                <span>Secured by Auth0</span>
              </div>
            </div>

            {/* Verification Status */}
            {isVerified && (
              <div className={styles.verificationInfo}>
                <h4>Verification Details</h4>
                <div className={styles.verificationGrid}>
                  <div className={styles.verificationItem}>
                    <span className={styles.verificationLabel}>User Type:</span>
                    <span className={styles.verificationValue}>
                      {userData.userType?.replace("_", " ")}
                    </span>
                  </div>
                  <div className={styles.verificationItem}>
                    <span className={styles.verificationLabel}>Verified:</span>
                    <span className={styles.verificationValue}>
                      {new Date(userData.approvedAt).toLocaleDateString()}
                    </span>
                  </div>
                  {userData.verificationData?.profession && (
                    <div className={styles.verificationItem}>
                      <span className={styles.verificationLabel}>
                        Profession:
                      </span>
                      <span className={styles.verificationValue}>
                        {userData.verificationData.profession}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Profile Completion */}
            <div className={styles.completionSection}>
              <div className={styles.completionHeader}>
                <h3>Profile Completion</h3>
                <span className={styles.percentage}>
                  {completionPercentage}%
                </span>
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <p className={styles.completionText}>
                {completionPercentage === 100
                  ? "Profile complete! Ready to find flatmates."
                  : `Complete remaining fields to unlock flatmate search`}
              </p>
            </div>

            {/* Action Button */}
            <button
              onClick={handleFindFlatmates}
              className={`${styles.actionBtn} ${
                completionPercentage === 100 ? styles.enabled : styles.disabled
              }`}
              disabled={completionPercentage !== 100}
            >
              <FaSearch />
              {completionPercentage === 100
                ? "Find Flatmates"
                : "Complete Profile First"}
            </button>

            {/* Stats */}
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>
                  {getMemberSinceYear()}
                </span>
                <span className={styles.statLabel}>Member Since</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>
                  {
                    Object.values(userData.socialMedia || {}).filter(
                      (link) => link && link.trim()
                    ).length
                  }
                  /4
                </span>
                <span className={styles.statLabel}>Social Links</span>
              </div>
            </div>
          </div>

          {/* Details Form */}
          <div className={styles.detailsSection}>
            {/* Edit Controls */}
            <div className={styles.editControls}>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className={styles.editBtn}
                >
                  <FaEdit />
                  Edit Profile
                </button>
              ) : (
                <div className={styles.editActions}>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className={styles.saveBtn}
                  >
                    <FaSave />
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                  <button onClick={handleCancel} className={styles.cancelBtn}>
                    <FaTimes />
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Verified Information Notice */}
            {isVerified && (
              <div className={styles.verifiedNotice}>
                <div className={styles.verifiedNoticeIcon}>
                  <FaLock />
                </div>
                <div className={styles.verifiedNoticeContent}>
                  <h4>Verified Information Protected</h4>
                  <p>
                    Your name, phone number, and address are verified and cannot
                    be changed. Contact support if you need to update verified
                    information.
                  </p>
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div className={styles.formCard}>
              <h3 className={styles.cardTitle}>
                Contact Information
                {isVerified && <FaLock className={styles.lockIcon} />}
              </h3>
              <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    <HiPhone />
                    Phone Number
                    {isVerified && (
                      <span className={styles.verifiedLabel}>(Verified)</span>
                    )}
                  </label>
                  {isEditing && !isVerified ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 123-4567"
                      className={styles.input}
                    />
                  ) : (
                    <div
                      className={`${styles.displayValue} ${
                        isVerified ? styles.verified : ""
                      }`}
                    >
                      {displayData.phone || (
                        <span className={styles.emptyState}>Not provided</span>
                      )}
                      {displayData.alternatePhone && (
                        <span className={styles.alternatePhone}>
                          <br />
                          Alt: {displayData.alternatePhone}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    <HiLocationMarker />
                    Current Address
                    {isVerified && (
                      <span className={styles.verifiedLabel}>(Verified)</span>
                    )}
                  </label>
                  {isEditing && !isVerified ? (
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter your current address or preferred area"
                      className={styles.textarea}
                      rows="2"
                    />
                  ) : (
                    <div
                      className={`${styles.displayValue} ${
                        isVerified ? styles.verified : ""
                      }`}
                    >
                      {displayData.address || (
                        <span className={styles.emptyState}>Not provided</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Emergency Contact (if verified) */}
            {isVerified && displayData.emergencyContact && (
              <div className={styles.formCard}>
                <h3 className={styles.cardTitle}>
                  Emergency Contact
                  <FaLock className={styles.lockIcon} />
                </h3>
                <div className={styles.verifiedInfo}>
                  <div className={styles.verifiedInfoGrid}>
                    <div className={styles.verifiedInfoItem}>
                      <span className={styles.verifiedInfoLabel}>Name:</span>
                      <span className={styles.verifiedInfoValue}>
                        {displayData.emergencyContact.name}
                      </span>
                    </div>
                    <div className={styles.verifiedInfoItem}>
                      <span className={styles.verifiedInfoLabel}>
                        Relation:
                      </span>
                      <span className={styles.verifiedInfoValue}>
                        {displayData.emergencyContact.relation}
                      </span>
                    </div>
                    <div className={styles.verifiedInfoItem}>
                      <span className={styles.verifiedInfoLabel}>Phone:</span>
                      <span className={styles.verifiedInfoValue}>
                        {displayData.emergencyContact.phone}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Professional Info (if verified) */}
            {isVerified && displayData.profession && (
              <div className={styles.formCard}>
                <h3 className={styles.cardTitle}>
                  Professional Information
                  <FaLock className={styles.lockIcon} />
                </h3>
                <div className={styles.verifiedInfo}>
                  <div className={styles.verifiedInfoItem}>
                    <span className={styles.verifiedInfoLabel}>
                      Profession:
                    </span>
                    <span className={styles.verifiedInfoValue}>
                      {displayData.profession}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* About Me */}
            <div className={styles.formCard}>
              <h3 className={styles.cardTitle}>About Me</h3>
              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  <FaUser />
                  Tell us about yourself
                </label>
                {isEditing ? (
                  <div>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="I'm looking for a flatmate... Tell us about your lifestyle, preferences, and what you're looking for in a flatmate."
                      className={styles.textarea}
                      rows="3"
                    />
                    <p className={styles.hint}>
                      Include keywords like "searching flatmate", "looking
                      roommate", "clean", "quiet" to be more discoverable
                    </p>
                  </div>
                ) : (
                  <div className={styles.displayValue}>
                    {userData.bio || (
                      <span className={styles.emptyState}>
                        Add a bio to help potential flatmates get to know you
                        better
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Social Media */}
            <div className={styles.formCard}>
              <h3 className={styles.cardTitle}>Social Media Profiles</h3>
              <div className={styles.socialGrid}>
                {socialPlatforms.map(
                  ({ key, icon: Icon, label, placeholder }) => (
                    <div key={key} className={styles.socialInput}>
                      <div className={styles.socialLabel}>
                        <Icon className={styles[`${key}Icon`]} />
                        <span>{label}</span>
                      </div>
                      {isEditing ? (
                        <input
                          type="url"
                          name={`social.${key}`}
                          value={formData.socialMedia[key]}
                          onChange={handleInputChange}
                          placeholder={placeholder}
                          className={styles.input}
                        />
                      ) : (
                        <div className={styles.displayValue}>
                          {userData.socialMedia?.[key] ? (
                            <a
                              href={userData.socialMedia[key]}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.socialLink}
                            >
                              View Profile
                            </a>
                          ) : (
                            <span className={styles.emptyState}>
                              Not connected
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <UserProperties />
      )}
    </div>
  );
};

export default UserProfile;
