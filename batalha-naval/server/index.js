// WebSocket server for Batalha Naval multiplayer game
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

const PORT = 3000;
const BOARD_SIZE = 10;

// Room storage: Map<roomCode, RoomData>
const rooms = new Map();
// Legacy room storage for backward compatibility: Map<roomId, RoomData>
const legacyRooms = new Map();

// Function to generate random 6-character room code
function generateRoomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  // Check if code already exists (unlikely but possible)
  if (rooms.has(code)) {
    return generateRoomCode(); // Recursive until unique
  }
  return code;
}

// Cleanup empty rooms periodically
function cleanupEmptyRooms() {
  const now = Date.now();
  const timeout = 30 * 60 * 1000; // 30 minutes
  
  for (const [code, room] of rooms.entries()) {
    // Remove rooms with no players or very old rooms
    if (!room.clients || room.clients.length === 0) {
      if (now - room.createdAt > timeout) {
        console.log(`🗑️ Removing old empty room: ${code}`);
        rooms.delete(code);
      }
    }
  }
  
  // Also cleanup legacy rooms
  for (const [roomId, room] of legacyRooms.entries()) {
    if (!room.clients || room.clients.length === 0) {
      if (now - room.createdAt > timeout) {
        console.log(`🗑️ Removing old legacy room: ${roomId}`);
        legacyRooms.delete(roomId);
      }
    }
  }
}

// Run cleanup every 5 minutes
setInterval(cleanupEmptyRooms, 5 * 60 * 1000);

// Helper to create empty board
function createEmptyBoard() {
  const cells = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    cells[row] = [];
    for (let col = 0; col < BOARD_SIZE; col++) {
      cells[row][col] = {
        position: { row, col },
        status: 'empty'
      };
    }
  }
  return { cells, ships: [] };
}

// Helper to create opponent board view (hide ships)
function getOpponentBoardView(board) {
  const cells = board.cells.map(row =>
    row.map(cell => ({
      position: cell.position,
      status: cell.status === 'ship' ? 'empty' : cell.status,
      shipId: cell.status === 'hit' ? cell.shipId : undefined
    }))
  );
  return { cells, ships: [] };
}

// Process fire action
function processFire(board, position) {
  const cell = board.cells[position.row][position.col];
  
  // Can't fire at same position twice
  if (cell.status === 'hit' || cell.status === 'miss') {
    return { board, hit: false, sunk: false };
  }
  
  const hit = cell.status === 'ship';
  const newCells = board.cells.map(row => row.map(c => ({ ...c })));
  
  newCells[position.row][position.col] = {
    ...cell,
    status: hit ? 'hit' : 'miss'
  };
  
  let sunk = false;
  let shipId = cell.shipId;
  let updatedShips = board.ships;
  
  if (hit && shipId) {
    updatedShips = board.ships.map(ship => {
      if (ship.id === shipId) {
        const newHits = ship.hits + 1;
        const isSunk = newHits >= ship.size;
        return { ...ship, hits: newHits, sunk: isSunk };
      }
      return ship;
    });
    
    const hitShip = updatedShips.find(s => s.id === shipId);
    sunk = hitShip?.sunk || false;
  }
  
  return {
    board: { cells: newCells, ships: updatedShips },
    hit,
    sunk,
    shipId
  };
}

// Check if all ships are sunk
function areAllShipsSunk(board) {
  return board.ships.length > 0 && board.ships.every(ship => ship.sunk);
}

// Place ships on board
function placeShipsOnBoard(board, ships) {
  const newCells = board.cells.map(row => row.map(cell => ({ ...cell })));
  
  for (const ship of ships) {
    for (const pos of ship.positions) {
      newCells[pos.row][pos.col] = {
        position: pos,
        status: 'ship',
        shipId: ship.id
      };
    }
  }
  
  return {
    cells: newCells,
    ships: ships
  };
}

