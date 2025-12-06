// src/screens/WelcomeScreen.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function WelcomeScreen({ onContinue, onSettings }: any) {
  const { colors } = useTheme ? useTheme() : { colors: { primary: "#00aa44", textPrimary: "#fff", background: "#111" } };

  return (
    <View style={[styles.root, { backgroundColor: colors.background ?? "#111" }]}>
      <Text style={[styles.title, { color: colors.textPrimary ?? "#fff" }]}>Jogo da Cobra</Text>

      <TouchableOpacity
        onPress={onContinue}
        style={[styles.playBtn, { backgroundColor: colors.primary ?? "#00aa44" }]}
      >
        <Text style={[styles.playText, { color: colors.buttonText ?? "#000" }]}>Jogar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onSettings} style={[styles.settingsBtn]}>
        <Text style={[styles.settingsText, { color: colors.textSecondary ?? "#ccc" }]}>Definições</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 30 },
  playBtn: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    marginBottom: 14,
  },
  playText: { fontSize: 18, fontWeight: "700" },

  settingsBtn: { marginTop: 12 },
  settingsText: { fontSize: 16 },
});

