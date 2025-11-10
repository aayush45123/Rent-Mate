import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Bed,
  Bath,
  Users,
  Share2,
  Heart,
  X,
  Star,
  Check,
  AlertCircle,
  Wifi,
  Car,
  Shield,
  Droplet,
  Zap,
  UtensilsCrossed,
  Sofa,
} from "lucide-react";
import styles from "./PropertyDetail.module.css";

const PropertyDetail = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  // Fetch property details
  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/property/${propertyId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch property details");
        }

        const data = await response.json();

        if (data.success) {
          setProperty(data.data);
        } else {
          setError("Failed to load property details");
        }
      } catch (err) {
        console.error("Error fetching property details:", err);
        setError("Failed to load property details");
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [propertyId]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <AlertCircle size={48} className={styles.errorIcon} />
          <h2 className={styles.errorTitle}>Something went wrong</h2>
          <p className={styles.errorText}>{error || "Property not found"}</p>
          <button onClick={() => navigate(-1)} className={styles.backBtn}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const images = property.media?.images || [];
  const currentImage =
    images[currentImageIndex]?.url || "/placeholder-property.jpg";

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  const handleContactFormChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/property/${propertyId}/inquiry`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(contactForm),
        }
      );
      alert("Your inquiry has been sent! Owner will contact you soon.");
      setShowContactForm(false);
      setContactForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      console.error("Error sending inquiry:", err);
      alert("Failed to send inquiry. Please try again.");
    }
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getAmenityIcon = (amenity) => {
    const amenityLower = amenity.toLowerCase();
    if (amenityLower.includes("wifi")) return <Wifi size={18} />;
    if (amenityLower.includes("parking") || amenityLower.includes("car"))
      return <Car size={18} />;
    if (amenityLower.includes("security")) return <Shield size={18} />;
    if (amenityLower.includes("water")) return <Droplet size={18} />;
    if (amenityLower.includes("power") || amenityLower.includes("electricity"))
      return <Zap size={18} />;
    if (amenityLower.includes("kitchen")) return <UtensilsCrossed size={18} />;
    if (amenityLower.includes("sofa") || amenityLower.includes("furniture"))
      return <Sofa size={18} />;
    return <Check size={18} />;
  };

  return (
    <div className={styles.container}>
      {/* Top Navigation */}

      {/* Main Content Grid */}
      <div className={styles.contentGrid}>
        {/* Left Column - Image Gallery */}
        <div className={styles.leftColumn}>
          <div className={styles.imageGallery}>
            {/* Main Image */}
            <div className={styles.mainImageContainer}>
              <img
                src={currentImage}
                alt="Property"
                className={styles.mainImage}
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePreviousImage}
                    className={`${styles.navButton} ${styles.prevButton}`}
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className={`${styles.navButton} ${styles.nextButton}`}
                  >
                    <ChevronRight size={24} />
                  </button>
                  <div className={styles.imageCounter}>
                    {currentImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className={styles.thumbnailStrip}>
                {images.map((image, index) => (
                  <div
                    key={index}
                    className={`${styles.thumbnail} ${
                      index === currentImageIndex ? styles.activeThumbnail : ""
                    }`}
                    onClick={() => handleThumbnailClick(index)}
                  >
                    <img src={image.url} alt={`Thumbnail ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Property Details */}
        <div className={styles.rightColumn}>
          <div className={styles.detailsContainer}>
            {/* Property Header */}
            <div className={styles.propertyHeader}>
              <div>
                <h1 className={styles.propertyTitle}>
                  {property.propertyTitle}
                </h1>
                <div className={styles.propertyLocation}>
                  <MapPin size={16} />
                  <span>
                    {property.address?.area}, {property.address?.city}
                  </span>
                </div>
                <div className={styles.propertyType}>
                  {property.propertySubType} •{" "}
                  {property.propertyDetails?.availableRooms} BHK
                </div>
              </div>
              {property.rating && (
                <div className={styles.ratingBadge}>
                  <Star size={16} fill="currentColor" />
                  <span>{property.rating}</span>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className={styles.quickStats}>
              <div className={styles.statItem}>
                <Bed size={20} />
                <div className={styles.statInfo}>
                  <div className={styles.statValue}>
                    {property.propertyDetails?.availableRooms}
                  </div>
                  <div className={styles.statLabel}>Rooms</div>
                </div>
              </div>
              <div className={styles.statItem}>
                <Bath size={20} />
                <div className={styles.statInfo}>
                  <div className={styles.statValue}>
                    {property.propertyDetails?.bathrooms}
                  </div>
                  <div className={styles.statLabel}>Bathrooms</div>
                </div>
              </div>
              <div className={styles.statItem}>
                <Users size={20} />
                <div className={styles.statInfo}>
                  <div className={styles.statValue}>
                    {property.rules?.gender}
                  </div>
                  <div className={styles.statLabel}>Gender</div>
                </div>
              </div>
              <div className={styles.statItem}>
                <Sofa size={20} />
                <div className={styles.statInfo}>
                  <div className={styles.statValue}>
                    {property.propertyDetails?.carpetArea} sq.ft
                  </div>
                  <div className={styles.statLabel}>Area</div>
                </div>
              </div>
            </div>

            {/* Pricing Card */}
            <div className={styles.pricingCard}>
              <div className={styles.priceSection}>
                <div className={styles.priceMain}>
                  <span className={styles.priceAmount}>
                    {formatPrice(property.pricing?.rentAmount)}
                  </span>
                  <span className={styles.pricePeriod}>per month</span>
                </div>
                {property.pricing?.rentNegotiable && (
                  <div className={styles.negotiableTag}>Negotiable</div>
                )}
              </div>

              <button
                className={styles.contactButton}
                onClick={() => setShowContactForm(true)}
              >
                Contact Owner
              </button>

              <div className={styles.priceHighlights}>
                <div className={styles.highlightItem}>
                  <Check size={16} />
                  <span>Available now</span>
                </div>
                {property.pricing?.rentNegotiable && (
                  <div className={styles.highlightItem}>
                    <Check size={16} />
                    <span>Price negotiable</span>
                  </div>
                )}
              </div>

              {/* Additional Pricing Details */}
              <div className={styles.additionalPricing}>
                {property.pricing?.securityDeposit > 0 && (
                  <div className={styles.pricingDetail}>
                    <span>Security Deposit</span>
                    <span>{formatPrice(property.pricing.securityDeposit)}</span>
                  </div>
                )}
                {property.pricing?.brokerageAmount > 0 && (
                  <div className={styles.pricingDetail}>
                    <span>Brokerage</span>
                    <span>{formatPrice(property.pricing.brokerageAmount)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Amenities Section */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>What this place offers</h3>
              <div className={styles.amenitiesGrid}>
                {property.amenities?.basic?.map((amenity, index) => (
                  <div key={index} className={styles.amenityItem}>
                    <div className={styles.amenityIcon}>
                      {getAmenityIcon(amenity)}
                    </div>
                    <span className={styles.amenityName}>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rules Section */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Rules & Preferences</h3>
              <div className={styles.rulesGrid}>
                {property.rules?.furnishing && (
                  <div className={styles.ruleItem}>
                    <span className={styles.ruleLabel}>Furnishing</span>
                    <span className={styles.ruleValue}>
                      {property.rules.furnishing}
                    </span>
                  </div>
                )}
                {property.rules?.petsAllowed !== undefined && (
                  <div className={styles.ruleItem}>
                    <span className={styles.ruleLabel}>Pets</span>
                    <span className={styles.ruleValue}>
                      {property.rules.petsAllowed ? "Allowed" : "Not Allowed"}
                    </span>
                  </div>
                )}
                {property.rules?.smokingAllowed !== undefined && (
                  <div className={styles.ruleItem}>
                    <span className={styles.ruleLabel}>Smoking</span>
                    <span className={styles.ruleValue}>
                      {property.rules.smokingAllowed
                        ? "Allowed"
                        : "Not Allowed"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Description Section */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Description</h3>
              <p className={styles.description}>
                {property.propertyDescription}
              </p>
            </div>

            {/* Report Button */}
            <button className={styles.reportButton}>Report this listing</button>
          </div>
        </div>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Contact Owner</h2>
              <button
                onClick={() => setShowContactForm(false)}
                className={styles.closeBtn}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleContactSubmit} className={styles.contactForm}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={contactForm.name}
                  onChange={handleContactFormChange}
                  required
                  className={styles.formInput}
                  placeholder="Your full name"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={contactForm.email}
                  onChange={handleContactFormChange}
                  required
                  className={styles.formInput}
                  placeholder="your.email@example.com"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={contactForm.phone}
                  onChange={handleContactFormChange}
                  required
                  className={styles.formInput}
                  placeholder="Your phone number"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Message</label>
                <textarea
                  name="message"
                  value={contactForm.message}
                  onChange={handleContactFormChange}
                  rows="3"
                  className={styles.formInput}
                  placeholder="Write your message here..."
                />
              </div>

              <button type="submit" className={styles.submitBtn}>
                Send Inquiry
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetail;
