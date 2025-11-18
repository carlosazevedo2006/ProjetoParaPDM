import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "HIGHSCORE";

export async function getBestScore(): Promise<number> {
  const value = await AsyncStorage.getItem(KEY);
  return value ? Number(value) : 0;
}

export async function saveBestScore(score: number) {
  await AsyncStorage.setItem(KEY, String(score));
}
