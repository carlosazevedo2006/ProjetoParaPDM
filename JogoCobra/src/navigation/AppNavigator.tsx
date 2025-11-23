// src/navigation/AppNavigator.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Game from "../components/Game";
import DificuldadeScreen from "../screens/DificuldadeScreen";
import PersonalizadoScreen from "../screens/PersonalizadoScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Dificuldades"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Dificuldades" component={DificuldadeScreen} />
        <Stack.Screen name="Personalizado" component={PersonalizadoScreen} />
        <Stack.Screen name="Game" component={Game} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
