// src/components/Controls.tsx
// Componentes de controlo: botões e suporte para acessibilidade.
// O componente envia a nova direcção para o pai (Game).

import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Posicao } from "../types";

type Props = {
  onChangeDirecao: (nova: Posicao) => void;
};

export default function Controls({ onChangeDirecao }: Props) {
  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={styles.botao}
        onPress={() => onChangeDirecao({ x: 0, y: -1 })}
        accessibilityLabel="Mover para cima"
      >
        <Text style={styles.txt}>⬆</Text>
      </TouchableOpacity>

      <View style={styles.row}>
        <TouchableOpacity
          style={styles.botao}
          onPress={() => onChangeDirecao({ x: -1, y: 0 })}
          accessibilityLabel="Mover para esquerda"
        >
          <Text style={styles.txt}>⬅</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botao}
          onPress={() => onChangeDirecao({ x: 1, y: 0 })}
          accessibilityLabel="Mover para direita"
        >
          <Text style={styles.txt}>➡</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.botao}
        onPress={() => onChangeDirecao({ x: 0, y: 1 })}
        accessibilityLabel="Mover para baixo"
      >
        <Text style={styles.txt}>⬇</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    marginTop: 12,
  },
  row: {
    flexDirection: "row",
    marginVertical: 6,
  },
  botao: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: "#efefef",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
    elevation: 2,
  },
  txt: {
    fontSize: 28,
    color: "#222",
  },
});
