import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function ModeSelectScreen({ onSelect }: any) {
  const { colors } = useTheme();

  const modes = [
    {
      id: "FACIL",
      title: "Fácil",
      desc: "Movimentação normal. Sem cobra inimiga.",
    },
    {
      id: "MEDIO",
      title: "Médio",
      desc: "Velocidade aumenta conforme come.",
    },
    {
      id: "DIFICIL",
      title: "Difícil",
      desc: "Uma cobra inimiga tenta colidir contigo.",
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        Selecionar Modo
      </Text>

      {modes.map((m) => (
        <TouchableOpacity
          key={m.id}
          onPress={() => onSelect(m.id)}
          style={[styles.card, { backgroundColor: colors.card }]}
        >
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            {m.title}
          </Text>
          <Text style={[styles.cardDesc, { color: colors.text }]}>
            {m.desc}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 18,
  },

  title: {
    marginTop: 40,
    fontSize: 32,
    fontWeight: "700",
  },

  card: {
    padding: 22,
    borderRadius: 16,
  },

  cardTitle: {
    fontSize: 22,
    fontWeight: "700",
  },

  cardDesc: {
    marginTop: 6,
    opacity: 0.75,
  },
});
