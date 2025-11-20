import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Posicao } from "../types/types";
import { DIRECOES } from "../utils/constants";

interface ControlsProps {
  onChangeDirecao: (dir: Posicao) => void;
}

export default function Controls({ onChangeDirecao }: ControlsProps) {
  return (
    <View style={styles.container}>
      {/* Linha de cima */}
      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={() => onChangeDirecao(DIRECOES.CIMA)}>
          <Text style={styles.text}>↑</Text>
        </TouchableOpacity>
      </View>

      {/* Linha do meio */}
      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={() => onChangeDirecao(DIRECOES.ESQUERDA)}>
          <Text style={styles.text}>←</Text>
        </TouchableOpacity>

        <View style={[styles.button, { backgroundColor: "transparent" }]} />

        <TouchableOpacity style={styles.button} onPress={() => onChangeDirecao(DIRECOES.DIREITA)}>
          <Text style={styles.text}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Linha de baixo */}
      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={() => onChangeDirecao(DIRECOES.BAIXO)}>
          <Text style={styles.text}>↓</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 20, alignItems: "center", justifyContent: "center" },
  row: { flexDirection: "row" },
  button: {
    width: 60,
    height: 60,
    backgroundColor: "#43a047",
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
    borderRadius: 8,
  },
  text: { fontSize: 32, color: "#fff", fontWeight: "700" },
});
