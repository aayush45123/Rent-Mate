// FlatmateCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./FlatmateCard.module.css";

const FlatmateCard = ({ flatmate, onConnect }) => {
  const navigate = useNavigate();

  const {
    name,
    email,
    bio,
    socialMedia,
    createdAt,
    picture,
    processedImageUrl,
    isVerified,
    userType,
  } = flatmate;

  const profileImage = flatmate.auth0Id
    ? `http://localhost:5000/api/user/${flatmate.auth0Id}/profile-image`
    : processedImageUrl || picture || "/default-avatar.png";
  const displaySince = createdAt ? new Date(createdAt).getFullYear() : "2025";
  const hasAbout = bio && bio.trim().length > 0;

  // Handle social media data from your schema
  const getSocialMediaLinks = () => {
    if (!socialMedia) return [];

    const links = [];

    // Check each social media platform
    if (socialMedia.instagram && socialMedia.instagram.trim() !== "") {
      links.push({ platform: "instagram", url: socialMedia.instagram });
    }
    if (socialMedia.twitter && socialMedia.twitter.trim() !== "") {
      links.push({ platform: "twitter", url: socialMedia.twitter });
    }
    if (socialMedia.facebook && socialMedia.facebook.trim() !== "") {
      links.push({ platform: "facebook", url: socialMedia.facebook });
    }
    if (socialMedia.linkedin && socialMedia.linkedin.trim() !== "") {
      links.push({ platform: "linkedin", url: socialMedia.linkedin });
    }

    return links;
  };

  const socialLinksList = getSocialMediaLinks();
  const hasSocialMedia = socialLinksList.length > 0;

  // Social media platform icons mapping
  const getPlatformIcon = (platform) => {
    const platformLower = platform.toLowerCase();
    if (platformLower.includes("instagram")) return "📷";
    if (platformLower.includes("facebook")) return "👥";
    if (platformLower.includes("linkedin")) return "💼";
    if (platformLower.includes("twitter")) return "🐦";
    return "🔗";
  };

  const formatPlatformName = (platform) => {
    const platformLower = platform.toLowerCase();
    if (platformLower.includes("instagram")) return "Instagram";
    if (platformLower.includes("facebook")) return "Facebook";
    if (platformLower.includes("linkedin")) return "LinkedIn";
    if (platformLower.includes("twitter")) return "Twitter";
    return platform.charAt(0).toUpperCase() + platform.slice(1);
  };

  const handleCardClick = () => {
    // Navigate to user detail page
    navigate(`/user/${flatmate._id}`);
  };

  const handleConnectClick = (e) => {
    e.stopPropagation(); // Prevent card click when clicking connect button
    onConnect(flatmate);
  };

  const handleImageError = (e) => {
    e.target.src = "/default-avatar.png";
  };

  return (
    <div className={styles.flatmateCard} onClick={handleCardClick}>
      {/* Decorative Background Pattern */}
      <div className={styles.cardBackground}>
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <linearGradient
              id={`grad-${flatmate._id}`}
              gradientUnits="userSpaceOnUse"
              x1="0"
              x2="0"
              y1="0"
              y2="100%"
              gradientTransform="rotate(222)"
            >
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="1" stopColor="#FC726E" />
            </linearGradient>
            <pattern
              patternUnits="userSpaceOnUse"
              id={`pattern-${flatmate._id}`}
              width="150"
              height="125"
              x="0"
              y="0"
              viewBox="0 0 1080 900"
            >
              <g fillOpacity="0.1">
                <polygon fill="#444" points="90 150 0 300 180 300" />
                <polygon points="90 150 180 0 0 0" />
                <polygon fill="#AAA" points="270 150 360 0 180 0" />
                <polygon fill="#DDD" points="450 150 360 300 540 300" />
                <polygon fill="#999" points="450 150 540 0 360 0" />
                <polygon points="630 150 540 300 720 300" />
                <polygon fill="#DDD" points="630 150 720 0 540 0" />
                <polygon fill="#444" points="810 150 720 300 900 300" />
              </g>
            </pattern>
          </defs>
          <rect
            x="0"
            y="0"
            fill={`url(#grad-${flatmate._id})`}
            width="100%"
            height="100%"
          />
          <rect
            x="0"
            y="0"
            fill={`url(#pattern-${flatmate._id})`}
            width="100%"
            height="100%"
          />
        </svg>
      </div>

      {/* Status Badge */}
      <div className={styles.statusBadge}>
        {isVerified ? "Verified" : "Active"}
      </div>

      {/* Profile Avatar - Centered with border */}
      <div className={styles.avatarWrapper}>
        <img
          src={profileImage}
          alt={name}
          className={styles.profileAvatar}
          onError={handleImageError}
        />
      </div>

      {/* Profile Info - Centered */}
      <div className={styles.profileSection}>
        <h3 className={styles.cardTitle}>{name}</h3>
        <p className={styles.cardSubtitle}>
          {userType === "LOOKING_FOR_PG"
            ? "Looking for PG"
            : userType === "PG_OWNER"
            ? "PG Owner"
            : userType === "FLAT_OWNER"
            ? "Flat Owner"
            : "Member"}
        </p>
        <p className={styles.memberSinceNew}>Member since {displaySince}</p>
      </div>

      {/* Contact Info */}
      <div className={styles.contactInfoNew}>
        <p className={styles.emailNew}>{email}</p>
      </div>

      {/* Content Sections */}
      <div className={styles.contentSections}>
        {/* About Section */}
        <div className={styles.aboutSection}>
          <h4 className={styles.sectionLabel}>About</h4>
          {hasAbout ? (
            <p className={styles.aboutText}>{bio}</p>
          ) : (
            <p
              className={styles.aboutText}
              style={{ color: "var(--text-tertiary)", fontStyle: "italic" }}
            >
              No bio provided
            </p>
          )}
        </div>

        {/* Social Media Section */}
        <div className={styles.socialSection}>
          <h4 className={styles.sectionLabel}>Social Media</h4>
          {hasSocialMedia ? (
            <div className={styles.socialLinks}>
              {socialLinksList.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  onClick={(e) => e.stopPropagation()}
                >
                  {getPlatformIcon(social.platform)}
                  {formatPlatformName(social.platform)}
                </a>
              ))}
            </div>
          ) : (
            <div className={styles.socialStatus}>
              <p>No social media linked</p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className={styles.buttonWrapper}>
        <button
          className={styles.actionButton}
          onClick={(e) => e.stopPropagation()}
        >
          View Profile
        </button>
        <button
          className={styles.actionButtonSolid}
          onClick={handleConnectClick}
        >
          Connect
        </button>
      </div>
    </div>
  );
};

export default FlatmateCard;
