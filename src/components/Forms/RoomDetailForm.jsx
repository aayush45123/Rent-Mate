import React from "react";
import {
  Bed,
  Wifi,
  Car,
  Shield,
  Bath,
  Utensils,
  Zap,
  Users,
  Home,
} from "lucide-react";
import styles from "../../Pages/PGListing/PGListing.module.css";

const RoomDetailsForm = ({ formData, updateFormData }) => {
  const handleRoomTypeChange = (roomType, field, value) => {
    const updatedRoomTypes = {
      ...formData.roomTypes,
      [roomType]: {
        ...formData.roomTypes[roomType],
        [field]: value,
      },
    };
    updateFormData({ roomTypes: updatedRoomTypes });
  };

  const handleAmenityChange = (amenity) => {
    const updatedAmenities = {
      ...formData.amenities,
      [amenity]: !formData.amenities[amenity],
    };
    updateFormData({ amenities: updatedAmenities });
  };

  const amenitiesList = [
    { key: "wifi", icon: Wifi, label: "Wi-Fi" },
    { key: "ac", icon: Zap, label: "Air Conditioning" },
    { key: "parking", icon: Car, label: "Parking" },
    { key: "laundry", icon: Bath, label: "Laundry" },
    { key: "meals", icon: Utensils, label: "Meals" },
    { key: "security", icon: Shield, label: "24/7 Security" },
    { key: "powerBackup", icon: Zap, label: "Power Backup" },
    { key: "tv", icon: Users, label: "TV/Common Area" },
    { key: "refrigerator", icon: Home, label: "Refrigerator" },
    { key: "geyser", icon: Bath, label: "Hot Water" },
  ];

  return (
    <div className={styles.formSection}>
      <div className={styles.sectionHeader}>
        <Bed className={styles.sectionIcon} />
        <h3 className={styles.sectionTitle}>Room Configuration & Pricing</h3>
      </div>

      <div className={styles.roomTypesGrid}>
        {Object.entries(formData.roomTypes).map(([roomType, details]) => (
          <div key={roomType} className={styles.roomTypeCard}>
            <div className={styles.roomTypeHeader}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={details.available}
                  onChange={(e) =>
                    handleRoomTypeChange(
                      roomType,
                      "available",
                      e.target.checked
                    )
                  }
                />
                <span className={styles.roomTypeName}>
                  {roomType.charAt(0).toUpperCase() + roomType.slice(1)} Sharing
                </span>
              </label>
            </div>

            {details.available && (
              <div className={styles.roomTypeDetails}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Number of Rooms</label>
                  <input
                    type="number"
                    className={styles.input}
                    placeholder="0"
                    value={details.count}
                    onChange={(e) =>
                      handleRoomTypeChange(
                        roomType,
                        "count",
                        parseInt(e.target.value) || 0
                      )
                    }
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Monthly Rent (₹)</label>
                  <input
                    type="number"
                    className={styles.input}
                    placeholder="0"
                    value={details.rent}
                    onChange={(e) =>
                      handleRoomTypeChange(
                        roomType,
                        "rent",
                        parseInt(e.target.value) || 0
                      )
                    }
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={styles.amenitiesSection}>
        <h4 className={styles.subsectionTitle}>Amenities & Facilities</h4>
        <div className={styles.amenitiesGrid}>
          {amenitiesList.map(({ key, icon: Icon, label }) => (
            <label key={key} className={styles.amenityItem}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={formData.amenities[key]}
                onChange={() => handleAmenityChange(key)}
              />
              <Icon className={styles.amenityIcon} />
              <span className={styles.amenityLabel}>{label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoomDetailsForm;
