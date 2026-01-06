# Screen Flow Visual Documentation

This document describes the visual appearance and layout of all new screens in the opening interface flow.

## 1. StartScreen (Entry Point)

```
┌──────────────────────────────────────┐
│ ┌──────────────────────────────────┐ │
│ │         (safe area)              │ │
│ │  ❓ Ajuda      [blank]  [blank]  │ │  ← TopBar
│ └──────────────────────────────────┘ │
│                                      │
│                                      │
│         ⚓ Batalha Naval ⚓           │  ← Title (42px, blue)
│            Bem-vindo!                │  ← Subtitle (20px)
│                                      │
│                                      │
│  ┌────────────────────────────────┐ │
│  │       🎮 Jogar                 │ │  ← Play button
│  └────────────────────────────────┘ │
│                                      │
│  ┌────────────────────────────────┐ │
│  │       ⚙️ Definições            │ │  ← Settings button
│  └────────────────────────────────┘ │
│                                      │
│  ┌────────────────────────────────┐ │
│  │       🚪 Sair                  │ │  ← Exit button (red)
│  └────────────────────────────────┘ │
│                                      │
└──────────────────────────────────────┘
```

**Colors:**
- Background: `#1a1a2e` (dark blue-gray)
- Title: `#4da6ff` (bright blue)
- Buttons: `#4da6ff` (blue), Exit: `#d9534f` (red)
- Text: `#fff` (white)

**Navigation:**
- Jogar → PlayMenuScreen
- Definições → SettingsScreen
- Sair → Confirmation dialog → BackHandler.exitApp()

---

## 2. PlayMenuScreen (Mode Selection)

```
┌──────────────────────────────────────┐
│ ┌──────────────────────────────────┐ │
│ │  ← Voltar   ❓ Ajuda   [blank]  │ │  ← TopBar with back
│ └──────────────────────────────────┘ │
│                                      │
│                                      │
│      Escolha o Modo de Jogo          │  ← Title (32px)
│    Selecione como deseja jogar       │  ← Subtitle (16px)
│                                      │
│                                      │
│  ┌────────────────────────────────┐ │
│  │           📱                   │ │
│  │          Local                 │ │  ← Local mode button
│  │    Mesmo dispositivo           │ │
│  └────────────────────────────────┘ │
│                                      │
│  ┌────────────────────────────────┐ │
│  │           🌐                   │ │
│  │       Multiplayer              │ │  ← Multiplayer button
│  │       Mesma WLAN               │ │
│  └────────────────────────────────┘ │
│                                      │
└──────────────────────────────────────┘
```

**Colors:**
- Background: `#1a1a2e`
- Buttons: `#16213e` with `#4da6ff` border
- Button text: `#4da6ff` (title), `#e0e0e0` (description)
- Icons: 48px emoji

**Navigation:**
- Voltar → StartScreen
- Local → LobbyScreen (serverUrl not set)
- Multiplayer → MultiplayerConnectScreen

---

## 3. MultiplayerConnectScreen

```
┌──────────────────────────────────────┐
│ ┌──────────────────────────────────┐ │
│ │  ← Voltar   ❓ Ajuda   [blank]  │ │  ← TopBar
│ └──────────────────────────────────┘ │
│                                      │
│         🌐 Multiplayer               │  ← Title (36px)
│       Conectar ao Servidor           │  ← Subtitle (18px)
│                                      │
│  ┌────────────────────────────────┐ │
│  │ URL do Servidor WebSocket:     │ │
│  │ Exemplo: ws://192.168.1.100    │ │
│  │                                │ │
│  │ [ws://192.168.1.100:3000]      │ │  ← Input field
│  │                                │ │
│  │  ┌──────────────────────────┐  │ │
│  │  │   🔌 Conectar            │  │ │  ← Connect button
│  │  └──────────────────────────┘  │ │
│  │                                │ │
│  │  ────────── ou ──────────      │ │
│  │                                │ │
│  │  ┌──────────────────────────┐  │ │
│  │  │ Já estou ligado —        │  │ │  ← Skip button
│  │  │ Ir para Lobby            │  │ │
│  │  └──────────────────────────┘  │ │
│  └────────────────────────────────┘ │
│                                      │
│  ┌────────────────────────────────┐ │
│  │ ℹ️ Informação                  │ │
│  │ • Ambos na mesma WiFi          │ │  ← Info box
│  │ • Servidor em execução         │ │
│  │ • Use IP local do servidor     │ │
│  └────────────────────────────────┘ │
└──────────────────────────────────────┘
```

**Colors:**
- Background: `#1a1a2e`
- Form box: `#16213e`
- Input: `#0f3460` with `#4da6ff` border
- Primary button: `#4da6ff`
- Secondary button: `#0f3460` with border
- Info box: `#16213e` with `#4da6ff` border

