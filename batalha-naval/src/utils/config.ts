import Constants from 'expo-constants';

/**
 * Gets the server URL from app.json configuration
 * Returns undefined if not configured (offline mode)
 */
export function getServerUrl(): string | undefined {
  const extra: any =
    (Constants as any)?.expoConfig?.extra ??
    (Constants as any)?.manifest?.extra ??
    undefined;
  return extra?.serverUrl;
}

/**
 * Gets the room salt from app.json configuration
 * Returns default value if not configured
 */
export function getRoomSalt(): string {
  const extra: any =
    (Constants as any)?.expoConfig?.extra ??
    (Constants as any)?.manifest?.extra ??
    {};
  return extra?.roomSalt ?? 'bn';
}
