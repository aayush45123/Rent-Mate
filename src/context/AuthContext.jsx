import React, { createContext, useEffect, useContext, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, useLocation } from "react-router-dom";

const AuthContext = createContext();

const API_BASE = "http://localhost:5000/api";

export const AuthProvider = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();
  const location = useLocation();
  const [userNeedsVerification, setUserNeedsVerification] = useState(false);
  const [hasProcessedLogin, setHasProcessedLogin] = useState(false);
  const [userVerificationStatus, setUserVerificationStatus] = useState(null);
  const [isCheckingVerification, setIsCheckingVerification] = useState(false);

  // Routes that don't require verification
  const publicRoutes = ["/verification-form", "/support", "/"];

  const isPublicRoute = (pathname) => {
    return publicRoutes.some(
      (route) => pathname === route || pathname.startsWith(route)
    );
  };

  useEffect(() => {
    const saveUserAndCheckVerification = async () => {
      if (isAuthenticated && user && !hasProcessedLogin) {
        setIsCheckingVerification(true);
        try {
          // First, save/update user
          const res = await fetch(`${API_BASE}/user`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              auth0Id: user.sub,
              name: user.name,
              email: user.email,
              picture: user.picture,
            }),
          });

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || "Failed to save user");
          }

          const responseData = await res.json();
          console.log("User save response:", responseData);

          // Check detailed verification status
          const verificationResponse = await fetch(
            `${API_BASE}/user/${user.sub}`
          );
          if (verificationResponse.ok) {
            const userData = await verificationResponse.json();
            console.log("Detailed user data:", userData);

            setUserVerificationStatus(userData);

            // UPDATED: Improved verification check logic
            const needsVerification =
              !userData.userType ||
              (!userData.verificationData && !userData.userType) ||
              (userData.userType && !userData.verificationData) ||
              (userData.userType &&
                userData.verificationData &&
                !userData.isVerified &&
                userData.verificationStatus !== "APPROVED");

            console.log("Verification check:", {
              userType: userData.userType,
              hasVerificationData: !!userData.verificationData,
              verificationStatus: userData.verificationStatus,
              isVerified: userData.isVerified,
              needsVerification,
            });

            setUserNeedsVerification(needsVerification);

            // Redirect logic
            if (needsVerification) {
              console.log("User needs verification, redirecting...");
              // Only redirect if not already on verification form or public routes
              if (!isPublicRoute(location.pathname)) {
                navigate("/verification-form");
              }
            } else {
              console.log("User is verified, no redirect needed");
              // User is verified, allow normal navigation
              setUserNeedsVerification(false);
            }
          } else {
            // If we can't get user details, assume they need verification
            console.log(
              "Could not fetch user details, assuming verification needed"
            );
            setUserNeedsVerification(true);
            if (!isPublicRoute(location.pathname)) {
              navigate("/verification-form");
            }
          }

          setHasProcessedLogin(true);
        } catch (err) {
          console.error("Error in auth flow:", err.message);
          console.error("Full error:", err);

          // On error, assume verification is needed for safety
          setUserNeedsVerification(true);
          if (!isPublicRoute(location.pathname)) {
            navigate("/verification-form");
          }
          setHasProcessedLogin(true);
        } finally {
          setIsCheckingVerification(false);
        }
      }
    };

    // Only run if not loading and haven't processed login yet
    if (!isLoading && !hasProcessedLogin) {
      saveUserAndCheckVerification();
    }
  }, [
    isAuthenticated,
    user,
    navigate,
    isLoading,
    hasProcessedLogin,
    location.pathname,
  ]);

  // Reset processed login state when user logs out
  useEffect(() => {
    if (!isAuthenticated && hasProcessedLogin) {
      setHasProcessedLogin(false);
      setUserNeedsVerification(false);
      setUserVerificationStatus(null);
      setIsCheckingVerification(false);
    }
  }, [isAuthenticated, hasProcessedLogin]);

  // Block navigation to protected routes if verification is needed
  useEffect(() => {
    if (
      isAuthenticated &&
      userNeedsVerification &&
      !isCheckingVerification &&
      hasProcessedLogin &&
      !isPublicRoute(location.pathname)
    ) {
      console.log("Blocking navigation to protected route:", location.pathname);
      navigate("/verification-form", { replace: true });
    }
  }, [
    location.pathname,
    userNeedsVerification,
    isAuthenticated,
    isCheckingVerification,
    hasProcessedLogin,
    navigate,
  ]);

  // UPDATED: Function to refresh verification status
  const refreshVerificationStatus = async () => {
    if (!isAuthenticated || !user) return;

    console.log("Refreshing verification status...");

    try {
      const response = await fetch(`${API_BASE}/user/${user.sub}`);
      if (response.ok) {
        const userData = await response.json();
        setUserVerificationStatus(userData);

        // UPDATED: Same improved logic as above
        const needsVerification =
          !userData.userType ||
          (!userData.verificationData && !userData.userType) ||
          (userData.userType && !userData.verificationData) ||
          (userData.userType &&
            userData.verificationData &&
            !userData.isVerified &&
            userData.verificationStatus !== "APPROVED");

        setUserNeedsVerification(needsVerification);

        console.log("Verification status refreshed:", {
          needsVerification,
          userType: userData.userType,
          verificationStatus: userData.verificationStatus,
          isVerified: userData.isVerified,
        });

        return !needsVerification;
      }
    } catch (error) {
      console.error("Error refreshing verification status:", error);
    }
    return false;
  };

  const contextValue = {
    user,
    isAuthenticated,
    isLoading,
    userNeedsVerification,
    setUserNeedsVerification,
    userVerificationStatus,
    isCheckingVerification,
    refreshVerificationStatus,
    isPublicRoute,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
