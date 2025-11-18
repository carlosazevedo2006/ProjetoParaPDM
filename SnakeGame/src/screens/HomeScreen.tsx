import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function HomeScreen({ navigation }: any) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#111",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ color: "white", fontSize: 36, marginBottom: 40 }}>
        SNAKE
      </Text>

      <TouchableOpacity
        onPress={() => navigation.navigate("Game")}
        style={{
          backgroundColor: "#2ecc71",
          padding: 15,
          paddingHorizontal: 40,
          borderRadius: 10,
        }}
      >
        <Text style={{ color: "white", fontSize: 22 }}>Jogar</Text>
      </TouchableOpacity>
    </View>
  );
}
