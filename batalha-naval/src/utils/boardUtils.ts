/**
 * ============================================
 * BOARD UTILS - FUNÇÕES AUXILIARES DO TABULEIRO
 * ============================================
 * 
 * Este ficheiro contém todas as funções auxiliares para manipular o tabuleiro
 * de jogo da Batalha Naval. Fornece operações para:
 * - Criar tabuleiros vazios
 * - Validar posições e posicionamento de navios
 * - Colocar navios no tabuleiro
 * - Processar disparos
 * - Verificar condições de vitória
 * - Gerar vistas do tabuleiro para o adversário
 * 
 * Funcionalidades principais:
 * - Validação de posições (dentro dos limites 10x10)
 * - Validação de colocação de navios (sem sobreposição, com distância mínima)
 * - Processamento de disparos (acerto/água, afundado)
 * - Geração de vista do adversário (ocultar navios não atingidos)
 * 
 * DECISÃO DE DESIGN:
 * Todas as funções são puras (sem efeitos secundários) e retornam novos objetos,
 * seguindo os princípios de programação funcional e imutabilidade.
 * Isto facilita o rastreamento de estado e previne bugs.
 * 
 * @author Carlos Azevedo
 * @date 2026
 */
import { Board, Cell, Position, Ship, BOARD_SIZE, CellStatus } from '../types';

/**
 * Criar um tabuleiro vazio 10x10
 * 
 * Inicializa um tabuleiro novo com todas as células vazias (água).
 * Cada célula é configurada com sua posição e estado inicial 'empty'.
 * Este tabuleiro é usado no início do jogo antes de posicionar os navios.
 * 
 * @returns Novo tabuleiro vazio com:
 *          - cells: Matriz 10x10 de células vazias
 *          - ships: Array vazio (ainda sem navios)
 * 
 * @example
 * const board = createEmptyBoard();
 * // board.cells[0][0] = { position: {row: 0, col: 0}, status: 'empty' }
 * // board.ships = []
 */
export function createEmptyBoard(): Board {
  const cells: Cell[][] = [];
  
  // Percorrer todas as linhas (0-9)
  for (let row = 0; row < BOARD_SIZE; row++) {
    cells[row] = [];
    
    // Percorrer todas as colunas (0-9)
    for (let col = 0; col < BOARD_SIZE; col++) {
      cells[row][col] = {
        position: { row, col },
        status: 'empty',
      };
    }
  }
  
  return { cells, ships: [] };
}

/**
 * Verificar se uma posição é válida (dentro dos limites do tabuleiro)
 * 
 * Valida se uma posição está dentro dos limites do tabuleiro 10x10.
 * Usado antes de aceder a células para prevenir erros de índice.
 * 
 * @param position - Posição a verificar
 * @returns Verdadeiro se a posição está dentro dos limites (0-9 para linha e coluna)
 * 
 * @example
 * isValidPosition({row: 0, col: 0})   // true - A1 é válido
 * isValidPosition({row: 9, col: 9})   // true - J10 é válido
 * isValidPosition({row: 10, col: 0})  // false - linha 10 não existe
 * isValidPosition({row: -1, col: 5})  // false - linha negativa
 */
export function isValidPosition(position: Position): boolean {
  return (
    position.row >= 0 &&
    position.row < BOARD_SIZE &&
    position.col >= 0 &&
    position.col < BOARD_SIZE
  );
}

/**
 * Verificar se um navio pode ser colocado nas posições especificadas
 * 
 * Valida se é possível colocar um navio nas posições fornecidas segundo as regras:
 * 1. Todas as posições devem estar dentro dos limites do tabuleiro
 * 2. Todas as posições devem estar vazias (não ocupadas por outro navio)
 * 3. Células adjacentes (incluindo diagonais) não podem ter outros navios
 * 
 * A regra 3 garante que há sempre pelo menos 1 célula de distância entre navios,
 * tornando o jogo mais justo e evitando confusão visual.
 * 
 * @param board - Tabuleiro atual
 * @param positions - Array de posições onde se quer colocar o navio
 * @returns Verdadeiro se o navio pode ser colocado, falso caso contrário
 * 
 * @example
 * // Tentar colocar navio de 3 células horizontalmente em A1-A3
 * const positions = [
 *   {row: 0, col: 0},
 *   {row: 0, col: 1},
 *   {row: 0, col: 2}
 * ];
 * const canPlace = canPlaceShip(board, positions);
 * if (canPlace) {
 *   // OK para colocar
 * }
 */
