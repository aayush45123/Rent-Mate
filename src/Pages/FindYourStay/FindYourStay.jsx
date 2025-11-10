import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  MapPin,
  Bed,
  Bath,
  Users,
  Wifi,
  Car,
  Shield,
  Heart,
  Star,
  Eye,
  Phone,
  Mail,
  ChevronDown,
  Grid3x3,
  List,
  SlidersHorizontal,
  X,
} from "lucide-react";
import styles from "./FindYourStay.module.css";

const FindYourStay = () => {
  const navigate = useNavigate();

  // State management
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("grid");

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    city: "",
    area: "",
    propertyType: "",
    minRent: "",
    maxRent: "",
    gender: "",
    furnishing: "",
  });

  // Local filter state (not yet applied)
  const [localFilters, setLocalFilters] = useState({ ...filters });

  // Sorting and pagination
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});

  // Fetch properties from API
  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: 12,
        sortBy,
        sortOrder,
        ...(searchQuery && { search: searchQuery }),
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v)),
      });

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/property?${queryParams}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch properties");
      }

      const data = await response.json();

      if (data.success) {
        setProperties(data.data.properties);
        setPagination(data.data.pagination);
      } else {
        setError("Failed to load properties");
      }
    } catch (err) {
      console.error("Error fetching properties:", err);
      setError("Failed to load properties");
    } finally {
      setLoading(false);
    }
  }, [currentPage, sortBy, sortOrder, searchQuery, filters]);

  // Initial load
  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProperties();
  };

  // Handle local filter change (doesn't trigger API call)
  const handleLocalFilterChange = (key, value) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Apply filters (only this triggers API call)
  const applyFilters = () => {
    setFilters({ ...localFilters });
    setCurrentPage(1);
  };

  // Clear all filters
  const clearFilters = () => {
    const emptyFilters = {
      city: "",
      area: "",
      propertyType: "",
      minRent: "",
      maxRent: "",
      gender: "",
      furnishing: "",
    };
    setFilters(emptyFilters);
    setLocalFilters(emptyFilters);
    setSearchQuery("");
    setCurrentPage(1);
  };

  // Handle property view
  const handlePropertyView = async (propertyId) => {
    try {
      await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/property/${propertyId}`,
        {
          method: "GET",
        }
      );
    } catch (err) {
      console.error("Error recording view:", err);
    }

    navigate(`/property-detail/${propertyId}`);
  };

  // Handle inquiry
  const handleInquiry = async (propertyId, e) => {
    e.stopPropagation();
    try {
      await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/property/${propertyId}/inquiry`,
        {
          method: "PUT",
        }
      );
      alert("Interest recorded! Contact information will be shared.");
    } catch (err) {
      console.error("Error recording inquiry:", err);
    }
  };

  // Format price
  const formatPrice = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Property Card Component
  const PropertyCard = ({ property }) => {
    const coverImage =
      property.media?.images?.[0]?.url || "/placeholder-property.jpg";

    return (
      <div
        className={`${styles.propertyCard} ${
          viewMode === "list" ? styles.listView : ""
        }`}
        onClick={() => handlePropertyView(property._id)}
      >
        <div className={styles.propertyImage}>
          <img src={coverImage} alt={property.propertyTitle} />
          <div className={styles.propertyBadges}>
            {property.featured && (
              <span className={`${styles.badge} ${styles.featuredBadge}`}>
                <Star size={12} />
                Featured
              </span>
            )}
            <span className={`${styles.badge} ${styles.typeBadge}`}>
              {property.propertySubType}
            </span>
          </div>
          <button
            className={styles.favoriteBtn}
            onClick={(e) => e.stopPropagation()}
          >
            <Heart size={16} />
          </button>
        </div>

        <div className={styles.propertyContent}>
          <div className={styles.propertyHeader}>
            <h3 className={styles.propertyTitle}>{property.propertyTitle}</h3>
            <div className={styles.propertyLocation}>
              <MapPin size={14} />
              <span>
                {property.address?.area}, {property.address?.city}
              </span>
            </div>
          </div>

          <div className={styles.propertyDetails}>
            <div className={styles.propertySpecs}>
              <div className={styles.spec}>
                <Bed size={16} />
                <span>{property.propertyDetails?.availableRooms} Rooms</span>
              </div>
              <div className={styles.spec}>
                <Bath size={16} />
                <span>{property.propertyDetails?.bathrooms} Bath</span>
              </div>
              <div className={styles.spec}>
                <Users size={16} />
                <span>{property.rules?.gender}</span>
              </div>
            </div>

            <div className={styles.propertyAmenities}>
              {property.amenities?.basic?.includes("wifi") && (
                <Wifi size={14} />
              )}
              {property.amenities?.basic?.includes("parking") && (
                <Car size={14} />
              )}
              {property.amenities?.safety?.includes("security") && (
                <Shield size={14} />
              )}
            </div>
          </div>

          <div className={styles.propertyFooter}>
            <div className={styles.propertyPrice}>
              <span className={styles.rent}>
                {formatPrice(property.pricing?.rentAmount)}
              </span>
              <span className={styles.period}>/month</span>
              {property.pricing?.rentNegotiable && (
                <span className={styles.negotiable}>Negotiable</span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render loading state
  if (loading && properties.length === 0) {
    return (
      <div className={styles.findStayContainer}>
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Loading properties...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className={styles.findStayContainer}>
        <div className={styles.errorState}>
          <h2>Something went wrong</h2>
          <p>{error}</p>
          <button onClick={fetchProperties} className={styles.retryBtn}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.findStayContainer}>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Find Your Perfect Stay</h1>
          <p>Discover comfortable and affordable accommodations</p>
        </div>
      </div>

      {/* Search Section */}
      <div className={styles.searchSection}>
        <div className={styles.searchWrapper}>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <div className={styles.searchInput}>
              <Search size={20} />
              <input
                type="text"
                placeholder="Search by location, property name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button type="submit" className={styles.searchBtn}>
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={styles.filterToggle}
            >
              <SlidersHorizontal size={20} />
              Filters
            </button>
          </form>
        </div>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className={styles.filtersSection}>
          <div className={styles.filtersWrapper}>
            <div className={styles.filtersGrid}>
              <select
                value={localFilters.city}
                onChange={(e) =>
                  handleLocalFilterChange("city", e.target.value)
                }
                className={styles.filterSelect}
              >
                <option value="">All Cities</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Pune">Pune</option>
                <option value="Hyderabad">Hyderabad</option>
              </select>

              <select
                value={localFilters.propertyType}
                onChange={(e) =>
                  handleLocalFilterChange("propertyType", e.target.value)
                }
                className={styles.filterSelect}
              >
                <option value="">All Types</option>
                <option value="PG">PG</option>
                <option value="FLAT">Flat/Apartment</option>
                <option value="ROOM">Room</option>
              </select>

              <select
                value={localFilters.gender}
                onChange={(e) =>
                  handleLocalFilterChange("gender", e.target.value)
                }
                className={styles.filterSelect}
              >
                <option value="">Any Gender</option>
                <option value="Male Only">Male Only</option>
                <option value="Female Only">Female Only</option>
                <option value="Both">Both</option>
              </select>

              <select
                value={localFilters.furnishing}
                onChange={(e) =>
                  handleLocalFilterChange("furnishing", e.target.value)
                }
                className={styles.filterSelect}
              >
                <option value="">Any Furnishing</option>
                <option value="Fully Furnished">Fully Furnished</option>
                <option value="Semi Furnished">Semi Furnished</option>
                <option value="Unfurnished">Unfurnished</option>
              </select>

              <input
                type="number"
                placeholder="Min Rent"
                value={localFilters.minRent}
                onChange={(e) =>
                  handleLocalFilterChange("minRent", e.target.value)
                }
                className={styles.filterInput}
              />

              <input
                type="number"
                placeholder="Max Rent"
                value={localFilters.maxRent}
                onChange={(e) =>
                  handleLocalFilterChange("maxRent", e.target.value)
                }
                className={styles.filterInput}
              />
            </div>

            <div className={styles.filterActions}>
              <button onClick={clearFilters} className={styles.clearFiltersBtn}>
                <X size={16} />
                Clear All
              </button>
              <button onClick={applyFilters} className={styles.applyFiltersBtn}>
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results Header */}
      <div className={styles.resultsHeader}>
        <div className={styles.resultsInfo}>
          <h2>
            {pagination.totalProperties || 0} Properties Found
            {searchQuery && ` for "${searchQuery}"`}
          </h2>
        </div>

        <div className={styles.resultsControls}>
          <div className={styles.viewModeToggle}>
            <button
              onClick={() => setViewMode("grid")}
              className={viewMode === "grid" ? styles.active : ""}
            >
              <Grid3x3 size={18} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={viewMode === "list" ? styles.active : ""}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Properties Grid/List */}
      <div className={`${styles.propertiesContainer} ${styles[viewMode]}`}>
        {properties.length > 0 ? (
          properties.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))
        ) : (
          <div className={styles.noResults}>
            <h3>No properties found</h3>
            <p>Try adjusting your filters or search terms</p>
            <button onClick={clearFilters} className={styles.clearFiltersBtn}>
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={!pagination.hasPreviousPage}
            className={styles.pageBtn}
          >
            Previous
          </button>

          <div className={styles.pageNumbers}>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter(
                (page) =>
                  page === 1 ||
                  page === pagination.totalPages ||
                  Math.abs(page - currentPage) <= 2
              )
              .map((page, index, array) => (
                <React.Fragment key={page}>
                  {index > 0 && array[index - 1] < page - 1 && (
                    <span className={styles.ellipsis}>...</span>
                  )}
                  <button
                    onClick={() => setCurrentPage(page)}
                    className={`${styles.pageBtn} ${
                      currentPage === page ? styles.active : ""
                    }`}
                  >
                    {page}
                  </button>
                </React.Fragment>
              ))}
          </div>

          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={!pagination.hasNextPage}
            className={styles.pageBtn}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default FindYourStay;
