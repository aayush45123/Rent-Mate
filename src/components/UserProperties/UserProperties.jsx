import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  FaHome,
  FaEdit,
  FaTrash,
  FaEye,
  FaEyeSlash,
  FaPlus,
  FaChartBar,
  FaCalendarAlt,
  FaRupeeSign,
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaUsers,
  FaStar,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import styles from "./UserProperties.module.css";

const UserProperties = () => {
  const { user, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  // State management
  const [properties, setProperties] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Fetch user's properties
  const fetchUserProperties = async () => {
    if (!isAuthenticated || !user) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/property/owner/${
          user.sub
        }?status=${activeTab}`
      );

      if (response.ok) {
        const data = await response.json();
        setProperties(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching user properties:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch property statistics
  const fetchPropertyStats = async () => {
    if (!isAuthenticated || !user) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/property/owner/${user.sub}/stats`
      );

      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (error) {
      console.error("Error fetching property stats:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserProperties();
      fetchPropertyStats();
    }
  }, [isAuthenticated, user, activeTab]);

  // Handle property actions
  const handleToggleStatus = async (propertyId, currentStatus) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/property/${propertyId}/toggle-status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ownerId: user.sub }),
        }
      );

      if (response.ok) {
        fetchUserProperties();
        fetchPropertyStats();
      }
    } catch (error) {
      console.error("Error toggling property status:", error);
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/property/${propertyId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ownerId: user.sub }),
        }
      );

      if (response.ok) {
        setDeleteConfirm(null);
        fetchUserProperties();
        fetchPropertyStats();
      }
    } catch (error) {
      console.error("Error deleting property:", error);
    }
  };

  const handleEditProperty = (propertyId) => {
    navigate(`/edit-property/${propertyId}`);
  };

  const handleCreateProperty = () => {
    navigate("/list-your-space");
  };

  const handleViewProperty = (propertyId) => {
    navigate(`/property-detail/${propertyId}`);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "published":
        return styles.statusPublished;
      case "draft":
        return styles.statusDraft;
      case "inactive":
        return styles.statusInactive;
      default:
        return styles.statusDraft;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingSpinner}>
          <div className={styles.spinner}></div>
          <p>Loading your properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>My Properties</h1>
          <p className={styles.subtitle}>
            Manage your property listings and track performance
          </p>
        </div>
        <button onClick={handleCreateProperty} className={styles.createBtn}>
          <FaPlus />
          List New Property
        </button>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FaHome />
            </div>
            <div className={styles.statContent}>
              <h3>{stats.totalProperties || 0}</h3>
              <p>Total Properties</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FaEye />
            </div>
            <div className={styles.statContent}>
              <h3>{stats.publishedProperties || 0}</h3>
              <p>Published</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FaChartBar />
            </div>
            <div className={styles.statContent}>
              <h3>{stats.totalViews || 0}</h3>
              <p>Total Views</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FaUsers />
            </div>
            <div className={styles.statContent}>
              <h3>{stats.totalInquiries || 0}</h3>
              <p>Inquiries</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FaRupeeSign />
            </div>
            <div className={styles.statContent}>
              <h3>{formatCurrency(stats.averageRent || 0)}</h3>
              <p>Avg. Rent</p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${
            activeTab === "all" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("all")}
        >
          All Properties ({stats?.totalProperties || 0})
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "published" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("published")}
        >
          Published ({stats?.publishedProperties || 0})
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "draft" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("draft")}
        >
          Drafts ({stats?.draftProperties || 0})
        </button>
      </div>

      {/* Properties Grid */}
      <div className={styles.propertiesGrid}>
        {properties.length === 0 ? (
          <div className={styles.emptyState}>
            <FaHome className={styles.emptyIcon} />
            <h3>No Properties Found</h3>
            <p>
              {activeTab === "all"
                ? "You haven't listed any properties yet."
                : `You don't have any ${activeTab} properties.`}
            </p>
            <button onClick={handleCreateProperty} className={styles.createBtn}>
              <FaPlus />
              List Your First Property
            </button>
          </div>
        ) : (
          properties.map((property) => (
            <div key={property._id} className={styles.propertyCard}>
              {/* Property Image */}
              <div className={styles.propertyImage}>
                {property.media?.images?.[0] ? (
                  <img
                    src={property.media.images[0].url}
                    alt={property.propertyTitle}
                    className={styles.image}
                  />
                ) : (
                  <div className={styles.imagePlaceholder}>
                    <FaHome />
                  </div>
                )}

                {/* Status Badge */}
                <div
                  className={`${styles.statusBadge} ${getStatusBadgeClass(
                    property.publishStatus
                  )}`}
                >
                  {property.publishStatus}
                </div>

                {/* Featured Badge */}
                {property.featured && (
                  <div className={styles.featuredBadge}>
                    <FaStar />
                    Featured
                  </div>
                )}
              </div>

              {/* Property Content */}
              <div className={styles.propertyContent}>
                <h3 className={styles.propertyTitle}>
                  {property.propertyTitle}
                </h3>

                <div className={styles.propertyLocation}>
                  <FaMapMarkerAlt />
                  {property.address.area}, {property.address.city}
                </div>

                <div className={styles.propertyDetails}>
                  <div className={styles.detailItem}>
                    <FaBed />
                    <span>
                      {property.propertyDetails.availableRooms} Room
                      {property.propertyDetails.availableRooms !== 1 ? "s" : ""}{" "}
                      Available
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <FaBath />
                    <span>
                      {property.propertyDetails.bathrooms} Bathroom
                      {property.propertyDetails.bathrooms !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <FaHome />
                    <span>
                      {property.propertyType} •{" "}
                      {property.propertyDetails.furnishingStatus}
                    </span>
                  </div>
                </div>

                <div className={styles.propertyPricing}>
                  <div className={styles.rent}>
                    <FaRupeeSign />
                    {formatCurrency(property.pricing.rentAmount)}
                    <span>/month</span>
                  </div>
                  <div className={styles.deposit}>
                    Security: {formatCurrency(property.pricing.securityDeposit)}
                  </div>
                </div>

                <div className={styles.propertyMeta}>
                  <div className={styles.metaItem}>
                    <FaEye />
                    {property.views} views
                  </div>
                  <div className={styles.metaItem}>
                    <FaUsers />
                    {property.inquiries} inquiries
                  </div>
                  <div className={styles.metaItem}>
                    <FaCalendarAlt />
                    Listed {formatDate(property.createdAt)}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className={styles.actionButtons}>
                <button
                  onClick={() => handleViewProperty(property._id)}
                  className={styles.viewBtn}
                >
                  <FaEye />
                  View
                </button>

                <button
                  onClick={() => handleEditProperty(property._id)}
                  className={styles.editBtn}
                >
                  <FaEdit />
                  Edit
                </button>

                <button
                  onClick={() =>
                    handleToggleStatus(property._id, property.isActive)
                  }
                  className={styles.toggleBtn}
                >
                  {property.isActive ? <FaEyeSlash /> : <FaEye />}
                  {property.isActive ? "Deactivate" : "Activate"}
                </button>

                <button
                  onClick={() => setDeleteConfirm(property._id)}
                  className={styles.deleteBtn}
                >
                  <FaTrash />
                  Delete
                </button>
              </div>

              {/* Delete Confirmation Modal */}
              {deleteConfirm === property._id && (
                <div className={styles.confirmModal}>
                  <div className={styles.confirmContent}>
                    <h4>Delete Property?</h4>
                    <p>
                      Are you sure you want to delete this property? This action
                      cannot be undone.
                    </p>
                    <div className={styles.confirmActions}>
                      <button
                        onClick={() => handleDeleteProperty(property._id)}
                        className={styles.confirmDelete}
                      >
                        Yes, Delete
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className={styles.confirmCancel}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserProperties;
