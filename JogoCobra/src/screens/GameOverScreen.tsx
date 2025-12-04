import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function GameOverScreen({ pontos, melhor, onRestart, onMenu }: any) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>GAME OVER</Text>

      <View style={styles.stats}>
        <Text style={[styles.stat, { color: colors.text }]}>
          Pontos: <Text style={styles.bold}>{pontos}</Text>
        </Text>
        <Text style={[styles.stat, { color: colors.text }]}>
          Recorde: <Text style={styles.bold}>{melhor}</Text>
        </Text>
      </View>

      <TouchableOpacity
        onPress={onRestart}
        style={[styles.button, { backgroundColor: colors.card }]}
      >
        <Text style={[styles.buttonText, { color: colors.text }]}>Recomeçar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onMenu}
        style={[styles.buttonSecondary, { borderColor: colors.text }]}
      >
        <Text style={[styles.buttonSecondaryText, { color: colors.text }]}>
          Menu
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },

  title: {
    fontSize: 42,
    fontWeight: "800",
  },

  stats: {
    gap: 6,
    marginBottom: 20,
  },

  stat: {
    fontSize: 20,
  },

  bold: { fontWeight: "700" },

  button: {
    paddingVertical: 18,
    paddingHorizontal: 80,
    borderRadius: 14,
    marginBottom: 4,
  },

  buttonText: {
    fontSize: 18,
    fontWeight: "600",
  },

  buttonSecondary: {
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 14,
    borderWidth: 2,
  },

  buttonSecondaryText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
