// src/screens/GameOverScreen.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function GameOverScreen({
  pontos,
  melhor,
  onRestart,
  onMenu,
}: {
  pontos: number;
  melhor: number;
  onRestart: () => void;
  onMenu: () => void;
}) {
  return (
    <View style={styles.root}>
      <Text style={styles.title}>GAME OVER</Text>

      <View style={styles.box}>
        <Text style={styles.info}>PONTOS: {pontos}</Text>
        <Text style={styles.info}>RECORDE: {melhor}</Text>
      </View>

      <TouchableOpacity style={styles.btn} onPress={onRestart}>
        <Text style={styles.btnText}>REINICIAR</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={onMenu}>
        <Text style={styles.btnText}>MENU</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  title: {
    color: "#00ff66",
    fontSize: 56,
    fontFamily: "VT323_400Regular",
    marginBottom: 40,
    letterSpacing: 4,
  },

  box: {
    borderWidth: 4,
    borderColor: "#00ff66",
    padding: 20,
    width: 240,
    alignItems: "center",
    marginBottom: 40,
  },

  info: {
    color: "#00ff66",
    fontSize: 28,
    fontFamily: "VT323_400Regular",
    marginVertical: 5,
    letterSpacing: 2,
  },

  btn: {
    width: 200,
    backgroundColor: "#00ff66",
    paddingVertical: 14,
    marginVertical: 10,
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#00ff66",
  },

  btnText: {
    color: "#000",
    fontSize: 28,
    fontFamily: "VT323_400Regular",
    letterSpacing: 2,
  },
});
