/**
 * ============================================
 * TYPES - DEFINIÇÕES DE TIPOS E INTERFACES
 * ============================================
 * 
 * Este ficheiro contém todas as definições de tipos TypeScript utilizadas
 * no jogo de Batalha Naval. Define a estrutura de dados para:
 * - Tabuleiros de jogo
 * - Navios e células
 * - Jogadores e estatísticas
 * - Mensagens de rede (multiplayer)
 * - Estado global do jogo
 * 
 * Funcionalidades principais:
 * - Tipagem forte para garantir segurança de tipos
 * - Interfaces reutilizáveis em todo o projeto
 * - Constantes do jogo (tamanhos de navios, nomes)
 * - Tipos de mensagens de rede para comunicação WebSocket
 * 
 * @author Carlos Azevedo
 * @date 2026
 */

/**
 * Estado de uma célula individual no tabuleiro
 * 
 * Define o que cada célula do tabuleiro 10x10 pode conter:
 * - 'empty': Água vazia, não atacada (azul)
 * - 'ship': Contém parte de um navio, não atacado (cinza - apenas visível no próprio tabuleiro)
 * - 'hit': Navio que foi atingido (vermelho)
 * - 'miss': Água que foi atacada (cinza claro - tiro na água)
 */
export type CellStatus = 'empty' | 'ship' | 'hit' | 'miss';

/**
 * Tipos de navios disponíveis no jogo
 * 
 * O jogo possui 5 tipos diferentes de navios, cada um com tamanho específico:
 * - carrier: Porta-aviões (5 células)
 * - battleship: Encouraçado (4 células)
 * - cruiser: Cruzador (3 células)
 * - submarine: Submarino (3 células)
 * - destroyer: Destroyer (2 células)
 */
export type ShipType = 'carrier' | 'battleship' | 'cruiser' | 'submarine' | 'destroyer';

/**
 * Interface que representa um navio no jogo
 * 
 * Cada navio tem um identificador único, tipo, tamanho e rastreamento de danos.
 * O jogo termina quando todos os navios de um jogador são afundados.
 */
export interface Ship {
  /** Identificador único do navio (ex: 'ship-1', 'ship-2') */
  id: string;
  
  /** Tipo de navio (determina o tamanho) */
  type: ShipType;
  
  /** Tamanho do navio em número de células (2-5) */
  size: number;
  
  /** 
   * Posições que o navio ocupa no tabuleiro
   * Array de coordenadas [linha, coluna]
   * Ex: [{row: 0, col: 0}, {row: 0, col: 1}, {row: 0, col: 2}] para navio horizontal de tamanho 3 em A1
   */
  positions: Position[];
  
  /** 
   * Número de células já atingidas deste navio
   * Quando hits === size, o navio está afundado (sunk = true)
   */
  hits: number;
  
  /** Verdadeiro se o navio foi completamente afundado (todas as células atingidas) */
  sunk: boolean;
}

/**
 * Posição no tabuleiro usando coordenadas de linha e coluna
 * 
 * Sistema de coordenadas:
 * - row: 0-9 (correspondente a letras A-J na interface)
 * - col: 0-9 (correspondente a números 1-10 na interface)
 * 
 * Exemplo: {row: 0, col: 0} = A1 (canto superior esquerdo)
 */
export interface Position {
  /** Linha da célula (0-9, correspondente a A-J) */
  row: number;
  
  /** Coluna da célula (0-9, correspondente a 1-10) */
  col: number;
}

/**
 * Célula individual do tabuleiro
 * 
 * Cada uma das 100 células do tabuleiro 10x10 contém informação sobre:
 * - Sua posição no tabuleiro
 * - Estado atual (vazia, navio, atingida, falhada)
 * - Referência ao navio (se houver)
 */
export interface Cell {
  /** Posição desta célula no tabuleiro */
  position: Position;
  
  /** Estado visual atual da célula */
  status: CellStatus;
  
  /** ID do navio nesta célula (undefined se for água) */
  shipId?: string;
}

