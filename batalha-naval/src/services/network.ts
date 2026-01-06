// WebSocket client for multiplayer networking
import { NetworkMessage } from '../types';

type MessageHandler = (message: NetworkMessage) => void;

export class Network {
  private ws: WebSocket | null = null;
  private messageHandlers: MessageHandler[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 2000;
  private serverUrl: string;
  private shouldReconnect = true;
  private connectionTimeout: NodeJS.Timeout | null = null;

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
            this.messageHandlers.forEach(handler => handler(message));
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
          this.messageHandlers.forEach(handler => handler(errorMessage));
          
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
          this.messageHandlers.forEach(handler => handler(disconnectMessage));

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
      this.messageHandlers.forEach(handler => handler(errorMessage));
    }
  }

  /**
   * Register a message handler
   */
  onMessage(handler: MessageHandler): () => void {
    this.messageHandlers.push(handler);
    
    // Return unsubscribe function
    return () => {
      this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    };
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
    
    this.messageHandlers = [];
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
