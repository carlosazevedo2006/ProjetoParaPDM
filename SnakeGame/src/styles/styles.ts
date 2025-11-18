import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  gameContainer: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  scoreContainer: {
    flexDirection: 'row',
    gap: 30,
  },
  scoreText: {
    fontSize: 16,
    color: 'white',
  },
  scoreValue: {
    color: '#10b981',
    fontWeight: 'bold',
  },
  highScoreValue: {
    color: '#fbbf24',
    fontWeight: 'bold',
  },
  menuContainer: {
    backgroundColor: '#1f2937',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 50,
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  menuText: {
    fontSize: 16,
    color: '#d1d5db',
    textAlign: 'center',
    marginBottom: 10,
  },
  warningText: {
    fontSize: 14,
    color: '#fbbf24',
    textAlign: 'center',
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#10b981',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 10,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  settingsButton: {
    backgroundColor: '#4b5563',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  settingsButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  gameoverContainer: {
    backgroundColor: '#1f2937',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 50,
  },
  gameoverTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ef4444',
    marginBottom: 15,
  },
  finalScore: {
    fontSize: 18,
    color: 'white',
    marginBottom: 10,
  },
  finalScoreValue: {
    color: '#10b981',
    fontWeight: 'bold',
  },
  newRecord: {
    fontSize: 18,
    color: '#fbbf24',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  restartButton: {
    backgroundColor: '#10b981',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  restartButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  pausedText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fbbf24',
    textAlign: 'center',
    marginVertical: 20,
  },
  controls: {
    alignItems: 'center',
    marginTop: 20,
  },
  controlRow: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 5,
  },
  controlButton: {
    backgroundColor: '#3b82f6',
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  controlButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  pauseButton: {
    backgroundColor: '#fbbf24',
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  pauseButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginTop: 20,
  },
  resetButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingsSmallButton: {
    backgroundColor: '#6b7280',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  settingsSmallButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  helpText: {
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 15,
    fontSize: 14,
  },
});