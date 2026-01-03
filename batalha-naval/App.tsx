import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView } from 'react-native';
import { useState } from 'react';
import { GameProvider } from './src/context/GameContext';
import { LobbyScreen } from './src/screens/LobbyScreen';
import { SetupScreen } from './src/screens/SetupScreen';
import { GameScreen } from './src/screens/GameScreen';
import { ResultScreen } from './src/screens/ResultScreen';
import { GamePhase } from './src/models/GameState';

export default function App() {
  const [currentPhase, setCurrentPhase] = useState<GamePhase>('lobby');

  const renderScreen = () => {
    switch (currentPhase) {
      case 'lobby':
        return <LobbyScreen onStart={() => setCurrentPhase('setup')} />;
      case 'setup':
        return <SetupScreen onReady={() => setCurrentPhase('playing')} />;
      case 'playing':
        return <GameScreen onGameEnd={() => setCurrentPhase('finished')} />;
      case 'finished':
        return <ResultScreen onRestart={() => setCurrentPhase('lobby')} />;
      default:
        return <LobbyScreen onStart={() => setCurrentPhase('setup')} />;
    }
  };

  return (
    <GameProvider>
      <SafeAreaView style={styles.container}>
        {renderScreen()}
        <StatusBar style="auto" />
      </SafeAreaView>
    </GameProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
});
