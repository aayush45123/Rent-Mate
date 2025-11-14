import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import {
  ChevronRight,
  ChevronLeft,
  Check,
  User,
  MapPin,
  Phone,
  FileText,
  Heart,
  Home,
  Upload,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import styles from "./VerificationForm.module.css";

const VerificationForm = () => {
  const { user, isAuthenticated } = useAuth0();
  const { refreshVerificationStatus } = useAuthContext();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [userType, setUserType] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [userStatus, setUserStatus] = useState(null);

  // Check user verification status on mount
  useEffect(() => {
    const checkUserStatus = async () => {
      if (!isAuthenticated || !user) return;

      try {
        console.log("🔍 Checking user verification status...");
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/user/${encodeURIComponent(
            user.sub
          )}`
        );

        if (response.ok) {
          const userData = await response.json();
          console.log("📊 User status:", {
            userType: userData.userType,
            verificationStatus: userData.verificationStatus,
            isVerified: userData.isVerified,
            hasVerificationData: !!userData.verificationData,
          });

          setUserStatus(userData);

          // Redirect if user is already verified
          if (
            userData.isVerified &&
            userData.verificationStatus === "APPROVED"
          ) {
            console.log("✅ User is already verified, redirecting to home");
            alert("You are already verified! Redirecting to home page.");
            navigate("/");
            return;
          }

          // Redirect if user is in review
          if (userData.verificationStatus === "IN_REVIEW") {
            console.log(
              "⏳ User verification is in review, redirecting to home"
            );
            alert(
              "Your verification is currently being reviewed. Please wait for approval."
            );
            navigate("/");
            return;
          }

          // If user has userType but verification was rejected, allow re-submission
          if (userData.userType && userData.verificationStatus === "REJECTED") {
            console.log(
              "❌ User verification was rejected, allowing re-submission"
            );
            setUserType(userData.userType);
          }

          // If user has userType but no clear status, set it
          if (userData.userType && !userData.verificationStatus) {
            setUserType(userData.userType);
          }
        }
      } catch (error) {
        console.error("Error checking user status:", error);
      } finally {
        setCheckingStatus(false);
      }
    };

    checkUserStatus();
  }, [isAuthenticated, user, navigate]);

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    alternatePhone: "",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
      landmark: "",
    },
    propertyType: "",
    propertyAddress: {
      street: "",
      city: "",
      state: "",
      pincode: "",
      landmark: "",
    },
    identityProof: {
      type: "AADHAR",
      number: "",
      frontImage: null,
      backImage: null,
    },
    ownershipProof: {
      type: "REGISTRY",
      documentImage: null,
    },
    emergencyContact: {
      name: "",
      relation: "",
      phone: "",
    },
    profession: "",
    workAddress: "",
    monthlyIncome: "",
    preferences: {
      budget: {
        min: "",
        max: "",
      },
      location: [],
      roomType: "ANY",
      foodPreference: "BOTH",
    },
  });

  const steps = [
    {
      number: 1,
      title: "User Type",
      icon: User,
      description: "Choose your role",
    },
    {
      number: 2,
      title: "Personal Info",
      icon: User,
      description: "Basic information",
    },
    {
      number: 3,
      title: "Address & Contact",
      icon: MapPin,
      description: "Contact details",
    },
    {
      number: 4,
      title: "Documents",
      icon: FileText,
      description: "Verification documents",
    },
    {
      number: 5,
      title: "Review",
      icon: Check,
      description: "Final review",
    },
  ];

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

  const handleFileUpload = (field, file, nested = null) => {
    if (file && file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        [`${field}${nested ? "." + nested : ""}`]:
          "File size should be less than 5MB",
      }));
      return;
    }

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (nested) {
          handleInputChange(field, reader.result, nested);
        } else {
          handleInputChange(field, reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!userType) {
          newErrors.userType = "Please select a user type";
        }
        break;

      case 2:
        if (!formData.fullName.trim()) {
          newErrors.fullName = "Full name is required";
        }
        if (!formData.phoneNumber.trim()) {
          newErrors.phoneNumber = "Phone number is required";
        } else if (!/^[6-9]\d{9}$/.test(formData.phoneNumber)) {
          newErrors.phoneNumber = "Please enter a valid 10-digit phone number";
        }
        break;

      case 3:
        if (!formData.address.street.trim()) {
          newErrors["address.street"] = "Street address is required";
        }
        if (!formData.address.city.trim()) {
          newErrors["address.city"] = "City is required";
        }
        if (!formData.address.state.trim()) {
          newErrors["address.state"] = "State is required";
        }
        if (!formData.address.pincode.trim()) {
          newErrors["address.pincode"] = "Pincode is required";
        } else if (!/^\d{6}$/.test(formData.address.pincode)) {
          newErrors["address.pincode"] = "Please enter a valid 6-digit pincode";
        }
        if (!formData.emergencyContact.name.trim()) {
          newErrors["emergencyContact.name"] =
            "Emergency contact name is required";
        }
        if (!formData.emergencyContact.phone.trim()) {
          newErrors["emergencyContact.phone"] =
            "Emergency contact phone is required";
        }
        if (!formData.emergencyContact.relation.trim()) {
          newErrors["emergencyContact.relation"] =
            "Emergency contact relation is required";
        }
        break;

      case 4:
        const isOwner = userType === "PG_OWNER" || userType === "FLAT_OWNER";
        if (isOwner) {
          if (!formData.identityProof.number.trim()) {
            newErrors["identityProof.number"] = "ID number is required";
          }
          if (!formData.propertyType) {
            newErrors.propertyType = "Property type is required";
          }
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Additional check before submission
    if (
      userStatus &&
      userStatus.isVerified &&
      userStatus.verificationStatus === "APPROVED"
    ) {
      alert("You are already verified! No need to resubmit.");
      navigate("/");
      return;
    }

    if (!validateStep(currentStep)) {
      return;
    }

    setLoading(true);
    try {
      const payload = {
        userType,
        verificationData: {
          ...formData,
          fullName: formData.fullName.trim(),
          phoneNumber: formData.phoneNumber.trim(),
          address: {
            ...formData.address,
            street: formData.address.street.trim(),
            city: formData.address.city.trim(),
            state: formData.address.state.trim(),
            pincode: formData.address.pincode.trim(),
          },
          emergencyContact: {
            ...formData.emergencyContact,
            name: formData.emergencyContact.name.trim(),
            phone: formData.emergencyContact.phone.trim(),
          },
        },
      };

      console.log(
        "Submitting verification data:",
        JSON.stringify(payload, null, 2)
      );

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/user/${encodeURIComponent(
          user.sub
        )}/verification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(30000), // 30 second timeout
        }
      );

      let responseData;
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        responseData = await response.json();
      } else {
        const textResponse = await response.text();
        console.error("Non-JSON response:", textResponse);
        throw new Error("Server returned invalid response format");
      }

      console.log("Server response:", responseData);

      if (response.ok) {
        // UPDATED: Refresh the verification status in the context
        await refreshVerificationStatus();

        // Add a small delay and refresh again to ensure backend has processed
        setTimeout(async () => {
          await refreshVerificationStatus();
          // Dispatch custom event for other components to listen
          window.dispatchEvent(new CustomEvent("verificationUpdated"));
        }, 1000);

        alert(
          "Verification approved successfully! You now have access to all features."
        );

        // Navigate to home page after successful submission
        navigate("/");
      } else {
        console.error("Verification submission error:", responseData);

        if (responseData.details && Array.isArray(responseData.details)) {
          const errorMessages = responseData.details
            .map((detail) => `${detail.field}: ${detail.message}`)
            .join("\n");
          alert(`Validation errors:\n${errorMessages}`);
        } else {
          alert(
            `Error: ${
              responseData.error || responseData.message || "Submission failed"
            }`
          );
        }
      }
    } catch (error) {
      console.error("Error submitting verification:", error);

      if (error.name === "TypeError" && error.message.includes("fetch")) {
        alert(
          "Network error: Please check your internet connection and try again."
        );
      } else if (error.message.includes("invalid response format")) {
        alert("Server error: Please try again later or contact support.");
      } else if (error.name === "AbortError") {
        alert("Request timed out. Please try again.");
      } else {
        alert(`An error occurred: ${error.message}. Please try again.`);
      }
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
          <React.Fragment key={step.number}>
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
                <div>{step.title}</div>
                <div style={{ fontSize: "11px", opacity: 0.7 }}>
                  {step.description}
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
          </React.Fragment>
        ))}
      </div>
    );
  };

  const renderStep1 = () => (
    <div>
      <h2 className={styles.sectionTitle}>
        <User className={styles.sectionIcon} />
        Select Your Role
      </h2>
      <div className={styles.userTypeSelection}>
        {[
          {
            value: "PG_OWNER",
            title: "PG Owner",
            icon: "🏠",
            desc: "I want to rent out PG/Hostel rooms",
          },
          {
            value: "FLAT_OWNER",
            title: "Flat Owner",
            icon: "🏢",
            desc: "I want to rent out flat/apartment",
          },
          {
            value: "LOOKING_FOR_PG",
            title: "Looking for PG",
            icon: "🔍",
            desc: "I am searching for PG/Flat",
          },
        ].map((option) => (
          <div
            key={option.value}
            onClick={() => setUserType(option.value)}
            className={`${styles.userTypeCard} ${
              userType === option.value ? styles.userTypeCardSelected : ""
            }`}
          >
            <div className={styles.userTypeIcon}>{option.icon}</div>
            <h3 className={styles.userTypeTitle}>{option.title}</h3>
            <p className={styles.userTypeDesc}>{option.desc}</p>
          </div>
        ))}
      </div>
      {errors.userType && (
        <div className={styles.errorMessage}>
          <AlertCircle size={16} />
          {errors.userType}
        </div>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div>
      <h2 className={styles.sectionTitle}>
        <User className={styles.sectionIcon} />
        Personal Information
      </h2>
      <div className={`${styles.grid} ${styles.gridCols2}`}>
        <div className={styles.formGroup}>
          <label className={`${styles.label} ${styles.labelRequired}`}>
            Full Name
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
            className={styles.input}
            placeholder="Enter your full name"
          />
          {errors.fullName && (
            <div className={styles.errorMessage}>
              <AlertCircle size={14} />
              {errors.fullName}
            </div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={`${styles.label} ${styles.labelRequired}`}>
            Phone Number
          </label>
          <input
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
            className={styles.input}
            placeholder="10-digit mobile number"
            pattern="[6-9][0-9]{9}"
          />
          {errors.phoneNumber && (
            <div className={styles.errorMessage}>
              <AlertCircle size={14} />
              {errors.phoneNumber}
            </div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Alternate Phone</label>
          <input
            type="tel"
            value={formData.alternatePhone}
            onChange={(e) =>
              handleInputChange("alternatePhone", e.target.value)
            }
            className={styles.input}
            placeholder="Optional alternate number"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Profession</label>
          <input
            type="text"
            value={formData.profession}
            onChange={(e) => handleInputChange("profession", e.target.value)}
            className={styles.input}
            placeholder="Your profession"
          />
        </div>

        {userType === "LOOKING_FOR_PG" && (
          <div className={styles.formGroup}>
            <label className={styles.label}>Monthly Income</label>
            <input
              type="text"
              value={formData.monthlyIncome}
              onChange={(e) =>
                handleInputChange("monthlyIncome", e.target.value)
              }
              className={styles.input}
              placeholder="Your monthly income"
            />
          </div>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div>
      <h2 className={styles.sectionTitle}>
        <MapPin className={styles.sectionIcon} />
        Address & Contact Details
      </h2>

      <h3
        style={{
          marginBottom: "var(--space-lg)",
          color: "var(--text-secondary)",
        }}
      >
        Current Address
      </h3>
      <div className={`${styles.grid} ${styles.gridCols2}`}>
        <div className={`${styles.formGroup} ${styles.gridFullWidth}`}>
          <label className={`${styles.label} ${styles.labelRequired}`}>
            Street Address
          </label>
          <input
            type="text"
            value={formData.address.street}
            onChange={(e) =>
              handleInputChange("address", e.target.value, "street")
            }
            className={styles.input}
            placeholder="House no., building, street"
          />
          {errors["address.street"] && (
            <div className={styles.errorMessage}>
              <AlertCircle size={14} />
              {errors["address.street"]}
            </div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={`${styles.label} ${styles.labelRequired}`}>
            City
          </label>
          <input
            type="text"
            value={formData.address.city}
            onChange={(e) =>
              handleInputChange("address", e.target.value, "city")
            }
            className={styles.input}
            placeholder="City"
          />
          {errors["address.city"] && (
            <div className={styles.errorMessage}>
              <AlertCircle size={14} />
              {errors["address.city"]}
            </div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={`${styles.label} ${styles.labelRequired}`}>
            State
          </label>
          <input
            type="text"
            value={formData.address.state}
            onChange={(e) =>
              handleInputChange("address", e.target.value, "state")
            }
            className={styles.input}
            placeholder="State"
          />
          {errors["address.state"] && (
            <div className={styles.errorMessage}>
              <AlertCircle size={14} />
              {errors["address.state"]}
            </div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={`${styles.label} ${styles.labelRequired}`}>
            Pincode
          </label>
          <input
            type="text"
            value={formData.address.pincode}
            onChange={(e) =>
              handleInputChange("address", e.target.value, "pincode")
            }
            className={styles.input}
            placeholder="6-digit pincode"
            pattern="[0-9]{6}"
          />
          {errors["address.pincode"] && (
            <div className={styles.errorMessage}>
              <AlertCircle size={14} />
              {errors["address.pincode"]}
            </div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Landmark</label>
          <input
            type="text"
            value={formData.address.landmark}
            onChange={(e) =>
              handleInputChange("address", e.target.value, "landmark")
            }
            className={styles.input}
            placeholder="Nearby landmark (optional)"
          />
        </div>
      </div>

      <h3
        style={{
          marginTop: "var(--space-2xl)",
          marginBottom: "var(--space-lg)",
          color: "var(--text-secondary)",
        }}
      >
        Emergency Contact
      </h3>
      <div className={`${styles.grid} ${styles.gridCols3}`}>
        <div className={styles.formGroup}>
          <label className={`${styles.label} ${styles.labelRequired}`}>
            Contact Name
          </label>
          <input
            type="text"
            value={formData.emergencyContact.name}
            onChange={(e) =>
              handleInputChange("emergencyContact", e.target.value, "name")
            }
            className={styles.input}
            placeholder="Emergency contact name"
          />
          {errors["emergencyContact.name"] && (
            <div className={styles.errorMessage}>
              <AlertCircle size={14} />
              {errors["emergencyContact.name"]}
            </div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={`${styles.label} ${styles.labelRequired}`}>
            Relation
          </label>
          <select
            value={formData.emergencyContact.relation}
            onChange={(e) =>
              handleInputChange("emergencyContact", e.target.value, "relation")
            }
            className={styles.select}
          >
            <option value="">Select Relation</option>
            <option value="Father">Father</option>
            <option value="Mother">Mother</option>
            <option value="Spouse">Spouse</option>
            <option value="Sibling">Sibling</option>
            <option value="Friend">Friend</option>
            <option value="Other">Other</option>
          </select>
          {errors["emergencyContact.relation"] && (
            <div className={styles.errorMessage}>
              <AlertCircle size={14} />
              {errors["emergencyContact.relation"]}
            </div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={`${styles.label} ${styles.labelRequired}`}>
            Contact Phone
          </label>
          <input
            type="tel"
            value={formData.emergencyContact.phone}
            onChange={(e) =>
              handleInputChange("emergencyContact", e.target.value, "phone")
            }
            className={styles.input}
            placeholder="10-digit phone number"
            pattern="[6-9][0-9]{9}"
          />
          {errors["emergencyContact.phone"] && (
            <div className={styles.errorMessage}>
              <AlertCircle size={14} />
              {errors["emergencyContact.phone"]}
            </div>
          )}
        </div>
      </div>

      {/* Property Address for owners */}
      {(userType === "PG_OWNER" || userType === "FLAT_OWNER") && (
        <>
          <h3
            style={{
              marginTop: "var(--space-2xl)",
              marginBottom: "var(--space-lg)",
              color: "var(--text-secondary)",
            }}
          >
            Property Address
          </h3>
          <div className={`${styles.grid} ${styles.gridCols2}`}>
            <div className={`${styles.formGroup} ${styles.gridFullWidth}`}>
              <label className={styles.label}>Property Street Address</label>
              <input
                type="text"
                value={formData.propertyAddress.street}
                onChange={(e) =>
                  handleInputChange("propertyAddress", e.target.value, "street")
                }
                className={styles.input}
                placeholder="Property address (leave empty if same as current)"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Property City</label>
              <input
                type="text"
                value={formData.propertyAddress.city}
                onChange={(e) =>
                  handleInputChange("propertyAddress", e.target.value, "city")
                }
                className={styles.input}
                placeholder="Property city"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Property State</label>
              <input
                type="text"
                value={formData.propertyAddress.state}
                onChange={(e) =>
                  handleInputChange("propertyAddress", e.target.value, "state")
                }
                className={styles.input}
                placeholder="Property state"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Property Pincode</label>
              <input
                type="text"
                value={formData.propertyAddress.pincode}
                onChange={(e) =>
                  handleInputChange(
                    "propertyAddress",
                    e.target.value,
                    "pincode"
                  )
                }
                className={styles.input}
                placeholder="Property pincode"
                pattern="[0-9]{6}"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Property Landmark</label>
              <input
                type="text"
                value={formData.propertyAddress.landmark}
                onChange={(e) =>
                  handleInputChange(
                    "propertyAddress",
                    e.target.value,
                    "landmark"
                  )
                }
                className={styles.input}
                placeholder="Nearby landmark"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderStep4 = () => {
    const isOwner = userType === "PG_OWNER" || userType === "FLAT_OWNER";

    return (
      <div>
        <h2 className={styles.sectionTitle}>
          <FileText className={styles.sectionIcon} />
          {isOwner ? "Property & Documents" : "Preferences"}
        </h2>

        {isOwner ? (
          <>
            <h3
              style={{
                marginBottom: "var(--space-lg)",
                color: "var(--text-secondary)",
              }}
            >
              Property Information
            </h3>
            <div className={`${styles.grid} ${styles.gridCols2}`}>
              <div className={styles.formGroup}>
                <label className={`${styles.label} ${styles.labelRequired}`}>
                  Property Type
                </label>
                <select
                  value={formData.propertyType}
                  onChange={(e) =>
                    handleInputChange("propertyType", e.target.value)
                  }
                  className={styles.select}
                >
                  <option value="">Select Property Type</option>
                  <option value="PG">PG/Hostel</option>
                  <option value="FLAT">Flat/Apartment</option>
                  <option value="ROOM">Single Room</option>
                </select>
                {errors.propertyType && (
                  <div className={styles.errorMessage}>
                    <AlertCircle size={14} />
                    {errors.propertyType}
                  </div>
                )}
              </div>
            </div>

            <h3
              style={{
                marginTop: "var(--space-2xl)",
                marginBottom: "var(--space-lg)",
                color: "var(--text-secondary)",
              }}
            >
              Identity Verification
            </h3>
            <div className={`${styles.grid} ${styles.gridCols2}`}>
              <div className={styles.formGroup}>
                <label className={styles.label}>ID Type</label>
                <select
                  value={formData.identityProof.type}
                  onChange={(e) =>
                    handleInputChange("identityProof", e.target.value, "type")
                  }
                  className={styles.select}
                >
                  <option value="AADHAR">Aadhar Card</option>
                  <option value="PAN">PAN Card</option>
                  <option value="DRIVING_LICENSE">Driving License</option>
                  <option value="PASSPORT">Passport</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={`${styles.label} ${styles.labelRequired}`}>
                  ID Number
                </label>
                <input
                  type="text"
                  value={formData.identityProof.number}
                  onChange={(e) =>
                    handleInputChange("identityProof", e.target.value, "number")
                  }
                  className={styles.input}
                  placeholder="Enter ID number"
                />
                {errors["identityProof.number"] && (
                  <div className={styles.errorMessage}>
                    <AlertCircle size={14} />
                    {errors["identityProof.number"]}
                  </div>
                )}
              </div>
            </div>

            <div
              className={`${styles.grid} ${styles.gridCols2}`}
              style={{ marginTop: "var(--space-lg)" }}
            >
              <div className={styles.formGroup}>
                <label className={styles.label}>ID Front Image</label>
                <div className={styles.fileInput}>
                  <label className={styles.fileInputLabel}>
                    <Upload size={20} />
                    <span>Upload front image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileUpload(
                          "identityProof",
                          e.target.files[0],
                          "frontImage"
                        )
                      }
                      className={styles.fileInputHidden}
                    />
                  </label>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>ID Back Image</label>
                <div className={styles.fileInput}>
                  <label className={styles.fileInputLabel}>
                    <Upload size={20} />
                    <span>Upload back image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileUpload(
                          "identityProof",
                          e.target.files[0],
                          "backImage"
                        )
                      }
                      className={styles.fileInputHidden}
                    />
                  </label>
                </div>
              </div>
            </div>

            <h3
              style={{
                marginTop: "var(--space-2xl)",
                marginBottom: "var(--space-lg)",
                color: "var(--text-secondary)",
              }}
            >
              Property Ownership Proof
            </h3>
            <div className={`${styles.grid} ${styles.gridCols2}`}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Document Type</label>
                <select
                  value={formData.ownershipProof.type}
                  onChange={(e) =>
                    handleInputChange("ownershipProof", e.target.value, "type")
                  }
                  className={styles.select}
                >
                  <option value="REGISTRY">Property Registry</option>
                  <option value="LEASE_AGREEMENT">Lease Agreement</option>
                  <option value="NOC">NOC from Owner</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Upload Document</label>
                <div className={styles.fileInput}>
                  <label className={styles.fileInputLabel}>
                    <Upload size={20} />
                    <span>Upload document</span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) =>
                        handleFileUpload(
                          "ownershipProof",
                          e.target.files[0],
                          "documentImage"
                        )
                      }
                      className={styles.fileInputHidden}
                    />
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : (
          // PG Seeker preferences
          <div className={`${styles.grid} ${styles.gridCols2}`}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Budget Range (Min)</label>
              <input
                type="number"
                value={formData.preferences.budget.min}
                onChange={(e) =>
                  handleInputChange(
                    "preferences",
                    e.target.value,
                    "budget",
                    "min"
                  )
                }
                className={styles.input}
                placeholder="Minimum budget"
                min="0"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Budget Range (Max)</label>
              <input
                type="number"
                value={formData.preferences.budget.max}
                onChange={(e) =>
                  handleInputChange(
                    "preferences",
                    e.target.value,
                    "budget",
                    "max"
                  )
                }
                className={styles.input}
                placeholder="Maximum budget"
                min="0"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Room Type</label>
              <select
                value={formData.preferences.roomType}
                onChange={(e) =>
                  handleInputChange("preferences", e.target.value, "roomType")
                }
                className={styles.select}
              >
                <option value="SINGLE">Single Room</option>
                <option value="SHARED">Shared Room</option>
                <option value="ANY">Any</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Food Preference</label>
              <select
                value={formData.preferences.foodPreference}
                onChange={(e) =>
                  handleInputChange(
                    "preferences",
                    e.target.value,
                    "foodPreference"
                  )
                }
                className={styles.select}
              >
                <option value="VEG">Vegetarian</option>
                <option value="NON_VEG">Non-Vegetarian</option>
                <option value="BOTH">Both</option>
              </select>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderStep5 = () => (
    <div>
      <h2 className={styles.sectionTitle}>
        <Check className={styles.sectionIcon} />
        Review & Submit
      </h2>

      <div
        style={{
          padding: "var(--space-xl)",
          backgroundColor: "var(--bg-secondary)",
          borderRadius: "var(--radius-xl)",
          marginBottom: "var(--space-xl)",
        }}
      >
        <h3
          style={{
            color: "var(--text-primary)",
            marginBottom: "var(--space-lg)",
          }}
        >
          Please review your information before submitting
        </h3>

        <div className={`${styles.grid} ${styles.gridCols2}`}>
          <div>
            <h4
              style={{
                color: "var(--text-secondary)",
                marginBottom: "var(--space-md)",
              }}
            >
              User Type
            </h4>
            <p style={{ color: "var(--text-primary)", margin: 0 }}>
              {userType === "PG_OWNER"
                ? "PG Owner"
                : userType === "FLAT_OWNER"
                ? "Flat Owner"
                : "Looking for PG"}
            </p>
          </div>

          <div>
            <h4
              style={{
                color: "var(--text-secondary)",
                marginBottom: "var(--space-md)",
              }}
            >
              Full Name
            </h4>
            <p style={{ color: "var(--text-primary)", margin: 0 }}>
              {formData.fullName}
            </p>
          </div>

          <div>
            <h4
              style={{
                color: "var(--text-secondary)",
                marginBottom: "var(--space-md)",
              }}
            >
              Phone Number
            </h4>
            <p style={{ color: "var(--text-primary)", margin: 0 }}>
              {formData.phoneNumber}
            </p>
          </div>

          <div>
            <h4
              style={{
                color: "var(--text-secondary)",
                marginBottom: "var(--space-md)",
              }}
            >
              City, State
            </h4>
            <p style={{ color: "var(--text-primary)", margin: 0 }}>
              {formData.address.city}, {formData.address.state}
            </p>
          </div>

          <div>
            <h4
              style={{
                color: "var(--text-secondary)",
                marginBottom: "var(--space-md)",
              }}
            >
              Emergency Contact
            </h4>
            <p style={{ color: "var(--text-primary)", margin: 0 }}>
              {formData.emergencyContact.name} (
              {formData.emergencyContact.relation})
            </p>
          </div>
        </div>
      </div>

      <div
        style={{
          padding: "var(--space-lg)",
          backgroundColor: "var(--primary-50)",
          borderRadius: "var(--radius-lg)",
          border: `1px solid var(--primary-200)`,
        }}
      >
        <p
          style={{
            margin: 0,
            color: "var(--text-secondary)",
            fontSize: "var(--font-size-sm)",
            lineHeight: "var(--line-height-relaxed)",
          }}
        >
          By submitting this form, you agree that all information provided is
          accurate and complete. Your verification will be processed instantly
          and you'll gain access to all features immediately.
        </p>
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
      default:
        return null;
    }
  };

  // Show loading while checking status
  if (checkingStatus) {
    return (
      <div className={styles.container}>
        <div className={styles.formWrapper}>
          <div className={styles.loginPrompt}>
            <div className={styles.spinner}></div>
            <h2 className={styles.loginPromptTitle}>
              Checking Verification Status...
            </h2>
            <p className={styles.loginPromptText}>
              Please wait while we verify your current status.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show success message if already verified
  if (
    userStatus &&
    userStatus.isVerified &&
    userStatus.verificationStatus === "APPROVED"
  ) {
    return (
      <div className={styles.container}>
        <div className={styles.formWrapper}>
          <div className={styles.loginPrompt}>
            <CheckCircle size={48} color="#28a745" />
            <h2 className={styles.loginPromptTitle}>Already Verified!</h2>
            <p className={styles.loginPromptText}>
              Your account is already verified. You have access to all features.
            </p>
            <button
              onClick={() => navigate("/")}
              className={`${styles.button} ${styles.buttonPrimary}`}
              style={{ marginTop: "1rem" }}
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className={styles.container}>
        <div className={styles.formWrapper}>
          <div className={styles.loginPrompt}>
            <h2 className={styles.loginPromptTitle}>Please Login First</h2>
            <p className={styles.loginPromptText}>
              You need to be logged in to access verification.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <div className={styles.header}>
          <h1 className={styles.title}>Account Verification</h1>
          <p className={styles.subtitle}>
            Complete your profile to get verified and access all features
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
              className={`${styles.button} ${styles.buttonSecondary}`}
            >
              <ChevronLeft className={styles.buttonIcon} />
              Previous
            </button>

            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={nextStep}
                className={`${styles.button} ${styles.buttonPrimary}`}
              >
                Next
                <ChevronRight className={styles.buttonIcon} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className={`${styles.button} ${styles.buttonPrimary}`}
              >
                {loading ? "Submitting..." : "Submit Verification"}
                <Check className={styles.buttonIcon} />
              </button>
            )}
          </div>
        </form>

        {import.meta.env.DEV && (
          <div className={styles.debugInfo}>
            <h4 className={styles.debugTitle}>Debug Info:</h4>
            <p className={styles.debugItem}>Current Step: {currentStep}</p>
            <p className={styles.debugItem}>User Type: {userType}</p>
            <p className={styles.debugItem}>
              Backend URL: {import.meta.env.VITE_BACKEND_URL}
            </p>
            <p className={styles.debugItem}>User Sub: {user?.sub}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationForm;
