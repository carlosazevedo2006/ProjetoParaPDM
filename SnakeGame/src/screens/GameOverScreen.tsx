import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function GameOverScreen({ navigation, route }: any) {
  const { score } = route.params;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#111",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ color: "white", fontSize: 40, marginBottom: 20 }}>
        Game Over
      </Text>

      <Text style={{ color: "white", fontSize: 26, marginBottom: 40 }}>
        Pontuação: {score}
      </Text>

      <TouchableOpacity
        onPress={() => navigation.replace("Game")}
        style={{
          backgroundColor: "#3498db",
          padding: 15,
          paddingHorizontal: 40,
          borderRadius: 10,
          marginBottom: 20,
        }}
      >
        <Text style={{ color: "white", fontSize: 22 }}>Recomeçar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.replace("Home")}
        style={{
          backgroundColor: "#2ecc71",
          padding: 15,
          paddingHorizontal: 40,
          borderRadius: 10,
        }}
      >
        <Text style={{ color: "white", fontSize: 22 }}>Menu</Text>
      </TouchableOpacity>
    </View>
  );
}
