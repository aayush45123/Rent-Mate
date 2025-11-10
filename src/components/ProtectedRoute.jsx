import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

const ProtectedOwnerRoute = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const { userNeedsVerification, isCheckingVerification } = useAuthContext();
  const navigate = useNavigate();
  const [canAccess, setCanAccess] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // UPDATED: More comprehensive access check function
  const checkAccess = async () => {
    if (!isAuthenticated || !user) {
      setCanAccess(false);
      setLoading(false);
      return;
    }

    if (userNeedsVerification) {
      setCanAccess(false);
      setErrorMessage("Please complete your account verification first.");
      setLoading(false);
      return;
    }

    try {
      console.log(
        "ProtectedOwnerRoute - Checking owner access for user:",
        user.sub
      );

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/user/${user.sub}/owner-access`
      );

      if (response.ok) {
        const data = await response.json();
        console.log("ProtectedOwnerRoute - Owner access response:", data);

        // UPDATED: More comprehensive access logic
        const hasAccess =
          data.canAccess === true &&
          (data.isVerified === true || data.verificationStatus === "APPROVED");

        console.log("ProtectedOwnerRoute - Final access decision:", hasAccess);
        setCanAccess(hasAccess);

        if (!hasAccess) {
          // UPDATED: Better error messages based on actual status
          if (!data.hasCompletedVerification) {
            setErrorMessage("Please complete your account verification first.");
          } else if (data.verificationStatus === "IN_REVIEW") {
            setErrorMessage(
              "Your verification is still under review. Please wait for approval."
            );
          } else if (data.verificationStatus === "REJECTED") {
            setErrorMessage(
              "Your verification was rejected. Please resubmit your verification documents."
            );
          } else if (
            !data.isVerified &&
            data.verificationStatus !== "APPROVED"
          ) {
            setErrorMessage(
              "Your verification is not yet approved. Please wait or contact support."
            );
          } else if (
            data.userType !== "PG_OWNER" &&
            data.userType !== "FLAT_OWNER"
          ) {
            setErrorMessage(
              "This feature is only available for PG Owners and Flat Owners."
            );
          } else {
            setErrorMessage(
              "You don't have access to owner features. Please ensure you're verified as an owner."
            );
          }
        }
      } else {
        console.error(
          "ProtectedOwnerRoute - Failed to check owner access:",
          response.status
        );
        setCanAccess(false);
        setErrorMessage(
          "Unable to verify your access. Please try again later."
        );
      }
    } catch (error) {
      console.error(
        "ProtectedOwnerRoute - Error checking owner access:",
        error
      );
      setCanAccess(false);
      setErrorMessage(
        "Network error. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Initial access check
  useEffect(() => {
    if (!isLoading && !isCheckingVerification) {
      checkAccess();
    }
  }, [
    isAuthenticated,
    user,
    isLoading,
    userNeedsVerification,
    isCheckingVerification,
  ]);

  // UPDATED: Listen for verification updates with more robust handling
  useEffect(() => {
    const handleVerificationUpdate = () => {
      console.log(
        "ProtectedOwnerRoute - Verification update received, rechecking access..."
      );

      // Reset states
      setCanAccess(null);
      setLoading(true);
      setErrorMessage("");

      // Add delay to ensure backend processing is complete
      setTimeout(() => {
        checkAccess();
      }, 1500); // Increased delay for better reliability
    };

    window.addEventListener("verificationUpdated", handleVerificationUpdate);

    return () => {
      window.removeEventListener(
        "verificationUpdated",
        handleVerificationUpdate
      );
    };
  }, [
    isAuthenticated,
    user,
    isLoading,
    isCheckingVerification,
    userNeedsVerification,
  ]);

  // Show loading state
  if (isLoading || loading || isCheckingVerification) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "4px solid #f3f4f6",
            borderTop: "4px solid #2563eb",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        ></div>
        <div>Verifying access permissions...</div>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Redirect to verification if needed
  if (userNeedsVerification) {
    return <Navigate to="/verification-form" replace />;
  }

  // UPDATED: Only show access denied if we're certain access is false
  if (canAccess === false) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          textAlign: "center",
          padding: "2rem",
          backgroundColor: "#f9fafb",
        }}
      >
        <div
          style={{
            maxWidth: "500px",
            padding: "2rem",
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            border: "1px solid #e5e7eb",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              backgroundColor: "#fef2f2",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem auto",
              border: "2px solid #fecaca",
            }}
          >
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="#ef4444"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "600",
              color: "#1f2937",
              marginBottom: "1rem",
            }}
          >
            Access Restricted
          </h2>

          <p
            style={{
              color: "#6b7280",
              marginBottom: "1.5rem",
              lineHeight: "1.6",
            }}
          >
            {errorMessage}
          </p>

          <div
            style={{ display: "flex", gap: "1rem", justifyContent: "center" }}
          >
            {(userNeedsVerification ||
              errorMessage.includes("verification")) && (
              <button
                onClick={() => navigate("/verification-form")}
                style={{
                  padding: "0.75rem 2rem",
                  background: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "500",
                  fontSize: "0.875rem",
                }}
              >
                Complete Verification
              </button>
            )}

            <button
              onClick={() => navigate("/")}
              style={{
                padding: "0.75rem 2rem",
                background: "#f3f4f6",
                color: "#374151",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "500",
                fontSize: "0.875rem",
              }}
            >
              Go Home
            </button>

            {/* UPDATED: Add manual refresh button for debugging */}
            <button
              onClick={() => {
                console.log("Manual refresh triggered");
                setCanAccess(null);
                setLoading(true);
                setErrorMessage("");
                setTimeout(checkAccess, 500);
              }}
              style={{
                padding: "0.75rem 2rem",
                background: "#10b981",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "500",
                fontSize: "0.875rem",
              }}
            >
              Refresh Access
            </button>
          </div>

          <p
            style={{
              marginTop: "1.5rem",
              fontSize: "0.875rem",
              color: "#9ca3af",
            }}
          >
            Need help?{" "}
            <a
              href="/support"
              style={{ color: "#2563eb", textDecoration: "none" }}
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    );
  }

  // UPDATED: Allow access if canAccess is true OR null (to handle edge cases)
  if (canAccess === true) {
    return children;
  }

  // Fallback loading state if canAccess is still null
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div>Loading...</div>
    </div>
  );
};

export default ProtectedOwnerRoute;
