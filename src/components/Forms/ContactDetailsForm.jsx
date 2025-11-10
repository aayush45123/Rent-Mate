import React from 'react';
import { Phone } from 'lucide-react';
import styles from '../../Pages/PGListing/PGListing.module.css';

const ContactDetailsForm = ({ formData, updateFormData }) => {
  const handleChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  return (
    <div className={styles.formSection}>
      <div className={styles.sectionHeader}>
        <Phone className={styles.sectionIcon} />
        <h3 className={styles.sectionTitle}>Contact & Additional Details</h3>
      </div>
      
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Owner Name <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            className={styles.input}
            placeholder="Enter owner name"
            value={formData.ownerName}
            onChange={(e) => handleChange('ownerName', e.target.value)}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Contact Number <span className={styles.required}>*</span>
          </label>
          <input
            type="tel"
            className={styles.input}
            placeholder="Enter contact number"
            value={formData.contactNumber}
            onChange={(e) => handleChange('contactNumber', e.target.value)}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>Alternate Number</label>
          <input
            type="tel"
            className={styles.input}
            placeholder="Enter alternate number"
            value={formData.alternateNumber}
            onChange={(e) => handleChange('alternateNumber', e.target.value)}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Email Address <span className={styles.required}>*</span>
          </label>
          <input
            type="email"
            className={styles.input}
            placeholder="Enter email address"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>Security Deposit (₹)</label>
          <input
            type="number"
            className={styles.input}
            placeholder="Enter security deposit"
            value={formData.securityDeposit}
            onChange={(e) => handleChange('securityDeposit', e.target.value)}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>Notice Period (Days)</label>
          <input
            type="number"
            className={styles.input}
            placeholder="Notice period in days"
            value={formData.noticePeriod}
            onChange={(e) => handleChange('noticePeriod', e.target.value)}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>Electricity Charges</label>
          <select
            className={styles.select}
            value={formData.electricityCharges}
            onChange={(e) => handleChange('electricityCharges', e.target.value)}
          >
            <option value="">Select electricity charges</option>
            <option value="included">Included in rent</option>
            <option value="actual">As per actual usage</option>
            <option value="fixed">Fixed monthly charges</option>
          </select>
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>Maintenance Charges (₹/month)</label>
          <input
            type="number"
            className={styles.input}
            placeholder="Monthly maintenance charges"
            value={formData.maintenanceCharges}
            onChange={(e) => handleChange('maintenanceCharges', e.target.value)}
          />
        </div>
      </div>
      
      <div className={styles.fullWidth}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Property Description</label>
          <textarea
            className={styles.textarea}
            placeholder="Describe your property, location benefits, and any special features..."
            rows="4"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default ContactDetailsForm;