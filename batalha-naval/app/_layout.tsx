import React from 'react';
import { Slot } from 'expo-router';
import { GameProvider } from '../src/context/GameContext';

export default function Layout() {
  return (
    <GameProvider>
      <Slot />
    </GameProvider>
  );
}
