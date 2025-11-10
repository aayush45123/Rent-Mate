import React from 'react';
import { Shield, Camera, X } from 'lucide-react';
import styles from '../../Pages/PGListing/PGListing.module.css';

const PoliciesImagesForm = ({ formData, updateFormData }) => {
  const handleChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  const handleImageUpload = (files) => {
    const newImages = [...formData.images, ...Array.from(files)];
    updateFormData({ images: newImages });
  };

  const removeImage = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    updateFormData({ images: updatedImages });
  };

  return (
    <div className={styles.formSection}>
      <div className={styles.sectionHeader}>
        <Shield className={styles.sectionIcon} />
        <h3 className={styles.sectionTitle}>Rules & Images</h3>
      </div>
      
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Gender Preference <span className={styles.required}>*</span>
          </label>
          <select
            className={styles.select}
            value={formData.gender}
            onChange={(e) => handleChange('gender', e.target.value)}
          >
            <option value="">Select preference</option>
            <option value="male">Male Only</option>
            <option value="female">Female Only</option>
            <option value="mixed">Co-ed</option>
          </select>
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>Food Policy</label>
          <select
            className={styles.select}
            value={formData.foodPolicy}
            onChange={(e) => handleChange('foodPolicy', e.target.value)}
          >
            <option value="">Select food policy</option>
            <option value="included">Meals Included</option>
            <option value="optional">Meals Optional</option>
            <option value="not-provided">No Meals</option>
            <option value="kitchen-access">Kitchen Access</option>
          </select>
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>Visitor Policy</label>
          <select
            className={styles.select}
            value={formData.visitorPolicy}
            onChange={(e) => handleChange('visitorPolicy', e.target.value)}
          >
            <option value="">Select visitor policy</option>
            <option value="allowed">Visitors Allowed</option>
            <option value="restricted">Time Restricted</option>
            <option value="not-allowed">No Visitors</option>
          </select>
        </div>
      </div>
      
      <div className={styles.policiesGrid}>
        {[
          { key: 'smokingAllowed', label: 'Smoking Allowed' },
          { key: 'drinkingAllowed', label: 'Drinking Allowed' },
          { key: 'petsAllowed', label: 'Pets Allowed' }
        ].map(({ key, label }) => (
          <label key={key} className={styles.policyItem}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={formData[key]}
              onChange={(e) => handleChange(key, e.target.checked)}
            />
            <span className={styles.policyLabel}>{label}</span>
          </label>
        ))}
      </div>
      
      <div className={styles.imageSection}>
        <h4 className={styles.subsectionTitle}>
          Property Images <span className={styles.required}>* (Minimum 3 required)</span>
        </h4>
        <div className={styles.imageUploadContainer}>
          <div className={styles.uploadArea}>
            <Camera className={styles.uploadIcon} />
            <div className={styles.uploadText}>
              <p className={styles.uploadTitle}>Upload Property Images</p>
              <p className={styles.uploadSubtext}>Add high-quality photos to showcase your PG</p>
              <p className={styles.uploadCount}>
                {formData.images.length}/3 minimum required
              </p>
            </div>
            <input
              type="file"
              multiple
              accept="image/*"
              className={styles.fileInput}
              onChange={(e) => handleImageUpload(e.target.files)}
            />
            <button type="button" className={styles.uploadButton}>
              Choose Images
            </button>
          </div>
          
          {formData.images.length > 0 && (
            <div className={styles.imagePreview}>
              {formData.images.map((image, index) => (
                <div key={index} className={styles.imageItem}>
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index + 1}`}
                    className={styles.previewImage}
                  />
                  <button
                    type="button"
                    className={styles.removeImageBtn}
                    onClick={() => removeImage(index)}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {formData.images.length < 3 && (
            <div className={styles.imageRequirement}>
              <p className={styles.requirementText}>
                Please upload at least {3 - formData.images.length} more image(s) to continue
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PoliciesImagesForm;