/**
 * Tabuleiro de jogo 10x10
 * 
 * Matriz bidimensional que representa o oceano onde os navios são colocados.
 * Cada jogador tem dois tabuleiros:
 * - board: O seu próprio tabuleiro (onde posiciona os navios)
 * - opponentBoard: Vista do tabuleiro do adversário (apenas disparos, navios ocultos)
 * 
 * Estrutura:
 * - cells: Matriz 10x10 de células
 * - ships: Array com os 5 navios do jogador
 */
export interface Board {
  /** Matriz 10x10 de células do tabuleiro */
  cells: Cell[][];
  
  /** Array com todos os navios colocados neste tabuleiro */
  ships: Ship[];
}

/**
 * Interface que representa um jogador
 * 
 * Cada partida tem dois jogadores. No modo local, ambos jogam no mesmo dispositivo.
 * No modo multiplayer, cada jogador está num dispositivo diferente.
 */
export interface Player {
  /** Identificador único do jogador (ex: 'player1', 'player2' ou ID de sessão) */
  id: string;
  
  /** Nome do jogador para exibição */
  name: string;
  
  /** Tabuleiro próprio do jogador (com os seus navios) */
  board: Board;
  
  /** Vista do tabuleiro do adversário (apenas disparos visíveis, navios ocultos) */
  opponentBoard: Board;
  
  /** Verdadeiro quando o jogador terminou de posicionar todos os navios */
  ready: boolean;
}

/**
 * Estatísticas do jogador
 * 
 * Guardadas localmente no dispositivo usando AsyncStorage.
 * Rastreiam o histórico de jogos do utilizador.
 */
export interface Statistics {
  /** Total de jogos concluídos */
  gamesPlayed: number;
  
  /** Total de vitórias */
  wins: number;
  
  /** Total de derrotas */
  losses: number;
  
  /** Taxa de vitória (0-100%, calculada automaticamente) */
  winRate: number;
}

/**
 * Estado global completo do jogo
 * 
 * Este é o estado central que é mantido no GameContext e sincronizado
 * entre os componentes. Contém toda a informação necessária para
 * representar o estado atual de uma partida.
 * 
 * Fases do jogo:
 * - 'setup': Jogadores estão a posicionar navios
 * - 'playing': Jogo em andamento, jogadores alternam disparos
 * - 'finished': Jogo terminou, um jogador ganhou
 */
export interface GameState {
  /** ID da sala (usado em multiplayer, 'local' para jogos locais) */
  roomId: string;
  
  /** Código da sala para partilha (apenas multiplayer, ex: 'ABC123') */
  roomCode?: string;
  
  /** Número de jogadores na sala (1 ou 2) */
  roomPlayerCount?: number;
  
  /** 
   * Array com exatamente 2 jogadores
   * Pode conter null durante a configuração inicial
   * [0] = Jogador 1, [1] = Jogador 2
   */
  players: [Player | null, Player | null];
  
  /** 
   * Índice do jogador cujo turno é atual
   * 0 = vez do jogador 1
   * 1 = vez do jogador 2
   */
  currentTurn: 0 | 1;
  
  /** Fase atual do jogo */
  phase: 'setup' | 'playing' | 'finished';
  
  /** Índice do jogador vencedor (definido quando phase === 'finished') */
  winner?: 0 | 1;
  
  /** 
   * Modo de jogo atual
   * - 'local': Dois jogadores no mesmo dispositivo
   * - 'multiplayer': Dois jogadores em dispositivos diferentes via WebSocket
   */
  mode: 'local' | 'multiplayer';
  
  /** Estatísticas do jogador (opcional) */
  statistics?: Statistics;
}

