import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  FaStar,
  FaShieldAlt,
  FaUsers,
  FaCheckCircle,
  FaArrowUp,
  FaQuoteLeft,
  FaHome,
  FaHandshake,
} from "react-icons/fa";
import styles from "./TrustSection.module.css";

function throttle(func, delay) {
  let lastCall = 0;
  return (...args) => {
    const now = new Date().getTime();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    return func(...args);
  };
}

const SpotlightCard = ({
  children,
  className = "",
  spotlightColor = "rgba(37, 99, 235, 0.3)",
  title,
  subtitle,
}) => {
  const divRef = useRef(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const onMouseMove = useCallback(
    throttle((e) => {
      const card = e.currentTarget;
      const box = card.getBoundingClientRect();
      const x = e.clientX - box.left;
      const y = e.clientY - box.top;
      const centerX = box.width / 2;
      const centerY = box.height / 2;

      const rotateX = (y - centerY) / 25;
      const rotateY = (centerX - x) / 25;

      setRotate({ x: rotateX, y: rotateY });

      divRef.current.style.setProperty("--mouse-x", `${x}px`);
      divRef.current.style.setProperty("--mouse-y", `${y}px`);
      divRef.current.style.setProperty("--spotlight-color", spotlightColor);
    }, 16),
    [spotlightColor]
  );

  const onMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const onMouseLeave = useCallback(() => {
    setRotate({ x: 0, y: 0 });
    setIsHovered(false);
  }, []);

  return (
    <div
      ref={divRef}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`${styles.cardSpotlight} ${className} ${
        isHovered ? styles.hovered : ""
      }`}
      style={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1, 1, 1)`,
        transition:
          rotate.x === 0 && rotate.y === 0
            ? "all 400ms cubic-bezier(0.03, 0.98, 0.52, 0.99)"
            : "none",
      }}
    >
      <div className={styles.cardContent}>
        {title && (
          <div className={styles.cardHeader}>
            <span className={styles.cardBadge}>RentMate</span>
            <h3 className={styles.cardTitle}>{title}</h3>
            <p className={styles.cardSubtitle}>{subtitle}</p>
          </div>
        )}

        <div className={styles.cardBody}>{children}</div>
      </div>
    </div>
  );
};

const TrustSection = () => {
  const [stats, setStats] = useState({
    totalMatches: 10,
    verifiedUsers: 5,
    successRate: 96,
    avgRating: 4.8,
    totalRatings: 0,
  });

  const [testimonials, setTestimonials] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchTrustData = async () => {
      try {
        console.log("🔍 Fetching trust data from backend...");

        // Fetch trust stats
        const statsResponse = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/ratings/trust-stats`
        );

        console.log("📊 Stats response status:", statsResponse.status);

        if (!statsResponse.ok) {
          throw new Error(`Stats API returned ${statsResponse.status}`);
        }

        const statsData = await statsResponse.json();
        console.log("📊 Stats data received:", statsData);

        if (statsData.success && statsData.stats) {
          console.log("✅ Using backend stats:", statsData.stats);
          setStats(statsData.stats);
        } else {
          console.log("⚠️ Invalid stats format, using fallback");
          throw new Error("Invalid stats format");
        }

        // Fetch recent testimonials (ratings with comments)
        const testimonialsResponse = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/ratings?limit=3&minRating=4`
        );

        if (testimonialsResponse.ok) {
          const testimonialsData = await testimonialsResponse.json();

          if (testimonialsData.success && testimonialsData.data?.length > 0) {
            const formattedTestimonials = testimonialsData.data.map(
              (rating, index) => ({
                name: rating.userName,
                role: "RentMate User",
                text: rating.comment || "Great experience with RentMate!",
                rating: rating.rating,
                image: getAvatarByIndex(index),
                date: new Date(rating.createdAt).toLocaleDateString(),
              })
            );
            console.log("✅ Using backend testimonials");
            setTestimonials(formattedTestimonials);
          } else {
            console.log("⚠️ No testimonials from backend, using defaults");
            setTestimonials(getDefaultTestimonials());
          }
        } else {
          console.log("⚠️ Testimonials API failed, using defaults");
          setTestimonials(getDefaultTestimonials());
        }
      } catch (error) {
        console.error("❌ Error fetching trust data:", error);
        console.log("🔄 Using fallback data");

        // Use fallback stats
        setStats({
          totalMatches: 10,
          verifiedUsers: 5,
          successRate: 96,
          avgRating: 4.8,
          totalRatings: 0,
        });
        setTestimonials(getDefaultTestimonials());
      }
    };

    fetchTrustData();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById("trust-section");
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const getAvatarByIndex = (index) => {
    const avatars = ["👩‍🎓", "👨‍💼", "👩‍💻", "👨‍🎨", "👩‍🔬", "👨‍🏫"];
    return avatars[index % avatars.length];
  };

  const getDefaultTestimonials = () => [
    {
      name: "Priya Sharma",
      role: "Engineering Student",
      text: "Found my perfect flatmate in just 2 days! The verification process made me feel so secure.",
      rating: 5,
      image: "👩‍🎓",
    },
    {
      name: "Rahul Verma",
      role: "Working Professional",
      text: "Best platform for finding genuine PG accommodations. No more fake listings!",
      rating: 5,
      image: "👨‍💼",
    },
    {
      name: "Sneha Patel",
      role: "MBA Student",
      text: "The dual verification system is brilliant. Connected with verified flat owners instantly.",
      rating: 5,
      image: "👩‍💻",
    },
  ];

  const Counter = ({ end, duration = 2000, suffix = "", decimals = 0 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!isVisible) return;

      let startTime;
      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);

        if (decimals > 0) {
          setCount(parseFloat((progress * end).toFixed(decimals)));
        } else {
          setCount(Math.floor(progress * end));
        }

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }, [isVisible, end, duration, decimals]);

    return (
      <span>
        {count}
        {suffix}
      </span>
    );
  };

  console.log("🎯 Current stats being rendered:", stats);

  return (
    <section id="trust-section" className={styles.trustSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Trusted by People</h2>
          <p className={styles.subtitle}>
            Real stories from real people who found their perfect living space
            through RentMate
          </p>
          {stats.totalRatings > 0 && (
            <div className={styles.ratingsSummary}>
              Based on <strong>{stats.totalRatings}+ reviews</strong> from our
              community
            </div>
          )}
        </div>

        <div className={styles.cardsContainer}>
          <SpotlightCard
            spotlightColor="rgba(37, 99, 235, 0.3)"
            className={styles.testimonialCard}
            title="What Our Community Says"
            subtitle="Join thousands of satisfied users who found their perfect match through our verified platform with complete peace of mind."
          >
            <div className={styles.testimonialsPanel}>
              {testimonials.map((testimonial, index) => (
                <div key={index} className={styles.testimonialItem}>
                  <div className={styles.testimonialHeader}>
                    <div className={styles.testimonialAvatar}>
                      {testimonial.image}
                    </div>
                    <div className={styles.testimonialInfo}>
                      <h4 className={styles.testimonialName}>
                        {testimonial.name}
                      </h4>
                      <p className={styles.testimonialRole}>
                        {testimonial.role}
                      </p>
                    </div>
                    <div className={styles.testimonialRating}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <FaStar key={i} className={styles.starIcon} />
                      ))}
                    </div>
                  </div>
                  <div className={styles.testimonialQuote}>
                    <FaQuoteLeft className={styles.quoteIcon} />
                    <p className={styles.testimonialText}>{testimonial.text}</p>
                  </div>
                  {testimonial.date && (
                    <div className={styles.testimonialDate}>
                      {testimonial.date}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </SpotlightCard>

          <SpotlightCard
            spotlightColor="rgba(6, 182, 212, 0.3)"
            className={styles.metricsCard}
            title="Trust & Safety Metrics"
            subtitle="Our commitment to safety and verified connections shows in our numbers. Every user is verified, every listing is authentic."
          >
            <div className={styles.metricsPanel}>
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>
                    <FaHandshake />
                  </div>
                  <div className={styles.statNumber}>
                    <Counter end={stats.totalMatches} />+
                  </div>
                  <div className={styles.statLabel}>Successful Matches</div>
                  <div className={styles.statTrend}>
                    <FaArrowUp />
                    <span>+35% this month</span>
                  </div>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statIcon}>
                    <FaShieldAlt />
                  </div>
                  <div className={styles.statNumber}>
                    <Counter end={stats.verifiedUsers} />+
                  </div>
                  <div className={styles.statLabel}>Verified Users</div>
                  <div className={styles.statTrend}>
                    <FaArrowUp />
                    <span>+42% growth</span>
                  </div>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statIcon}>
                    <FaStar />
                  </div>
                  <div className={styles.statNumber}>
                    <Counter end={stats.avgRating} decimals={1} />★
                  </div>
                  <div className={styles.statLabel}>Average Rating</div>
                  <div className={styles.statTrend}>
                    <FaArrowUp />
                    <span>Excellent</span>
                  </div>
                </div>
              </div>

              <div className={styles.trustBadges}>
                <div className={styles.trustBadge}>
                  <FaCheckCircle className={styles.badgeIcon} />
                  <div className={styles.badgeContent}>
                    <h4 className={styles.badgeTitle}>100% Verified</h4>
                    <p className={styles.badgeText}>
                      Every profile verified with ID proof
                    </p>
                  </div>
                </div>

                <div className={styles.trustBadge}>
                  <FaShieldAlt className={styles.badgeIcon} />
                  <div className={styles.badgeContent}>
                    <h4 className={styles.badgeTitle}>Secure Platform</h4>
                    <p className={styles.badgeText}>
                      End-to-end encrypted communication
                    </p>
                  </div>
                </div>

                <div className={styles.trustBadge}>
                  <FaUsers className={styles.badgeIcon} />
                  <div className={styles.badgeContent}>
                    <h4 className={styles.badgeTitle}>Active Community</h4>
                    <p className={styles.badgeText}>
                      24/7 support and moderation
                    </p>
                  </div>
                </div>
              </div>

              <div className={styles.successRate}>
                <div className={styles.successRateHeader}>
                  <FaHome />
                  <span>Match Success Rate</span>
                </div>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${stats.successRate}%` }}
                  >
                    <span className={styles.progressLabel}>
                      <Counter end={stats.successRate} />%
                    </span>
                  </div>
                </div>
                <p className={styles.successRateText}>
                  {stats.successRate}% of our users find their perfect match
                  within 7 days
                </p>
              </div>
            </div>
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
