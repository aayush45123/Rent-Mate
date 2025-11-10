import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import styles from "./Profile.module.css";

const Profile = () => {
  const { user: auth0User, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const fetchLatestUserData = async () => {
    if (isAuthenticated && auth0User) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/user/${auth0User.sub}`
        );

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);

          const imageUrl = userData.picture || auth0User.picture;
          if (imageUrl) {
            await loadProfileImage(imageUrl, auth0User.sub);
          } else {
            setImageError(true);
          }
        } else {
          setUser(auth0User);
          if (auth0User.picture) {
            await loadProfileImage(auth0User.picture, auth0User.sub);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUser(auth0User);
        if (auth0User.picture) {
          await loadProfileImage(auth0User.picture, auth0User.sub);
        }
      }
    }
  };

  useEffect(() => {
    fetchLatestUserData();
  }, [isAuthenticated, auth0User]);

  useEffect(() => {
    const handleVerificationUpdate = () => {
      fetchLatestUserData();
    };

    window.addEventListener("verificationUpdated", handleVerificationUpdate);

    return () => {
      window.removeEventListener(
        "verificationUpdated",
        handleVerificationUpdate
      );
    };
  }, []);

  const loadProfileImage = async (imageUrl, auth0Id) => {
    if (!imageUrl) {
      setImageError(true);
      setImageLoading(false);
      return;
    }

    // Handle base64 images directly
    if (imageUrl.startsWith("data:")) {
      setProfileImageUrl(imageUrl);
      setImageError(false);
      setImageLoading(false);
      return;
    }

    // Check if it's a Google image that might need proxying
    const isGoogleImage =
      imageUrl.includes("googleusercontent.com") ||
      imageUrl.includes("googleapis.com");

    if (isGoogleImage) {
      setImageLoading(true);

      try {
        // Try proxy first
        const proxyResponse = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/user/${auth0Id}/profile-image`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (proxyResponse.ok) {
          const data = await proxyResponse.json();
          if (data.imageUrl) {
            setProfileImageUrl(data.imageUrl);
            setImageError(false);
          } else {
            // Fallback to direct URL
            setProfileImageUrl(imageUrl);
          }
        } else {
          // Fallback to direct URL
          setProfileImageUrl(imageUrl);
        }
      } catch (error) {
        console.error("Error loading image through proxy:", error);
        // Fallback to direct URL
        setProfileImageUrl(imageUrl);
      } finally {
        setImageLoading(false);
      }
    } else {
      // Non-Google images, load directly
      setProfileImageUrl(imageUrl);
      setImageError(false);
      setImageLoading(false);
    }
  };

  const getAvatarColor = (name) => {
    if (!name) return "#667eea";
    const colors = [
      "#667eea",
      "#764ba2",
      "#f093fb",
      "#f5576c",
      "#4facfe",
      "#00f2fe",
      "#43e97b",
      "#38f9d7",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const handleImageError = (e) => {
    console.error("Image failed to load:", e.target.src);
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageError(false);
    setImageLoading(false);
  };

  const getVerificationStatus = () => {
    if (!user) return null;

    const { userType, verificationStatus, isVerified, verificationData } = user;

    // Verified users
    if (
      isVerified === true &&
      (verificationStatus === "APPROVED" || verificationStatus === "VERIFIED")
    ) {
      return {
        status: "approved",
        icon: CheckCircle,
        text: "Verified",
        description: "Your account is fully verified",
      };
    }

    // Legacy verified users
    if (isVerified === true && verificationData) {
      return {
        status: "approved",
        icon: CheckCircle,
        text: "Verified",
        description: "Your account is fully verified",
      };
    }

    // Check explicit statuses
    switch (verificationStatus) {
      case "IN_REVIEW":
        return {
          status: "in-review",
          icon: Clock,
          text: "Under Review",
          description: "Your verification is being processed",
        };

      case "APPROVED":
      case "VERIFIED":
        return {
          status: "approved",
          icon: CheckCircle,
          text: "Verified",
          description: "Your account is fully verified",
        };

      case "REJECTED":
        return {
          status: "rejected",
          icon: XCircle,
          text: "Verification Failed",
          description: "Please resubmit your verification documents",
        };

      case "PENDING":
      default:
        if (verificationData && userType) {
          return {
            status: "in-review",
            icon: Clock,
            text: "Under Review",
            description: "Your verification is being processed",
          };
        }

        return {
          status: "not-started",
          icon: AlertCircle,
          text: "Verification Required",
          description:
            "Complete your profile verification to access all features",
        };
    }
  };

  const handleVerificationClick = () => {
    const verificationInfo = getVerificationStatus();

    if (
      verificationInfo &&
      (verificationInfo.status === "not-started" ||
        verificationInfo.status === "rejected")
    ) {
      navigate("/verification-form");
    }
  };

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const avatarColor = getAvatarColor(user.name);
  const initials =
    user.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";

  const shouldShowImage = profileImageUrl && !imageError && !imageLoading;
  const verificationInfo = getVerificationStatus();
  const VerificationIcon = verificationInfo?.icon;

  const shouldShowVerificationButton =
    verificationInfo &&
    (verificationInfo.status === "not-started" ||
      verificationInfo.status === "rejected");

  return (
    <div className={styles.profile}>
      <div className={styles.avatarContainer}>
        {imageLoading ? (
          <div
            className={`${styles.avatar} ${styles.loading}`}
            style={{ backgroundColor: avatarColor }}
          >
            ...
          </div>
        ) : shouldShowImage ? (
          <img
            src={profileImageUrl}
            alt={user.name}
            className={styles.avatar}
            onError={handleImageError}
            onLoad={handleImageLoad}
            referrerPolicy="no-referrer"
          />
        ) : (
          <div
            className={`${styles.avatar} ${styles.initials}`}
            style={{ backgroundColor: avatarColor }}
          >
            {initials}
          </div>
        )}

        {verificationInfo && VerificationIcon && (
          <div
            className={`${styles.verificationBadge} ${
              styles[verificationInfo.status]
            }`}
            onClick={handleVerificationClick}
            title={verificationInfo.description}
          >
            <VerificationIcon size={12} />
          </div>
        )}
      </div>

      <div className={styles.profileDropdown}>
        <div className={styles.profileInfo}>
          <h4 className={styles.userName}>{user.name}</h4>
          <p className={styles.userEmail}>{user.email}</p>

          {verificationInfo && VerificationIcon && (
            <div
              className={styles.verificationStatus}
              onClick={handleVerificationClick}
            >
              <div className={styles.verificationStatusIcon}>
                <VerificationIcon size={16} />
              </div>
              <div className={styles.verificationStatusText}>
                <span className={styles.verificationStatusTitle}>
                  {verificationInfo.text}
                </span>
                <span className={styles.verificationStatusDesc}>
                  {verificationInfo.description}
                </span>
              </div>
            </div>
          )}

          <div className={styles.quickActions}>
            <button
              className={styles.actionButton}
              onClick={() => navigate("/user-profile")}
            >
              View Profile
            </button>

            {shouldShowVerificationButton && (
              <button
                className={styles.actionButtonPrimary}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleVerificationClick();
                }}
              >
                Complete Verification
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
