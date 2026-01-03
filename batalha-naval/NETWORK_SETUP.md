# 🌐 WLAN Multiplayer Setup Guide

## Overview

The Batalha Naval app now supports **WLAN (WiFi) multiplayer** allowing two players on different devices connected to the same network to play against each other. The implementation uses WebSocket for real-time communication with **zero UI changes** - the same lobby, setup, and game screens work for both local and network play.

## How It Works

### Automatic Room Pairing

When two players enter **the same two names** (in any order) in the Lobby screen, they automatically join the same game room:

- **Player 1** enters: "Alice" and "Bob"
- **Player 2** enters: "Bob" and "Alice"
- Result: Both join room `room_alice_bob_<salt>`

The room ID is deterministic (derived from sorted names + salt), so no manual room codes are needed!

### Game Flow

1. **Lobby**: Both players enter the same two names → press "Iniciar Jogo"
2. **Setup**: Each player's ships are automatically placed (no manual placement needed)
3. **Game**: Players take turns firing at each other's boards
4. **Result**: Winner is displayed, then both can start a new game

## Server Setup

### Prerequisites

- Node.js 14+ installed
- Both devices on the same WiFi network
- Basic command line knowledge

### Step 1: Create WebSocket Server

Create a new directory for the server:

```bash
mkdir batalha-naval-server
cd batalha-naval-server
npm init -y
npm install ws
```

Create `server.js`:

```javascript
const WebSocket = require('ws');

const PORT = 8080;
const wss = new WebSocket.Server({ port: PORT });

// Room storage: roomId -> { players: [ws1, ws2], gameState: {...} }
const rooms = new Map();

wss.on('connection', (ws) => {
  console.log('New client connected');
  
  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data);
      handleMessage(ws, msg);
    } catch (err) {
      console.error('Invalid message:', err);
    }
  });
  
  ws.on('close', () => {
    console.log('Client disconnected');
    // Clean up rooms
    for (const [roomId, room] of rooms.entries()) {
      room.players = room.players.filter(p => p !== ws);
      if (room.players.length === 0) {
        rooms.delete(roomId);
      }
    }
  });
});

function handleMessage(ws, msg) {
  const { type, payload } = msg;
  
  switch (type) {
    case 'JOIN_ROOM':
      handleJoinRoom(ws, payload);
      break;
    case 'PLAYER_READY':
      handlePlayerReady(ws, payload);
      break;
    case 'FIRE':
      handleFire(ws, payload);
      break;
    case 'RESET':
      handleReset(ws, payload);
      break;
    default:
      console.log('Unknown message type:', type);
  }
}

function handleJoinRoom(ws, payload) {
  const { roomId, playerId, playerName } = payload;
  
  if (!rooms.has(roomId)) {
    rooms.set(roomId, { players: [], gameState: null });
  }
  
  const room = rooms.get(roomId);
  
  if (!room.players.includes(ws)) {
    room.players.push(ws);
  }
  
  console.log(`Player ${playerName} joined room ${roomId} (${room.players.length}/2)`);
  
  // Notify all players in room
  broadcast(roomId, 'ROOM_UPDATE', {
    playerCount: room.players.length,
    message: `${playerName} joined`,
  });
}

function handlePlayerReady(ws, payload) {
  const { roomId } = payload;
  const room = rooms.get(roomId);
  
  if (room) {
    broadcast(roomId, 'PLAYER_READY_UPDATE', payload);
  }
}

function handleFire(ws, payload) {
  const { roomId, attackerId, targetRow, targetCol } = payload;
  const room = rooms.get(roomId);
  
  if (room) {
    // Broadcast the fire action to all players
    broadcast(roomId, 'FIRE_UPDATE', {
      attackerId,
      targetRow,
      targetCol,
    });
  }
}

function handleReset(ws, payload) {
  const { roomId } = payload;
  broadcast(roomId, 'GAME_RESET', {});
}

function broadcast(roomId, type, payload) {
  const room = rooms.get(roomId);
  if (room) {
    const message = JSON.stringify({ type, payload });
    room.players.forEach(player => {
      if (player.readyState === WebSocket.OPEN) {
        player.send(message);
      }
    });
  }
}

console.log(`WebSocket server running on port ${PORT}`);
console.log(`Clients should connect to: ws://<YOUR_IP>:${PORT}`);
```

### Step 2: Start the Server

```bash
node server.js
```

You should see:
```
WebSocket server running on port 8080
Clients should connect to: ws://<YOUR_IP>:8080
```

### Step 3: Find Your Server IP

**On Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" under your WiFi adapter (e.g., 192.168.1.100)

**On Mac/Linux:**
```bash
ifconfig
```
or
```bash
ip addr show
```
Look for your WiFi interface IP (e.g., 192.168.1.100)

## Client Configuration

### Update app.json

Edit `/batalha-naval/app.json` and set the `serverUrl` in the `extra` section:

```json
{
  "expo": {
    "name": "batalha-naval",
    ...
    "extra": {
      "serverUrl": "ws://192.168.1.100:8080",
      "roomSalt": "batalha-naval-2026"
    }
  }
}
```

**Important:**
- Replace `192.168.1.100` with your server's actual IP address
- Keep `roomSalt` the same on all devices
- Leave `serverUrl` as empty string (`""`) to play locally without network

### Run the App

```bash
cd batalha-naval
npm start
```

Then open on two devices using Expo Go or development build.

## Playing Multiplayer

### Device 1:
1. Open the app
2. Enter: Player 1 = "Alice", Player 2 = "Bob"
3. Press "Iniciar Jogo"
4. Ships auto-placed → Press "Iniciar Jogo" again
5. Wait for Device 2

### Device 2:
1. Open the app
2. Enter: Player 1 = "Bob", Player 2 = "Alice" (same names, any order!)
3. Press "Iniciar Jogo"
4. Ships auto-placed → Press "Iniciar Jogo" again
5. Game starts!

Both devices will now be synchronized. When one player fires, the other sees the result!

## Network Protocol

### Messages from Client to Server

**JOIN_ROOM**
```json
{
  "type": "JOIN_ROOM",
  "payload": {
    "roomId": "room_alice_bob_salt",
    "playerId": "p_abc123",
    "playerName": "Alice"
  }
}
```

**PLAYER_READY**
```json
{
  "type": "PLAYER_READY",
  "payload": {
    "playerId": "p_abc123",
    "roomId": "room_alice_bob_salt"
  }
}
```

**FIRE**
```json
{
  "type": "FIRE",
  "payload": {
    "roomId": "room_alice_bob_salt",
    "attackerId": "p_abc123",
    "targetRow": 3,
    "targetCol": 5
  }
}
```

**RESET**
```json
{
  "type": "RESET",
  "payload": {
    "roomId": "room_alice_bob_salt"
  }
}
```

### Messages from Server to Client

**SERVER_STATE** (complete game state sync)
```json
{
  "type": "SERVER_STATE",
  "payload": {
    "players": [...],
    "currentTurnPlayerId": "p_abc123",
    "phase": "playing",
    "selfId": "p_abc123",
    "roomId": "room_alice_bob_salt"
  }
}
```

**ROOM_UPDATE**
```json
{
  "type": "ROOM_UPDATE",
  "payload": {
    "playerCount": 2,
    "message": "Alice joined"
  }
}
```

## Troubleshooting

### Players Can't Connect

**Problem:** "Failed to connect to server"

**Solutions:**
1. Verify both devices are on the **same WiFi network**
2. Check firewall settings - allow port 8080
3. Ensure server is running: `node server.js`
4. Verify IP address in `app.json` is correct
5. Try `ws://` not `wss://` (unless you've set up SSL)

