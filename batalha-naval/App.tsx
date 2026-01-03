import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GameProvider, useGameContext } from './src/context/GameContext';
import { LobbyScreen } from './src/screens/LobbyScreen';
import { SetupScreen } from './src/screens/SetupScreen';
import { GameScreen } from './src/screens/GameScreen';
import { ResultScreen } from './src/screens/ResultScreen';
import { GamePhase } from './src/models/GameState';

function Root() {
  const { gameState } = useGameContext();

  const renderScreen = () => {
    switch (gameState.phase as GamePhase) {
      case 'lobby':
        return <LobbyScreen />;
      case 'setup':
        return <SetupScreen />;
      case 'playing':
        return <GameScreen />;
      case 'finished':
        return <ResultScreen onRestart={() => {}} />;
      default:
        return <LobbyScreen />;
    }
  };

  return (
    <View style={styles.container}>
      {renderScreen()}
      <StatusBar style="light" />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <GameProvider>
        <Root />
      </GameProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
});