// Broadcast state to all clients in room
function broadcastGameState(room) {
  room.clients.forEach((client, index) => {
    if (client.ws.readyState === WebSocket.OPEN) {
      // Send personalized state (each player sees their own ships)
      const personalizedState = {
        ...room.gameState,
        players: room.gameState.players.map((player, i) => {
          if (i === index) {
            // Current player sees their own board
            return player;
          } else {
            // Opponent's board is hidden
            return player ? {
              ...player,
              board: getOpponentBoardView(player.board)
            } : null;
          }
        })
      };
      
      client.ws.send(JSON.stringify({
        type: 'SERVER_STATE',
        gameState: personalizedState
      }));
    }
  });
}

// Create WebSocket server
const wss = new WebSocket.Server({ port: PORT });

console.log(`🚀 Batalha Naval WebSocket server running on port ${PORT}`);
console.log(`📡 Clients can connect to ws://<your-ip>:${PORT}`);
console.log(`🎮 Room system enabled with 6-character codes`);

wss.on('connection', (ws) => {
  console.log('👤 New client connected');
  
  let currentRoom = null;
  let playerIndex = null;
  let currentRoomCode = null;
  
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      console.log('📨 Received:', message.type);
      
      switch (message.type) {
        case 'CREATE_ROOM': {
          // Generate new room code
          const code = generateRoomCode();
          currentRoomCode = code;
          
          console.log(`🏠 Creating room with code: ${code}`);
          
          const player1 = {
            id: uuidv4(),
            name: 'Player 1',
            board: createEmptyBoard(),
            opponentBoard: createEmptyBoard(),
            ready: false
          };
          
          currentRoom = {
            roomCode: code,
            clients: [{ ws, playerId: player1.id }],
            gameState: {
              roomId: code,
              roomCode: code,
              roomPlayerCount: 1,
              players: [player1, null],
              currentTurn: 0,
              phase: 'setup',
              mode: 'multiplayer'
            },
            createdAt: Date.now()
          };
          
          rooms.set(code, currentRoom);
          playerIndex = 0;
          
          // Send room code to client
          ws.send(JSON.stringify({
            type: 'ROOM_CREATED',
            payload: { code }
          }));
          
          // Send player assignment
          ws.send(JSON.stringify({
            type: 'PLAYER_ASSIGNED',
            playerId: player1.id
          }));
          
          console.log(`✅ Room ${code} created with Player 1`);
          broadcastGameState(currentRoom);
          break;
        }
        
        case 'JOIN_ROOM': {
          const { code } = message.payload || {};
          
          if (!code) {
            ws.send(JSON.stringify({
              type: 'ERROR',
              message: 'Room code is required'
            }));
            return;
          }
          
          currentRoomCode = code;
          currentRoom = rooms.get(code);
          
          if (!currentRoom) {
            console.log(`❌ Room not found: ${code}`);
            ws.send(JSON.stringify({
              type: 'ROOM_NOT_FOUND',
              payload: { code }
            }));
            return;
          }
          
          if (currentRoom.clients.length >= 2) {
            console.log(`❌ Room full: ${code}`);
            ws.send(JSON.stringify({
              type: 'ROOM_FULL',
              payload: { code }
            }));
            return;
          }
          
          // Add player 2
          const player2 = {
            id: uuidv4(),
            name: 'Player 2',
            board: createEmptyBoard(),
            opponentBoard: createEmptyBoard(),
            ready: false
          };
          
          currentRoom.clients.push({ ws, playerId: player2.id });
          currentRoom.gameState.players[1] = player2;
          currentRoom.gameState.roomPlayerCount = 2;
          playerIndex = 1;
          
          console.log(`👥 Player 2 joined room: ${code}`);
          
          // Notify player 2 they joined
          ws.send(JSON.stringify({
            type: 'ROOM_JOINED',
            payload: { code, playerCount: 2 }
          }));
          
          // Send player assignment
          ws.send(JSON.stringify({
            type: 'PLAYER_ASSIGNED',
            playerId: player2.id
          }));
          
          // Notify both players room is ready
          currentRoom.clients.forEach(client => {
            if (client.ws.readyState === WebSocket.OPEN) {
              client.ws.send(JSON.stringify({
                type: 'ROOM_READY',
                payload: { code }
              }));
            }
          });
          
          broadcastGameState(currentRoom);
          break;
        }
        
        case 'JOIN_OR_CREATE': {
          // Legacy support for old connection method
          const { roomId, playerName } = message;
          
          if (!roomId || !playerName) {
            ws.send(JSON.stringify({
              type: 'ERROR',
              message: 'roomId and playerName are required'
            }));
            return;
          }
          
          // Get or create room (legacy)
          let room = legacyRooms.get(roomId);
          
          if (!room) {
            // Create new room
            console.log(`🏠 Creating legacy room: ${roomId}`);
            
            const player1 = {
              id: uuidv4(),
              name: playerName,
              board: createEmptyBoard(),
              opponentBoard: createEmptyBoard(),
              ready: false
            };
            
            room = {
              roomId,
              clients: [{ ws, playerId: player1.id }],
              gameState: {
                roomId,
                players: [player1, null],
                currentTurn: 0,
                phase: 'setup',
                mode: 'multiplayer'
              },
              createdAt: Date.now()
            };
            
            legacyRooms.set(roomId, room);
            currentRoom = room;
            playerIndex = 0;
            
            console.log(`✅ Player 1 joined legacy room: ${roomId}`);
          } else if (room.clients.length < 2) {
            // Join existing room as player 2
            console.log(`👥 Player 2 joining legacy room: ${roomId}`);
            
            const player2 = {
              id: uuidv4(),
              name: playerName,
              board: createEmptyBoard(),
              opponentBoard: createEmptyBoard(),
              ready: false
            };
            
            room.clients.push({ ws, playerId: player2.id });
            room.gameState.players[1] = player2;
            currentRoom = room;
            playerIndex = 1;
            
            console.log(`✅ Player 2 joined legacy room: ${roomId}`);
          } else {
            ws.send(JSON.stringify({
              type: 'ERROR',
              message: 'Room is full'
            }));
            return;
          }
          
          // Send player assignment to this client
          ws.send(JSON.stringify({
            type: 'PLAYER_ASSIGNED',
            playerId: room.gameState.players[playerIndex].id
          }));
          
          broadcastGameState(room);
          break;
        }
        
        case 'PLAYER_READY': {
          if (!currentRoom || playerIndex === null) {
            ws.send(JSON.stringify({
              type: 'ERROR',
              message: 'Not in a room'
            }));
            return;
          }
          
          const { ships } = message;
          const player = currentRoom.gameState.players[playerIndex];
          
          if (!player || !ships) {
            ws.send(JSON.stringify({
              type: 'ERROR',
              message: 'Invalid ready message'
            }));
            return;
          }
          
          // Place ships on player's board
          player.board = placeShipsOnBoard(player.board, ships);
          player.ready = true;
          
          console.log(`✅ Player ${playerIndex + 1} is ready in room: ${currentRoomCode || currentRoom.roomId}`);
          
          // Check if both players are ready
          const bothReady = currentRoom.gameState.players[0]?.ready && 
                           currentRoom.gameState.players[1]?.ready;
          
          if (bothReady) {
            currentRoom.gameState.phase = 'playing';
            console.log(`🎮 Game starting in room: ${currentRoomCode || currentRoom.roomId}`);
          }
          
          broadcastGameState(currentRoom);
          break;
        }
        
        case 'FIRE': {
          if (!currentRoom || playerIndex === null) {
            ws.send(JSON.stringify({
              type: 'ERROR',
              message: 'Not in a room'
            }));
            return;
          }
          
          if (currentRoom.gameState.phase !== 'playing') {
            ws.send(JSON.stringify({
              type: 'ERROR',
              message: 'Game not in playing phase'
            }));
            return;
          }
          
          if (currentRoom.gameState.currentTurn !== playerIndex) {
            ws.send(JSON.stringify({
              type: 'ERROR',
              message: 'Not your turn'
            }));
            return;
          }
          
          const { position } = message;
          const opponentIndex = playerIndex === 0 ? 1 : 0;
          const opponent = currentRoom.gameState.players[opponentIndex];
          
          if (!opponent) {
            ws.send(JSON.stringify({
              type: 'ERROR',
              message: 'Opponent not found'
            }));
            return;
          }
          
          // Process fire
          const result = processFire(opponent.board, position);
          opponent.board = result.board;
          
          // Update current player's opponent view
          const currentPlayer = currentRoom.gameState.players[playerIndex];
          if (currentPlayer) {
            currentPlayer.opponentBoard = getOpponentBoardView(result.board);
          }
          
          console.log(`💥 Player ${playerIndex + 1} fired at (${position.row}, ${position.col}) - ${result.hit ? 'HIT' : 'MISS'}`);
          
          // Check for winner
          const allSunk = areAllShipsSunk(opponent.board);
          
          if (allSunk) {
            currentRoom.gameState.phase = 'finished';
            currentRoom.gameState.winner = playerIndex;
            console.log(`🏆 Player ${playerIndex + 1} wins in room: ${currentRoomCode || currentRoom.roomId}`);
          } else {
            // Switch turn
            currentRoom.gameState.currentTurn = opponentIndex;
          }
          
          broadcastGameState(currentRoom);
          break;
        }
        
        case 'RESET': {
          if (!currentRoom) {
            ws.send(JSON.stringify({
              type: 'ERROR',
              message: 'Not in a room'
            }));
            return;
          }
          
          // Reset game state
          currentRoom.gameState.players.forEach(player => {
            if (player) {
              player.board = createEmptyBoard();
              player.opponentBoard = createEmptyBoard();
              player.ready = false;
            }
          });
          
          currentRoom.gameState.currentTurn = 0;
          currentRoom.gameState.phase = 'setup';
          currentRoom.gameState.winner = undefined;
          
          console.log(`🔄 Game reset in room: ${currentRoomCode || currentRoom.roomId}`);
          broadcastGameState(currentRoom);
          break;
        }
        
        default:
          ws.send(JSON.stringify({
            type: 'ERROR',
            message: 'Unknown message type'
          }));
      }
    } catch (error) {
      console.error('❌ Error processing message:', error);
      ws.send(JSON.stringify({
        type: 'ERROR',
        message: 'Internal server error'
      }));
    }
  });
  
  ws.on('close', () => {
    console.log('👋 Client disconnected');
    
    if (currentRoom) {
      // Remove client from room
      const clientIndex = currentRoom.clients.findIndex(c => c.ws === ws);
      if (clientIndex !== -1) {
        currentRoom.clients.splice(clientIndex, 1);
      }
      
      const roomIdentifier = currentRoomCode || currentRoom.roomId;
      
      // If room is empty, delete it
      if (currentRoom.clients.length === 0) {
        if (currentRoomCode) {
          rooms.delete(currentRoomCode);
        } else {
          legacyRooms.delete(currentRoom.roomId);
        }
        console.log(`🗑️ Room deleted: ${roomIdentifier}`);
      } else {
        // Notify remaining clients
        currentRoom.clients.forEach(client => {
          if (client.ws.readyState === WebSocket.OPEN) {
            client.ws.send(JSON.stringify({
              type: 'PLAYER_LEFT',
              payload: { code: roomIdentifier }
            }));
            client.ws.send(JSON.stringify({
              type: 'DISCONNECT',
              message: 'Opponent disconnected'
            }));
          }
        });
      }
    }
  });
  
  ws.on('error', (error) => {
    console.error('❌ WebSocket error:', error);
  });
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  wss.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
    cells: newCells,
    ships: ships
  };
}

