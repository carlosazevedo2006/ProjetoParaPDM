// WebSocket client for multiplayer networking
import { NetworkMessage } from '../types';

type MessageHandler = (message: NetworkMessage) => void;

export class Network {
  private ws: WebSocket | null = null;
  private messageHandlers: Map<string, MessageHandler[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 2000;
  private serverUrl: string;
  private shouldReconnect = true;
  private connectionTimeout: number | null = null;

  constructor(serverUrl: string) {
    this.serverUrl = serverUrl;
  }

  /**
   * Connect to the WebSocket server
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        console.log('[Network] Connecting to:', this.serverUrl);
        this.ws = new WebSocket(this.serverUrl);

        // Set connection timeout
        this.connectionTimeout = setTimeout(() => {
          if (this.ws && this.ws.readyState !== WebSocket.OPEN) {
            console.log('[Network] Connection timeout');
            this.ws.close();
            reject(new Error('Connection timeout'));
          }
        }, 10000); // 10 second timeout

        this.ws.onopen = () => {
          console.log('[Network] Connected to server');
          if (this.connectionTimeout) {
            clearTimeout(this.connectionTimeout);
            this.connectionTimeout = null;
          }
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: NetworkMessage = JSON.parse(event.data);
            console.log('[Network] Received message:', message.type);
            
            // Call all handlers for this message type
            const handlers = this.messageHandlers.get(message.type) || [];
            handlers.forEach(handler => handler(message));
            
            // Also call global handlers (handlers registered for all messages)
            const globalHandlers = this.messageHandlers.get('*') || [];
            globalHandlers.forEach(handler => handler(message));
          } catch (error) {
            console.error('[Network] Failed to parse message:', error);
          }
        };

        this.ws.onerror = (error) => {
          console.error('[Network] WebSocket error:', error);
          if (this.connectionTimeout) {
            clearTimeout(this.connectionTimeout);
            this.connectionTimeout = null;
          }
          
          const errorMessage: NetworkMessage = {
            type: 'CONNECTION_ERROR',
            message: 'Failed to connect to server',
          };
          
          const handlers = this.messageHandlers.get('CONNECTION_ERROR') || [];
          handlers.forEach(handler => handler(errorMessage));
          
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('[Network] Connection closed');
          if (this.connectionTimeout) {
            clearTimeout(this.connectionTimeout);
            this.connectionTimeout = null;
          }
          
          const disconnectMessage: NetworkMessage = {
            type: 'DISCONNECT',
            message: 'Disconnected from server',
          };
          
          const handlers = this.messageHandlers.get('DISCONNECT') || [];
          handlers.forEach(handler => handler(disconnectMessage));

          // Attempt to reconnect
          if (this.shouldReconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`[Network] Reconnecting... Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
            
            setTimeout(() => {
              this.connect().catch(err => {
                console.error('[Network] Reconnection failed:', err);
              });
            }, this.reconnectDelay * this.reconnectAttempts);
          }
        };
      } catch (error) {
        console.error('[Network] Failed to create WebSocket:', error);
        reject(error);
      }
    });
  }

  /**
   * Send a message to the server
   */
  send(message: NetworkMessage): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log('[Network] Sending message:', message.type);
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('[Network] Cannot send message - not connected');
      const errorMessage: NetworkMessage = {
        type: 'CONNECTION_ERROR',
        message: 'Not connected to server',
      };
      
      const handlers = this.messageHandlers.get('CONNECTION_ERROR') || [];
      handlers.forEach(handler => handler(errorMessage));
    }
  }

  /**
   * Register a message handler for a specific message type
   * @param type The message type to listen for, or '*' for all messages
   * @param handler The handler function
   * @returns Unsubscribe function
   */
  on(type: string, handler: MessageHandler): () => void {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, []);
    }
    
    const handlers = this.messageHandlers.get(type);
    if (handlers) {
      handlers.push(handler);
    }
    
    // Return unsubscribe function
    return () => {
      const updatedHandlers = this.messageHandlers.get(type)?.filter(h => h !== handler);
      if (updatedHandlers) {
        this.messageHandlers.set(type, updatedHandlers);
      }
    };
  }

  /**
   * Remove a message handler
   */
  off(type: string, handler: MessageHandler): void {
    const handlers = this.messageHandlers.get(type);
    if (handlers) {
      const filtered = handlers.filter(h => h !== handler);
      this.messageHandlers.set(type, filtered);
    }
  }

  /**
   * Register a message handler (legacy support)
   */
  onMessage(handler: MessageHandler): () => void {
    return this.on('*', handler);
  }

  /**
   * Check if connected to server
   */
  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  /**
   * Disconnect from server
   */
  disconnect(): void {
    console.log('[Network] Disconnecting...');
    this.shouldReconnect = false;
    
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
      this.connectionTimeout = null;
    }
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    this.messageHandlers.clear();
    this.reconnectAttempts = 0;
  }

  /**
   * Reset reconnection state (useful when manually reconnecting)
   */
  resetReconnection(): void {
    this.reconnectAttempts = 0;
    this.shouldReconnect = true;
  }
}

// Singleton instance
let networkInstance: Network | null = null;

export function getNetwork(serverUrl?: string): Network {
  if (!networkInstance && serverUrl) {
    networkInstance = new Network(serverUrl);
  }
  
  if (!networkInstance) {
    throw new Error('Network not initialized. Call getNetwork with serverUrl first.');
  }
  
  return networkInstance;
}

export function resetNetwork(): void {
  if (networkInstance) {
    networkInstance.disconnect();
    networkInstance = null;
  }
}
