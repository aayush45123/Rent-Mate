import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import styles from "./RateUsSection.module.css";

const RateUsSection = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState(null);

  // Fetch additional user data from your backend
  useEffect(() => {
    const fetchUserData = async () => {
      if (isAuthenticated && user?.sub) {
        try {
          const response = await fetch(
            `http://localhost:5000/api/users/${user.sub}`
          );
          if (response.ok) {
            const userData = await response.json();
            setUserData(userData);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [isAuthenticated, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isAuthenticated) {
      setError("Please log in to submit a rating.");
      return;
    }

    if (rating === 0) {
      setError("Please select a rating before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:5000/api/ratings/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating,
          comment,
          userName: userData?.name || user?.name || "Anonymous",
          userEmail: userData?.email || user?.email || "",
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSubmitted(true);
      } else {
        setError(data.message || "Failed to submit rating. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setRating(0);
    setComment("");
    setIsSubmitted(false);
    setError("");
  };

  const StarIcon = ({
    filled,
    hovered,
    onClick,
    onMouseEnter,
    onMouseLeave,
  }) => (
    <svg
      className={`${styles.star} ${filled ? styles.filled : ""} ${
        hovered ? styles.hovered : ""
      }`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
        fill={filled ? "currentColor" : "none"}
      />
    </svg>
  );

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h2 className={styles.title}>Rate Your Experience</h2>
            <p className={styles.subtitle}>
              Please log in to share your feedback about RentMate
            </p>
          </div>
          <div className={styles.loginPrompt}>
            <p>You need to be logged in to submit a rating.</p>
          </div>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className={styles.container}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>✓</div>
          <h3 className={styles.successTitle}>
            Thank You, {userData?.name || user?.name || "User"}!
          </h3>
          <p className={styles.successMessage}>
            Your feedback helps us improve RentMate for everyone.
          </p>
          <button className={styles.resetButton} onClick={handleReset}>
            Submit Another Review
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h2 className={styles.title}>Rate Your Experience</h2>
          <p className={styles.subtitle}>
            How was your experience with RentMate?
          </p>
          {userData && (
            <div className={styles.userInfoBadge}>
              Rating as: <strong>{userData.name}</strong>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.errorMessage}>{error}</div>}

          <div className={styles.ratingSection}>
            <div className={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  filled={star <= (hoverRating || rating)}
                  hovered={star <= hoverRating}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                />
              ))}
            </div>
            <div className={styles.ratingText}>
              {rating > 0 && (
                <span className={styles.ratingValue}>
                  {rating} star{rating !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>

          <div className={styles.commentSection}>
            <label htmlFor="comment" className={styles.label}>
              Share your thoughts (optional)
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you like about RentMate? How can we improve?"
              className={styles.textarea}
              rows="4"
              maxLength="500"
            />
            <div className={styles.charCount}>
              {comment.length}/500 characters
            </div>
          </div>

          <button
            type="submit"
            disabled={rating === 0 || isSubmitting}
            className={`${styles.submitButton} ${
              rating === 0 ? styles.disabled : ""
            }`}
          >
            {isSubmitting ? (
              <>
                <div className={styles.spinner}></div>
                Submitting...
              </>
            ) : (
              "Submit Review"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RateUsSection;
