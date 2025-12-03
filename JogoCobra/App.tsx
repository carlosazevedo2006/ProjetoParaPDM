// App.tsx
// Adiciona menu inicial para escolher o modo de jogo

import React, { useState } from "react";
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import Game from "./src/screens/Game";

export default function App() {
  // modo é null --> mostra menu
  // modo é "FACIL" | "MEDIO" | "DIFICIL" --> entra no jogo
  

  // Se o modo ainda não foi escolhido, mostrar menu
  
  // Quando o modo está selecionado, iniciar o jogo
  return (
    <SafeAreaView style={styles.container}>
      <Game/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    alignItems: "center",
    justifyContent: "center",
  },
  titulo: {
    color: "white",
    fontSize: 32,
    marginBottom: 40,
    fontWeight: "bold",
  },
  botao: {
    backgroundColor: "#1f1f1f",
    padding: 20,
    borderRadius: 12,
    marginVertical: 10,
    width: 220,
    alignItems: "center",
  },
  botaoTexto: {
    color: "white",
    fontSize: 20,
  },
});
