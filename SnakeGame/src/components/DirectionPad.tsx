import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Direction } from "../logic/gameTypes";

export default function DirectionPad({ onChange }: { onChange: (d: Direction) => void }) {
  return (
    <View
      style={{
        marginTop: 40,
        alignItems: "center",
      }}
    >
      <TouchableOpacity onPress={() => onChange("UP")}>
        <Text style={{ color: "white", fontSize: 30 }}>⬆</Text>
      </TouchableOpacity>

      <View style={{ flexDirection: "row", marginTop: 10 }}>
        <TouchableOpacity onPress={() => onChange("LEFT")}>
          <Text style={{ color: "white", fontSize: 30, marginRight: 40 }}>⬅</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onChange("RIGHT")}>
          <Text style={{ color: "white", fontSize: 30 }}>➡</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => onChange("DOWN")} style={{ marginTop: 10 }}>
        <Text style={{ color: "white", fontSize: 30 }}>⬇</Text>
      </TouchableOpacity>
    </View>
  );
}
