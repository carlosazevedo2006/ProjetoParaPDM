// App.tsx
import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import AppNavigator from "./src/navigation/AppNavigator";
import { SettingsProvider } from "./src/context/SettingsContext";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <SettingsProvider>
        <AppNavigator />
      </SettingsProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
});