/**
 * Tipos de mensagens de rede (WebSocket)
 * 
 * Define todos os tipos de mensagens trocadas entre cliente e servidor
 * no modo multiplayer. Cada tipo tem uma estrutura específica de payload.
 * 
 * FLUXO DE MENSAGENS TÍPICO:
 * 
 * 1. Criar sala:
 *    Cliente → Servidor: CREATE_ROOM
 *    Servidor → Cliente: ROOM_CREATED {code}
 * 
 * 2. Entrar em sala:
 *    Cliente → Servidor: JOIN_ROOM {code}
 *    Servidor → Cliente: ROOM_JOINED {code, playerCount}
 *    Servidor → Ambos: ROOM_READY (quando 2 jogadores)
 * 
 * 3. Durante o jogo:
 *    Cliente → Servidor: PLAYER_READY {ships} (após configuração)
 *    Cliente → Servidor: FIRE {position}
 *    Servidor → Ambos: SERVER_STATE {gameState} (estado atualizado)
 * 
 * 4. Erros:
 *    Servidor → Cliente: ROOM_NOT_FOUND / ROOM_FULL / ERROR
 */
export type NetworkMessage =
  /** Entrar ou criar sala (modo legado) */
  | { type: 'JOIN_OR_CREATE'; roomId: string; playerName: string }
  
  /** Criar nova sala de jogo */
  | { type: 'CREATE_ROOM' }
  
  /** Sala criada com sucesso - contém código de 6 caracteres */
  | { type: 'ROOM_CREATED'; payload: { code: string } }
  
  /** Tentar entrar numa sala existente */
  | { type: 'JOIN_ROOM'; payload: { code: string } }
  
  /** Entrada na sala bem-sucedida */
  | { type: 'ROOM_JOINED'; payload: { code: string; playerCount: number } }
  
  /** Sala não encontrada (código inválido) */
  | { type: 'ROOM_NOT_FOUND'; payload: { code: string } }
  
  /** Sala já tem 2 jogadores (não pode entrar) */
  | { type: 'ROOM_FULL'; payload: { code: string } }
  
  /** Sala está pronta para começar (2 jogadores conectados) */
  | { type: 'ROOM_READY'; payload: { code: string } }
  
  /** Um jogador saiu da sala */
  | { type: 'PLAYER_LEFT'; payload: { code: string } }
  
  /** Jogador terminou configuração e está pronto */
  | { type: 'PLAYER_READY'; ships: Ship[] }
  
  /** Disparar numa posição do tabuleiro adversário */
  | { type: 'FIRE'; position: Position }
  
  /** Reiniciar o jogo */
  | { type: 'RESET' }
  
  /** Estado completo do jogo sincronizado do servidor */
  | { type: 'SERVER_STATE'; gameState: GameState }
  
  /** ID do jogador atribuído pelo servidor */
  | { type: 'PLAYER_ASSIGNED'; playerId: string }
  
  /** Erro genérico do servidor */
  | { type: 'ERROR'; message: string }
  
  /** Erro de conexão (falha ao conectar ao servidor) */
  | { type: 'CONNECTION_ERROR'; message: string }
  
  /** Desconectado do servidor */
  | { type: 'DISCONNECT'; message: string };

/**
 * Tamanhos dos navios por tipo
 * 
 * Mapa que define quantas células cada tipo de navio ocupa.
 * Usado na validação de posicionamento e criação de navios.
 * 
 * Total de células ocupadas: 5 + 4 + 3 + 3 + 2 = 17 células
 */
export const SHIP_SIZES: Record<ShipType, number> = {
  carrier: 5,      // Porta-aviões
  battleship: 4,   // Encouraçado
  cruiser: 3,      // Cruzador
  submarine: 3,    // Submarino
  destroyer: 2,    // Destroyer
};

/**
 * Nomes dos navios em Português de Portugal
 * 
 * Mapa que traduz os tipos de navios para nomes legíveis
 * exibidos na interface do utilizador.
 */
export const SHIP_NAMES: Record<ShipType, string> = {
  carrier: 'Porta-aviões',
  battleship: 'Encouraçado',
  cruiser: 'Cruzador',
  submarine: 'Submarino',
  destroyer: 'Destroyer',
};

/**
 * Tamanho do tabuleiro (10x10)
 * 
 * Constante que define as dimensões do tabuleiro quadrado.
 * Linhas e colunas vão de 0 a 9 (indexação zero-based).
 */
export const BOARD_SIZE = 10;
