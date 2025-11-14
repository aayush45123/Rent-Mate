import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Home,
  MapPin,
  Camera,
  DollarSign,
  Users,
  FileText,
  Send,
  Upload,
  X,
  AlertCircle,
  Building,
  Bed,
  Bath,
  Wifi,
  Car,
  Shield,
  Utensils,
  Zap,
  Droplets,
  Wind,
  Sun,
  Moon,
} from "lucide-react";
import styles from "./ListYourSpace.module.css";

const ListYourSpace = () => {
  const { user, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    // Step 1: Property Type & Basic Info
    propertyType: "",
    propertySubType: "",
    propertyTitle: "",
    propertyDescription: "",

    // Step 2: Location Details
    address: {
      street: "",
      area: "",
      city: "",
      state: "",
      pincode: "",
      landmark: "",
      coordinates: {
        lat: null,
        lng: null,
      },
    },
    nearbyPlaces: {
      metro: [],
      hospital: [],
      school: [],
      market: [],
      office: [],
    },

    // Step 3: Property Details
    propertyDetails: {
      totalRooms: "",
      availableRooms: "",
      bathrooms: "",
      balconies: "",
      floor: "",
      totalFloors: "",
      builtUpArea: "",
      carpetArea: "",
      furnishingStatus: "",
      ageOfProperty: "",
      parking: "",
    },

    // Step 4: Amenities & Features
    amenities: {
      basic: [],
      safety: [],
      recreational: [],
      services: [],
    },
    rules: {
      gender: "",
      smoking: false,
      drinking: false,
      pets: false,
      guestsAllowed: false,
      foodRestrictions: "",
      timing: {
        entry: "",
        exit: "",
      },
    },

    // Step 5: Pricing & Availability
    pricing: {
      rentAmount: "",
      securityDeposit: "",
      maintenanceCharges: "",
      electricityCharges: "",
      additionalCharges: [],
      rentNegotiable: false,
    },
    availability: {
      availableFrom: "",
      minimumStay: "",
      maximumStay: "",
      noticePeriod: "",
    },

    // Step 6: Photos & Videos
    media: {
      images: [],
      virtualTourLink: "",
      videoLink: "",
    },

    // Step 7: Contact & Final Details
    contactInfo: {
      contactPerson: "",
      phoneNumber: "",
      alternateNumber: "",
      email: "",
      preferredContactTime: "",
      showContactInfo: true,
    },
    publishStatus: "draft",
  });

  const steps = [
    {
      number: 1,
      title: "Property Type",
      icon: Home,
      description: "Basic property information",
    },
    {
      number: 2,
      title: "Location",
      icon: MapPin,
      description: "Address and nearby places",
    },
    {
      number: 3,
      title: "Property Details",
      icon: Building,
      description: "Specifications and features",
    },
    {
      number: 4,
      title: "Amenities",
      icon: Shield,
      description: "Facilities and house rules",
    },
    {
      number: 5,
      title: "Pricing",
      icon: DollarSign,
      description: "Rent and charges",
    },
    {
      number: 6,
      title: "Media",
      icon: Camera,
      description: "Photos and videos",
    },
    {
      number: 7,
      title: "Contact & Publish",
      icon: Send,
      description: "Final details and publish",
    },
  ];

  const propertyTypes = {
    PG: {
      label: "Paying Guest (PG)",
      subtypes: ["Boys PG", "Girls PG", "Co-living Space", "Executive PG"],
    },
    FLAT: {
      label: "Flat/Apartment",
      subtypes: ["1 BHK", "2 BHK", "3 BHK", "4+ BHK", "Studio"],
    },
    ROOM: {
      label: "Individual Room",
      subtypes: ["Single Room", "Shared Room", "Master Bedroom"],
    },
  };

  const amenitiesList = {
    basic: [
      { id: "wifi", label: "Wi-Fi", icon: Wifi },
      { id: "parking", label: "Parking", icon: Car },
      { id: "power_backup", label: "Power Backup", icon: Zap },
      { id: "water_supply", label: "24/7 Water", icon: Droplets },
      { id: "ac", label: "Air Conditioning", icon: Wind },
      { id: "heating", label: "Heating", icon: Sun },
      { id: "laundry", label: "Laundry Service", icon: Moon },
      { id: "cleaning", label: "Cleaning Service", icon: Home },
    ],
    safety: [
      { id: "security", label: "Security Guard", icon: Shield },
      { id: "cctv", label: "CCTV Surveillance", icon: Camera },
      { id: "fire_safety", label: "Fire Safety", icon: AlertCircle },
      { id: "intercom", label: "Intercom", icon: Users },
    ],
    recreational: [
      { id: "gym", label: "Gym/Fitness Center", icon: Users },
      { id: "common_area", label: "Common Area", icon: Home },
      { id: "terrace", label: "Terrace Access", icon: Building },
      { id: "garden", label: "Garden/Lawn", icon: Sun },
    ],
    services: [
      { id: "food", label: "Food Service", icon: Utensils },
      { id: "housekeeping", label: "Housekeeping", icon: Home },
      { id: "maintenance", label: "Maintenance", icon: FileText },
    ],
  };

  const handleInputChange = (field, value, nested = null, subNested = null) => {
    setFormData((prev) => {
      if (subNested) {
        return {
          ...prev,
          [field]: {
            ...prev[field],
            [nested]: {
              ...prev[field][nested],
              [subNested]: value,
            },
          },
        };
      } else if (nested) {
        return {
          ...prev,
          [field]: {
            ...prev[field],
            [nested]: value,
          },
        };
      } else {
        return {
          ...prev,
          [field]: value,
        };
      }
    });

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleArrayInputChange = (field, value, nested = null) => {
    if (nested) {
      setFormData((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          [nested]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleFileUpload = (files, field) => {
    const uploadedFiles = Array.from(files).map((file) => {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          [field]: "Each file should be less than 5MB",
        }));
        return null;
      }

      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            id: Date.now() + Math.random(),
            name: file.name,
            url: reader.result,
            file: file,
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(uploadedFiles.filter(Boolean)).then((results) => {
      handleInputChange(
        "media",
        [...formData.media.images, ...results],
        "images"
      );
    });
  };

  const removeImage = (imageId) => {
    const updatedImages = formData.media.images.filter(
      (img) => img.id !== imageId
    );
    handleInputChange("media", updatedImages, "images");
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.propertyType)
          newErrors.propertyType = "Property type is required";
        if (!formData.propertySubType)
          newErrors.propertySubType = "Property subtype is required";
        if (!formData.propertyTitle.trim())
          newErrors.propertyTitle = "Property title is required";
        if (!formData.propertyDescription.trim())
          newErrors.propertyDescription = "Description is required";
        break;

      case 2:
        if (!formData.address.street.trim())
          newErrors["address.street"] = "Street address is required";
        if (!formData.address.area.trim())
          newErrors["address.area"] = "Area is required";
        if (!formData.address.city.trim())
          newErrors["address.city"] = "City is required";
        if (!formData.address.state.trim())
          newErrors["address.state"] = "State is required";
        if (!formData.address.pincode.trim())
          newErrors["address.pincode"] = "Pincode is required";
        else if (!/^\d{6}$/.test(formData.address.pincode))
          newErrors["address.pincode"] = "Invalid pincode";
        break;

      case 3:
        if (!formData.propertyDetails.totalRooms)
          newErrors["propertyDetails.totalRooms"] = "Total rooms is required";
        if (!formData.propertyDetails.availableRooms)
          newErrors["propertyDetails.availableRooms"] =
            "Available rooms is required";
        if (!formData.propertyDetails.bathrooms)
          newErrors["propertyDetails.bathrooms"] =
            "Number of bathrooms is required";
        if (!formData.propertyDetails.furnishingStatus)
          newErrors["propertyDetails.furnishingStatus"] =
            "Furnishing status is required";
        break;

      case 4:
        if (!formData.rules.gender)
          newErrors["rules.gender"] = "Gender preference is required";
        break;

      case 5:
        if (!formData.pricing.rentAmount)
          newErrors["pricing.rentAmount"] = "Rent amount is required";
        if (!formData.pricing.securityDeposit)
          newErrors["pricing.securityDeposit"] = "Security deposit is required";
        if (!formData.availability.availableFrom)
          newErrors["availability.availableFrom"] =
            "Available from date is required";
        break;

      case 6:
        if (formData.media.images.length === 0)
          newErrors["media.images"] = "At least one photo is required";
        break;

      case 7:
        if (!formData.contactInfo.contactPerson.trim())
          newErrors["contactInfo.contactPerson"] =
            "Contact person name is required";
        if (!formData.contactInfo.phoneNumber.trim())
          newErrors["contactInfo.phoneNumber"] = "Phone number is required";
        else if (!/^[6-9]\d{9}$/.test(formData.contactInfo.phoneNumber))
          newErrors["contactInfo.phoneNumber"] = "Invalid phone number";
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
      // Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(currentStep)) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/property/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            ownerId: encodeURIComponent(user.sub),
          }),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        alert("Property listed successfully!");
        navigate("/");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || "Failed to list property"}`);
      }
    } catch (error) {
      console.error("Error submitting property:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getProgressPercentage = () => {
    return (currentStep / steps.length) * 100;
  };

  const renderStepper = () => {
    return (
      <div className={styles.stepper}>
        {steps.map((step, index) => (
          <div key={step.number} className={styles.stepContainer}>
            <div className={styles.step}>
              <div
                className={`${styles.stepCircle} ${
                  step.number < currentStep
                    ? styles.stepCompleted
                    : step.number === currentStep
                    ? styles.stepActive
                    : styles.stepInactive
                }`}
              >
                {step.number < currentStep ? (
                  <Check size={20} />
                ) : (
                  <step.icon size={20} />
                )}
              </div>
              <div className={styles.stepLabel}>
                <div className={styles.stepTitle}>{step.title}</div>
                <div className={styles.stepDescription}>{step.description}</div>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`${styles.stepConnector} ${
                  step.number < currentStep ? styles.stepConnectorActive : ""
                }`}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderStep1 = () => (
    <div className={styles.stepContent}>
      <h2 className={styles.sectionTitle}>
        <Home className={styles.sectionIcon} />
        Property Type & Basic Information
      </h2>

      <div className={styles.formSection}>
        <h3 className={styles.subsectionTitle}>
          What type of property are you listing?
        </h3>
        <div className={styles.propertyTypeGrid}>
          {Object.entries(propertyTypes).map(([type, config]) => (
            <div
              key={type}
              onClick={() => {
                handleInputChange("propertyType", type);
                handleInputChange("propertySubType", "");
              }}
              className={`${styles.propertyTypeCard} ${
                formData.propertyType === type ? styles.selected : ""
              }`}
            >
              <h4>{config.label}</h4>
            </div>
          ))}
        </div>
        {errors.propertyType && (
          <div className={styles.errorMessage}>
            <AlertCircle size={16} />
            {errors.propertyType}
          </div>
        )}
      </div>

      {formData.propertyType && (
        <div className={styles.formSection}>
          <label className={`${styles.formLabel} ${styles.required}`}>
            Property Sub-type
          </label>
          <select
            value={formData.propertySubType}
            onChange={(e) =>
              handleInputChange("propertySubType", e.target.value)
            }
            className={styles.formSelect}
          >
            <option value="">Select sub-type</option>
            {propertyTypes[formData.propertyType].subtypes.map((subtype) => (
              <option key={subtype} value={subtype}>
                {subtype}
              </option>
            ))}
          </select>
          {errors.propertySubType && (
            <div className={styles.errorMessage}>
              <AlertCircle size={16} />
              {errors.propertySubType}
            </div>
          )}
        </div>
      )}

      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label className={`${styles.formLabel} ${styles.required}`}>
            Property Title
          </label>
          <input
            type="text"
            value={formData.propertyTitle}
            onChange={(e) => handleInputChange("propertyTitle", e.target.value)}
            className={styles.formInput}
            placeholder="e.g., Spacious 2BHK near Metro Station"
            maxLength={100}
          />
          <div className={styles.inputHint}>Make it catchy and descriptive</div>
          {errors.propertyTitle && (
            <div className={styles.errorMessage}>
              <AlertCircle size={16} />
              {errors.propertyTitle}
            </div>
          )}
        </div>
      </div>

      <div className={styles.formSection}>
        <label className={`${styles.formLabel} ${styles.required}`}>
          Property Description
        </label>
        <textarea
          value={formData.propertyDescription}
          onChange={(e) =>
            handleInputChange("propertyDescription", e.target.value)
          }
          className={styles.formTextarea}
          placeholder="Describe your property, its features, and what makes it special..."
          rows={6}
          maxLength={1000}
        />
        <div className={styles.inputHint}>
          {formData.propertyDescription.length}/1000 characters
        </div>
        {errors.propertyDescription && (
          <div className={styles.errorMessage}>
            <AlertCircle size={16} />
            {errors.propertyDescription}
          </div>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className={styles.stepContent}>
      <h2 className={styles.sectionTitle}>
        <MapPin className={styles.sectionIcon} />
        Location Details
      </h2>

      <div className={styles.formSection}>
        <h3 className={styles.subsectionTitle}>Property Address</h3>
        <div className={styles.formGrid}>
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label className={`${styles.formLabel} ${styles.required}`}>
              Street Address
            </label>
            <input
              type="text"
              value={formData.address.street}
              onChange={(e) =>
                handleInputChange("address", e.target.value, "street")
              }
              className={styles.formInput}
              placeholder="House/Building number, Street name"
            />
            {errors["address.street"] && (
              <div className={styles.errorMessage}>
                <AlertCircle size={16} />
                {errors["address.street"]}
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={`${styles.formLabel} ${styles.required}`}>
              Area/Locality
            </label>
            <input
              type="text"
              value={formData.address.area}
              onChange={(e) =>
                handleInputChange("address", e.target.value, "area")
              }
              className={styles.formInput}
              placeholder="Area or locality name"
            />
            {errors["address.area"] && (
              <div className={styles.errorMessage}>
                <AlertCircle size={16} />
                {errors["address.area"]}
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={`${styles.formLabel} ${styles.required}`}>
              City
            </label>
            <input
              type="text"
              value={formData.address.city}
              onChange={(e) =>
                handleInputChange("address", e.target.value, "city")
              }
              className={styles.formInput}
              placeholder="City"
            />
            {errors["address.city"] && (
              <div className={styles.errorMessage}>
                <AlertCircle size={16} />
                {errors["address.city"]}
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={`${styles.formLabel} ${styles.required}`}>
              State
            </label>
            <input
              type="text"
              value={formData.address.state}
              onChange={(e) =>
                handleInputChange("address", e.target.value, "state")
              }
              className={styles.formInput}
              placeholder="State"
            />
            {errors["address.state"] && (
              <div className={styles.errorMessage}>
                <AlertCircle size={16} />
                {errors["address.state"]}
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={`${styles.formLabel} ${styles.required}`}>
              PIN Code
            </label>
            <input
              type="text"
              value={formData.address.pincode}
              onChange={(e) =>
                handleInputChange("address", e.target.value, "pincode")
              }
              className={styles.formInput}
              placeholder="6-digit PIN code"
              maxLength={6}
            />
            {errors["address.pincode"] && (
              <div className={styles.errorMessage}>
                <AlertCircle size={16} />
                {errors["address.pincode"]}
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Landmark</label>
            <input
              type="text"
              value={formData.address.landmark}
              onChange={(e) =>
                handleInputChange("address", e.target.value, "landmark")
              }
              className={styles.formInput}
              placeholder="Nearby landmark (optional)"
            />
          </div>
        </div>
      </div>

      <div className={styles.formSection}>
        <h3 className={styles.subsectionTitle}>Nearby Places (Optional)</h3>
        <div className={styles.inputHint}>
          Add nearby places to help tenants understand the location better
        </div>

        {["metro", "hospital", "school", "market", "office"].map((category) => (
          <div key={category} className={styles.formGroup}>
            <label className={styles.formLabel}>
              {category.charAt(0).toUpperCase() + category.slice(1)}{" "}
              Stations/Places
            </label>
            <input
              type="text"
              value={formData.nearbyPlaces[category].join(", ")}
              onChange={(e) =>
                handleArrayInputChange(
                  "nearbyPlaces",
                  e.target.value
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean),
                  category
                )
              }
              className={styles.formInput}
              placeholder={`Enter ${category} names separated by commas`}
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className={styles.stepContent}>
      <h2 className={styles.sectionTitle}>
        <Building className={styles.sectionIcon} />
        Property Specifications
      </h2>

      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label className={`${styles.formLabel} ${styles.required}`}>
            Total Rooms
          </label>
          <select
            value={formData.propertyDetails.totalRooms}
            onChange={(e) =>
              handleInputChange("propertyDetails", e.target.value, "totalRooms")
            }
            className={styles.formSelect}
          >
            <option value="">Select</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <option key={num} value={num}>
                {num} Room{num > 1 ? "s" : ""}
              </option>
            ))}
          </select>
          {errors["propertyDetails.totalRooms"] && (
            <div className={styles.errorMessage}>
              <AlertCircle size={16} />
              {errors["propertyDetails.totalRooms"]}
            </div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={`${styles.formLabel} ${styles.required}`}>
            Available Rooms
          </label>
          <select
            value={formData.propertyDetails.availableRooms}
            onChange={(e) =>
              handleInputChange(
                "propertyDetails",
                e.target.value,
                "availableRooms"
              )
            }
            className={styles.formSelect}
          >
            <option value="">Select</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <option key={num} value={num}>
                {num} Room{num > 1 ? "s" : ""}
              </option>
            ))}
          </select>
          {errors["propertyDetails.availableRooms"] && (
            <div className={styles.errorMessage}>
              <AlertCircle size={16} />
              {errors["propertyDetails.availableRooms"]}
            </div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={`${styles.formLabel} ${styles.required}`}>
            Bathrooms
          </label>
          <select
            value={formData.propertyDetails.bathrooms}
            onChange={(e) =>
              handleInputChange("propertyDetails", e.target.value, "bathrooms")
            }
            className={styles.formSelect}
          >
            <option value="">Select</option>
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <option key={num} value={num}>
                {num} Bathroom{num > 1 ? "s" : ""}
              </option>
            ))}
          </select>
          {errors["propertyDetails.bathrooms"] && (
            <div className={styles.errorMessage}>
              <AlertCircle size={16} />
              {errors["propertyDetails.bathrooms"]}
            </div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Balconies</label>
          <select
            value={formData.propertyDetails.balconies}
            onChange={(e) =>
              handleInputChange("propertyDetails", e.target.value, "balconies")
            }
            className={styles.formSelect}
          >
            <option value="">Select</option>
            <option value="0">No Balcony</option>
            {[1, 2, 3, 4].map((num) => (
              <option key={num} value={num}>
                {num} Balcon{num > 1 ? "ies" : "y"}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Floor</label>
          <input
            type="text"
            value={formData.propertyDetails.floor}
            onChange={(e) =>
              handleInputChange("propertyDetails", e.target.value, "floor")
            }
            className={styles.formInput}
            placeholder="e.g., Ground, 1st, 2nd"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Total Floors</label>
          <select
            value={formData.propertyDetails.totalFloors}
            onChange={(e) =>
              handleInputChange(
                "propertyDetails",
                e.target.value,
                "totalFloors"
              )
            }
            className={styles.formSelect}
          >
            <option value="">Select</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30].map((num) => (
              <option key={num} value={num}>
                {num} Floor{num > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Built-up Area (sq ft)</label>
          <input
            type="number"
            value={formData.propertyDetails.builtUpArea}
            onChange={(e) =>
              handleInputChange(
                "propertyDetails",
                e.target.value,
                "builtUpArea"
              )
            }
            className={styles.formInput}
            placeholder="Area in square feet"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Carpet Area (sq ft)</label>
          <input
            type="number"
            value={formData.propertyDetails.carpetArea}
            onChange={(e) =>
              handleInputChange("propertyDetails", e.target.value, "carpetArea")
            }
            className={styles.formInput}
            placeholder="Carpet area in square feet"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={`${styles.formLabel} ${styles.required}`}>
            Furnishing Status
          </label>
          <select
            value={formData.propertyDetails.furnishingStatus}
            onChange={(e) =>
              handleInputChange(
                "propertyDetails",
                e.target.value,
                "furnishingStatus"
              )
            }
            className={styles.formSelect}
          >
            <option value="">Select</option>
            <option value="Fully Furnished">Fully Furnished</option>
            <option value="Semi Furnished">Semi Furnished</option>
            <option value="Unfurnished">Unfurnished</option>
          </select>
          {errors["propertyDetails.furnishingStatus"] && (
            <div className={styles.errorMessage}>
              <AlertCircle size={16} />
              {errors["propertyDetails.furnishingStatus"]}
            </div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Property Age</label>
          <select
            value={formData.propertyDetails.ageOfProperty}
            onChange={(e) =>
              handleInputChange(
                "propertyDetails",
                e.target.value,
                "ageOfProperty"
              )
            }
            className={styles.formSelect}
          >
            <option value="">Select</option>
            <option value="Under Construction">Under Construction</option>
            <option value="0-1 years">0-1 years</option>
            <option value="1-5 years">1-5 years</option>
            <option value="5-10 years">5-10 years</option>
            <option value="10-20 years">10-20 years</option>
            <option value="20+ years">20+ years</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Parking</label>
          <select
            value={formData.propertyDetails.parking}
            onChange={(e) =>
              handleInputChange("propertyDetails", e.target.value, "parking")
            }
            className={styles.formSelect}
          >
            <option value="">Select</option>
            <option value="No Parking">No Parking</option>
            <option value="Bike Parking">Bike Parking Only</option>
            <option value="Car Parking">Car Parking Available</option>
            <option value="Both">Both Car & Bike Parking</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className={styles.stepContent}>
      <h2 className={styles.sectionTitle}>
        <Shield className={styles.sectionIcon} />
        Amenities & House Rules
      </h2>

      <div className={styles.formSection}>
        <h3 className={styles.subsectionTitle}>Available Amenities</h3>

        {Object.entries(amenitiesList).map(([category, items]) => (
          <div key={category} className={styles.amenityCategory}>
            <h4 className={styles.amenityCategoryTitle}>
              {category.charAt(0).toUpperCase() + category.slice(1)} Amenities
            </h4>
            <div className={styles.amenityGrid}>
              {items.map((amenity) => (
                <label key={amenity.id} className={styles.amenityCheckbox}>
                  <input
                    type="checkbox"
                    checked={formData.amenities[category].includes(amenity.id)}
                    onChange={(e) => {
                      const currentAmenities = formData.amenities[category];
                      const newAmenities = e.target.checked
                        ? [...currentAmenities, amenity.id]
                        : currentAmenities.filter((id) => id !== amenity.id);
                      handleInputChange("amenities", newAmenities, category);
                    }}
                  />
                  <amenity.icon size={20} />
                  <span>{amenity.label}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.formSection}>
        <h3 className={styles.subsectionTitle}>House Rules & Preferences</h3>

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={`${styles.formLabel} ${styles.required}`}>
              Tenant Gender Preference
            </label>
            <select
              value={formData.rules.gender}
              onChange={(e) =>
                handleInputChange("rules", e.target.value, "gender")
              }
              className={styles.formSelect}
            >
              <option value="">Select preference</option>
              <option value="Male Only">Male Only</option>
              <option value="Female Only">Female Only</option>
              <option value="Both">Both Male & Female</option>
            </select>
            {errors["rules.gender"] && (
              <div className={styles.errorMessage}>
                <AlertCircle size={16} />
                {errors["rules.gender"]}
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Food Restrictions</label>
            <select
              value={formData.rules.foodRestrictions}
              onChange={(e) =>
                handleInputChange("rules", e.target.value, "foodRestrictions")
              }
              className={styles.formSelect}
            >
              <option value="">No restrictions</option>
              <option value="Vegetarian Only">Vegetarian Only</option>
              <option value="No Non-Veg Cooking">No Non-Veg Cooking</option>
              <option value="Jain Food Only">Jain Food Only</option>
            </select>
          </div>
        </div>

        <div className={styles.rulesCheckboxes}>
          {[
            { key: "smoking", label: "Smoking Allowed" },
            { key: "drinking", label: "Drinking Allowed" },
            { key: "pets", label: "Pets Allowed" },
            { key: "guestsAllowed", label: "Guests Allowed" },
          ].map((rule) => (
            <label key={rule.key} className={styles.ruleCheckbox}>
              <input
                type="checkbox"
                checked={formData.rules[rule.key]}
                onChange={(e) =>
                  handleInputChange("rules", e.target.checked, rule.key)
                }
              />
              <span>{rule.label}</span>
            </label>
          ))}
        </div>

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Entry Time Restriction</label>
            <input
              type="time"
              value={formData.rules.timing.entry}
              onChange={(e) =>
                handleInputChange("rules", e.target.value, "timing", "entry")
              }
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Exit Time Restriction</label>
            <input
              type="time"
              value={formData.rules.timing.exit}
              onChange={(e) =>
                handleInputChange("rules", e.target.value, "timing", "exit")
              }
              className={styles.formInput}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className={styles.stepContent}>
      <h2 className={styles.sectionTitle}>
        <DollarSign className={styles.sectionIcon} />
        Pricing & Availability
      </h2>

      <div className={styles.formSection}>
        <h3 className={styles.subsectionTitle}>Rental Pricing</h3>

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={`${styles.formLabel} ${styles.required}`}>
              Monthly Rent (₹)
            </label>
            <input
              type="number"
              value={formData.pricing.rentAmount}
              onChange={(e) =>
                handleInputChange("pricing", e.target.value, "rentAmount")
              }
              className={styles.formInput}
              placeholder="Enter monthly rent"
              min="0"
            />
            {errors["pricing.rentAmount"] && (
              <div className={styles.errorMessage}>
                <AlertCircle size={16} />
                {errors["pricing.rentAmount"]}
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={`${styles.formLabel} ${styles.required}`}>
              Security Deposit (₹)
            </label>
            <input
              type="number"
              value={formData.pricing.securityDeposit}
              onChange={(e) =>
                handleInputChange("pricing", e.target.value, "securityDeposit")
              }
              className={styles.formInput}
              placeholder="Security deposit amount"
              min="0"
            />
            {errors["pricing.securityDeposit"] && (
              <div className={styles.errorMessage}>
                <AlertCircle size={16} />
                {errors["pricing.securityDeposit"]}
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Maintenance Charges (₹)</label>
            <input
              type="number"
              value={formData.pricing.maintenanceCharges}
              onChange={(e) =>
                handleInputChange(
                  "pricing",
                  e.target.value,
                  "maintenanceCharges"
                )
              }
              className={styles.formInput}
              placeholder="Monthly maintenance (if any)"
              min="0"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Electricity Charges</label>
            <select
              value={formData.pricing.electricityCharges}
              onChange={(e) =>
                handleInputChange(
                  "pricing",
                  e.target.value,
                  "electricityCharges"
                )
              }
              className={styles.formSelect}
            >
              <option value="">Select billing method</option>
              <option value="Included in Rent">Included in Rent</option>
              <option value="As per Meter">As per Meter Reading</option>
              <option value="Fixed Amount">Fixed Monthly Amount</option>
            </select>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.ruleCheckbox}>
            <input
              type="checkbox"
              checked={formData.pricing.rentNegotiable}
              onChange={(e) =>
                handleInputChange("pricing", e.target.checked, "rentNegotiable")
              }
            />
            <span>Rent is negotiable</span>
          </label>
        </div>
      </div>

      <div className={styles.formSection}>
        <h3 className={styles.subsectionTitle}>Availability Details</h3>

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={`${styles.formLabel} ${styles.required}`}>
              Available From
            </label>
            <input
              type="date"
              value={formData.availability.availableFrom}
              onChange={(e) =>
                handleInputChange(
                  "availability",
                  e.target.value,
                  "availableFrom"
                )
              }
              className={styles.formInput}
              min={new Date().toISOString().split("T")[0]}
            />
            {errors["availability.availableFrom"] && (
              <div className={styles.errorMessage}>
                <AlertCircle size={16} />
                {errors["availability.availableFrom"]}
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Minimum Stay Period</label>
            <select
              value={formData.availability.minimumStay}
              onChange={(e) =>
                handleInputChange("availability", e.target.value, "minimumStay")
              }
              className={styles.formSelect}
            >
              <option value="">No minimum</option>
              <option value="1 month">1 month</option>
              <option value="3 months">3 months</option>
              <option value="6 months">6 months</option>
              <option value="1 year">1 year</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Maximum Stay Period</label>
            <select
              value={formData.availability.maximumStay}
              onChange={(e) =>
                handleInputChange("availability", e.target.value, "maximumStay")
              }
              className={styles.formSelect}
            >
              <option value="">No maximum</option>
              <option value="6 months">6 months</option>
              <option value="1 year">1 year</option>
              <option value="2 years">2 years</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Notice Period</label>
            <select
              value={formData.availability.noticePeriod}
              onChange={(e) =>
                handleInputChange(
                  "availability",
                  e.target.value,
                  "noticePeriod"
                )
              }
              className={styles.formSelect}
            >
              <option value="">Select notice period</option>
              <option value="No notice">No notice required</option>
              <option value="1 week">1 week</option>
              <option value="2 weeks">2 weeks</option>
              <option value="1 month">1 month</option>
              <option value="2 months">2 months</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className={styles.stepContent}>
      <h2 className={styles.sectionTitle}>
        <Camera className={styles.sectionIcon} />
        Photos & Media
      </h2>

      <div className={styles.formSection}>
        <h3 className={styles.subsectionTitle}>Property Photos</h3>
        <div className={styles.inputHint}>
          Add high-quality photos to attract more tenants. First photo will be
          the cover image.
        </div>

        <div className={styles.photoUploadArea}>
          <input
            type="file"
            id="photo-upload"
            multiple
            accept="image/*"
            onChange={(e) => handleFileUpload(e.target.files, "images")}
            className={styles.fileInputHidden}
          />
          <label htmlFor="photo-upload" className={styles.photoUploadButton}>
            <Upload size={24} />
            <span>Upload Photos</span>
            <div className={styles.uploadHint}>
              Click to select multiple photos
            </div>
          </label>
        </div>

        {errors["media.images"] && (
          <div className={styles.errorMessage}>
            <AlertCircle size={16} />
            {errors["media.images"]}
          </div>
        )}

        <div className={styles.uploadedPhotos}>
          {formData.media.images.map((image, index) => (
            <div key={image.id} className={styles.uploadedPhoto}>
              <img src={image.url} alt={`Property ${index + 1}`} />
              <button
                type="button"
                onClick={() => removeImage(image.id)}
                className={styles.removePhotoBtn}
              >
                <X size={16} />
              </button>
              {index === 0 && (
                <div className={styles.coverBadge}>Cover Photo</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.formSection}>
        <h3 className={styles.subsectionTitle}>Additional Media (Optional)</h3>

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Virtual Tour Link</label>
            <input
              type="url"
              value={formData.media.virtualTourLink}
              onChange={(e) =>
                handleInputChange("media", e.target.value, "virtualTourLink")
              }
              className={styles.formInput}
              placeholder="https://example.com/virtual-tour"
            />
            <div className={styles.inputHint}>
              360° virtual tour or interactive walkthrough link
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Video Tour Link</label>
            <input
              type="url"
              value={formData.media.videoLink}
              onChange={(e) =>
                handleInputChange("media", e.target.value, "videoLink")
              }
              className={styles.formInput}
              placeholder="https://youtube.com/watch?v=..."
            />
            <div className={styles.inputHint}>
              YouTube or other video platform link
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep7 = () => (
    <div className={styles.stepContent}>
      <h2 className={styles.sectionTitle}>
        <Send className={styles.sectionIcon} />
        Contact Information & Publish
      </h2>

      <div className={styles.formSection}>
        <h3 className={styles.subsectionTitle}>Contact Details</h3>

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={`${styles.formLabel} ${styles.required}`}>
              Contact Person Name
            </label>
            <input
              type="text"
              value={formData.contactInfo.contactPerson}
              onChange={(e) =>
                handleInputChange(
                  "contactInfo",
                  e.target.value,
                  "contactPerson"
                )
              }
              className={styles.formInput}
              placeholder="Your name or property manager's name"
            />
            {errors["contactInfo.contactPerson"] && (
              <div className={styles.errorMessage}>
                <AlertCircle size={16} />
                {errors["contactInfo.contactPerson"]}
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={`${styles.formLabel} ${styles.required}`}>
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.contactInfo.phoneNumber}
              onChange={(e) =>
                handleInputChange("contactInfo", e.target.value, "phoneNumber")
              }
              className={styles.formInput}
              placeholder="10-digit mobile number"
            />
            {errors["contactInfo.phoneNumber"] && (
              <div className={styles.errorMessage}>
                <AlertCircle size={16} />
                {errors["contactInfo.phoneNumber"]}
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Alternate Number</label>
            <input
              type="tel"
              value={formData.contactInfo.alternateNumber}
              onChange={(e) =>
                handleInputChange(
                  "contactInfo",
                  e.target.value,
                  "alternateNumber"
                )
              }
              className={styles.formInput}
              placeholder="Alternate contact number"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Email Address</label>
            <input
              type="email"
              value={formData.contactInfo.email}
              onChange={(e) =>
                handleInputChange("contactInfo", e.target.value, "email")
              }
              className={styles.formInput}
              placeholder="your.email@example.com"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Preferred Contact Time</label>
            <select
              value={formData.contactInfo.preferredContactTime}
              onChange={(e) =>
                handleInputChange(
                  "contactInfo",
                  e.target.value,
                  "preferredContactTime"
                )
              }
              className={styles.formSelect}
            >
              <option value="">Anytime</option>
              <option value="Morning (9 AM - 12 PM)">
                Morning (9 AM - 12 PM)
              </option>
              <option value="Afternoon (12 PM - 5 PM)">
                Afternoon (12 PM - 5 PM)
              </option>
              <option value="Evening (5 PM - 9 PM)">
                Evening (5 PM - 9 PM)
              </option>
              <option value="Weekends Only">Weekends Only</option>
            </select>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.ruleCheckbox}>
            <input
              type="checkbox"
              checked={formData.contactInfo.showContactInfo}
              onChange={(e) =>
                handleInputChange(
                  "contactInfo",
                  e.target.checked,
                  "showContactInfo"
                )
              }
            />
            <span>Show my contact information to interested tenants</span>
          </label>
          <div className={styles.inputHint}>
            If unchecked, tenants will contact you through our platform
            messaging system
          </div>
        </div>
      </div>

      <div className={styles.formSection}>
        <h3 className={styles.subsectionTitle}>Publishing Options</h3>

        <div className={styles.publishOptions}>
          <label className={styles.publishOption}>
            <input
              type="radio"
              name="publishStatus"
              value="draft"
              checked={formData.publishStatus === "draft"}
              onChange={(e) =>
                handleInputChange("publishStatus", e.target.value)
              }
            />
            <div className={styles.publishOptionContent}>
              <strong>Save as Draft</strong>
              <div>
                Save your listing without publishing. You can complete and
                publish it later.
              </div>
            </div>
          </label>

          <label className={styles.publishOption}>
            <input
              type="radio"
              name="publishStatus"
              value="published"
              checked={formData.publishStatus === "published"}
              onChange={(e) =>
                handleInputChange("publishStatus", e.target.value)
              }
            />
            <div className={styles.publishOptionContent}>
              <strong>Publish Now</strong>
              <div>
                Make your listing live and visible to potential tenants
                immediately.
              </div>
            </div>
          </label>
        </div>
      </div>

      <div className={styles.summarySection}>
        <h3 className={styles.subsectionTitle}>Listing Summary</h3>
        <div className={styles.summaryGrid}>
          <div className={styles.summaryItem}>
            <strong>Property:</strong> {formData.propertySubType} in{" "}
            {formData.address.area}, {formData.address.city}
          </div>
          <div className={styles.summaryItem}>
            <strong>Rent:</strong> ₹{formData.pricing.rentAmount}/month
          </div>
          <div className={styles.summaryItem}>
            <strong>Available from:</strong>{" "}
            {formData.availability.availableFrom}
          </div>
          <div className={styles.summaryItem}>
            <strong>Photos:</strong> {formData.media.images.length} uploaded
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      case 5:
        return renderStep5();
      case 6:
        return renderStep6();
      case 7:
        return renderStep7();
      default:
        return null;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.listSpaceContainer}>
        <div className={styles.listSpaceWrapper}>
          <div className={styles.loginPrompt}>
            <h2>Please Login First</h2>
            <p>You need to be logged in to list your property.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.listSpaceContainer}>
      <div className={styles.listSpaceWrapper}>
        <div className={styles.header}>
          <h1 className={styles.mainTitle}>List Your Property</h1>
          <p className={styles.mainSubtitle}>
            Create a professional listing to attract quality tenants
          </p>
        </div>

        {renderStepper()}

        <div className={styles.progressBar}>
          <div
            className={styles.progressBarFill}
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formContent}>{renderCurrentStep()}</div>

          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`${styles.btn} ${styles.btnSecondary}`}
            >
              <ChevronLeft size={20} />
              Previous
            </button>

            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={nextStep}
                className={`${styles.btn} ${styles.btnPrimary}`}
              >
                Next
                <ChevronRight size={20} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className={`${styles.btn} ${styles.btnSuccess}`}
              >
                {loading
                  ? "Publishing..."
                  : formData.publishStatus === "draft"
                  ? "Save Draft"
                  : "Publish Listing"}
                <Send size={20} />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ListYourSpace;
