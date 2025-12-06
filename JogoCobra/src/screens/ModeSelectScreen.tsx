// src/screens/ModeSelectScreen.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { Modo } from "../types/types";

export default function ModeSelectScreen({
  onSelect,
  onBack,
}: {
  onSelect: (modo: Modo) => void;
  onBack: () => void;
}) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>

      {/* BOTÃO VOLTAR */}
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={[styles.backText, { color: colors.textPrimary }]}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={[styles.title, { color: colors.textPrimary }]}>
        Selecionar Modo
      </Text>

      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.card }]}
        onPress={() => onSelect("FACIL")}
      >
        <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Fácil</Text>
        <Text style={[styles.cardDesc, { color: colors.textSecondary }]}>
          Lento — ideal para aprender
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.card }]}
        onPress={() => onSelect("MEDIO")}
      >
        <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Médio</Text>
        <Text style={[styles.cardDesc, { color: colors.textSecondary }]}>
          Velocidade progressiva
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.card }]}
        onPress={() => onSelect("DIFICIL")}
      >
        <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Difícil</Text>
        <Text style={[styles.cardDesc, { color: colors.textSecondary }]}>
          Cobra inimiga + desafio
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 22,
  },

  backButton: {
    position: "absolute",
    top: 30,
    left: 20,
    zIndex: 10,
  },
  backText: {
    fontSize: 18,
    fontWeight: "600",
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 30,
    alignSelf: "center",
  },

  card: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "700",
  },
  cardDesc: {
    fontSize: 16,
    marginTop: 4,
  },
});
