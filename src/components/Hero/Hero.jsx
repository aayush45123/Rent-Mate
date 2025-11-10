import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Hero.module.css";
import HeroImg from "../../assets/HeroImg.svg";

const Hero = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/find-your-stay");
  };

  return (
    <div className={styles.overflowHidden}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <p className={styles.badge}>Skip the Hassle. Find Your Home.</p>
            <h1 className={styles.heroTitle}>
              Your trusted rental community grows together.
            </h1>
            <p className={styles.heroDescription}>
              Tired of unreliable rental listings and questionable roommates?
              RentMate connects verified PG owners, flat owners, and
              accommodation seekers through our comprehensive verification
              system.
            </p>

            <div className={styles.buttonGroup}>
              <div className={styles.buttonGlow}></div>
              <button 
                onClick={handleGetStarted}
                className={styles.ctaButton}
              >
                Get Started - It's Free
              </button>
            </div>
          </div>
        </div>

        <div className={styles.heroImageContainer}>
          <img
            className={styles.heroImage}
            src={HeroImg}
            alt="Illustration of rental community"
          />
        </div>
      </section>
    </div>
  );
};

export default Hero;