import React from "react";
import { FaGithub, FaLinkedin, FaEnvelope, FaHeart } from "react-icons/fa";
import styles from "./About.module.css";

// Correct image imports based on your folder
import aayushImg from "../../assets/me.jpg";
import vedantImg from "../../assets/Vedant.jpg";
import prathamImg from "../../assets/pratham.jpg";

const About = () => {
  const teamMembers = [
    {
      name: "Aayush Bharda",
      role: "Aspiring Web Developer",
      image: aayushImg,
      bio: "Passionate about creating seamless user experiences and robust backend systems.",
      skills: ["React", "Node.js", "MongoDB"],
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      email: "member1@example.com",
    },
    {
      name: "Vedant",
      role: "Frontend Developer",
      image: vedantImg,
      bio: "Specializes in crafting beautiful, responsive interfaces with modern web technologies.",
      skills: ["React", "CSS", "UI/UX"],
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      email: "member2@example.com",
    },
    {
      name: "Pratham",
      role: "Database Integration Specialist",
      image: prathamImg,
      bio: "Handles efficient database design, integration, and management. Ensures smooth data flow between the backend and the application while maintaining reliability and performance.",
      skills: ["MongoDB", "Database Design", "Backend Integration"],
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      email: "member3@example.com",
    },
  ];

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <h1 className={styles.title}>About RentMate</h1>
        <p className={styles.subtitle}>
          Built with passion by students, for students
        </p>
      </section>

      {/* Mission Section */}
      <section className={styles.mission}>
        <div className={styles.missionContent}>
          <div className={styles.missionIcon}>
            <FaHeart />
          </div>
          <h2 className={styles.missionTitle}>Our Mission</h2>
          <p className={styles.missionText}>
            RentMate was born from a simple idea: finding the right flatmate or
            accommodation shouldn't be stressful. We're a team of three students
            from KJ Somaiya Institute who experienced the challenges of finding
            safe, verified housing firsthand. Our platform combines modern
            technology with a user-first approach to make the search process
            seamless, secure, and trustworthy.
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section className={styles.team}>
        <h2 className={styles.sectionTitle}>Meet the Team</h2>
        <p className={styles.sectionSubtitle}>
          The passionate developers behind RentMate
        </p>

        <div className={styles.teamGrid}>
          {teamMembers.map((member, index) => (
            <div key={index} className={styles.memberCard}>
              <div className={styles.memberImageWrapper}>
                <img
                  src={member.image}
                  alt={member.name}
                  className={styles.memberImage}
                />
              </div>

              <div className={styles.memberInfo}>
                <h3 className={styles.memberName}>{member.name}</h3>
                <p className={styles.memberRole}>{member.role}</p>
                <p className={styles.memberBio}>{member.bio}</p>

                <div className={styles.memberSkills}>
                  {member.skills.map((skill, idx) => (
                    <span key={idx} className={styles.skillTag}>
                      {skill}
                    </span>
                  ))}
                </div>

                <div className={styles.memberSocial}>
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                  >
                    <FaGithub />
                  </a>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                  >
                    <FaLinkedin />
                  </a>
                  <a
                    href={`mailto:${member.email}`}
                    className={styles.socialLink}
                  >
                    <FaEnvelope />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className={styles.techStack}>
        <h2 className={styles.sectionTitle}>Built With</h2>
        <p className={styles.sectionSubtitle}>
          Modern technologies for a robust platform
        </p>

        <div className={styles.techGrid}>
          <div className={styles.techCategory}>
            <h3>Frontend</h3>
            <div className={styles.techList}>
              <span>React</span>
              <span>CSS Modules</span>
              <span>React Router</span>
            </div>
          </div>

          <div className={styles.techCategory}>
            <h3>Backend</h3>
            <div className={styles.techList}>
              <span>Node.js</span>
              <span>Express</span>
              <span>MongoDB</span>
            </div>
          </div>

          <div className={styles.techCategory}>
            <h3>Authentication</h3>
            <div className={styles.techList}>
              <span>Auth0</span>
              <span>JWT</span>
              <span>OAuth</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Have Questions?</h2>
          <p className={styles.ctaText}>
            We'd love to hear from you. Reach out to us anytime!
          </p>
          <div className={styles.ctaButtons}>
            <a href="mailto:rentmate17@gmail.com" className={styles.ctaButton}>
              <FaEnvelope />
              Email Us
            </a>
            <a href="/support" className={styles.ctaButtonSecondary}>
              Visit Support
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
