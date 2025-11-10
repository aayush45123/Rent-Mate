import React, { createContext, useContext, useState, useEffect } from "react";

// Create Theme Context
const ThemeContext = createContext();

// Custom hook to use theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  // Initialize theme from localStorage or default to dark
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      const isDark = savedTheme === "dark";
      setIsDarkTheme(isDark);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      // Default to dark theme
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    const themeString = newTheme ? "dark" : "light";

    // Apply theme to document
    document.documentElement.setAttribute("data-theme", themeString);

    // Save to localStorage
    localStorage.setItem("theme", themeString);
  };

  const value = {
    isDarkTheme,
    toggleTheme,
    theme: isDarkTheme ? "dark" : "light",
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export default ThemeContext;