export function canPlaceShip(
  board: Board,
  positions: Position[]
): boolean {
  // VALIDAÇÃO 1: Verificar se todas as posições são válidas (dentro do tabuleiro)
  if (!positions.every(isValidPosition)) {
    return false;
  }
  
  // VALIDAÇÃO 2: Verificar se todas as posições estão vazias
  for (const pos of positions) {
    const cell = board.cells[pos.row][pos.col];
    if (cell.status !== 'empty') {
      return false;
    }
  }
  
  // VALIDAÇÃO 3: Verificar células adjacentes (incluindo diagonais)
  // Para cada posição do navio, verificar as 8 células à volta
  for (const pos of positions) {
    // dr = delta row, dc = delta column
    // Percorrer de -1 a +1 em ambas as direções
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        // Saltar a própria célula (0, 0)
        if (dr === 0 && dc === 0) continue;
        
        // Calcular posição adjacente
        const adjPos = { row: pos.row + dr, col: pos.col + dc };
        
        // Apenas verificar se a posição adjacente está dentro do tabuleiro
        if (isValidPosition(adjPos)) {
          const adjCell = board.cells[adjPos.row][adjPos.col];
          
          // Se a célula adjacente tem um navio E não faz parte do navio atual
          // então há conflito (navios demasiado próximos)
          if (adjCell.status === 'ship' && 
              !positions.some(p => p.row === adjPos.row && p.col === adjPos.col)) {
            return false;
          }
        }
      }
    }
  }
  
  // Todas as validações passaram
  return true;
}

/**
 * Colocar um navio no tabuleiro
 * 
 * Adiciona um navio ao tabuleiro, marcando as células correspondentes.
 * Esta função NÃO valida se o posicionamento é válido - use canPlaceShip()
 * antes de chamar esta função para garantir que o posicionamento é legal.
 * 
 * IMPORTANTE: Esta é uma função pura que retorna um NOVO tabuleiro.
 * O tabuleiro original não é modificado (imutabilidade).
 * 
 * @param board - Tabuleiro atual
 * @param ship - Navio a colocar (deve conter posições válidas)
 * @returns Novo tabuleiro com o navio adicionado
 * 
 * @example
 * const ship = {
 *   id: 'ship-1',
 *   type: 'destroyer',
 *   size: 2,
 *   positions: [{row: 0, col: 0}, {row: 0, col: 1}],
 *   hits: 0,
 *   sunk: false
 * };
 * const newBoard = placeShip(board, ship);
 * // board original inalterado, newBoard tem o navio
 */
export function placeShip(board: Board, ship: Ship): Board {
  // Criar cópia profunda de todas as células
  // Isto garante imutabilidade - não modificamos o tabuleiro original
  const newCells = board.cells.map(row => 
    row.map(cell => ({ ...cell }))
  );
  
  // Marcar cada posição do navio no novo tabuleiro
  for (const pos of ship.positions) {
    newCells[pos.row][pos.col] = {
      position: pos,
      status: 'ship',        // Marcar como contendo navio
      shipId: ship.id,       // Guardar referência ao navio
    };
  }
  
  // Retornar novo tabuleiro com células atualizadas e navio adicionado à lista
  return {
    cells: newCells,
    ships: [...board.ships, ship],  // Adicionar navio à lista (imutável)
  };
}

