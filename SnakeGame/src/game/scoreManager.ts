import AsyncStorage from '@react-native-async-storage/async-storage';

export class ScoreManager {
  private static STORAGE_KEY = '@snake_high_score';

  static async loadHighScore(): Promise<number> {
    try {
      const saved = await AsyncStorage.getItem(this.STORAGE_KEY);
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  }

  static async saveHighScore(score: number): Promise<void> {
    try {
      await AsyncStorage.setItem(this.STORAGE_KEY, score.toString());
    } catch (error) {
      console.error('Erro ao guardar pontuação:', error);
    }
  }
}