// Broadcast state to all clients in room
function broadcastGameState(room) {
  const message = {
    type: 'SERVER_STATE',
    gameState: room.gameState
  };
  
  room.clients.forEach((client, index) => {
    if (client.ws.readyState === WebSocket.OPEN) {
      // Send personalized state (each player sees their own ships)
      const personalizedState = {
        ...room.gameState,
        players: room.gameState.players.map((player, i) => {
          if (i === index) {
            // Current player sees their own board
            return player;
          } else {
            // Opponent's board is hidden
            return player ? {
              ...player,
              board: getOpponentBoardView(player.board)
            } : null;
          }
        })
      };
      
      client.ws.send(JSON.stringify({
        type: 'SERVER_STATE',
        gameState: personalizedState
      }));
    }
  });
}

// Create WebSocket server
const wss = new WebSocket.Server({ port: PORT });

console.log(`🚀 Batalha Naval WebSocket server running on port ${PORT}`);
console.log(`📡 Clients can connect to ws://<your-ip>:${PORT}`);

wss.on('connection', (ws) => {
  console.log('👤 New client connected');
  
  let currentRoom = null;
  let playerIndex = null;
  
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      console.log('📨 Received:', message.type);
      
      switch (message.type) {
        case 'JOIN_OR_CREATE': {
          const { roomId, playerName } = message;
          
          if (!roomId || !playerName) {
            ws.send(JSON.stringify({
              type: 'ERROR',
              message: 'roomId and playerName are required'
            }));
            return;
          }
          
          // Get or create room
          let room = rooms.get(roomId);
          
          if (!room) {
            // Create new room
            console.log(`🏠 Creating room: ${roomId}`);
            
            const player1 = {
              id: uuidv4(),
              name: playerName,
              board: createEmptyBoard(),
              opponentBoard: createEmptyBoard(),
              ready: false
            };
            
            room = {
              roomId,
              clients: [{ ws, playerId: player1.id }],
              gameState: {
                roomId,
                players: [player1, null],
                currentTurn: 0,
                phase: 'setup',
                mode: 'multiplayer'
              }
            };
            
            rooms.set(roomId, room);
            currentRoom = room;
            playerIndex = 0;
            
            console.log(`✅ Player 1 joined room: ${roomId}`);
          } else if (room.clients.length < 2) {
            // Join existing room as player 2
            console.log(`👥 Player 2 joining room: ${roomId}`);
            
            const player2 = {
              id: uuidv4(),
              name: playerName,
              board: createEmptyBoard(),
              opponentBoard: createEmptyBoard(),
              ready: false
            };
            
            room.clients.push({ ws, playerId: player2.id });
            room.gameState.players[1] = player2;
            currentRoom = room;
            playerIndex = 1;
            
            console.log(`✅ Player 2 joined room: ${roomId}`);
          } else {
            ws.send(JSON.stringify({
              type: 'ERROR',
              message: 'Room is full'
            }));
            return;
          }
          
          // Send player assignment to this client
          ws.send(JSON.stringify({
            type: 'PLAYER_ASSIGNED',
            playerId: room.gameState.players[playerIndex].id
          }));
          
          broadcastGameState(room);
          break;
        }
        
        case 'PLAYER_READY': {
          if (!currentRoom || playerIndex === null) {
            ws.send(JSON.stringify({
              type: 'ERROR',
              message: 'Not in a room'
            }));
            return;
          }
          
          const { ships } = message;
          const player = currentRoom.gameState.players[playerIndex];
          
          if (!player || !ships) {
            ws.send(JSON.stringify({
              type: 'ERROR',
              message: 'Invalid ready message'
            }));
            return;
          }
          
          // Place ships on player's board
          player.board = placeShipsOnBoard(player.board, ships);
          player.ready = true;
          
          console.log(`✅ Player ${playerIndex + 1} is ready in room: ${currentRoom.roomId}`);
          
          // Check if both players are ready
          const bothReady = currentRoom.gameState.players[0]?.ready && 
                           currentRoom.gameState.players[1]?.ready;
          
          if (bothReady) {
            currentRoom.gameState.phase = 'playing';
            console.log(`🎮 Game starting in room: ${currentRoom.roomId}`);
          }
          
          broadcastGameState(currentRoom);
          break;
        }
        
        case 'FIRE': {
          if (!currentRoom || playerIndex === null) {
            ws.send(JSON.stringify({
              type: 'ERROR',
              message: 'Not in a room'
            }));
            return;
          }
          
          if (currentRoom.gameState.phase !== 'playing') {
            ws.send(JSON.stringify({
              type: 'ERROR',
              message: 'Game not in playing phase'
            }));
            return;
          }
          
          if (currentRoom.gameState.currentTurn !== playerIndex) {
            ws.send(JSON.stringify({
              type: 'ERROR',
              message: 'Not your turn'
            }));
            return;
          }
          
          const { position } = message;
          const opponentIndex = playerIndex === 0 ? 1 : 0;
          const opponent = currentRoom.gameState.players[opponentIndex];
          
          if (!opponent) {
            ws.send(JSON.stringify({
              type: 'ERROR',
              message: 'Opponent not found'
            }));
            return;
          }
          
          // Process fire
          const result = processFire(opponent.board, position);
          opponent.board = result.board;
          
          // Update current player's opponent view
          const currentPlayer = currentRoom.gameState.players[playerIndex];
          if (currentPlayer) {
            currentPlayer.opponentBoard = getOpponentBoardView(result.board);
          }
          
          console.log(`💥 Player ${playerIndex + 1} fired at (${position.row}, ${position.col}) - ${result.hit ? 'HIT' : 'MISS'}`);
          
          // Check for winner
          const allSunk = areAllShipsSunk(opponent.board);
          
          if (allSunk) {
            currentRoom.gameState.phase = 'finished';
            currentRoom.gameState.winner = playerIndex;
            console.log(`🏆 Player ${playerIndex + 1} wins in room: ${currentRoom.roomId}`);
          } else {
            // Switch turn
            currentRoom.gameState.currentTurn = opponentIndex;
          }
          
          broadcastGameState(currentRoom);
          break;
        }
        
        case 'RESET': {
          if (!currentRoom) {
            ws.send(JSON.stringify({
              type: 'ERROR',
              message: 'Not in a room'
            }));
            return;
          }
          
          // Reset game state
          currentRoom.gameState.players.forEach(player => {
            if (player) {
              player.board = createEmptyBoard();
              player.opponentBoard = createEmptyBoard();
              player.ready = false;
            }
          });
          
          currentRoom.gameState.currentTurn = 0;
          currentRoom.gameState.phase = 'setup';
          currentRoom.gameState.winner = undefined;
          
          console.log(`🔄 Game reset in room: ${currentRoom.roomId}`);
          broadcastGameState(currentRoom);
          break;
        }
        
        default:
          ws.send(JSON.stringify({
            type: 'ERROR',
            message: 'Unknown message type'
          }));
      }
    } catch (error) {
      console.error('❌ Error processing message:', error);
      ws.send(JSON.stringify({
        type: 'ERROR',
        message: 'Internal server error'
      }));
    }
  });
  
  ws.on('close', () => {
    console.log('👋 Client disconnected');
    
    if (currentRoom) {
      // Remove client from room
      const clientIndex = currentRoom.clients.findIndex(c => c.ws === ws);
      if (clientIndex !== -1) {
        currentRoom.clients.splice(clientIndex, 1);
      }
      
      // If room is empty, delete it
      if (currentRoom.clients.length === 0) {
        rooms.delete(currentRoom.roomId);
        console.log(`🗑️ Room deleted: ${currentRoom.roomId}`);
      } else {
        // Notify remaining clients
        currentRoom.clients.forEach(client => {
          if (client.ws.readyState === WebSocket.OPEN) {
            client.ws.send(JSON.stringify({
              type: 'DISCONNECT',
              message: 'Opponent disconnected'
            }));
          }
        });
      }
    }
  });
  
  ws.on('error', (error) => {
    console.error('❌ WebSocket error:', error);
  });
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  wss.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