/**
 * Processar um disparo numa posição
 * 
 * Esta é a função central do jogo que processa um disparo do jogador.
 * Atualiza o estado do tabuleiro e determina se foi acerto ou água,
 * e se algum navio foi afundado.
 * 
 * Lógica:
 * 1. Verificar se a célula já foi atacada (não pode disparar duas vezes no mesmo sítio)
 * 2. Determinar se é acerto (hit) ou água (miss)
 * 3. Atualizar estado da célula
 * 4. Se acerto, incrementar contador de danos do navio
 * 5. Verificar se o navio foi afundado (todas as células atingidas)
 * 
 * IMPORTANTE: Função pura - retorna novo tabuleiro sem modificar o original.
 * 
 * @param board - Tabuleiro atual
 * @param position - Posição onde disparar
 * @returns Objeto com:
 *          - board: Tabuleiro atualizado
 *          - hit: true se acertou num navio, false se água
 *          - sunk: true se afundou o navio, false caso contrário
 *          - shipId: ID do navio atingido (undefined se miss)
 * 
 * @example
 * const result = processFireOnBoard(board, {row: 5, col: 3});
 * if (result.hit) {
 *   console.log('Acertou!');
 *   if (result.sunk) {
 *     console.log('Afundou o navio!');
 *   }
 * } else {
 *   console.log('Água!');
 * }
 */
export function processFireOnBoard(
  board: Board,
  position: Position
): { board: Board; hit: boolean; sunk: boolean; shipId?: string } {
  // Obter célula alvo
  const cell = board.cells[position.row][position.col];
  
  // VALIDAÇÃO: Não pode disparar na mesma célula duas vezes
  // Se já está marcada como 'hit' ou 'miss', ignorar
  if (cell.status === 'hit' || cell.status === 'miss') {
    return { board, hit: false, sunk: false };
  }
  
  // Determinar se é acerto (célula contém navio)
  const hit = cell.status === 'ship';
  
  // Criar cópia profunda do tabuleiro (imutabilidade)
  const newCells = board.cells.map(row => 
    row.map(c => ({ ...c }))
  );
  
  // Atualizar estado da célula alvo
  newCells[position.row][position.col] = {
    ...cell,
    status: hit ? 'hit' : 'miss',  // 'hit' se acertou, 'miss' se água
  };
  
  let sunk = false;
  let shipId = cell.shipId;
  let updatedShips = board.ships;
  
  // Se acertou E célula tem ID de navio
  if (hit && shipId) {
    // Atualizar contador de danos do navio
    updatedShips = board.ships.map(ship => {
      if (ship.id === shipId) {
        const newHits = ship.hits + 1;
        const isSunk = newHits >= ship.size;  // Afundado se hits >= tamanho
        return { ...ship, hits: newHits, sunk: isSunk };
      }
      return ship;
    });
    
    // Verificar se o navio foi afundado
    const hitShip = updatedShips.find(s => s.id === shipId);
    sunk = hitShip?.sunk || false;
  }
  
  return {
    board: { cells: newCells, ships: updatedShips },
    hit,
    sunk,
    shipId,
  };
}

/**
 * Verificar se todos os navios de um tabuleiro estão afundados
 * 
 * Esta função determina se um jogador perdeu o jogo.
 * O jogo termina quando todos os 5 navios de um jogador foram afundados.
 * 
 * NOTA: Retorna false se o tabuleiro não tem navios (ainda em configuração)
 * 
 * @param board - Tabuleiro a verificar
 * @returns Verdadeiro se todos os navios estão afundados (jogador perdeu)
 * 
 * @example
 * if (areAllShipsSunk(player2Board)) {
 *   console.log('Jogador 1 ganhou!');
 *   endGame(0); // Jogador 1 é o vencedor
 * }
 */
export function areAllShipsSunk(board: Board): boolean {
  // Deve ter navios E todos devem estar afundados
  return board.ships.length > 0 && board.ships.every(ship => ship.sunk);
}

