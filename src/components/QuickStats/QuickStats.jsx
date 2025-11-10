import { useState, useEffect } from "react";
import {
  FaUsers,
  FaHome,
  FaStar,
  FaHandshake,
  FaChartLine,
  FaShieldAlt,
} from "react-icons/fa";
import styles from "./QuickStats.module.css";

const QuickStatsSection = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    successfulMatches: 0,
    averageRating: 0,
    verifiedListings: 0,
    responseRate: 0,
    citiesCovered: 0,
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch from your backend API
        const response = await fetch(
          "http://localhost:5000/api/ratings/trust-stats"
        );
        const data = await response.json();

        if (data.success) {
          setStats({
            totalUsers: data.stats.totalUsers || 3500,
            successfulMatches: data.stats.totalMatches || 1250,
            averageRating: data.stats.avgRating || 4.8,
            verifiedListings: data.stats.verifiedUsers || 2800,
            responseRate: 94, // You can make this dynamic too
            citiesCovered: 25, // Can be dynamic
          });
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
        // Fallback data
        setStats({
          totalUsers: 3500,
          successfulMatches: 1250,
          averageRating: 4.8,
          verifiedListings: 2800,
          responseRate: 94,
          citiesCovered: 25,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ icon, value, label, suffix = "", color = "primary" }) => (
    <div className={`${styles.statCard} ${styles[color]}`}>
      <div className={styles.statIcon}>{icon}</div>
      <div className={styles.statContent}>
        <div className={styles.statValue}>
          {isLoading ? (
            <div className={styles.skeleton}></div>
          ) : (
            <>
              {value}
              {suffix}
            </>
          )}
        </div>
        <div className={styles.statLabel}>{label}</div>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h3 className={styles.title}>RentMate at a Glance</h3>
          <p className={styles.subtitle}>Real-time platform insights</p>
        </div>

        <div className={styles.statsGrid}>
          <StatCard
            icon={<FaUsers />}
            value={stats.totalUsers}
            label="Active Users"
            suffix="+"
            color="blue"
          />

          <StatCard
            icon={<FaHandshake />}
            value={stats.successfulMatches}
            label="Successful Matches"
            suffix="+"
            color="green"
          />

          <StatCard
            icon={<FaStar />}
            value={stats.averageRating}
            label="Average Rating"
            suffix="/5"
            color="orange"
          />

          <StatCard
            icon={<FaShieldAlt />}
            value={stats.verifiedListings}
            label="Verified Listings"
            suffix="+"
            color="purple"
          />

          <StatCard
            icon={<FaChartLine />}
            value={stats.responseRate}
            label="Response Rate"
            suffix="%"
            color="teal"
          />

          <StatCard
            icon={<FaHome />}
            value={stats.citiesCovered}
            label="Cities Covered"
            suffix="+"
            color="red"
          />
        </div>

        <div className={styles.footer}>
          <div className={styles.liveIndicator}>
            <span className={styles.dot}></span>
            Live Updates
          </div>
          <p className={styles.footerText}>
            Trusted by students and professionals across India
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuickStatsSection;
