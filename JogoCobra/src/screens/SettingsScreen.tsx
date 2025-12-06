// src/screens/SettingsScreen.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function SettingsScreen({ onClose, onApply }: any) {
  const { theme, setTheme, colors, snakeColor, setSnakeColor } = useTheme();

  const [localTheme, setLocalTheme] = useState(theme);
  const [localColor, setLocalColor] = useState(snakeColor);

  const colorOptions = ["#43a047", "#1e88e5", "#e53935", "#fdd835", "#8e24aa"];

  return (
    <View style={[styles.overlay, { backgroundColor: colors.backdrop }]}>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Definições
        </Text>

        {/* TEMA */}
        <Text style={[styles.label, { color: colors.textPrimary }]}>
          Tema
        </Text>

        <View style={styles.row}>
          <TouchableOpacity
            style={[
              styles.themeButton,
              localTheme === "light" && { borderColor: colors.primary }
            ]}
            onPress={() => setLocalTheme("light")}
          >
            <Text
              style={[
                styles.themeButtonText,
                { color: localTheme === "light" ? colors.primary : colors.textPrimary }
              ]}
            >
              Claro
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.themeButton,
              localTheme === "dark" && { borderColor: colors.primary }
            ]}
            onPress={() => setLocalTheme("dark")}
          >
            <Text
              style={[
                styles.themeButtonText,
                { color: localTheme === "dark" ? colors.primary : colors.textPrimary }
              ]}
            >
              Escuro
            </Text>
          </TouchableOpacity>
        </View>

        {/* COR DA COBRA */}
        <Text style={[styles.label, { color: colors.textPrimary }]}>
          Cor da cobra
        </Text>

        <View style={styles.colorRow}>
          {colorOptions.map((c) => (
            <TouchableOpacity
              key={c}
              onPress={() => setLocalColor(c)}
              style={[
                styles.colorCircle,
                { backgroundColor: c },
                localColor === c && {
                  borderWidth: 3,
                  borderColor: colors.primary
                }
              ]}
            />
          ))}
        </View>

        {/* BOTÕES */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.applyButton, { backgroundColor: colors.primary }]}
            onPress={() => {
              setTheme(localTheme);
              setSnakeColor(localColor);
              onApply();
            }}
          >
            <Text style={[styles.applyText, { color: colors.buttonText }]}>
              Aplicar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose}>
            <Text style={[styles.closeText, { color: colors.textPrimary }]}>
              Fechar
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    padding: 20
  },
  card: {
    padding: 20,
    borderRadius: 18
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 20
  },
  label: {
    fontSize: 16,
    marginBottom: 10
  },
  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20
  },
  themeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2
  },
  themeButtonText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600"
  },
  colorRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 30
  },
  colorCircle: {
    width: 38,
    height: 38,
    borderRadius: 19
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  applyButton: {
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 12
  },
  applyText: {
    fontSize: 16,
    fontWeight: "700"
  },
  closeText: {
    fontSize: 16
  }
});
