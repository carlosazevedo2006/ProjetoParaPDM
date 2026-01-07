/**
 * ============================================
 * NETWORK - CLIENTE WEBSOCKET MULTIPLAYER
 * ============================================
 * 
 * Gestão de comunicação em tempo real entre dois jogadores.
 * Este ficheiro implementa o cliente WebSocket que permite o modo multiplayer
 * do jogo, conectando dois dispositivos através de um servidor central.
 * 
 * ARQUITETURA:
 * 
 * ```
 * Dispositivo A                    Servidor WebSocket                Dispositivo B
 *     │                                    │                               │
 *     │──── CREATE_ROOM ────────────────→  │                               │
 *     │←─── ROOM_CREATED {code: ABC123} ── │                               │
 *     │                                    │                               │
 *     │                                    │  ←──── JOIN_ROOM {ABC123} ────│
 *     │                                    │  ──── ROOM_JOINED ──────────→ │
 *     │←────── ROOM_READY ─────────────────│─────── ROOM_READY ──────────→│
 *     │                                    │                               │
 *     │──── FIRE {row: 5, col: 3} ───────→ │ ──────────────────────────→  │
 *     │←──── SERVER_STATE {...} ───────────│ ←────────────────────────────│
 * ```
 * 
 * EVENTOS SUPORTADOS:
 * - CREATE_ROOM: Criar nova sala de jogo
 * - JOIN_ROOM: Entrar em sala existente com código
 * - FIRE: Enviar disparo ao adversário
 * - PLAYER_READY: Jogador terminou configuração
 * - SERVER_STATE: Estado do jogo sincronizado
 * - PLAYER_LEFT: Adversário desconectou
 * - ROOM_READY: Sala pronta para começar (2 jogadores)
 * 
 * CARACTERÍSTICAS:
 * - Reconexão automática em caso de desconexão (máximo 5 tentativas)
 * - Sistema de handlers para escutar mensagens específicas
 * - Timeout de conexão de 10 segundos
 * - Padrão Singleton para instância global
 * 
 * @author Carlos Azevedo
 * @date 2026
 */
import { NetworkMessage } from '../types';

/**
 * Tipo de função handler para processar mensagens recebidas
 * 
 * @param message - Mensagem recebida do servidor
 */
type MessageHandler = (message: NetworkMessage) => void;

/**
 * Classe Network - Cliente WebSocket para comunicação multiplayer
 * 
 * Esta classe encapsula toda a lógica de comunicação WebSocket,
 * incluindo conexão, envio/receção de mensagens, reconexão automática
 * e gestão de handlers de eventos.
 * 
 * @class Network
 */
export class Network {
  /** Conexão WebSocket ativa (null se desconectado) */
  private ws: WebSocket | null = null;
  
  /** 
   * Mapa de handlers de mensagens
   * Chave: Tipo de mensagem (ex: 'FIRE', 'ROOM_CREATED') ou '*' para todas
   * Valor: Array de funções callback a chamar quando mensagem é recebida
   */
  private messageHandlers: Map<string, MessageHandler[]> = new Map();
  
  /** Número de tentativas de reconexão já efetuadas */
  private reconnectAttempts = 0;
  
  /** Número máximo de tentativas de reconexão (5) */
  private maxReconnectAttempts = 5;
  
  /** Atraso entre tentativas de reconexão em ms (2000 = 2 segundos) */
  private reconnectDelay = 2000;
  
  /** URL do servidor WebSocket (ex: ws://192.168.1.69:3000) */
  private serverUrl: string;
  
  /** Se verdadeiro, tenta reconectar automaticamente em caso de desconexão */
  private shouldReconnect = true;
  
  /** Timer para timeout de conexão (10 segundos) */
  private connectionTimeout: number | null = null;

  /**
   * Construtor da classe Network
   * 
   * @param serverUrl - URL completo do servidor WebSocket
   *                    Formato: ws://IP:PORTA
   *                    Exemplo: ws://192.168.1.69:3000
   */
  constructor(serverUrl: string) {
    this.serverUrl = serverUrl;
  }

