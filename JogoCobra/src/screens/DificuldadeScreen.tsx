// src/screens/DificuldadeScreen.tsx
// Ecrã com 3 cartões grandes (Fácil, Médio, Difícil) + botão "Personalizado"
// UI: estilo cartões (opção B)

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSettings } from "../context/SettingsContext";
import { DIFICULDADES } from "../config/dificuldades";

export default function DificuldadeScreen() {
  const nav = useNavigation();
  const { settings, setSettings } = useSettings();

  function escolher(key: "FACIL" | "MEDIO" | "DIFICIL") {
    setSettings({
      ...settings,
      dificuldadeKey: key,
      // actualizar valores custom de base para terem coerência visual
      customVelocidadeMs: DIFICULDADES[key].velocidadeBaseMs,
      customAumentaVel: DIFICULDADES[key].aumentaVelocidade,
      customIncrementoMs: DIFICULDADES[key].incrementoPor3ComidasMs ?? 0,
      customCobraInimiga: DIFICULDADES[key].cobraInimiga,
    });
    // volta ao menu principal (ou inicia jogo)
    nav.goBack();
  }

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Escolher Dificuldade</Text>

      <View style={styles.cards}>
        {["FACIL", "MEDIO", "DIFICIL"].map((k) => {
          const def = DIFICULDADES[k];
          const selected = settings.dificuldadeKey === k;
          return (
            <TouchableOpacity
              key={k}
              onPress={() => escolher(k as any)}
              style={[styles.card, selected && styles.cardSelected]}
            >
              <Text style={styles.cardTitle}>{def.label}</Text>
              <Text style={styles.cardText}>Velocidade: {def.velocidadeBaseMs} ms</Text>
              <Text style={styles.cardText}>
                {def.aumentaVelocidade ? "Aumenta velocidade" : "Velocidade estável"}
              </Text>
              <Text style={styles.cardText}>
                {def.cobraInimiga ? "Com cobra inimiga" : "Sem cobra inimiga"}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity style={styles.personalBtn} onPress={() => nav.navigate("Personalizado")}>
        <Text style={styles.personalText}>Personalizar...</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#111", padding: 18 },
  title: { color: "#fff", fontSize: 22, fontWeight: "700", marginBottom: 16 },
  cards: { flexDirection: "row", justifyContent: "space-between" },
  card: {
    width: "32%",
    padding: 12,
    backgroundColor: "#222",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#333",
  },
  cardSelected: { borderColor: "#4caf50", shadowColor: "#4caf50", elevation: 6 },
  cardTitle: { color: "#fff", fontSize: 16, fontWeight: "700", marginBottom: 6 },
  cardText: { color: "#bbb", fontSize: 12, marginBottom: 4 },
  personalBtn: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#4caf50",
    borderRadius: 10,
    alignItems: "center",
  },
  personalText: { color: "#fff", fontWeight: "700" },
});
