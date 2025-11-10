import React from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Brand Section */}
          <div className={styles.brand}>
            <Link to="/" className={styles.logo}>
              <Home className={styles.logoIcon} />
              <span className={styles.brandName}>RentMate</span>
            </Link>
            <p className={styles.description}>
              Advanced flatmate matching platform designed for safety and
              convenience.
            </p>
            <div className={styles.social}>
              <a
                href="https://facebook.com"
                className={styles.socialLink}
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://twitter.com"
                className={styles.socialLink}
                aria-label="Twitter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter size={18} />
              </a>
              <a
                href="https://instagram.com"
                className={styles.socialLink}
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://linkedin.com"
                className={styles.socialLink}
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className={styles.links}>
            <div className={styles.section}>
              <h3 className={styles.title}>Platform</h3>
              <ul className={styles.list}>
                <li>
                  <Link to="/find-flatmates" className={styles.link}>
                    Find Flatmates
                  </Link>
                </li>
                <li>
                  <Link to="/list-your-space" className={styles.link}>
                    List Your Space
                  </Link>
                </li>
                <li>
                  <Link to="/find-your-stay" className={styles.link}>
                    Find Your Stay
                  </Link>
                </li>
                <li>
                  <Link to="/about" className={styles.link}>
                    About Us
                  </Link>
                </li>
              </ul>
            </div>

            <div className={styles.section}>
              <h3 className={styles.title}>Support</h3>
              <ul className={styles.list}>
                <li>
                  <Link to="/support" className={styles.link}>
                    Help Center
                  </Link>
                </li>
                <li></li>
                <li></li>
                <li>
                  <Link to="/verification-form" className={styles.link}>
                    Get Verified
                  </Link>
                </li>
              </ul>
            </div>

            <div className={styles.section}>
              <h3 className={styles.title}>Contact</h3>
              <div className={styles.contact}>
                <a
                  href="mailto:rentmate17@gmail.com"
                  className={styles.contactItem}
                >
                  <Mail size={14} />
                  <span>rentmate17@gmail.com</span>
                </a>
                <a href="tel:+919167541096" className={styles.contactItem}>
                  <Phone size={14} />
                  <span>+91 9167541096</span>
                </a>
                <a
                  href="https://maps.google.com/?q=KJ+Somaiya+Institute+Sion"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.contactItem}
                >
                  <MapPin size={14} />
                  <span>KJ Somaiya Institute, Sion</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © 2025 RentMate. All rights reserved.
          </p>
          <div className={styles.legal}>
            <Link to="/privacy" className={styles.legalLink}>
              Privacy Policy
            </Link>
            <Link to="/terms" className={styles.legalLink}>
              Terms of Service
            </Link>
            <Link to="/cookies" className={styles.legalLink}>
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
