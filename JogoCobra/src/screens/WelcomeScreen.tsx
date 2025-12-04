// src/screens/WelcomeScreen.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, BackHandler, Platform } from "react-native";

export default function WelcomeScreen({ onContinue }: any) {
  return (
    <View style={styles.container}>

      {/* TÍTULO */}
      <Text style={styles.title}>SNAKE PIXEL</Text>

      {/* BOTÕES */}
      <View style={styles.menuBox}>
        <TouchableOpacity style={styles.button} onPress={onContinue}>
          <Text style={styles.buttonText}>JOGAR</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => console.log("Definições (por agora)")}>
          <Text style={styles.buttonText}>DEFINIÇÕES</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.exitButton]}
          onPress={() => {
            if (Platform.OS === "android") BackHandler.exitApp();
          }}
        >
          <Text style={styles.buttonText}>SAIR</Text>
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
    fontSize: 70,
    color: "#00ff99",
    marginBottom: 60,
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

  exitButton: {
    borderColor: "#ff4d4d",
  },

  buttonText: {
    fontFamily: "VT323",
    fontSize: 32,
    color: "#fff",
    letterSpacing: 2,
  },
});
