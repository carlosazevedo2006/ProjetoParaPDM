import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GameProvider, useGameContext } from './src/context/GameContext';
import { StartScreen } from './src/screens/StartScreen';
import { PlayMenuScreen } from './src/screens/PlayMenuScreen';
import { MultiplayerConnectScreen } from './src/screens/MultiplayerConnectScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { LobbyScreen } from './src/screens/LobbyScreen';
import { SetupScreen } from './src/screens/SetupScreen';
import { GameScreen } from './src/screens/GameScreen';
import { ResultScreen } from './src/screens/ResultScreen';
import { GamePhase } from './src/models/GameState';

function Root() {
  const { gameState } = useGameContext();

  const renderScreen = () => {
    switch (gameState.phase as GamePhase) {
      case 'start':
        return <StartScreen />;
      case 'playMenu':
        return <PlayMenuScreen />;
      case 'connect':
        return <MultiplayerConnectScreen />;
      case 'settings':
        return <SettingsScreen />;
      case 'lobby':
        return <LobbyScreen />;
      case 'setup':
        return <SetupScreen />;
      case 'playing':
        return <GameScreen />;
      case 'finished':
        return <ResultScreen onRestart={() => {}} />;
      default:
        return <StartScreen />;
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