**Features:**
- URL validation (ws:// or wss://)
- Loading spinner on connect
- Error alerts on connection failure
- Success alert with navigation option

**Navigation:**
- Voltar → PlayMenuScreen
- Conectar (success) → LobbyScreen
- Já estou ligado → LobbyScreen

---

## 4. SettingsScreen

```
┌──────────────────────────────────────┐
│ ┌──────────────────────────────────┐ │
│ │  ← Voltar   ❓ Ajuda   [blank]  │ │  ← TopBar
│ └──────────────────────────────────┘ │
│                                      │
│         ⚙️ Definições                │  ← Title (36px)
│                                      │
│  ┌────────────────────────────────┐ │
│  │ Preferências                   │ │
│  │                                │ │
│  │ Vibração                 [ON]  │ │  ← Toggle switch
│  │ Ativar feedback vibratório     │ │
│  └────────────────────────────────┘ │
│                                      │
│  ┌────────────────────────────────┐ │
│  │ Estatísticas                   │ │
│  │                                │ │
│  │ Jogos Jogados            —     │ │
│  │ Vitórias                 —     │ │
│  │ Derrotas                 —     │ │  ← Stats placeholders
│  │ Taxa de Vitória          —     │ │
│  │                                │ │
│  │ ℹ️ As estatísticas serão       │ │
│  │    implementadas futuramente   │ │
│  └────────────────────────────────┘ │
│                                      │
│  ┌────────────────────────────────┐ │
│  │         Fechar                 │ │  ← Close button
│  └────────────────────────────────┘ │
└──────────────────────────────────────┘
```

**Colors:**
- Background: `#1a1a2e`
- Section boxes: `#16213e` with `#4da6ff` border
- Section titles: `#4da6ff`
- Stats labels: `#e0e0e0`
- Stats values: `#4da6ff` (or `—` for placeholders)
- Toggle: `#4da6ff` when ON, gray when OFF

**Features:**
- Vibration toggle persists via AsyncStorage
- Statistics show placeholders with future note
- Scrollable content

**Navigation:**
- Voltar/Fechar → StartScreen

---

## 5. LobbyScreen (Updated)

```
┌──────────────────────────────────────┐
│ ┌──────────────────────────────────┐ │
│ │  ← Voltar   ❓ Ajuda   Local    │ │  ← TopBar (mode shown)
│ └──────────────────────────────────┘ │
│                                      │
│        ⚓ Batalha Naval ⚓             │  ← Title (36px)
│              Local                   │  ← Mode (18px)
│                                      │
│  ┌────────────────────────────────┐ │
│  │ Nome do Jogador 1:             │ │
│  │ [Jogador 1____________]        │ │  ← Input 1
│  │                                │ │
│  │ Nome do Jogador 2:             │ │
│  │ [Jogador 2____________]        │ │  ← Input 2
│  │                                │ │
│  │  ┌──────────────────────────┐  │ │
│  │  │    Iniciar Jogo          │  │ │  ← Start button
│  │  └──────────────────────────┘  │ │
│  └────────────────────────────────┘ │
│                                      │
└──────────────────────────────────────┘
```

**Updates:**
- Back button added (returns to PlayMenu or Connect)
- Mode text shows "Local" or "Multiplayer"
- Otherwise identical to previous version

**Navigation:**
- Voltar → PlayMenuScreen (if local) or MultiplayerConnectScreen (if multiplayer)
- Iniciar Jogo → SetupScreen

---

## Complete Navigation Map

```
                    StartScreen
                         |
        ┌────────────────┼────────────────┐
        |                |                |
   PlayMenuScreen   SettingsScreen      Exit
        |                |                |
    ┌───┴───┐           Back          Confirm
    |       |            ↓              ↓
  Local   Multi      StartScreen     Close App
    |       |
    |   MultiplayerConnectScreen
    |       |
    └───┬───┘
        ↓
   LobbyScreen
        |
   SetupScreen
        |
   GameScreen
        |
   ResultScreen
        |
     (reset)
        ↓
   StartScreen
```

## Safe Area Handling

All screens use TopBar component which:
- Uses `useSafeAreaInsets()` from react-native-safe-area-context
- Adds `paddingTop: insets.top + 10` to container
- Ensures content doesn't overlap with:
  - Status bar
  - Notches
  - Home indicators
  - Any system UI

## Responsive Layout

All screens:
- Use flexbox for layout
- Scale properly on different screen sizes
- Have proper spacing and padding
- Maintain aspect ratios
- Use ScrollView where needed (SettingsScreen)

## Accessibility

- All buttons have clear text labels
- Sufficient touch target sizes (minimum 44x44 dp)
- High contrast colors for readability
- Consistent navigation patterns
- Clear visual hierarchy

## Theme Consistency

All screens maintain the existing dark theme:
- **Primary background**: `#1a1a2e`
- **Secondary background**: `#16213e`
- **Input background**: `#0f3460`
- **Accent color**: `#4da6ff`
- **Text primary**: `#fff`
- **Text secondary**: `#e0e0e0`
- **Borders**: `#4da6ff`
- **Destructive**: `#d9534f`

This creates a cohesive, professional appearance throughout the app.
