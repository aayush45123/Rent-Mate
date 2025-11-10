import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaShare,
  FaFlag,
  FaComments, // ADDED: Chat icon
} from "react-icons/fa";
import { useChat } from "../../context/ChatContext"; // ADDED: Chat context
import ChatInterface from "../../components/ChatInterface/ChatInterface"; // ADDED: Chat component
import styles from "./UserDetail.module.css";

const UserDetail = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { onlineUsers } = useChat(); // ADDED: Get online users from chat context

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showChat, setShowChat] = useState(false); // ADDED: Chat visibility state
  const [isOnline, setIsOnline] = useState(false); // ADDED: Online status

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  // ADDED: Check if user is online
  useEffect(() => {
    if (user) {
      setIsOnline(onlineUsers.includes(user._id));
    }
  }, [user, onlineUsers]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/user/details/${userId}`
      );

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
      } else {
        setError(data.error || "Failed to load user details");
      }
    } catch (err) {
      console.error("Error fetching user details:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = () => {
    console.log("Connect with:", user.name);
    alert(`Connection request sent to ${user.name}!`);
  };

  const handleMessage = () => {
    console.log("Message to:", user.name);
    alert(`Opening chat with ${user.name}!`);
  };

  // ADDED: Real-time chat handler
  const handleStartChat = () => {
    setShowChat(true);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${user.name}'s Profile - RentMate`,
        text: `Check out ${user.name}'s profile on RentMate`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Profile link copied to clipboard!");
    }
  };

  const handleReport = () => {
    console.log("Report user:", user.name);
    alert(`Reporting ${user.name} to moderators.`);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading user profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <FaExclamationTriangle className={styles.errorIcon} />
          <h2 className={styles.errorTitle}>Something went wrong</h2>
          <p className={styles.errorText}>{error}</p>
          <button onClick={fetchUserDetails} className={styles.retryButton}>
            Try Again
          </button>
          <button
            onClick={() => navigate(-1)}
            className={styles.secondaryButton}
            style={{ marginTop: "1rem", background: "transparent" }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <FaExclamationTriangle className={styles.errorIcon} />
          <h2 className={styles.errorTitle}>User Not Found</h2>
          <p className={styles.errorText}>
            The user you're looking for doesn't exist.
          </p>
          <button onClick={() => navigate(-1)} className={styles.retryButton}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header - UNCHANGED */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <button onClick={() => navigate(-1)} className={styles.backBtn}>
            <FaArrowLeft />
            Back to Search
          </button>
        </div>
      </div>

      {/* Main Content - UNCHANGED */}
      <div className={styles.content}>
        {/* Left Column - Profile Details - UNCHANGED */}
        <div className={styles.profileSection}>
          {/* Profile Header - UNCHANGED */}
          <div className={styles.profileHeader}>
            <img
              src={user.picture || "/default-avatar.png"}
              alt={user.name}
              className={styles.profileImage}
              onError={(e) => {
                e.target.src = "/default-avatar.png";
              }}
            />
            <div className={styles.profileInfo}>
              <h1 className={styles.name}>
                {user.name}
                {user.isVerified && (
                  <span className={styles.verifiedBadge}>
                    <FaCheckCircle size={12} />
                    Verified
                  </span>
                )}
              </h1>
              <p className={styles.email}>
                <FaEnvelope />
                {user.email}
              </p>
              <p className={styles.memberSince}>
                Member since {new Date(user.memberSince).getFullYear()}
              </p>
              <p className={styles.userType}>
                {user.userType === "LOOKING_FOR_PG"
                  ? "Looking for PG"
                  : user.userType === "PG_OWNER"
                  ? "PG Owner"
                  : user.userType === "FLAT_OWNER"
                  ? "Flat Owner"
                  : "User"}
              </p>
            </div>
          </div>

          {/* Profile Completion - UNCHANGED */}
          {user.profileCompletion && (
            <div className={styles.profileCompletion}>
              <div className={styles.completionHeader}>
                <span className={styles.completionLabel}>
                  Profile Completion
                </span>
                <span className={styles.completionPercentage}>
                  {user.profileCompletion}%
                </span>
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${user.profileCompletion}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* About Section - UNCHANGED */}
          <div className={`${styles.section} ${styles.aboutSection}`}>
            <h2 className={styles.sectionTitle}>About</h2>
            {user.bio ? (
              <p className={styles.aboutText}>{user.bio}</p>
            ) : (
              <p
                className={styles.aboutText}
                style={{ fontStyle: "italic", color: "var(--text-tertiary)" }}
              >
                No bio provided
              </p>
            )}
          </div>

          {/* Contact Information - UNCHANGED */}
          <div className={`${styles.section} ${styles.contactSection}`}>
            <h2 className={styles.sectionTitle}>Contact Information</h2>
            <div className={styles.contactGrid}>
              {user.phone && (
                <div className={styles.contactItem}>
                  <div className={styles.contactIcon}>
                    <FaPhone />
                  </div>
                  <div className={styles.contactInfo}>
                    <div className={styles.contactLabel}>Phone</div>
                    <div className={styles.contactValue}>{user.phone}</div>
                  </div>
                </div>
              )}

              {user.address && (
                <div className={styles.contactItem}>
                  <div className={styles.contactIcon}>
                    <FaMapMarkerAlt />
                  </div>
                  <div className={styles.contactInfo}>
                    <div className={styles.contactLabel}>Address</div>
                    <div className={styles.contactValue}>{user.address}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Social Media - UNCHANGED */}
          {(user.socialMedia?.instagram ||
            user.socialMedia?.facebook ||
            user.socialMedia?.linkedin ||
            user.socialMedia?.twitter) && (
            <div className={`${styles.section} ${styles.socialSection}`}>
              <h2 className={styles.sectionTitle}>Social Media</h2>
              <div className={styles.socialGrid}>
                {user.socialMedia.instagram && (
                  <a
                    href={user.socialMedia.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                  >
                    <div className={`${styles.socialIcon} ${styles.instagram}`}>
                      📷
                    </div>
                    <div className={styles.socialInfo}>
                      <div className={styles.socialPlatform}>Instagram</div>
                      <div className={styles.socialUrl}>
                        {user.socialMedia.instagram}
                      </div>
                    </div>
                  </a>
                )}

                {user.socialMedia.facebook && (
                  <a
                    href={user.socialMedia.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                  >
                    <div className={`${styles.socialIcon} ${styles.facebook}`}>
                      👥
                    </div>
                    <div className={styles.socialInfo}>
                      <div className={styles.socialPlatform}>Facebook</div>
                      <div className={styles.socialUrl}>
                        {user.socialMedia.facebook}
                      </div>
                    </div>
                  </a>
                )}

                {user.socialMedia.linkedin && (
                  <a
                    href={user.socialMedia.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                  >
                    <div className={`${styles.socialIcon} ${styles.linkedin}`}>
                      💼
                    </div>
                    <div className={styles.socialInfo}>
                      <div className={styles.socialPlatform}>LinkedIn</div>
                      <div className={styles.socialUrl}>
                        {user.socialMedia.linkedin}
                      </div>
                    </div>
                  </a>
                )}

                {user.socialMedia.twitter && (
                  <a
                    href={user.socialMedia.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                  >
                    <div className={`${styles.socialIcon} ${styles.twitter}`}>
                      🐦
                    </div>
                    <div className={styles.socialInfo}>
                      <div className={styles.socialPlatform}>Twitter</div>
                      <div className={styles.socialUrl}>
                        {user.socialMedia.twitter}
                      </div>
                    </div>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Action Cards - MINOR UPDATE */}
        <div className={styles.sidebar}>
          {/* Connect Card - ADDED Chat Button */}
          <div className={`${styles.actionCard} ${styles.connectCard}`}>
            <h3 className={styles.cardTitle}>Connect with {user.name}</h3>
            <button
              onClick={handleConnect}
              className={`${styles.actionButton} ${styles.connectButton}`}
            >
              🤝 Send Connection Request
            </button>
            {/* ADDED: Real-time Chat Button */}
            <button
              onClick={handleStartChat}
              className={`${styles.actionButton} ${styles.chatButton}`}
            >
              <FaComments />
              Start Real-time Chat
            </button>
            {/* KEPT: Original Message Button */}
          </div>

          {/* Actions Card - UNCHANGED */}
          <div className={styles.actionCard}>
            <h3 className={styles.cardTitle}>Actions</h3>
            <button
              onClick={handleShare}
              className={`${styles.actionButton} ${styles.secondaryButton}`}
            >
              <FaShare />
              Share Profile
            </button>
            <button
              onClick={handleReport}
              className={`${styles.actionButton} ${styles.secondaryButton}`}
            >
              <FaFlag />
              Report User
            </button>
          </div>
        </div>
      </div>

      {/* ADDED: Chat Interface Component */}
      <ChatInterface
        isOpen={showChat}
        onClose={() => setShowChat(false)}
        otherUser={user}
      />
    </div>
  );
};

export default UserDetail;
