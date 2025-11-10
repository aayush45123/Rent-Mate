import styles from "./HowItWorks.module.css";

export default function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Sign Up & Login",
      description:
        "Create your account and log in to access our platform. Quick and secure authentication process.",
      icon: "🔐",
      highlight: "Secure login",
    },
    {
      step: "02",
      title: "Complete Verification",
      description:
        "Choose your profile type - verify as a PG/Flat Owner to list properties, or as someone Looking for PG to browse listings.",
      icon: "✅",
      highlight: "Get verified",
    },
    {
      step: "03",
      title: "Browse & Connect",
      description:
        "Explore verified listings or potential flatmates. Connect with compatible matches and start meaningful conversations.",
      icon: "💬",
      highlight: "Safe communication",
    },
    {
      step: "04",
      title: "Meet & Move In",
      description:
        "Schedule meetups, verify compatibility in person, and finalize your perfect living arrangement with confidence.",
      icon: "🏠",
      highlight: "Find your home",
    },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.heading}>
            How It <span className={styles.highlight}>Works</span>
          </h2>
          <p className={styles.subtext}>
            Find your perfect flatmate in 4 simple steps with our AI-powered
            matching system
          </p>
        </div>

        <div className={styles.timeline}>
          {steps.map((step, index) => (
            <div
              key={index}
              className={`${styles.timelineItem} ${
                index % 2 === 0 ? styles.left : styles.right
              }`}
            >
              <div className={styles.timelineContent}>
                <div className={styles.stepNumber}>{step.step}</div>
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div className={styles.icon}>{step.icon}</div>
                    <div className={styles.cardInfo}>
                      <h3 className={styles.cardTitle}>{step.title}</h3>
                      <span className={styles.cardHighlight}>
                        {step.highlight}
                      </span>
                    </div>
                  </div>
                  <p className={styles.cardDesc}>{step.description}</p>
                </div>
              </div>
              <div className={styles.timelineDot}></div>
            </div>
          ))}
        </div>

        <div className={styles.cta}>
          <p className={styles.ctaText}>
            Join thousands who found their perfect flatmate
          </p>
        </div>
      </div>
    </section>
  );
}
