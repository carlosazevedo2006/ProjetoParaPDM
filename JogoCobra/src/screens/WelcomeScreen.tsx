import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function WelcomeScreen() {
  const nav = useNavigation();
  return (
    <View style={styles.root}>
      <Text style={styles.title}>🐍 SNAKE GAME</Text>
      <Text style={styles.subtitle}>Deslize para controlar a cobra</Text>
      <TouchableOpacity style={styles.btn} onPress={() => nav.navigate("Game")}>
        <Text style={styles.btnText}>JOGAR</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#111", justifyContent: "center", alignItems: "center" },
  title: { color: "#fff", fontSize: 36, fontWeight: "700", marginBottom: 10 },
  subtitle: { color: "#aaa", fontSize: 16, marginBottom: 40 },
  btn: { padding: 20, backgroundColor: "#43a047", borderRadius: 10 },
  btnText: { color: "#fff", fontSize: 20, fontWeight: "700" },
});