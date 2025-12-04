// src/screens/ModeSelectScreen.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Modo } from "../types/types";

export default function ModeSelectScreen({ onSelect }: { onSelect: (m: Modo) => void }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>SELECIONAR MODO</Text>

      <View style={styles.menuBox}>
        <TouchableOpacity style={styles.button} onPress={() => onSelect("FACIL")}>
          <Text style={styles.buttonText}>FÁCIL</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => onSelect("MEDIO")}>
          <Text style={styles.buttonText}>MÉDIO</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.hardButton]} onPress={() => onSelect("DIFICIL")}>
          <Text style={styles.buttonText}>DIFÍCIL</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const PIXEL_BORDER = {
  borderWidth: 4,
  borderColor: "#00ff99",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  title: {
    fontFamily: "VT323",
    fontSize: 52,
    color: "#00ff99",
    marginBottom: 50,
    textShadowColor: "#008f66",
    textShadowRadius: 10,
  },

  menuBox: {
    width: "85%",
    gap: 20,
  },

  button: {
    backgroundColor: "#000",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    ...PIXEL_BORDER,
  },

  hardButton: {
    borderColor: "#ff4d4d",
  },

  buttonText: {
    fontFamily: "VT323",
    fontSize: 30,
    color: "#fff",
    letterSpacing: 2,
  },
});
