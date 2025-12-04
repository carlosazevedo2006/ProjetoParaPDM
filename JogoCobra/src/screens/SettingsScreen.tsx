import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function SettingsScreen({ onBack }: any) {
  const { colors, theme, toggleTheme, snakeColor, setSnakeColor } = useTheme();

  const palette = ["#43a047", "#00BCD4", "#FF9800", "#E91E63", "#9C27B0"];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Definições</Text>

      {/* Tema */}
      <TouchableOpacity
        onPress={toggleTheme}
        style={[styles.option, { backgroundColor: colors.card }]}
      >
        <Text style={[styles.optionText, { color: colors.text }]}>
          Tema: {theme === "dark" ? "Escuro" : "Claro"}
        </Text>
      </TouchableOpacity>

      {/* Cor da cobra */}
      <Text style={[styles.subtitle, { color: colors.text }]}>Cor da Cobra</Text>
      <View style={styles.paletteRow}>
        {palette.map((c) => (
          <TouchableOpacity
            key={c}
            onPress={() => setSnakeColor(c)}
            style={[
              styles.colorDot,
              { backgroundColor: c, borderWidth: snakeColor === c ? 3 : 0 },
            ]}
          />
        ))}
      </View>

      {/* Botão voltar */}
      <TouchableOpacity
        onPress={onBack}
        style={[styles.buttonSecondary, { borderColor: colors.text }]}
      >
        <Text style={[styles.buttonSecondaryText, { color: colors.text }]}>
          Voltar
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 22,
  },

  title: {
    fontSize: 32,
    marginTop: 24,
    fontWeight: "700",
  },

  option: {
    padding: 18,
    borderRadius: 14,
  },

  optionText: {
    fontSize: 18,
  },

  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: -10,
  },

  paletteRow: {
    flexDirection: "row",
    gap: 12,
  },

  colorDot: {
    width: 42,
    height: 42,
    borderRadius: 42,
    borderColor: "white",
  },

  buttonSecondary: {
    marginTop: 40,
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: "center",
  },

  buttonSecondaryText: {
    fontSize: 18,
  },
});
