import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function WelcomeScreen({ onContinue }: any) {
  return (
    <View style={styles.root}>
      <Text style={styles.title}>JOGO DA COBRA</Text>
      <Text style={styles.btnText}>Bem-vindo ao jogo clássico da cobra. Este projeto ainda se encontra em desenvolvimento, por isso haverá falhas.</Text>
      <Text style={{ color: "#00ff66", fontSize: 20, marginBottom: 60, fontFamily: "VT323_400Regular" }}>
        Toca em JOGAR para começares a tua aventura!
      </Text>
      <TouchableOpacity style={styles.btn} onPress={onContinue}>
        <Text style={styles.btnText}>JOGAR</Text>
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
// MODIFICA APENAS ESTES ESTILOS:

title: {
  fontSize: 34,        // era 48
  color: "#00ff66",
  marginBottom: 20,    // era 30
  fontFamily: "VT323_400Regular",
  letterSpacing: 2,
},

btnText: {
  color: "#00ff66",
  fontSize: 16,        // era 20
  fontFamily: "VT323_400Regular",
},


btn: {
  paddingVertical: 10,   // era 14
  paddingHorizontal: 28, // era 40
  backgroundColor: "#222",
  borderWidth: 3,
  borderColor: "#00ff66",
},
});
