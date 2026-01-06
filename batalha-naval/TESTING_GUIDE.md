# Testing Guide: Menu Inicial, Estatísticas e Botão Sair

## Overview
This document describes the new features added to the Batalha Naval app and how to test them.

## New Features

### 1. Start Screen (Menu Inicial)
- **Location**: `src/screens/StartScreen.tsx`
- **Route**: `/` (index)
- **Features**:
  - Title: "⚓ Batalha Naval ⚓"
  - Subtitle: "Bem-vindo!"
  - Three main buttons:
    1. 🎮 Jogar → navigates to Play Menu
    2. ⚙️ Definições → navigates to Settings
    3. 🚪 Sair → shows confirmation dialog and exits app

### 2. Play Menu Screen
- **Location**: `src/screens/PlayMenuScreen.tsx`
- **Route**: `/play-menu`
- **Features**:
  - Two game mode options:
    1. 🎮 Jogo Local → starts local game
    2. 🌐 Multiplayer Online → navigates to multiplayer connection
  - Back button → returns to Start Screen

### 3. Settings Screen
- **Location**: `src/screens/SettingsScreen.tsx`
- **Route**: `/settings`
- **Features**:
  - Statistics display section:
    - Jogos Jogados (Games Played)
    - Vitórias (Wins)
    - Derrotas (Losses)
    - Taxa de Vitória (Win Rate %)
  - Clear Statistics button with confirmation
  - Back button → returns to previous screen

### 4. Statistics System
- **Location**: `src/context/GameContext.tsx`, `src/types/index.ts`
- **Features**:
  - Persistent statistics using AsyncStorage
  - Statistics are tracked across app sessions
  - Automatically updated when games finish
  - Statistics interface:
    ```typescript
    interface Statistics {
      gamesPlayed: number;
      wins: number;
      losses: number;
      winRate: number; // calculated automatically
    }
    ```

### 5. Exit Button in Game
- **Location**: `src/screens/GameScreen.tsx`
- **Features**:
  - "🚪 Sair" button in top-right corner during gameplay
  - Shows confirmation dialog before exiting
  - Returns to Start Screen and resets game state

### 6. Statistics Saving in Results
- **Location**: `src/screens/ResultScreen.tsx`
- **Features**:
  - Automatically saves game result to statistics
  - Determines win/loss based on player's result
  - Updates statistics in AsyncStorage

## Navigation Flow

```
Start Screen (/)
├── Play Menu (/play-menu)
│   ├── Local Game → Setup Screen (/setup)
│   │   └── Game Screen (/game)
│   │       └── Result Screen (/result)
│   └── Multiplayer → Connect Screen (/multiplayer-connect)
│       └── Lobby Screen (/lobby)
│           └── Setup Screen (/setup)
│               └── Game Screen (/game)
│                   └── Result Screen (/result)
└── Settings (/settings)
```

## Testing Checklist

### Start Screen Tests
- [ ] App opens to Start Screen (not HomeScreen)
- [ ] Title displays correctly: "⚓ Batalha Naval ⚓"
- [ ] All three buttons are visible and styled correctly
- [ ] "Jogar" button navigates to Play Menu
- [ ] "Definições" button navigates to Settings
- [ ] "Sair" button shows confirmation dialog
- [ ] Confirming exit closes the app
- [ ] Canceling exit keeps app open

### Play Menu Tests
- [ ] Navigation from Start Screen works
- [ ] Two game mode buttons are displayed
- [ ] "Jogo Local" starts a local game and goes to Setup
- [ ] "Multiplayer Online" goes to connection screen
- [ ] "Voltar" button returns to Start Screen
- [ ] Visual style matches other screens

### Settings Screen Tests
- [ ] Navigation from Start Screen works
- [ ] Statistics section displays correctly
- [ ] All four statistics show correct values:
  - [ ] Jogos Jogados (initially 0)
  - [ ] Vitórias (initially 0)
  - [ ] Derrotas (initially 0)
  - [ ] Taxa de Vitória (initially 0%)
- [ ] "Limpar Estatísticas" button works
- [ ] Confirmation dialog appears before clearing
- [ ] Statistics reset to 0 after clearing
- [ ] Success message appears after clearing
- [ ] "Voltar" button returns to previous screen

### Statistics Persistence Tests
- [ ] Play a complete local game
- [ ] Check statistics in Settings (should update)
- [ ] Close and reopen the app
- [ ] Check statistics still show correct values
- [ ] Play another game
- [ ] Verify statistics increment correctly
- [ ] Win Rate calculates correctly (wins/total * 100)

### Game Exit Button Tests
- [ ] Start a local game
- [ ] Exit button appears in top-right corner
- [ ] Click exit button shows confirmation
- [ ] Cancel keeps game running
- [ ] Confirm exits game and returns to Start Screen
- [ ] Game state is reset after exit
- [ ] Test same flow with multiplayer game

### Result Screen Tests
- [ ] Complete a local game
- [ ] Result screen appears
- [ ] Go to Settings
- [ ] Verify statistics updated correctly:
  - [ ] Games Played +1
  - [ ] Wins or Losses +1 (depending on result)
  - [ ] Win Rate recalculated
- [ ] Return to home and play again
- [ ] Verify statistics accumulate correctly

### Visual Consistency Tests
- [ ] All new screens match existing design
- [ ] Colors are consistent:
  - Background: `#1E3A5F`
  - Primary buttons: `#4A90E2`
  - Exit/Delete buttons: `#d9534f`
  - Text colors match
- [ ] Font sizes are consistent
- [ ] Padding and spacing match existing screens
- [ ] Border radius and shadows match

### Edge Cases
- [ ] Statistics work correctly with 0 games played
- [ ] Win Rate handles division by zero (should be 0%)
- [ ] Statistics persist after app crash
- [ ] Navigation back button works on all screens
- [ ] Multiple rapid button presses don't cause issues
- [ ] Statistics update correctly for both local and multiplayer games

## Known Issues
None currently known.

## Technical Notes

### AsyncStorage Key
- Statistics are stored under the key: `'statistics'`

### Statistics Format
```json
{
  "gamesPlayed": 0,
  "wins": 0,
  "losses": 0,
  "winRate": 0
}
```

### Dependencies Added
- `@react-native-async-storage/async-storage` - for persistent storage

## Files Modified

### New Files
- `src/screens/StartScreen.tsx`
- `src/screens/PlayMenuScreen.tsx`
- `src/screens/SettingsScreen.tsx`
- `app/start.tsx`
- `app/play-menu.tsx`
- `app/settings.tsx`

### Modified Files
- `src/types/index.ts` - Added Statistics interface
- `src/context/GameContext.tsx` - Added statistics management
- `src/screens/GameScreen.tsx` - Added exit button
- `src/screens/ResultScreen.tsx` - Added statistics saving
- `app/_layout.tsx` - Added new routes
- `app/index.tsx` - Changed to StartScreen
- `package.json` - Added AsyncStorage dependency

## Running the App

```bash
# Install dependencies
npm install

# Start the development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run linter
npm run lint
```
