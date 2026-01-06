# Post-Merge Instructions

## After Merging This PR

This PR changes React versions from 19.x to 18.2.0 to be compatible with React Native 0.76.9 and Expo SDK 54. Follow these steps after merging to ensure a clean installation:

### For All Operating Systems

1. **Remove old dependencies:**
   ```bash
   cd batalha-naval
   rm -rf node_modules
   rm package-lock.json
   ```

2. **Clean npm cache:**
   ```bash
   npm cache clean --force
   ```

3. **Install dependencies using Expo:**
   ```bash
   npx expo install
   ```

4. **Start the app with clean cache:**
   ```bash
   npx expo start -c
   ```

### Windows-Specific Instructions

If you encounter persistent cache issues on Windows, also delete the npm cache directory:

1. **Delete Windows npm cache:**
   ```cmd
   rmdir /s /q %LOCALAPPDATA%\npm-cache
   ```

2. **Then retry installation:**
   ```bash
   npm cache clean --force
   npx expo install
   npx expo start -c
   ```

## What Changed

### Dependencies
- **React:** 19.2.3 → 18.2.0
- **React-DOM:** 19.2.3 → 18.2.0
- **React Native:** 0.76.x → 0.76.9 (pinned)
- **@types/react:** ~19.1.0 → ~18.2.0
- **Added:** package.json overrides for react and react-dom

### New Features
- Opening interface with Start screen
- Mode selection (Local / Multiplayer)
- Settings screen with vibration toggle
- Multiplayer connection screen
- Safe-area handling for all screens

## Verification

After installation, verify everything works:

1. **Check installation:**
   ```bash
   npm list react react-dom react-native
   ```
   
   Should show:
   - react@18.2.0
   - react-dom@18.2.0
   - react-native@0.76.9

2. **Check TypeScript:**
   ```bash
   npx tsc --noEmit
   ```
   
   Should complete with no errors.

3. **Run the app:**
   ```bash
   npx expo start
   ```
   
   Should start without dependency errors.

## Navigation Flow

The app now follows this flow:

```
Start Screen
  ├── Jogar → Play Menu
  │   ├── Local → Lobby → Setup → Game → Result
  │   └── Multiplayer → Connect → Lobby → Setup → Game → Result
  ├── Definições → Settings
  └── Sair → Exit App
```

## Troubleshooting

### Still getting ERESOLVE errors?

Try these steps:
1. Delete `node_modules` and `package-lock.json` again
2. Clear npm cache: `npm cache clean --force`
3. On Windows, delete: `%LOCALAPPDATA%\npm-cache`
4. Install with legacy peer deps: `npm install --legacy-peer-deps`
5. If that works, try `npx expo install` afterwards

### Expo Go not connecting?

1. Make sure your computer and phone are on the same WiFi network
2. Try: `npx expo start --tunnel` for alternative connection method
3. Check firewall settings aren't blocking the connection

### Build errors?

1. Make sure you're using Node.js version 18.x or higher
2. Clear Metro bundler cache: `npx expo start -c`
3. Restart your development environment

## Questions?

If you encounter any issues after following these instructions, please:
1. Check the error message carefully
2. Verify all steps were followed in order
3. Check that React versions are correct: `npm list react`
4. Open an issue with the complete error message