  /**
   * Conectar ao servidor WebSocket
   * 
   * Estabelece conexão com o servidor e configura handlers para:
   * - onopen: Conexão estabelecida com sucesso
   * - onmessage: Mensagem recebida do servidor
   * - onerror: Erro na conexão
   * - onclose: Conexão fechada
   * 
   * Possui timeout de 10 segundos - se não conectar neste tempo, falha.
   * Em caso de desconexão, tenta reconectar automaticamente até 5 vezes
   * com delay crescente entre tentativas.
   * 
   * @returns Promise que resolve quando conecta ou rejeita em caso de erro
   * 
   * @example
   * const network = new Network('ws://192.168.1.69:3000');
   * try {
   *   await network.connect();
   *   console.log('Conectado!');
   * } catch (error) {
   *   console.error('Falha ao conectar:', error);
   * }
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        console.log('[Network] A conectar a:', this.serverUrl);
        
        // Criar nova conexão WebSocket
        this.ws = new WebSocket(this.serverUrl);

        // Configurar timeout de conexão (10 segundos)
        // Se não conectar neste tempo, cancela e rejeita a Promise
        this.connectionTimeout = setTimeout(() => {
          if (this.ws && this.ws.readyState !== WebSocket.OPEN) {
            console.log('[Network] Timeout de conexão');
            this.ws.close();
            reject(new Error('Connection timeout'));
          }
        }, 10000); // 10 segundos

        // Handler: Conexão aberta com sucesso
        this.ws.onopen = () => {
          console.log('[Network] Conectado ao servidor');
          
          // Limpar timeout (já conectou)
          if (this.connectionTimeout) {
            clearTimeout(this.connectionTimeout);
            this.connectionTimeout = null;
          }
          
          // Resetar contador de reconexões
          this.reconnectAttempts = 0;
          
          // Resolver a Promise (sucesso)
          resolve();
        };

        // Handler: Mensagem recebida do servidor
        this.ws.onmessage = (event) => {
          try {
            // Fazer parse do JSON recebido
            const message: NetworkMessage = JSON.parse(event.data);
            console.log('[Network] Mensagem recebida:', message.type);
            
            // Chamar todos os handlers registados para este tipo específico de mensagem
            const handlers = this.messageHandlers.get(message.type) || [];
            handlers.forEach(handler => handler(message));
            
            // Chamar também handlers globais (registados com '*')
            // Estes recebem TODAS as mensagens, independentemente do tipo
            const globalHandlers = this.messageHandlers.get('*') || [];
            globalHandlers.forEach(handler => handler(message));
          } catch (error) {
            console.error('[Network] Falha ao processar mensagem:', error);
          }
        };

        // Handler: Erro na conexão
        this.ws.onerror = (error) => {
          console.error('[Network] Erro WebSocket:', error);
          
          // Limpar timeout
          if (this.connectionTimeout) {
            clearTimeout(this.connectionTimeout);
            this.connectionTimeout = null;
          }
          
          // Criar mensagem de erro e notificar handlers
          const errorMessage: NetworkMessage = {
            type: 'CONNECTION_ERROR',
            message: 'Failed to connect to server',
          };
          
          const handlers = this.messageHandlers.get('CONNECTION_ERROR') || [];
          handlers.forEach(handler => handler(errorMessage));
          
          // Rejeitar a Promise (falha)
          reject(error);
        };

        // Handler: Conexão fechada
        this.ws.onclose = () => {
          console.log('[Network] Conexão fechada');
          
          // Limpar timeout
          if (this.connectionTimeout) {
            clearTimeout(this.connectionTimeout);
            this.connectionTimeout = null;
          }
          
          // Notificar handlers de desconexão
          const disconnectMessage: NetworkMessage = {
            type: 'DISCONNECT',
            message: 'Disconnected from server',
          };
          
          const handlers = this.messageHandlers.get('DISCONNECT') || [];
          handlers.forEach(handler => handler(disconnectMessage));

          // Tentar reconectar automaticamente (se permitido)
          // Apenas se não atingiu o máximo de tentativas
          if (this.shouldReconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`[Network] A reconectar... Tentativa ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
            
            // Aguardar antes de reconectar
            // Delay aumenta com cada tentativa (backoff exponencial)
            setTimeout(() => {
              this.connect().catch(err => {
                console.error('[Network] Reconexão falhada:', err);
              });
            }, this.reconnectDelay * this.reconnectAttempts);
          }
        };
      } catch (error) {
        console.error('[Network] Falha ao criar WebSocket:', error);
        reject(error);
      }
    });
  }

  /**
   * Enviar uma mensagem ao servidor
   * 
   * Serializa a mensagem para JSON e envia via WebSocket.
   * Apenas envia se a conexão estiver ativa (estado OPEN).
   * Se não estiver conectado, notifica handlers de erro.
   * 
   * @param message - Mensagem a enviar (será convertida para JSON)
   * 
   * @example
   * // Enviar um disparo
   * network.send({
   *   type: 'FIRE',
   *   position: { row: 5, col: 3 }
   * });
   * 
   * @example
   * // Criar uma sala
   * network.send({ type: 'CREATE_ROOM' });
   */
  send(message: NetworkMessage): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log('[Network] A enviar mensagem:', message.type);
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('[Network] Não é possível enviar - não conectado');
      
