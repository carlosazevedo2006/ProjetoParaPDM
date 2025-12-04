import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function WelcomeScreen({ onPlay, onSettings, onExit }: any) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>SNAKE</Text>
      <Text style={[styles.subtitle, { color: colors.text }]}>
        O clássico, reinventado.
      </Text>

      <View style={styles.buttons}>
        <TouchableOpacity
          onPress={onPlay}
          style={[styles.button, { backgroundColor: colors.card }]}
        >
          <Text style={[styles.buttonText, { color: colors.text }]}>Jogar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onSettings}
          style={[styles.button, { backgroundColor: colors.card }]}
        >
          <Text style={[styles.buttonText, { color: colors.text }]}>
            Definições
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onExit}
          style={[styles.buttonSecondary, { borderColor: colors.text }]}
        >
          <Text style={[styles.buttonSecondaryText, { color: colors.text }]}>
            Sair
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },

  title: {
    fontSize: 42,
    fontWeight: "700",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 16,
    opacity: 0.8,
    marginBottom: 40,
  },

  buttons: {
    width: "100%",
    gap: 18,
  },

  button: {
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: "center",
  },

  buttonText: {
    fontSize: 18,
    fontWeight: "600",
  },

  buttonSecondary: {
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: "center",
  },

  buttonSecondaryText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
