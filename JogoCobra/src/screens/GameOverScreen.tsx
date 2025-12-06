// src/screens/GameOverScreen.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function GameOverScreen({ pontos, melhor, onRestart, onMenu }: any) {
  const { colors } = useTheme ? useTheme() : { colors: { background: "#111", textPrimary: "#fff", primary: "#00aa44", buttonText: "#000" } };

  return (
    <View style={[styles.root, { backgroundColor: colors.background ?? "#111" }]}>
      <Text style={[styles.title, { color: colors.textPrimary ?? "#fff" }]}>Game Over</Text>
      <Text style={[styles.score, { color: colors.textSecondary ?? "#ccc" }]}>
        Pontos: {pontos} • Melhor: {melhor}
      </Text>

      <TouchableOpacity style={[styles.btnPrimary, { backgroundColor: colors.primary ?? "#00aa44" }]} onPress={onRestart}>
        <Text style={[styles.btnText, { color: colors.buttonText ?? "#000" }]}>Recomeçar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.btnSecondary]} onPress={onMenu}>
        <Text style={[styles.btnTextSecondary, { color: colors.textPrimary ?? "#fff" }]}>Voltar ao Menu</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 34, fontWeight: "700", marginBottom: 10 },
  score: { fontSize: 16, marginBottom: 22 },

  btnPrimary: {
    paddingVertical: 12,
    paddingHorizontal: 26,
    borderRadius: 12,
    marginBottom: 12,
  },
  btnText: { fontSize: 16, fontWeight: "700" },

  btnSecondary: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  btnTextSecondary: { fontSize: 15 },
});
