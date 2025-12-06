// src/context/ThemeContext.tsx
import React, { createContext, useContext, useState } from "react";

const lightColors = {
  background: "#F5F5F5",
  card: "#FFFFFF",
  textPrimary: "#000000",
  textSecondary: "#555555",
  primary: "#2ecc71",
  buttonText: "#FFFFFF",
  backdrop: "rgba(0,0,0,0.25)",
};

const darkColors = {
  background: "#000000",
  card: "#1A1A1A",
  textPrimary: "#E8FFE8",
  textSecondary: "#BBBBBB",
  primary: "#00FF88",
  buttonText: "#000000",
  backdrop: "rgba(0,0,0,0.55)",
};

const ThemeContext = createContext<any>(null);

export function ThemeProvider({ children }: any) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const [snakeColor, setSnakeColor] = useState("#43a047");

  const colors = theme === "light" ? lightColors : darkColors;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        colors,
        snakeColor,
        setSnakeColor,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
