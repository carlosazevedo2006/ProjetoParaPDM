import React from "react";
import { SafeAreaView } from "react-native";
import { ThemeProvider } from "./src/context/ThemeContext";
import Game from "./src/components/Game";

export default function App() {
  return (
    <ThemeProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <Game />
      </SafeAreaView>
    </ThemeProvider>
  );
}
