import { useState } from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaEnvelope,
  FaPhone,
  FaBook,
  FaHome,
  FaUserFriends,
  FaShieldAlt,
  FaLifeRing,
  FaPaperPlane,
  FaCheckCircle,
} from "react-icons/fa";
import styles from "./Support.module.css";

const Support = () => {
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const faqData = [
    {
      id: 1,
      question: "How do I create my profile on RentMate?",
      answer:
        "After signing up, go to your profile section and fill in your personal details, preferences, and upload photos. A complete profile helps you find better matches.",
    },
    {
      id: 2,
      question: "How does the flatmate matching system work?",
      answer:
        "Our smart algorithm considers your lifestyle preferences, budget, location, and compatibility factors to suggest the best potential flatmates.",
    },
    {
      id: 3,
      question: "How do I list my space for rent?",
      answer:
        "Navigate to 'List Your Space' from the menu. Fill in property details, upload photos, set your rent and preferences, then publish your listing.",
    },
    {
      id: 4,
      question: "How do you verify users on the platform?",
      answer:
        "We use a comprehensive verification process including government ID verification, address proof, and phone number verification. All verified users get a blue checkmark badge.",
    },
    {
      id: 5,
      question: "How is my personal information protected?",
      answer:
        "Your data is encrypted and stored securely using industry-standard protocols. You control what information is visible to other users through your privacy settings.",
    },
    {
      id: 6,
      question: "What payment methods do you accept?",
      answer:
        "We support multiple payment methods including credit/debit cards, UPI, net banking, and digital wallets for a seamless transaction experience.",
    },
    {
      id: 7,
      question: "How do I report suspicious activity?",
      answer:
        "Click the 'Report' button on any profile or listing. Our team reviews all reports within 24 hours and takes appropriate action to ensure community safety.",
    },
    {
      id: 8,
      question: "Can I edit my listing after publishing?",
      answer:
        "Yes, you can edit your listing anytime from your dashboard. Changes are reflected immediately after saving. You can also pause or deactivate your listing temporarily.",
    },
  ];

  const supportChannels = [
    {
      title: "Email Support",
      description: "Send us a detailed message",
      icon: FaEnvelope,
      availability: "24/7 Support",
      responseTime: "< 24 hours",
      color: "#3b82f6",
      contact: "rentmate17@gmail.com",
    },
    {
      title: "Phone Support",
      description: "Speak directly with our team",
      icon: FaPhone,
      availability: "Mon-Fri 9AM-6PM",
      responseTime: "Immediate",
      color: "#f59e0b",
      contact: "+91 9167541096",
    },
    {
      title: "Help Center",
      description: "Browse our knowledge base",
      icon: FaBook,
      availability: "Always Available",
      responseTime: "Instant",
      color: "#8b5cf6",
      contact: "FAQ & Guides",
    },
  ];

  const helpCategories = [
    {
      icon: FaHome,
      title: "Property Listings",
      description: "Create and manage your property listings",
    },
    {
      icon: FaUserFriends,
      title: "Finding Flatmates",
      description: "Connect with verified flatmates",
    },
    {
      icon: FaShieldAlt,
      title: "Safety & Security",
      description: "Learn about our security measures",
    },
    {
      icon: FaLifeRing,
      title: "Account Support",
      description: "Manage your account settings",
    },
  ];

  const toggleFAQ = (id) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Contact form submitted:", contactForm);
    setFormSubmitted(true);

    setTimeout(() => {
      setFormSubmitted(false);
      setContactForm({ name: "", email: "", subject: "", message: "" });
    }, 3000);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>How can we help you?</h1>
        <p className={styles.subtitle}>
          Get the support you need to make the most of RentMate
        </p>
      </div>

      <div className={styles.content}>
        {/* Support Channels */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Get in Touch</h2>
          <div className={styles.channelsGrid}>
            {supportChannels.map((channel, index) => (
              <div key={index} className={styles.channelCard}>
                <div
                  className={styles.channelIcon}
                  style={{
                    backgroundColor: `${channel.color}15`,
                    color: channel.color,
                  }}
                >
                  <channel.icon />
                </div>
                <h3>{channel.title}</h3>
                <p>{channel.description}</p>
                <div className={styles.channelDetails}>
                  <span className={styles.channelAvailability}>
                    {channel.availability}
                  </span>
                  <span className={styles.channelResponse}>
                    Response: {channel.responseTime}
                  </span>
                  <span className={styles.channelContact}>
                    {channel.contact}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Help Categories */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Browse by Category</h2>
          <div className={styles.categoriesGrid}>
            {helpCategories.map((category, index) => (
              <div key={index} className={styles.categoryCard}>
                <category.icon className={styles.categoryIcon} />
                <h3>{category.title}</h3>
                <p className={styles.categoryDescription}>
                  {category.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className={styles.section} id="faq">
          <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          <div className={styles.faqList}>
            {faqData.map((faq, index) => (
              <div
                key={faq.id}
                className={`${styles.faqItem} ${
                  expandedFAQ === faq.id ? styles.faqItemExpanded : ""
                }`}
                style={{ marginBottom: index < faqData.length - 1 ? "0" : "0" }}
              >
                <button
                  className={styles.faqQuestion}
                  onClick={() => toggleFAQ(faq.id)}
                  aria-expanded={expandedFAQ === faq.id}
                  aria-controls={`faq-answer-${faq.id}`}
                >
                  <h3>{faq.question}</h3>
                  <span className={styles.faqIcon}>
                    {expandedFAQ === faq.id ? (
                      <FaChevronUp />
                    ) : (
                      <FaChevronDown />
                    )}
                  </span>
                </button>
                <div
                  className={styles.faqAnswerWrapper}
                  style={{
                    maxHeight: expandedFAQ === faq.id ? "500px" : "0",
                    overflow: "hidden",
                    transition: "max-height 0.3s ease-out",
                  }}
                >
                  <div className={styles.faqAnswer} id={`faq-answer-${faq.id}`}>
                    <p>{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Form */}
        <section className={styles.section} id="contact">
          <h2 className={styles.sectionTitle}>Still Need Help?</h2>
          <p className={styles.sectionSubtitle}>
            Send us a message and we'll respond within 24 hours
          </p>
          {formSubmitted ? (
            <div className={styles.successMessage}>
              <FaCheckCircle className={styles.successIcon} />
              <h3>Message Sent Successfully!</h3>
              <p>We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className={styles.contactForm}>
              <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                  <label htmlFor="name">Full Name *</label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={contactForm.name}
                    onChange={handleFormChange}
                    required
                    placeholder="Your full name"
                    autoComplete="name"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="email">Email Address *</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={contactForm.email}
                    onChange={handleFormChange}
                    required
                    placeholder="your.email@example.com"
                    autoComplete="email"
                  />
                </div>
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="subject">Subject *</label>
                <input
                  id="subject"
                  type="text"
                  name="subject"
                  value={contactForm.subject}
                  onChange={handleFormChange}
                  required
                  placeholder="Brief description of your issue"
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={contactForm.message}
                  onChange={handleFormChange}
                  required
                  rows="5"
                  placeholder="Please describe your issue in detail..."
                />
              </div>
              <button type="submit" className={styles.submitButton}>
                <FaPaperPlane />
                Send Message
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
};

export default Support;
