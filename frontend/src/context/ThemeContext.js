// src/context/ThemeContext.js
import { createContext, useState, useEffect } from "react";
import { lightTheme, darkTheme } from "../global/Theme";

export const ThemeContext = createContext();

export const ThemeContextProvider = ({ children }) => {

  // Check localStorage for saved theme, else default to light
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("app-theme");
    return savedTheme === "dark" ? darkTheme : lightTheme;
  });

  // Toggle between light and dark theme
  const toggleTheme = () => {
    setTheme((prevTheme) =>
      prevTheme.mode === "light" ? darkTheme : lightTheme
    );
  };

  // Persist theme mode to localStorage
  useEffect(() => {
    localStorage.setItem("app-theme", theme.mode);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