      // Notificar handlers de erro
      const errorMessage: NetworkMessage = {
        type: 'CONNECTION_ERROR',
        message: 'Not connected to server',
      };
      
      const handlers = this.messageHandlers.get('CONNECTION_ERROR') || [];
      handlers.forEach(handler => handler(errorMessage));
    }
  }

  /**
   * Registar um handler para um tipo específico de mensagem
   * 
   * Permite escutar mensagens do servidor e reagir a elas.
   * Pode ter múltiplos handlers para o mesmo tipo de mensagem.
   * Use '*' como tipo para escutar TODAS as mensagens.
   * 
   * @param type - Tipo de mensagem a escutar (ex: 'FIRE', 'ROOM_CREATED') ou '*' para todas
   * @param handler - Função callback a chamar quando mensagem é recebida
   * @returns Função para remover este handler (cleanup/unsubscribe)
   * 
   * @example
   * // Escutar disparos
   * const unsubscribe = network.on('FIRE', (message) => {
   *   console.log('Disparo recebido:', message.payload);
   *   // Processar disparo...
   * });
   * 
   * // Mais tarde, parar de escutar
   * unsubscribe();
   * 
   * @example
   * // Escutar todas as mensagens
   * network.on('*', (message) => {
   *   console.log('Qualquer mensagem:', message);
   * });
   */
  on(type: string, handler: MessageHandler): () => void {
    // Criar array se ainda não existe
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, []);
    }
    
    // Adicionar handler ao array
    const handlers = this.messageHandlers.get(type);
    if (handlers) {
      handlers.push(handler);
    }
    
    // Retornar função de cleanup (unsubscribe)
    // Quando chamada, remove este handler da lista
    return () => {
      const updatedHandlers = this.messageHandlers.get(type)?.filter(h => h !== handler);
      if (updatedHandlers) {
        this.messageHandlers.set(type, updatedHandlers);
      }
    };
  }

  /**
   * Remover um handler de mensagem
   * 
   * Remove um handler específico da lista de handlers de um tipo de mensagem.
   * Útil quando não queremos mais escutar certo tipo de mensagem.
   * 
   * NOTA: É preferível usar a função retornada por on() para remover handlers,
   * pois garante que remove exatamente o handler correto.
   * 
   * @param type - Tipo de mensagem
   * @param handler - Handler a remover
   */
  off(type: string, handler: MessageHandler): void {
    const handlers = this.messageHandlers.get(type);
    if (handlers) {
      const filtered = handlers.filter(h => h !== handler);
      this.messageHandlers.set(type, filtered);
    }
  }

  /**
   * Registar um handler para todas as mensagens (suporte legado)
   * 
   * Método de conveniência que regista um handler para '*' (todas as mensagens).
   * É equivalente a chamar on('*', handler).
   * 
   * @param handler - Função callback a chamar para cada mensagem recebida
   * @returns Função para remover este handler
   * 
   * @example
   * const unsubscribe = network.onMessage((message) => {
   *   console.log('Mensagem recebida:', message.type);
   * });
   */
  onMessage(handler: MessageHandler): () => void {
    return this.on('*', handler);
  }

  /**
   * Verificar se está conectado ao servidor
   * 
   * @returns Verdadeiro se WebSocket está aberto e pronto para comunicação
   */
  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  /**
   * Desconectar do servidor
   * 
   * Fecha a conexão WebSocket, limpa todos os handlers e para tentativas de reconexão.
   * Use quando o jogador sai do modo multiplayer ou fecha a aplicação.
   * 
   * IMPORTANTE: Após desconectar, a instância Network não pode ser reutilizada.
   * Crie uma nova instância para reconectar.
   */
  disconnect(): void {
    console.log('[Network] A desconectar...');
    
    // Parar reconexões automáticas
    this.shouldReconnect = false;
    
    // Limpar timeout se existir
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
      this.connectionTimeout = null;
    }
    
    // Fechar WebSocket
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    // Limpar todos os handlers
    this.messageHandlers.clear();
    this.reconnectAttempts = 0;
  }

  /**
   * Resetar estado de reconexão
   * 
   * Útil quando o utilizador tenta reconectar manualmente.
   * Reseta o contador de tentativas e permite reconexões automáticas novamente.
   * 
   * @example
   * // Após várias falhas de reconexão, permitir tentar novamente
   * network.resetReconnection();
   * await network.connect();
   */
  resetReconnection(): void {
    this.reconnectAttempts = 0;
    this.shouldReconnect = true;
  }
}

