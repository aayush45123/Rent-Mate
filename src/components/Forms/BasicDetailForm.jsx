import React from 'react';
import { Home } from 'lucide-react';
import styles from '../../Pages/PGListing/PGListing.module.css';

const BasicDetailsForm = ({ formData, updateFormData }) => {
  const handleChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  return (
    <div className={styles.formSection}>
      <div className={styles.sectionHeader}>
        <Home className={styles.sectionIcon} />
        <h3 className={styles.sectionTitle}>Property Information</h3>
      </div>
      
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            PG Name <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            className={styles.input}
            placeholder="Enter your PG name"
            value={formData.pgName}
            onChange={(e) => handleChange('pgName', e.target.value)}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Property Type <span className={styles.required}>*</span>
          </label>
          <select
            className={styles.select}
            value={formData.propertyType}
            onChange={(e) => handleChange('propertyType', e.target.value)}
          >
            <option value="">Select property type</option>
            <option value="pg">Paying Guest</option>
            <option value="hostel">Hostel</option>
            <option value="co-living">Co-living Space</option>
          </select>
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Total Rooms <span className={styles.required}>*</span>
          </label>
          <input
            type="number"
            className={styles.input}
            placeholder="Number of rooms"
            value={formData.totalRooms}
            onChange={(e) => handleChange('totalRooms', e.target.value)}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>
            City <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            className={styles.input}
            placeholder="Enter city"
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>
            State <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            className={styles.input}
            placeholder="Enter state"
            value={formData.state}
            onChange={(e) => handleChange('state', e.target.value)}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>
            PIN Code <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            className={styles.input}
            placeholder="Enter PIN code"
            value={formData.pincode}
            onChange={(e) => handleChange('pincode', e.target.value)}
          />
        </div>
      </div>
      
      <div className={styles.fullWidth}>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Complete Address <span className={styles.required}>*</span>
          </label>
          <textarea
            className={styles.textarea}
            placeholder="Enter complete address with landmarks"
            rows="3"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>Nearby Landmarks</label>
          <input
            type="text"
            className={styles.input}
            placeholder="Metro station, mall, hospital, etc."
            value={formData.nearbyLandmarks}
            onChange={(e) => handleChange('nearbyLandmarks', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default BasicDetailsForm;