import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import styles from "./VerificationStatus.module.css";

const VerificationStatus = () => {
  const { user, isAuthenticated } = useAuth0();
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchVerificationStatus = async () => {
    if (isAuthenticated && user) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/user/${encodeURIComponent(
            user.sub
          )}`
        );
        if (response.ok) {
          const userData = await response.json();
          console.log("VerificationStatus - fetched user data:", userData); // Debug log
          setVerificationStatus({
            status: userData.verificationStatus,
            userType: userData.userType,
            isVerified: userData.isVerified,
            adminNotes: userData.adminNotes,
            submittedAt: userData.submittedAt,
            approvedAt: userData.approvedAt,
          });
        }
      } catch (error) {
        console.error("Error fetching verification status:", error);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVerificationStatus();
  }, [isAuthenticated, user]);

  // UPDATED: Listen for verification updates
  useEffect(() => {
    const handleVerificationUpdate = () => {
      console.log(
        "VerificationStatus - Heard verification update, refetching..."
      );
      fetchVerificationStatus();
    };

    window.addEventListener("verificationUpdated", handleVerificationUpdate);

    return () => {
      window.removeEventListener(
        "verificationUpdated",
        handleVerificationUpdate
      );
    };
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading verification status...</div>;
  }

  if (!verificationStatus) {
    return null;
  }

  // UPDATED: Handle both APPROVED and VERIFIED statuses
  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "#ffc107";
      case "IN_REVIEW":
        return "#17a2b8";
      case "APPROVED":
        return "#28a745";
      case "VERIFIED":
        return "#28a745";
      case "REJECTED":
        return "#dc3545";
      default:
        return "#6c757d";
    }
  };

  // UPDATED: Handle new status messages
  const getStatusMessage = (status, isVerified) => {
    // If user is verified, always show verified message regardless of status
    if (isVerified && (status === "APPROVED" || status === "VERIFIED")) {
      return "Your account is verified! You can now access all features.";
    }

    switch (status) {
      case "PENDING":
        return "Your verification is pending. Please complete the verification form.";
      case "IN_REVIEW":
        return "Your verification is under review. We'll process it within 2 hours.";
      case "APPROVED":
        return "Your account is verified! You can now access all features.";
      case "VERIFIED":
        return "Your account is verified! You can now access all features.";
      case "REJECTED":
        return "Your verification was rejected. Please contact support or resubmit with correct information.";
      default:
        return "Unknown verification status.";
    }
  };

  // UPDATED: Better display name for status
  const getStatusDisplayName = (status, isVerified) => {
    if (isVerified && (status === "APPROVED" || status === "VERIFIED")) {
      return "VERIFIED";
    }
    return status.replace("_", " ");
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.statusCard}>
        <div className={styles.header}>
          <h3>Verification Status</h3>
          <span
            className={styles.statusBadge}
            style={{
              backgroundColor: getStatusColor(verificationStatus.status),
            }}
          >
            {getStatusDisplayName(
              verificationStatus.status,
              verificationStatus.isVerified
            )}
          </span>
        </div>

        <div className={styles.content}>
          <p>
            <strong>User Type:</strong>{" "}
            {verificationStatus.userType?.replace("_", " ") || "Not specified"}
          </p>

          {/* UPDATED: Show verification status */}
          <p>
            <strong>Verified:</strong>{" "}
            <span
              style={{
                color: verificationStatus.isVerified ? "#28a745" : "#dc3545",
                fontWeight: "bold",
              }}
            >
              {verificationStatus.isVerified ? "Yes" : "No"}
            </span>
          </p>

          <p className={styles.statusMessage}>
            {getStatusMessage(
              verificationStatus.status,
              verificationStatus.isVerified
            )}
          </p>

          {/* UPDATED: Show timestamps */}
          {verificationStatus.submittedAt && (
            <p>
              <strong>Submitted:</strong>{" "}
              {formatDate(verificationStatus.submittedAt)}
            </p>
          )}

          {verificationStatus.approvedAt && (
            <p>
              <strong>Approved:</strong>{" "}
              {formatDate(verificationStatus.approvedAt)}
            </p>
          )}

          {verificationStatus.adminNotes && (
            <div className={styles.adminNotes}>
              <strong>Admin Notes:</strong>
              <p>{verificationStatus.adminNotes}</p>
            </div>
          )}
        </div>

        {/* UPDATED: Add refresh button */}
        <div className={styles.actions}>
          <button
            onClick={fetchVerificationStatus}
            className={styles.refreshButton}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh Status"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationStatus;
