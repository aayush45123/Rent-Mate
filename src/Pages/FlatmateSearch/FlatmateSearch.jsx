import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { FaSearch, FaUser, FaExclamationTriangle } from "react-icons/fa";
import FlatmateCard from "../../components/FlatmateCard/FlatmateCard";
import styles from "./FlatmateSearch.module.css";

const FlatmateSearch = () => {
  const { user, isAuthenticated } = useAuth0();
  const [flatmates, setFlatmates] = useState([]);
  const [filteredFlatmates, setFilteredFlatmates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeywords, setSearchKeywords] = useState("");
  const [error, setError] = useState("");
  const [profileIncomplete, setProfileIncomplete] = useState(false);
  const [imageCache, setImageCache] = useState(new Map());

  // Fetch flatmates on component mount
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchFlatmates();
    }
  }, [isAuthenticated, user]);

  // Filter flatmates when search keywords change
  useEffect(() => {
    try {
      if (searchKeywords.trim() === "") {
        setFilteredFlatmates(flatmates);
      } else {
        const keywords = searchKeywords.toLowerCase();
        const filtered = flatmates.filter((flatmate) => {
          const bio = flatmate.bio?.toLowerCase() || "";
          const name = flatmate.name?.toLowerCase() || "";
          const address = flatmate.address?.toLowerCase() || "";

          return (
            bio.includes(keywords) ||
            name.includes(keywords) ||
            address.includes(keywords)
          );
        });
        setFilteredFlatmates(filtered);
      }
    } catch (err) {
      console.error("Error filtering flatmates:", err);
      setFilteredFlatmates(flatmates);
    }
  }, [searchKeywords, flatmates]);

  // Function to load profile image through proxy if needed
  const loadProfileImage = async (flatmate) => {
    const cacheKey = flatmate._id;

    try {
      // Check if we already have this image cached
      if (imageCache.has(cacheKey)) {
        return imageCache.get(cacheKey);
      }

      // If it's already a base64 image, use it directly
      if (flatmate.picture?.startsWith("data:")) {
        const newCache = new Map(imageCache);
        newCache.set(cacheKey, flatmate.picture);
        setImageCache(newCache);
        return flatmate.picture;
      }

      // If it's a Google image, try to load through proxy
      if (
        flatmate.picture &&
        (flatmate.picture.includes("googleusercontent.com") ||
          flatmate.picture.includes("googleapis.com"))
      ) {
        try {
          const proxyResponse = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/user/${
              flatmate.auth0Id || flatmate._id
            }/profile-image`
          );

          if (proxyResponse.ok) {
            const { imageUrl: proxiedImageUrl } = await proxyResponse.json();
            const newCache = new Map(imageCache);
            newCache.set(cacheKey, proxiedImageUrl);
            setImageCache(newCache);
            console.log(
              `Successfully loaded image through proxy for ${flatmate.name}`
            );
            return proxiedImageUrl;
          } else {
            // Fallback to original URL
            const newCache = new Map(imageCache);
            newCache.set(cacheKey, flatmate.picture);
            setImageCache(newCache);
            return flatmate.picture;
          }
        } catch (error) {
          console.error(
            `Error loading image through proxy for ${flatmate.name}:`,
            error
          );
          const newCache = new Map(imageCache);
          newCache.set(cacheKey, flatmate.picture);
          setImageCache(newCache);
          return flatmate.picture;
        }
      } else {
        // For non-Google images, use directly
        const newCache = new Map(imageCache);
        newCache.set(cacheKey, flatmate.picture);
        setImageCache(newCache);
        return flatmate.picture;
      }
    } catch (err) {
      console.error("Error in loadProfileImage:", err);
      return flatmate.picture;
    }
  };

  const fetchFlatmates = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/user/${user.sub}/flatmates`
      );

      const data = await response.json();

      if (response.ok) {
        console.log("FlatmateSearch - fetched flatmates:", data.flatmates);

        // Process flatmates and load their images
        const flatmatesWithImages = await Promise.all(
          data.flatmates.map(async (flatmate) => {
            const processedImageUrl = await loadProfileImage(flatmate);
            return {
              ...flatmate,
              processedImageUrl,
            };
          })
        );

        setFlatmates(flatmatesWithImages);
        setFilteredFlatmates(flatmatesWithImages);
        setProfileIncomplete(false);
      } else {
        if (data.completionStatus === false) {
          setProfileIncomplete(true);
          setError(data.error);
        } else {
          setError(data.error || "Failed to fetch flatmates");
          setFlatmates([]);
          setFilteredFlatmates([]);
        }
      }
    } catch (err) {
      console.error("Error fetching flatmates:", err);
      setError("Network error. Please try again.");
      setFlatmates([]);
      setFilteredFlatmates([]);
    } finally {
      setLoading(false);
    }
  };

  const searchWithKeywords = async () => {
    if (!searchKeywords.trim()) {
      fetchFlatmates();
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/user/${
          user.sub
        }/search-flatmates?keywords=${encodeURIComponent(searchKeywords)}`
      );

      const data = await response.json();

      if (response.ok) {
        // Process flatmates and load their images
        const flatmatesWithImages = await Promise.all(
          data.flatmates.map(async (flatmate) => {
            const processedImageUrl = await loadProfileImage(flatmate);
            return {
              ...flatmate,
              processedImageUrl,
            };
          })
        );

        setFlatmates(flatmatesWithImages);
        setFilteredFlatmates(flatmatesWithImages);
      } else {
        setError(data.error || "Failed to search flatmates");
        setFlatmates([]);
        setFilteredFlatmates([]);
      }
    } catch (err) {
      console.error("Error searching flatmates:", err);
      setError("Network error. Please try again.");
      setFlatmates([]);
      setFilteredFlatmates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = (flatmate) => {
    console.log("Connect button clicked for:", flatmate.name);
    // Add your connect logic here
    // For example: open modal, send connection request, etc.
    alert(`Connection request sent to ${flatmate.name}!`);
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.container}>
        <div className={styles.errorCard}>
          <FaExclamationTriangle className={styles.errorIcon} />
          <h2>Authentication Required</h2>
          <p>Please log in to search for flatmates.</p>
        </div>
      </div>
    );
  }

  if (profileIncomplete) {
    return (
      <div className={styles.container}>
        <div className={styles.errorCard}>
          <FaExclamationTriangle className={styles.warningIcon} />
          <h2>Complete Your Profile First</h2>
          <p>{error}</p>
          <p>
            Fill out all fields in your profile to start searching for
            flatmates.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Find Flatmates</h1>
          <p className={styles.subtitle}>
            Connect with potential flatmates in your area
          </p>
        </div>
      </div>

      {/* Search Section */}
      <div className={styles.searchSection}>
        <div className={styles.searchBar}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by keywords (e.g., 'searching og', 'looking flatmate', 'need roommate')"
            value={searchKeywords}
            onChange={(e) => setSearchKeywords(e.target.value)}
            className={styles.searchInput}
            onKeyPress={(e) => e.key === "Enter" && searchWithKeywords()}
          />
          <button
            onClick={searchWithKeywords}
            className={styles.searchButton}
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && !profileIncomplete && (
        <div className={styles.errorMessage}>{error}</div>
      )}

      {/* Results */}
      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Finding flatmates for you...</p>
        </div>
      ) : (
        <div className={styles.resultsSection}>
          <div className={styles.resultsHeader}>
            <h2>
              {filteredFlatmates.length} Flatmate
              {filteredFlatmates.length !== 1 ? "s" : ""}
            </h2>
            {searchKeywords && (
              <button
                onClick={() => {
                  setSearchKeywords("");
                  fetchFlatmates();
                }}
                className={styles.clearSearch}
              >
                Clear Search
              </button>
            )}
          </div>

          {filteredFlatmates.length === 0 ? (
            <div className={styles.noResults}>
              <FaUser className={styles.noResultsIcon} />
              <h3>No flatmates found</h3>
              <p>
                {searchKeywords
                  ? "Try different keywords or clear your search to see all available flatmates."
                  : "No users are currently looking for flatmates. Check back later!"}
              </p>
            </div>
          ) : (
            <div className={styles.flatmateGrid}>
              {filteredFlatmates.map((flatmate) => (
                <FlatmateCard
                  key={flatmate._id}
                  flatmate={{
                    ...flatmate,
                    picture: flatmate.processedImageUrl || flatmate.picture,
                  }}
                  onConnect={handleConnect}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FlatmateSearch;
