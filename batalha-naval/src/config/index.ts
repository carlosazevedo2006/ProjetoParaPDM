/**
 * Configuration for the Batalha Naval app
 */

// Default server URL
// In production, this should be updated or configured via environment variables
export const DEFAULT_SERVER_URL = 'ws://192.168.1.100:3000';

// Can be overridden by environment variables
export const getServerUrl = (): string => {
  // Check for environment variable (if using expo-constants with extra config)
  if (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_SERVER_URL) {
    return process.env.EXPO_PUBLIC_SERVER_URL;
  }
  
  return DEFAULT_SERVER_URL;
};

// Room code configuration
export const ROOM_CODE_LENGTH = 6;
export const ROOM_CODE_REGEX = /^[A-Z0-9]{6}$/;

// Connection timeouts
export const CONNECTION_TIMEOUT = 10000; // 10 seconds
export const RECONNECT_DELAY = 2000; // 2 seconds
export const MAX_RECONNECT_ATTEMPTS = 5;
