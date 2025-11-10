// AnimatedBackground.jsx
import React, { useState, useEffect, useRef } from "react";
import styles from "./AnimatedBackground.module.css";

const AnimatedBackground = ({
  intensity = "soft",
  interactive = true,
  elementCount = 40,
}) => {
  const [elements, setElements] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Initialize background elements
  useEffect(() => {
    const initialElements = Array.from({ length: elementCount }, (_, i) => ({
      id: i,
      type: Math.random() > 0.7 ? "building" : "home",
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 25 + 15,
      speed: Math.random() * 0.2 + 0.05,
      opacity: Math.random() * 0.3 + 0.1,
      pulseSpeed: Math.random() * 0.03 + 0.01,
      pulsePhase: Math.random() * Math.PI * 2,
      color: `hsl(${200 + Math.random() * 40}, ${60 + Math.random() * 20}%, ${
        80 + Math.random() * 15
      }%)`,
    }));
    setElements(initialElements);
  }, [elementCount]);

  // Animation loop
  useEffect(() => {
    let animationFrameId;

    const animate = () => {
      setElements((prevElements) =>
        prevElements.map((element) => {
          // Gentle floating motion
          let newY = element.y - element.speed;
          if (newY < -10) newY = 110;

          // Mouse interaction
          let newX = element.x;
          if (interactive) {
            const dx = (mousePosition.x / window.innerWidth) * 100 - element.x;
            const dy = (mousePosition.y / window.innerHeight) * 100 - element.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 20) {
              const force = (20 - distance) / 20;
              newX = element.x - dx * force * 0.02;
            }
          }

          // Update pulse
          const newPulsePhase = element.pulsePhase + element.pulseSpeed;

          return {
            ...element,
            x: Math.max(0, Math.min(100, newX)),
            y: newY,
            pulsePhase: newPulsePhase,
          };
        })
      );

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [mousePosition, interactive]);

  const handleMouseMove = (e) => {
    if (!interactive) return;
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  // Render building or home SVG shapes
  const renderShape = (element) => {
    const size = element.size;
    const currentOpacity =
      element.opacity * (0.8 + 0.2 * Math.sin(element.pulsePhase));

    if (element.type === "building") {
      return (
        <svg
          key={element.id}
          className={styles.building}
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            width: `${size}px`,
            height: `${size}px`,
            opacity: currentOpacity,
            color: element.color,
          }}
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M19 2H9c-1.1 0-2 .9-2 2v6H5c-1.1 0-2 .9-2 2v9c0 .55.45 1 1 1s1-.45 1-1v-1h16v1c0 .55.45 1 1 1s1-.45 1-1V4c0-1.1-.9-2-2-2zM5 12h2v3H5v-3zm4 6H7v-3h2v3zm4 0h-2v-3h2v3zm4 0h-2v-3h2v3zm4 0h-2v-3h2v3zm0-6h-2v-3h2v3zm-4-6H9V4h10v8z"
          />
        </svg>
      );
    } else {
      return (
        <svg
          key={element.id}
          className={styles.home}
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            width: `${size}px`,
            height: `${size}px`,
            opacity: currentOpacity,
            color: element.color,
          }}
          viewBox="0 0 24 24"
        >
          <path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
      );
    }
  };

  return (
    <div
      ref={containerRef}
      className={`${styles.background} ${styles[intensity]}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Floating connection lines */}
      <div className={styles.connectionLines}></div>

      {/* Animated background elements */}
      {elements.map(renderShape)}

      {/* Subtle gradient overlays */}
      <div className={styles.gradientOverlay1}></div>
      <div className={styles.gradientOverlay2}></div>

      {/* Community pattern */}
      <div className={styles.communityPattern}></div>
    </div>
  );
};

export default AnimatedBackground;
