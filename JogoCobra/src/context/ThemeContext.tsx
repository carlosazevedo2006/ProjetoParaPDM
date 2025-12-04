import React, { createContext, useContext, useState } from "react";

type ThemeType = "light" | "dark";

interface ThemeColors {
  background: string;
  card: string;
  text: string;
  board: string;
  snake: string;
  enemy: string;
  food: string;
  border: string;
}

interface ThemeContextProps {
  theme: ThemeType;
  colors: ThemeColors;
  snakeColor: string;
  setSnakeColor: (c: string) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps>(null as any);

const darkTheme: ThemeColors = {
  background: "#0A0F14",
  card: "#11161D",
  text: "#FFFFFF",
  board: "#00070D",
  snake: "#43a047", // será substituído pelo user
  enemy: "#FF4A4A",
  food: "#FF3B3B",
  border: "#1A1F24",
};

const lightTheme: ThemeColors = {
  background: "#FFFFFF",
  card: "#F2F2F2",
  text: "#000000",
  board: "#EDEDED",
  snake: "#43a047", // será substituído pelo user
  enemy: "#E53935",
  food: "#FF3B3B",
  border: "#D0D0D0",
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeType>("dark");
  const [snakeColor, setSnakeColor] = useState("#43a047");

  const toggleTheme = () => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  };

  const colors = theme === "dark" ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider
      value={{ theme, colors, snakeColor, setSnakeColor, toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
