import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoHomeSharp } from "react-icons/io5";
import { FaBars, FaTimes, FaSun, FaMoon } from "react-icons/fa";
import { useAuth0 } from "@auth0/auth0-react";
import Login from "../Auth/Login/Login";
import Logout from "../Auth/Logout/Logout";
import styles from "./Navbar.module.css";
import Profile from "../Profile/Profile";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [canAccessOwnerFeatures, setCanAccessOwnerFeatures] = useState(false);
  const { user, isAuthenticated } = useAuth0();
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Theme toggle functionality
  const toggleTheme = () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    document.documentElement.setAttribute(
      "data-theme",
      newTheme ? "dark" : "light"
    );
  };

  // Initialize theme on component mount
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "dark");
  }, []);

  // UPDATED: More robust owner access checking
  const checkOwnerAccess = async () => {
    if (isAuthenticated && user) {
      try {
        console.log("Checking owner access for user:", user.sub);

        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/user/${user.sub}/owner-access`
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Owner access response:", data);

          // UPDATED: More comprehensive access check
          const hasAccess =
            data.canAccess === true &&
            (data.isVerified === true ||
              data.verificationStatus === "APPROVED");

          console.log("Setting canAccessOwnerFeatures to:", hasAccess);
          setCanAccessOwnerFeatures(hasAccess);
        } else {
          console.error("Failed to check owner access:", response.status);
          setCanAccessOwnerFeatures(false);
        }
      } catch (error) {
        console.error("Error checking owner access:", error);
        setCanAccessOwnerFeatures(false);
      }
    } else {
      setCanAccessOwnerFeatures(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check owner access when user is authenticated
  useEffect(() => {
    checkOwnerAccess();
  }, [isAuthenticated, user]);

  // UPDATED: Listen for verification updates and recheck access
  useEffect(() => {
    const handleVerificationUpdate = () => {
      console.log("Navbar - Heard verification update, rechecking access...");
      // Add a delay to ensure backend has processed the update
      setTimeout(() => {
        checkOwnerAccess();
      }, 1000);
    };

    window.addEventListener("verificationUpdated", handleVerificationUpdate);

    return () => {
      window.removeEventListener(
        "verificationUpdated",
        handleVerificationUpdate
      );
    };
  }, [isAuthenticated, user]);

  // Save user to backend when logged in
  useEffect(() => {
    const saveUser = async () => {
      if (isAuthenticated && user) {
        try {
          const payload = {
            auth0Id: user.sub,
            name: user.name,
            email: user.email,
            picture: user.picture || "",
          };

          console.log("Payload being sent to backend:", payload);

          const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          if (!res.ok) {
            const errorData = await res.json();
            console.error("Backend error response:", errorData);
            throw new Error(errorData.error || "Failed to save user");
          }

          console.log("User saved/updated successfully");

          // UPDATED: Check owner access after saving user
          setTimeout(() => {
            checkOwnerAccess();
          }, 500);
        } catch (err) {
          console.error("Error saving user:", err.message);
        }
      }
    };

    saveUser();
  }, [isAuthenticated, user]);

  return (
    <div className={styles.container}>
      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
        <div className={styles.logo}>
          <IoHomeSharp className={styles.logoIcon} />
          <Link to="/" className={styles.navLink}>
            <h2>RentMate</h2>
          </Link>
        </div>

        <div className={styles.hamburger} onClick={toggleMenu}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>

        <ul className={`${styles.navList} ${isOpen ? styles.active : ""}`}>
          <li className={styles.navItem}>
            <Link to="/find-flatmates" className={styles.navLink}>
              Find FlatMates
            </Link>
          </li>
          {/* UPDATED: More detailed logging for debugging */}
          {console.log(
            "Rendering navbar - canAccessOwnerFeatures:",
            canAccessOwnerFeatures
          )}
          {canAccessOwnerFeatures && (
            <li className={styles.navItem}>
              <Link to="/list-your-space" className={styles.navLink}>
                List Your Space
              </Link>
            </li>
          )}

          <li className={styles.navItem}>
            <Link to="/find-your-stay" className={styles.navLink}>
              Find Your Stay
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link to="/support" className={styles.navLink}>
              Support
            </Link>
          </li>
           <li className={styles.navItem}>
            <Link to="/about" className={styles.navLink}>
              About
            </Link>
          </li>
        </ul>

        <div className={styles.buttons}>
          {isAuthenticated ? (
            <>
              <Link to="/user-profile" className={styles.navLink}>
                <Profile />
              </Link>
              <Logout />
            </>
          ) : (
            <Login />
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
