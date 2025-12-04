import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Modo } from "../types/types";

export default function ModeSelectionScreen({
  onSelect,
}: {
  onSelect: (modo: Modo) => void;
}) {
  return (
    <View style={styles.root}>
      <Text style={styles.title}>Selecionar Modo</Text>

      <TouchableOpacity style={styles.btn} onPress={() => onSelect("FACIL")}>
        <Text style={styles.btnText}>FÁCIL</Text>
        <Text style={styles.btnText}>Neste modo, a velocidade da cobra é mais lenta, tornando o jogo mais acessível para iniciantes.</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={() => onSelect("MEDIO")}>
        <Text style={styles.btnText}>MÉDIO</Text>
        <Text style={styles.btnText}>Este modo cada vez que comeres a cobra, ela aumenta a velocidade, proporcionando um desafio equilibrado para jogadores com alguma experiência.</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={() => onSelect("DIFICIL")}>
        <Text style={styles.btnText}>DIFÍCIL</Text>
        <Text style={styles.btnText}>Neste modo, para além de aumentar a velocidade da cobra normal cada vez que comeres, terás um inimigo a perseguir-te. Este modo encontra-se ainda em desenvolvimento, por isso não funciona por agora.</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    color: "#00ff66",
    fontSize: 48,
    marginBottom: 40,
    fontFamily: "VT323_400Regular",
    letterSpacing: 2,
  },

  btn: {
    width: 220,
    paddingVertical: 12,
    backgroundColor: "#222",
    borderColor: "#00ff66",
    borderWidth: 3,
    marginVertical: 12,
  },

  btnText: {
    color: "#00ff66",
    fontSize: 32,
    textAlign: "center",
    fontFamily: "VT323_400Regular",
    letterSpacing: 1,
  },
});
