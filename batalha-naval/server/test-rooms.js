#!/usr/bin/env node
/**
 * Test script for room-based multiplayer system
 * Tests the CREATE_ROOM and JOIN_ROOM flow
 */

const WebSocket = require('ws');

const SERVER_URL = 'ws://localhost:3000';
let testsPassed = 0;
let testsFailed = 0;

function log(emoji, message) {
  console.log(`${emoji} ${message}`);
}

function assert(condition, message) {
  if (condition) {
    testsPassed++;
    log('✅', `PASS: ${message}`);
    return true;
  } else {
    testsFailed++;
    log('❌', `FAIL: ${message}`);
    return false;
  }
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testRoomSystem() {
  log('🚀', 'Starting room system tests...\n');
  
  // Test 1: Create room
  log('📝', 'Test 1: Creating room');
  const client1 = new WebSocket(SERVER_URL);
  let roomCode = null;
  let client1Id = null;
  
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Connection timeout')), 5000);
    
    client1.on('open', () => {
      clearTimeout(timeout);
      log('🔌', 'Client 1 connected');
      
      // Send CREATE_ROOM message
      client1.send(JSON.stringify({ type: 'CREATE_ROOM' }));
    });
    
    client1.on('message', (data) => {
      const message = JSON.parse(data.toString());
      
      if (message.type === 'ROOM_CREATED') {
        roomCode = message.payload.code;
        assert(roomCode && roomCode.length === 6, 'Room code is 6 characters');
        assert(/^[A-Z0-9]{6}$/.test(roomCode), 'Room code contains only alphanumeric characters');
        log('🎮', `Room created with code: ${roomCode}`);
      } else if (message.type === 'PLAYER_ASSIGNED') {
        client1Id = message.playerId;
        assert(client1Id, 'Player 1 received ID');
        log('👤', `Player 1 ID: ${client1Id}`);
      } else if (message.type === 'SERVER_STATE') {
        assert(message.gameState.roomCode === roomCode, 'Game state contains room code');
        assert(message.gameState.roomPlayerCount === 1, 'Room has 1 player');
        log('📊', 'Received initial game state');
        resolve();
      }
    });
    
    client1.on('error', (error) => {
      clearTimeout(timeout);
      reject(error);
    });
  });
  
  await sleep(500);
  
  // Test 2: Join room
  log('\n📝', 'Test 2: Joining room');
  const client2 = new WebSocket(SERVER_URL);
  let client2Id = null;
  let roomReady = false;
  
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Connection timeout')), 5000);
    
    client2.on('open', () => {
      clearTimeout(timeout);
      log('🔌', 'Client 2 connected');
      
      // Send JOIN_ROOM message
      client2.send(JSON.stringify({ 
        type: 'JOIN_ROOM', 
        payload: { code: roomCode } 
      }));
    });
    
    let messagesReceived = 0;
    
    client2.on('message', (data) => {
      const message = JSON.parse(data.toString());
      messagesReceived++;
      
      if (message.type === 'ROOM_JOINED') {
        assert(message.payload.code === roomCode, 'Joined correct room');
        assert(message.payload.playerCount === 2, 'Room now has 2 players');
        log('🔑', `Joined room: ${message.payload.code}`);
      } else if (message.type === 'PLAYER_ASSIGNED') {
        client2Id = message.playerId;
        assert(client2Id, 'Player 2 received ID');
        assert(client2Id !== client1Id, 'Player 2 has different ID than Player 1');
        log('👤', `Player 2 ID: ${client2Id}`);
      } else if (message.type === 'ROOM_READY') {
        roomReady = true;
        assert(message.payload.code === roomCode, 'Room ready notification has correct code');
        log('✅', 'Room is ready');
      } else if (message.type === 'SERVER_STATE') {
        assert(message.gameState.roomPlayerCount === 2, 'Game state shows 2 players');
        log('📊', 'Received updated game state');
      }
      
      // Resolve after receiving all expected messages
      if (messagesReceived >= 3 && roomReady) {
        resolve();
      }
    });
    
    client2.on('error', (error) => {
      clearTimeout(timeout);
      reject(error);
    });
  });
  
  await sleep(500);
  
  // Test 3: Try to join full room
  log('\n📝', 'Test 3: Attempting to join full room');
  const client3 = new WebSocket(SERVER_URL);
  
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Connection timeout')), 5000);
    
    client3.on('open', () => {
      clearTimeout(timeout);
      log('🔌', 'Client 3 connected');
      
      // Try to join full room
      client3.send(JSON.stringify({ 
        type: 'JOIN_ROOM', 
        payload: { code: roomCode } 
      }));
    });
    
    client3.on('message', (data) => {
      const message = JSON.parse(data.toString());
      
      if (message.type === 'ROOM_FULL') {
        assert(message.payload.code === roomCode, 'Received room full error');
        log('🚫', 'Room correctly rejected 3rd player');
        client3.close();
        resolve();
      }
    });
    
    client3.on('error', (error) => {
      clearTimeout(timeout);
      reject(error);
    });
  });
  
  await sleep(500);
  
  // Test 4: Try to join non-existent room
  log('\n📝', 'Test 4: Attempting to join non-existent room');
  const client4 = new WebSocket(SERVER_URL);
  
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Connection timeout')), 5000);
    
    client4.on('open', () => {
      clearTimeout(timeout);
      log('🔌', 'Client 4 connected');
      
      // Try to join non-existent room
      client4.send(JSON.stringify({ 
        type: 'JOIN_ROOM', 
        payload: { code: 'FAKE99' } 
      }));
    });
    
    client4.on('message', (data) => {
      const message = JSON.parse(data.toString());
      
      if (message.type === 'ROOM_NOT_FOUND') {
        assert(message.payload.code === 'FAKE99', 'Received room not found error');
        log('🚫', 'Non-existent room correctly rejected');
        client4.close();
        resolve();
      }
    });
    
    client4.on('error', (error) => {
      clearTimeout(timeout);
      reject(error);
    });
  });
  
  // Cleanup
  client1.close();
  client2.close();
  
  await sleep(500);
}

async function runTests() {
  try {
    await testRoomSystem();
    
    log('\n📊', '='.repeat(50));
    log('📊', `Test Results: ${testsPassed} passed, ${testsFailed} failed`);
    
    if (testsFailed === 0) {
      log('🎉', 'All tests passed!');
      process.exit(0);
    } else {
      log('❌', 'Some tests failed');
      process.exit(1);
    }
  } catch (error) {
    log('❌', `Test suite error: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

runTests();
