import { Shield, UserCheck, Zap, Award, Check } from "lucide-react";
import styles from "./WhyChooseRentMate.module.css";

export default function WhyChooseRentMate() {
  const features = [
    {
      icon: Shield,
      title: "Verified Profiles",
      description:
        "Every user goes through identity verification for your safety and peace of mind.",
      color: "#10b981",
    },
    {
      icon: UserCheck,
      title: "Dual Verification System",
      description:
        "Choose to verify as PG/Flat Owner to list properties or as Tenant to browse listings.",
      color: "#3b82f6",
    },
    {
      icon: Zap,
      title: "Quick Setup",
      description:
        "Get verified and start browsing or listing in minutes with our streamlined process.",
      color: "#f59e0b",
    },
    {
      icon: Award,
      title: "Quality Listings",
      description:
        "All properties and profiles are verified, ensuring genuine and trustworthy connections.",
      color: "#8b5cf6",
    },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.headerWrapper}>
          <div className={styles.badge}>
            <Check size={16} />
            <span>Trusted Platform</span>
          </div>
          <h2 className={styles.heading}>
            Why Choose <span className={styles.highlight}>RentMate</span>?
          </h2>
          <p className={styles.subtext}>
            Experience the most trusted platform with verified profiles and secure
            connections designed for your safety and convenience.
          </p>
        </div>

        <div className={styles.grid}>
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className={styles.card}>
                <div className={styles.cardInner}>
                  <div className={styles.iconContainer}>
                    <div 
                      className={styles.iconBackground}
                      style={{ backgroundColor: `${feature.color}15` }}
                    >
                      <Icon 
                        className={styles.icon}
                        style={{ color: feature.color }}
                        size={28}
                      />
                    </div>
                  </div>
                  <div className={styles.content}>
                    <h3 className={styles.cardTitle}>{feature.title}</h3>
                    <p className={styles.cardDesc}>{feature.description}</p>
                  </div>
                  <div 
                    className={styles.cardAccent}
                    style={{ backgroundColor: feature.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}