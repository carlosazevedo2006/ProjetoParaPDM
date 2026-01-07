# 🏗️ Arquitetura do Projeto Batalha Naval

Documentação técnica da arquitetura, design patterns e decisões de implementação.

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura de Alto Nível](#arquitetura-de-alto-nível)
3. [Estrutura de Pastas](#estrutura-de-pastas)
4. [Fluxo de Dados](#fluxo-de-dados)
5. [Gestão de Estado](#gestão-de-estado)
6. [Comunicação de Rede](#comunicação-de-rede)
7. [Fases do Jogo](#fases-do-jogo)
8. [Componentes Principais](#componentes-principais)
9. [Decisões Técnicas](#decisões-técnicas)
10. [Padrões de Design](#padrões-de-design)

---

## 🎯 Visão Geral

O projeto Batalha Naval é uma aplicação React Native multiplataforma que implementa o jogo clássico de tabuleiro. A arquitetura foi desenhada para suportar:

- **Separação de Responsabilidades**: Cada módulo tem uma função clara
- **Reutilização de Código**: Componentes e funções modulares
- **Escalabilidade**: Fácil adicionar novas funcionalidades
- **Manutenibilidade**: Código bem documentado e estruturado
- **Testabilidade**: Funções puras e lógica isolada

---

## 🏛️ Arquitetura de Alto Nível

### **Diagrama de Camadas**

```
┌─────────────────────────────────────────────────────────┐
│                    CAMADA DE APRESENTAÇÃO                │
│  (Screens & Components - UI/UX)                         │
│  StartScreen, GameScreen, SetupScreen, Board, etc.      │
└────────────────────────┬────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────┐
│                  CAMADA DE LÓGICA DE NEGÓCIO            │
│  (Context & Business Logic)                             │
│  GameContext, boardUtils, game rules                    │
└────────────────────────┬────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────┐
│                    CAMADA DE DADOS                       │
│  (Services & Storage)                                    │
│  Network (WebSocket), AsyncStorage (Statistics)          │
└─────────────────────────────────────────────────────────┘
```

### **Fluxo de Comunicação**

```
User Interface
      ↓
   useGame() Hook
      ↓
  GameContext
      ↓
   boardUtils (Local) ←→ Network (Multiplayer)
      ↓                        ↓
  Update State          WebSocket Server
```

---

## 📁 Estrutura de Pastas Detalhada

```
batalha-naval/
│
├── src/
│   │
│   ├── components/              # Componentes reutilizáveis
│   │   ├── Board.tsx            # Renderização do tabuleiro 10x10
│   │   │   └── Responsabilidade: Exibir matriz de células
│   │   ├── ShipSelector.tsx     # Seletor de navios durante setup
│   │   │   └── Responsabilidade: UI para escolher/posicionar navios
│   │   └── TopBar.tsx           # Barra de navegação (se existir)
│   │
│   ├── context/                 # Context API - Estado Global
│   │   └── GameContext.tsx      # 🧠 CÉREBRO DO JOGO
│   │       ├── GameProvider     # Provider do contexto
│   │       ├── useGame()        # Hook para aceder ao contexto
│   │       ├── Estado:          # gameState, myPlayerId, statistics
│   │       ├── Ações Locais:    # startLocalGame, fireAtPosition, etc.
│   │       ├── Ações MP:        # connectToServer, createRoom, etc.
│   │       └── Ações Stats:     # updateStatistics, loadStatistics
│   │
│   ├── screens/                 # Ecrãs da aplicação
│   │   ├── StartScreen.tsx      # Ecrã inicial (menu principal)
│   │   ├── PlayMenuScreen.tsx   # Escolher modo (local/multiplayer)
│   │   ├── LobbyScreen.tsx      # Configuração pré-jogo (nomes)
│   │   ├── SetupScreen.tsx      # Posicionamento de navios
│   │   ├── GameScreen.tsx       # Jogo em curso (disparos)
│   │   ├── ResultScreen.tsx     # Resultado final + estatísticas
│   │   ├── MultiplayerModeScreen.tsx    # Menu multiplayer
│   │   ├── CreateRoomScreen.tsx         # Criar sala
│   │   ├── JoinRoomScreen.tsx           # Entrar em sala
│   │   ├── HowToPlayScreen.tsx          # Instruções
│   │   └── SettingsScreen.tsx           # Configurações
│   │
│   ├── services/                # Serviços externos
│   │   └── network.ts           # 🌐 Cliente WebSocket
│   │       ├── class Network    # Classe principal
│   │       ├── connect()        # Conectar ao servidor
│   │       ├── send()           # Enviar mensagem
│   │       ├── on()             # Registar handler
│   │       ├── disconnect()     # Desconectar
│   │       ├── getNetwork()     # Singleton pattern
│   │       └── resetNetwork()   # Limpar singleton
│   │
│   ├── styles/                  # Estilos globais
│   │   ├── colors.ts            # 🎨 Paleta de cores
│   │   │   └── Colors, CONTRAST_RATIOS
│   │   └── common.ts            # 📐 Estilos reutilizáveis
│   │       ├── Typography       # Estilos de texto
│   │       ├── Buttons          # Estilos de botões
│   │       ├── Containers       # Layouts e cards
│   │       ├── Inputs           # Campos de entrada
│   │       ├── Spacing          # Constantes de espaçamento
│   │       ├── BorderRadius     # Raios de borda
│   │       └── Shadows          # Sombras para elevação
│   │
│   ├── types/                   # Definições TypeScript
│   │   └── index.ts             # 📝 Todos os tipos
│   │       ├── CellStatus       # Estado de célula
│   │       ├── ShipType         # Tipos de navios
│   │       ├── Ship             # Interface de navio
│   │       ├── Position         # Coordenadas
│   │       ├── Cell             # Célula do tabuleiro
│   │       ├── Board            # Tabuleiro completo
│   │       ├── Player           # Jogador
│   │       ├── Statistics       # Estatísticas
│   │       ├── GameState        # Estado global
│   │       ├── NetworkMessage   # Mensagens WebSocket
│   │       ├── SHIP_SIZES       # Constante de tamanhos
│   │       ├── SHIP_NAMES       # Constante de nomes
│   │       └── BOARD_SIZE       # Constante 10x10
│   │
│   └── utils/                   # Funções auxiliares
│       └── boardUtils.ts        # ⚙️ Lógica do tabuleiro
│           ├── createEmptyBoard()       # Criar tabuleiro vazio
│           ├── isValidPosition()        # Validar posição
│           ├── canPlaceShip()           # Validar colocação
│           ├── placeShip()              # Colocar navio
│           ├── processFireOnBoard()     # Processar disparo
│           ├── areAllShipsSunk()        # Verificar vitória
│           ├── generateShipPositions()  # Gerar posições
│           └── getOpponentBoardView()   # Vista do adversário
│
├── server/                      # Servidor WebSocket
│   ├── index.js                 # Servidor principal Node.js
│   │   ├── Gestão de salas      # Criar/entrar/sair de salas
│   │   ├── Broadcast de estado  # Sincronizar jogadores
│   │   └── Lógica de jogo       # Processar disparos
│   └── package.json
│
├── app/                         # Navegação (Expo Router)
│   ├── _layout.tsx              # Layout raiz
│   ├── index.tsx                # Ecrã inicial
│   ├── game.tsx                 # Rota do jogo
│   └── ...                      # Outras rotas
│
├── App.tsx                      # Ponto de entrada
└── package.json                 # Dependências
```

---

## 🔄 Fluxo de Dados

### **Modo Local (Hot-Seat)**

```
1. Iniciar Jogo
   StartScreen → PlayMenuScreen → LobbyScreen
        ↓
   useGame().startLocalGame()
        ↓
   GameContext cria 2 jogadores com tabuleiros vazios
   Estado: phase = 'setup', currentTurn = 0

2. Setup (Posicionar Navios)
   SetupScreen (Player 1)
        ↓
   useGame().placeShipOnBoard(0, ship)
        ↓
   GameContext atualiza board do player1
        ↓
   useGame().setPlayerReady(0)
        ↓
   SetupScreen (Player 2)
        ↓
   useGame().placeShipOnBoard(1, ship)
        ↓
   useGame().setPlayerReady(1)
        ↓
   GameContext muda phase = 'playing'

3. Jogo (Disparos)
   GameScreen (Player 1 turn)
        ↓
   Jogador clica numa célula
        ↓
   useGame().fireAtPosition({row, col})
        ↓
   GameContext:
        - processFireOnBoard() processa disparo
        - Atualiza tabuleiros
        - areAllShipsSunk() verifica vitória
        - Alterna currentTurn se não ganhou
        - Muda phase = 'finished' se ganhou
        ↓
   GameScreen re-renderiza com novo estado
        ↓
   (Se não terminou) Turno do Player 2
   (Se terminou) → ResultScreen

4. Resultado
   ResultScreen
        ↓
   Exibe vencedor
        ↓
   useGame().updateStatistics(won)
        ↓
   Estatísticas guardadas no AsyncStorage
```

### **Modo Multiplayer (WebSocket)**

```
1. Conectar ao Servidor
   MultiplayerModeScreen
        ↓
   useGame().connectToServer('ws://IP:PORT')
        ↓
   Network.connect()
        ↓
   WebSocket estabelecido

2. Criar/Entrar em Sala
   Criar:
        useGame().createRoom()
        → Network.send({ type: 'CREATE_ROOM' })
        → Servidor responde: { type: 'ROOM_CREATED', code }
        → GameContext guarda roomCode

   Entrar:
        useGame().joinRoom(code)
        → Network.send({ type: 'JOIN_ROOM', code })
        → Servidor responde: { type: 'ROOM_JOINED' }
        → Quando 2 jogadores: { type: 'ROOM_READY' }

3. Setup (Posicionar Navios)
   SetupScreen
        ↓
   useGame().placeShipOnBoard(myIndex, ship)
        ↓
   useGame().setPlayerReady(myIndex)
        ↓
   Network.send({ type: 'PLAYER_READY', ships })
        ↓
   Servidor aguarda ambos jogadores prontos
        ↓
   Servidor envia: { type: 'SERVER_STATE', gameState }
        ↓
   GameContext atualiza com estado do servidor

4. Jogo (Disparos)
   GameScreen
        ↓
   useGame().fireAtPosition({row, col})
        ↓
   (Se não é meu turno) → Retorna
        ↓
   Network.send({ type: 'FIRE', position })
        ↓
   Servidor processa disparo
        ↓
   Servidor envia para ambos: { type: 'SERVER_STATE', gameState }
        ↓
   GameContext atualiza com novo estado
        ↓
   Ambos dispositivos re-renderizam

5. Resultado
   Quando phase = 'finished' no servidor
        ↓
   ResultScreen exibe vencedor
        ↓
   useGame().updateStatistics(won)
```

---

## 🎮 Gestão de Estado

### **GameContext (Context API)**

O GameContext é o **único source of truth** do estado do jogo.

**Estado Mantido:**

```typescript
interface GameState {
  roomId: string;              // ID da sala
  roomCode?: string;           // Código de 6 caracteres (MP)
  players: [Player, Player];   // Exatamente 2 jogadores
  currentTurn: 0 | 1;          // Índice do jogador atual
  phase: 'setup' | 'playing' | 'finished';  // Fase do jogo
  winner?: 0 | 1;              // Índice do vencedor
  mode: 'local' | 'multiplayer';  // Modo de jogo
  statistics?: Statistics;     // Estatísticas
}
```

**Funções Disponíveis:**

| Categoria | Função | Descrição |
|-----------|--------|-----------|
| **Estado** | `gameState` | Estado completo do jogo |
| | `myPlayerId` | ID deste jogador |
| | `isMyTurn` | Se é o turno deste jogador |
| **Local** | `startLocalGame()` | Iniciar jogo local |
| | `placeShipOnBoard()` | Colocar navio |
| | `fireAtPosition()` | Disparar |
| | `setPlayerReady()` | Marcar pronto |
| **MP** | `connectToServer()` | Conectar WebSocket |
| | `createRoom()` | Criar sala |
| | `joinRoom()` | Entrar em sala |
| **Stats** | `updateStatistics()` | Guardar estatísticas |

---

## 🌐 Comunicação de Rede

### **Protocolo WebSocket**

**Mensagens Cliente → Servidor:**

| Tipo | Payload | Descrição |
|------|---------|-----------|
| `CREATE_ROOM` | - | Criar nova sala |
| `JOIN_ROOM` | `{ code }` | Entrar em sala |
| `PLAYER_READY` | `{ ships }` | Pronto para jogar |
| `FIRE` | `{ position }` | Disparar |

**Mensagens Servidor → Cliente:**

| Tipo | Payload | Descrição |
|------|---------|-----------|
| `ROOM_CREATED` | `{ code }` | Sala criada |
| `ROOM_JOINED` | `{ code, playerCount }` | Entrou na sala |
| `ROOM_READY` | `{ code }` | 2 jogadores prontos |
| `SERVER_STATE` | `{ gameState }` | Estado atualizado |
| `PLAYER_ASSIGNED` | `{ playerId }` | ID atribuído |
| `ERROR` | `{ message }` | Erro genérico |

### **Sincronização de Estado**

O servidor é a **autoridade** do estado no modo multiplayer:

1. Cliente envia **ação** (ex: FIRE)
2. Servidor **processa** ação
3. Servidor **valida** (turno correto, posição válida)
4. Servidor **atualiza** estado
5. Servidor envia **SERVER_STATE** para **ambos** clientes
6. Clientes **substituem** estado local pelo do servidor

Isto previne:
- ❌ Disparar fora do turno
- ❌ Disparar na mesma célula duas vezes
- ❌ Trapaças (manipulação de estado local)

---

## 🎭 Fases do Jogo

```
┌──────────┐
│  setup   │  Posicionar navios
└────┬─────┘
     │ Ambos jogadores prontos
     ↓
┌──────────┐
│ playing  │  Alternar disparos
└────┬─────┘
     │ Todos navios afundados
     ↓
┌──────────┐
│ finished │  Exibir vencedor
└──────────┘
```

### **Transições**

| De | Para | Condição |
|----|------|----------|
| - | `setup` | `startLocalGame()` ou ambos na sala |
| `setup` | `playing` | Ambos jogadores `ready = true` |
| `playing` | `finished` | `areAllShipsSunk() = true` |
| `finished` | - | `resetGame()` |

---

## 🧩 Componentes Principais

### **Board.tsx**

Renderiza o tabuleiro 10x10.

**Props:**
- `board: Board` - Dados do tabuleiro
- `onCellPress?: (pos: Position) => void` - Callback de clique
- `isOpponent?: boolean` - Se é o tabuleiro adversário

**Renderização:**
- Matriz 10x10 de células
- Cores baseadas em `CellStatus`
- Interatividade apenas se `onCellPress` fornecido

### **GameContext.tsx**

Provider do estado global.

**Responsabilidades:**
- Manter `gameState`
- Processar ações do jogo
- Sincronizar com servidor (MP)
- Persistir estatísticas

### **network.ts**

Cliente WebSocket.

**Características:**
- Padrão Singleton
- Reconexão automática (5 tentativas)
- Sistema de handlers por tipo de mensagem
- Timeout de 10 segundos

---

## 🛠️ Decisões Técnicas

### **1. Context API vs Redux**

**Escolha: Context API**

**Razões:**
- ✅ Simplicidade (menos boilerplate)
- ✅ Suficiente para estado desta complexidade
- ✅ Hooks nativos (useContext)
- ✅ Menos dependências
- ❌ Redux seria overkill para este projeto

### **2. WebSocket vs HTTP Polling**

**Escolha: WebSocket**

**Razões:**
- ✅ Comunicação bidirecional em tempo real
- ✅ Baixa latência
- ✅ Menos overhead que polling
- ✅ Ideal para jogos turn-based

### **3. Imutabilidade**

**Escolha: Sempre criar novos objetos**

**Razões:**
- ✅ Previne bugs de mutação
- ✅ Facilita debugging
- ✅ Otimização de re-renders (React)
- ✅ Compatível com React DevTools

### **4. TypeScript Strict Mode**

**Escolha: TypeScript com strict**

**Razões:**
- ✅ Segurança de tipos
- ✅ Autocomplete melhorado
- ✅ Menos bugs em runtime
- ✅ Melhor manutenibilidade

---

## 🎨 Padrões de Design

### **1. Singleton Pattern**

**Onde:** `network.ts` (getNetwork, resetNetwork)

**Porquê:** Garantir apenas uma conexão WebSocket ativa.

### **2. Provider Pattern**

**Onde:** `GameContext.tsx` (GameProvider)

**Porquê:** Partilhar estado globalmente sem prop drilling.

### **3. Custom Hooks**

**Onde:** `useGame()`

**Porquê:** Encapsular lógica de acesso ao contexto.

### **4. Pure Functions**

**Onde:** `boardUtils.ts` (todas as funções)

**Porquê:** Testabilidade, previsibilidade, sem efeitos secundários.

### **5. Composition**

**Onde:** Componentes React

**Porquê:** Reutilização e flexibilidade.

---

## 📊 Diagrama de Sequência (Disparo)

### **Modo Local**

```
Jogador    GameScreen   GameContext   boardUtils
   │           │            │             │
   │──Clique──→│            │             │
   │           │──fire()───→│             │
   │           │            │──process──→ │
   │           │            │←──result──  │
   │           │←──update── │             │
   │←──render──│            │             │
```

### **Modo Multiplayer**

```
Jogador   GameScreen   GameContext   Network   Servidor   Oponente
   │          │            │           │          │           │
   │─Clique─→ │            │           │          │           │
   │          │──fire()──→ │           │          │           │
   │          │            │──send()──→│          │           │
   │          │            │           │──FIRE──→ │           │
   │          │            │           │          │─process─→ │
   │          │            │           │←─STATE── │           │
   │          │            │←─update── │          │           │
   │          │←─render──  │           │          │           │
   │          │            │           │──STATE─→ │           │
   │          │            │           │          │──update─→ │
```

---

## 🔐 Segurança

### **Validações**

1. **Cliente:**
   - Validação de posicionamento de navios
   - Verificação de turno (multiplayer)
   - Validação de inputs

2. **Servidor:**
   - Re-validação de todas as ações
   - Verificação de autoridade
   - Prevenção de trapaças

### **Dados Sensíveis**

- ❌ Não há senhas ou dados pessoais
- ✅ Estatísticas guardadas localmente
- ✅ Salas temporárias (não persistem)

---

## 🧪 Testabilidade

### **Funções Puras (boardUtils.ts)**

✅ Fácil de testar:
- Input determinístico → Output determinístico
- Sem efeitos secundários
- Sem dependências externas

**Exemplo:**

```typescript
test('canPlaceShip retorna false se posição inválida', () => {
  const board = createEmptyBoard();
  const positions = [{ row: 10, col: 0 }]; // Fora dos limites
  expect(canPlaceShip(board, positions)).toBe(false);
});
```

### **Context (GameContext.tsx)**

✅ Testável com mocks:
- Mockar AsyncStorage
- Mockar Network
- Testar state transitions

---

## 📈 Escalabilidade

### **Adicionar Novas Funcionalidades**

**Exemplo: Adicionar Power-ups**

1. Atualizar tipos (`types/index.ts`):
   ```typescript
   interface PowerUp {
     id: string;
     type: 'scan' | 'missile' | 'shield';
     used: boolean;
   }
   ```

2. Atualizar GameState:
   ```typescript
   interface Player {
     // ... campos existentes
     powerUps: PowerUp[];
   }
   ```

3. Adicionar função em GameContext:
   ```typescript
   usePowerUp: (powerUpId: string) => void;
   ```

4. Atualizar UI (GameScreen.tsx)

5. Atualizar servidor para sincronizar

---

## 🚀 Performance

### **Otimizações Implementadas**

1. **useCallback**: Prevenir re-criação de funções
2. **React.memo**: Evitar re-renders desnecessários (se usado)
3. **Funções Puras**: Facilitar memoização
4. **Estruturas Imutáveis**: Otimização de diffing do React

### **Melhorias Futuras**

- [ ] useMemo para cálculos complexos
- [ ] Virtualização de listas longas
- [ ] Lazy loading de ecrãs
- [ ] Code splitting

---

**Esta arquitetura foi desenhada para ser:**
- 📚 **Educativa**: Fácil de entender
- 🔧 **Manutenível**: Código limpo e documentado
- 🚀 **Escalável**: Fácil de estender
- 🧪 **Testável**: Lógica isolada
- ⚡ **Performante**: Otimizações inteligentes

---

**Autor**: Carlos Azevedo - 2026
