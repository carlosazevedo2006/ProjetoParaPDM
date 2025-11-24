// App.tsx
// Adiciona menu inicial para escolher o modo de jogo

import React, { useState } from "react";
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import Game from "./src/components/Game";

export default function App() {
  // modo é null --> mostra menu
  // modo é "FACIL" | "MEDIO" | "DIFICIL" --> entra no jogo
  const [modo, setModo] = useState<"FACIL" | "MEDIO" | "DIFICIL" | null>(null);

  // Se o modo ainda não foi escolhido, mostrar menu
  if (modo === null) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.titulo}>JOGO DA COBRA</Text>

        {/* Botão Modo Fácil */}
        <TouchableOpacity style={styles.botao} onPress={() => setModo("FACIL")}>
          <Text style={styles.botaoTexto}>Modo Fácil</Text>
        </TouchableOpacity>

        {/* Botão Modo Médio */}
        <TouchableOpacity style={styles.botao} onPress={() => setModo("MEDIO")}>
          <Text style={styles.botaoTexto}>Modo Médio</Text>
        </TouchableOpacity>

        {/* Botão Modo Difícil */}
        <TouchableOpacity style={styles.botao} onPress={() => setModo("DIFICIL")}>
          <Text style={styles.botaoTexto}>Modo Difícil</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Quando o modo está selecionado, iniciar o jogo
  return (
    <SafeAreaView style={styles.container}>
      <Game modo={modo} voltarMenu={() => setModo(null)} />
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