// ============================================
// FUNÇÕES AUXILIARES - PADRÃO SINGLETON
// ============================================

/**
 * Instância singleton da classe Network
 * 
 * Garante que existe apenas uma instância de Network em toda a aplicação,
 * evitando múltiplas conexões ao servidor.
 */
let networkInstance: Network | null = null;

/**
 * Obter a instância singleton do Network
 * 
 * Esta função implementa o padrão Singleton, garantindo que apenas
 * uma instância de Network existe na aplicação. Na primeira chamada,
 * cria a instância. Nas chamadas seguintes, retorna a instância existente.
 * 
 * @param serverUrl - URL do servidor WebSocket (obrigatório na primeira chamada)
 * @returns Instância singleton de Network
 * @throws Erro se chamado sem serverUrl antes de inicializar
 * 
 * @example
 * // Primeira chamada - inicializar
 * const network = getNetwork('ws://192.168.1.69:3000');
 * await network.connect();
 * 
 * @example
 * // Chamadas subsequentes - reutilizar instância
 * const network = getNetwork(); // Não precisa de serverUrl
 * network.send({ type: 'FIRE', position: { row: 5, col: 3 } });
 */
export function getNetwork(serverUrl?: string): Network {
  // Se não existe instância E foi fornecido serverUrl, criar nova
  if (!networkInstance && serverUrl) {
    networkInstance = new Network(serverUrl);
  }
  
  // Se não existe instância e não foi fornecido serverUrl, erro
  if (!networkInstance) {
    throw new Error('Network not initialized. Call getNetwork with serverUrl first.');
  }
  
  return networkInstance;
}

/**
 * Resetar a instância singleton do Network
 * 
 * Desconecta do servidor e destrói a instância singleton.
 * A próxima chamada a getNetwork() irá criar uma nova instância.
 * 
 * Use esta função quando:
 * - O jogador sai do modo multiplayer
 * - Precisa mudar de servidor
 * - Quer limpar completamente a conexão
 * 
 * @example
 * // Limpar conexão ao sair do multiplayer
 * resetNetwork();
 * // Agora pode criar nova instância com servidor diferente
 * const network = getNetwork('ws://novo-servidor:3000');
 */
export function resetNetwork(): void {
  if (networkInstance) {
    networkInstance.disconnect();
    networkInstance = null;
  }
}
