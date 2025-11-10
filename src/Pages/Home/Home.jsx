import React, { useEffect, useRef } from "react";
import Hero from "../../components/Hero/Hero";
import WhyChooseRentMate from "../../components/WhyChooseRentmate/WhyChooseRentMate";
import HowItWorks from "../../components/HowItWorks/HowItWorks";
import TrustSection from "../../components/TrustSection/TrustSection";
import RateUsSection from "../../components/RateUsSection/RateUsSection";
import styles from "./Home.module.css";
import QuickStatsSection from "../../components/QuickStats/QuickStats";

const Home = () => {
  const heroRef = useRef(null);
  const whyChooseRef = useRef(null);
  const howItWorksRef = useRef(null);
  const trustRef = useRef(null);
  const sectionsRef = useRef(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.visible);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    const elements = [
      heroRef.current,
      whyChooseRef.current,
      howItWorksRef.current,
      trustRef.current,
      sectionsRef.current,
    ];

    elements.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      elements.forEach((el) => {
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  return (
    <div className={styles.homeContainer}>
      <div ref={heroRef} className={`${styles.section} ${styles.fadeInUp}`}>
        <Hero />
      </div>

      <div
        ref={whyChooseRef}
        className={`${styles.section} ${styles.fadeInLeft}`}
      >
        <WhyChooseRentMate />
      </div>

      <div
        ref={howItWorksRef}
        className={`${styles.section} ${styles.fadeInRight}`}
      >
        <HowItWorks />
      </div>

      <div ref={trustRef} className={`${styles.section} ${styles.fadeInUp}`}>
        <TrustSection />
      </div>

      <div ref={sectionsRef} className={`${styles.section} ${styles.scaleIn}`}>
        <div className={styles.sectionsContainer}>
          <div className={styles.column}>
            <RateUsSection />
          </div>
          <div className={styles.column}>
            <QuickStatsSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