/**
 * Gerar array de posições para um navio
 * 
 * Calcula as posições que um navio ocupará dado:
 * - Posição inicial
 * - Tamanho do navio
 * - Orientação (horizontal ou vertical)
 * 
 * Esta função é usada durante a fase de configuração quando o jogador
 * seleciona onde colocar cada navio.
 * 
 * @param start - Posição inicial do navio (célula mais à esquerda/cima)
 * @param size - Tamanho do navio (2-5 células)
 * @param horizontal - true para horizontal, false para vertical
 * @returns Array de posições que o navio ocupará
 * 
 * @example
 * // Navio horizontal de tamanho 3 começando em A1
 * const positions = generateShipPositions({row: 0, col: 0}, 3, true);
 * // Resultado: [{row: 0, col: 0}, {row: 0, col: 1}, {row: 0, col: 2}]
 * // Ocupa: A1, A2, A3
 * 
 * @example
 * // Navio vertical de tamanho 2 começando em C5
 * const positions = generateShipPositions({row: 2, col: 4}, 2, false);
 * // Resultado: [{row: 2, col: 4}, {row: 3, col: 4}]
 * // Ocupa: C5, D5
 */
export function generateShipPositions(
  start: Position,
  size: number,
  horizontal: boolean
): Position[] {
  const positions: Position[] = [];
  
  // Gerar 'size' posições consecutivas
  for (let i = 0; i < size; i++) {
    positions.push({
      // Se horizontal: linha fixa, coluna aumenta
      // Se vertical: linha aumenta, coluna fixa
      row: horizontal ? start.row : start.row + i,
      col: horizontal ? start.col + i : start.col,
    });
  }
  
  return positions;
}

/**
 * Criar vista do tabuleiro do adversário
 * 
 * Esta função é CRUCIAL para o jogo justo. Gera uma versão do tabuleiro
 * que oculta informação que o adversário não deve ver.
 * 
 * O que é ocultado:
 * - Navios não atingidos aparecem como água ('empty')
 * - Apenas células já atacadas mostram seu verdadeiro estado
 * 
 * O que é mostrado:
 * - Células com disparos na água ('miss')
 * - Células com acertos em navios ('hit')
 * 
 * Esta vista é usada para renderizar o tabuleiro do adversário na UI.
 * Cada jogador vê o próprio tabuleiro completo (com navios) mas apenas
 * vê os disparos no tabuleiro do adversário (navios ocultos).
 * 
 * DECISÃO DE DESIGN:
 * A lista de navios é esvaziada na vista do adversário para evitar
 * vazamento de informação sobre navios ainda não descobertos.
 * 
 * @param board - Tabuleiro completo (com todos os navios visíveis)
 * @returns Novo tabuleiro com navios não atingidos ocultos
 * 
 * @example
 * // Tabuleiro real do jogador 2:
 * // - Tem navio em A1-A3
 * // - Jogador 1 já disparou em A1 (acerto) e B1 (água)
 * 
 * const opponentView = getOpponentBoardView(player2Board);
 * 
 * // Vista que jogador 1 vê:
 * // A1: 'hit' (sabe que acertou)
 * // A2: 'empty' (não sabe que tem navio aqui)
 * // A3: 'empty' (não sabe que tem navio aqui)
 * // B1: 'miss' (sabe que é água)
 * // Resto: 'empty' (ainda não explorado)
 */
export function getOpponentBoardView(board: Board): Board {
  // Criar cópia do tabuleiro com células filtradas
  const cells: Cell[][] = board.cells.map(row =>
    row.map(cell => ({
      position: cell.position,
      // Se é 'ship' (não atingido), mostrar como 'empty' (ocultar)
      // Caso contrário, mostrar estado real ('hit' ou 'miss')
      status: cell.status === 'ship' ? 'empty' : cell.status,
      // Apenas mostrar shipId se célula foi atingida (para saber qual navio afundou)
      shipId: cell.status === 'hit' ? cell.shipId : undefined,
    }))
  );
  
  // Retornar tabuleiro com lista de navios vazia (ocultar informação)
  return { cells, ships: [] };
}
