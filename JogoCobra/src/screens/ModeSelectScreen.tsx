// src/screens/ModeSelectScreen.tsx
import React, { useState } from "react";
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

  // estado para destacar seleção
  const [selected, setSelected] = useState<Modo | null>(null);

  function escolher(modo: Modo) {
    setSelected(modo);
    setTimeout(() => onSelect(modo), 120); // leve delay para mostrar highlight
  }

  function cardEstilo(modo: Modo) {
    return {
      backgroundColor: colors.card,
      borderWidth: selected === modo ? 2 : 0,
      borderColor: selected === modo ? colors.primary : "transparent",
    };
  }

  function tituloEstilo(modo: Modo) {
    return {
      color: selected === modo ? colors.primary : colors.textPrimary,
    };
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>

      {/* BOTÃO VOLTAR */}
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={[styles.backText, { color: colors.textPrimary }]}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={[styles.title, { color: colors.textPrimary }]}>
        Selecionar Modo
      </Text>

      {/* FÁCIL */}
      <TouchableOpacity
        style={[styles.card, cardEstilo("FACIL")]}
        onPress={() => escolher("FACIL")}
      >
        <Text style={[styles.cardTitle, tituloEstilo("FACIL")]}>Fácil</Text>
        <Text style={[styles.cardDesc, { color: colors.textSecondary }]}>
          Lento — ideal para aprender
        </Text>
      </TouchableOpacity>

      {/* MÉDIO */}
      <TouchableOpacity
        style={[styles.card, cardEstilo("MEDIO")]}
        onPress={() => escolher("MEDIO")}
      >
        <Text style={[styles.cardTitle, tituloEstilo("MEDIO")]}>Médio</Text>
        <Text style={[styles.cardDesc, { color: colors.textSecondary }]}>
          Velocidade progressiva
        </Text>
      </TouchableOpacity>

      {/* DIFÍCIL */}
      <TouchableOpacity
        style={[styles.card, cardEstilo("DIFICIL")]}
        onPress={() => escolher("DIFICIL")}
      >
        <Text style={[styles.cardTitle, tituloEstilo("DIFICIL")]}>Difícil</Text>
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