### Players Join Different Rooms

**Problem:** Same names but different rooms

**Solutions:**
1. Check `roomSalt` is **identical** in `app.json` on both devices
2. Names are case-insensitive but check for typos
3. Restart both apps after changing `app.json`

### Game Desyncs

**Problem:** Board states don't match between devices

**Solutions:**
1. The current implementation relies on local state + server broadcasts
2. For production, implement SERVER_STATE broadcasts from server
3. Server should maintain authoritative game state and send full updates

### Local Mode Not Working

**Problem:** Want to play locally but getting errors

**Solution:**
Set `serverUrl` to empty string in `app.json`:
```json
"extra": {
  "serverUrl": "",
  "roomSalt": "batalha-naval-2026"
}
```

## Advanced: Production Deployment

For production use, consider:

1. **Use WSS (Secure WebSocket)**
   - Get SSL certificate
   - Use `wss://` instead of `ws://`

2. **Deploy Server to Cloud**
   - Heroku, AWS, DigitalOcean, etc.
   - Use environment variables for configuration

3. **Add Authentication**
   - Verify player identities
   - Prevent room hijacking

4. **Implement Server Authority**
   - Server validates all moves
   - Server maintains game state
   - Clients just render server state

5. **Add Reconnection Logic**
   - Save game state on server
   - Allow players to reconnect after disconnect

## Architecture Notes

### Client-Side (React Native)

- `src/services/network.ts` - WebSocket client wrapper
- `src/context/GameContext.tsx` - Main game logic with network integration
- `src/models/GameState.ts` - Game state with optional `selfId` and `roomId`

### Design Decisions

1. **No UI Changes** - All existing screens work unchanged
2. **Auto Ship Placement** - Avoids need for placement UI sync
3. **Deterministic Rooms** - Name-based room IDs eliminate manual codes
4. **Local-First** - Works perfectly offline when `serverUrl` is empty
5. **Expo Go Compatible** - No native modules required

## Testing Checklist

- [ ] Server starts without errors
- [ ] Device 1 can connect to server
- [ ] Device 2 can connect to server
- [ ] Both devices join same room with same names
- [ ] Ships auto-place on both devices
- [ ] Game starts when both ready
- [ ] Turns alternate correctly
- [ ] Firing updates both boards
- [ ] Game ends when fleet is destroyed
- [ ] Reset works for new game
- [ ] Local mode works with serverUrl=""

## Support

For issues or questions:
1. Check server console for errors
2. Check device console (Expo DevTools)
3. Verify network connectivity
4. Review the protocol messages being sent

---

**Note:** This is a basic implementation suitable for LAN play. For production over the internet, implement server-side game state management, validation, and security measures.
