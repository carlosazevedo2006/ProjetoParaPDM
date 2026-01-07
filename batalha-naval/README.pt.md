# 🚢 Batalha Naval - Jogo Multiplayer

Jogo clássico da Batalha Naval desenvolvido em React Native com Expo, suportando modo local e multiplayer online.

---

## 📖 Descrição

Implementação digital completa do jogo de tabuleiro clássico onde dois jogadores tentam afundar a frota um do outro. O jogo suporta:

- **Modo Local**: Dois jogadores no mesmo dispositivo (hot-seat)
- **Modo Multiplayer**: Dois jogadores em dispositivos diferentes via WebSocket

---

## 🎮 Como Jogar

### **Objetivo**

Ser o primeiro a afundar todos os 5 navios do adversário.

### **Navios**

Cada jogador tem 5 navios de tamanhos diferentes:

| Navio | Tamanho | Quantidade |
|-------|---------|------------|
| Porta-aviões | 5 células | 1 |
| Encouraçado | 4 células | 1 |
| Cruzador | 3 células | 1 |
| Submarino | 3 células | 1 |
| Destroyer | 2 células | 1 |

**Total: 17 células ocupadas** por cada jogador.

### **Regras**

1. **Configuração**:
   - Cada jogador posiciona secretamente os 5 navios no seu tabuleiro 10x10
   - Navios podem ser colocados horizontal ou verticalmente
   - Navios não podem sobrepor-se
   - Deve haver pelo menos 1 célula de distância entre navios (incluindo diagonais)

2. **Jogo**:
   - Os jogadores alternam turnos disparando numa célula do tabuleiro adversário
   - **"Água"** se errar (célula fica cinza)
   - **"Acerto"** se atingir um navio (célula fica vermelha)
   - Quando todas as células de um navio são atingidas, está **afundado**
   - Jogador que afundar todos os navios adversários primeiro **ganha**

3. **Vitória**:
   - O primeiro a afundar todos os 5 navios do adversário ganha
   - Estatísticas são guardadas localmente no dispositivo

---

## 🚀 Instalação e Configuração

### **Pré-requisitos**

- Node.js (v14 ou superior)
- npm ou yarn
- Expo CLI (`npm install -g expo-cli`)
- Dispositivo móvel com Expo Go ou emulador Android/iOS

### **Passos de Instalação**

```bash
# 1. Clonar repositório
git clone https://github.com/carlosazevedo2006/ProjetoParaPDM.git

# 2. Entrar na pasta do projeto
cd ProjetoParaPDM/batalha-naval

# 3. Instalar dependências
npm install

# 4. Iniciar aplicação
npm start
# ou
expo start

# 5. Escanear QR code com Expo Go (dispositivo físico)
# ou pressionar 'a' para Android emulator / 'i' para iOS simulator
```

### **Servidor Multiplayer (Opcional)**

Para jogar no modo multiplayer, é necessário iniciar o servidor WebSocket:

```bash
# Entrar na pasta do servidor
cd batalha-naval/server

# Instalar dependências do servidor (apenas primeira vez)
npm install

# Iniciar servidor
node index.js

# Servidor inicia em ws://192.168.1.69:3000 (ajustar IP conforme necessário)
```

**NOTA**: Certifica-te que ambos dispositivos estão na mesma rede WiFi.

---

## 📱 Tecnologias Utilizadas

### **Frontend (App)**

- **React Native**: Framework para desenvolvimento mobile multiplataforma
- **Expo**: Plataforma para desenvolvimento e build de apps React Native
- **TypeScript**: Tipagem estática para maior segurança e manutenibilidade
- **Context API**: Gestão de estado global da aplicação
- **AsyncStorage**: Persistência local de estatísticas

### **Backend (Servidor)**

- **Node.js**: Runtime JavaScript do lado do servidor
- **WebSocket (ws)**: Comunicação bidirecional em tempo real

### **Arquitetura**

```
Frontend (React Native)
    ↓
Context API (Estado Global)
    ↓
WebSocket Client ←→ WebSocket Server ←→ WebSocket Client
    ↓                                           ↓
Dispositivo A                            Dispositivo B
```

---

## 🏗️ Estrutura do Projeto

```
batalha-naval/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── Board.tsx        # Tabuleiro 10x10
│   │   └── ShipSelector.tsx # Seletor de navios
│   ├── context/             # Context API
│   │   └── GameContext.tsx  # Estado global do jogo
│   ├── models/              # Tipos e interfaces
│   │   └── index.ts         # Tipos TypeScript
│   ├── screens/             # Ecrãs da aplicação
│   │   ├── StartScreen.tsx
│   │   ├── PlayMenuScreen.tsx
│   │   ├── LobbyScreen.tsx
│   │   ├── SetupScreen.tsx
│   │   ├── GameScreen.tsx
│   │   ├── ResultScreen.tsx
│   │   └── ...
│   ├── services/            # Serviços externos
│   │   └── network.ts       # Cliente WebSocket
│   ├── styles/              # Estilos globais
│   │   ├── colors.ts        # Paleta de cores
│   │   └── common.ts        # Estilos comuns
│   └── utils/               # Funções auxiliares
│       └── boardUtils.ts    # Lógica do tabuleiro
├── server/                  # Servidor WebSocket
│   ├── index.js             # Servidor principal
│   └── package.json
├── app/                     # Navegação (Expo Router)
├── App.tsx                  # Ponto de entrada
└── package.json
```

---

## 🎯 Funcionalidades

### **✅ Implementado**

- ✅ Modo Local (Hot-Seat)
- ✅ Modo Multiplayer (WebSocket)
- ✅ Sistema de salas com códigos (6 caracteres)
- ✅ Colocação manual de navios
- ✅ Colocação aleatória de navios
- ✅ Validação de posicionamento
- ✅ Lógica completa de jogo
- ✅ Detecção de acertos/água
- ✅ Detecção de navios afundados
- ✅ Sistema de turnos
- ✅ Detecção de vitória
- ✅ Estatísticas (vitórias, derrotas, taxa de vitória)
- ✅ Persistência de estatísticas
- ✅ Tema escuro
- ✅ Interface intuitiva
- ✅ Animações e feedback visual

### **🚧 Melhorias Futuras**

- 🚧 Sons e efeitos sonoros
- 🚧 Animações avançadas
- 🚧 Chat entre jogadores
- 🚧 Sistema de ranking global
- 🚧 Modo contra IA
- 🚧 Power-ups especiais
- 🚧 Tabuleiros de tamanhos variados

---

## 📚 Fluxo do Jogo

### **Modo Local**

```
Ecrã Inicial
    ↓
Escolher Modo → Local
    ↓
Lobby (Configurar nomes)
    ↓
Setup (Posicionar navios) → Jogador 1
    ↓
Setup (Posicionar navios) → Jogador 2
    ↓
Jogo (Alternar disparos)
    ↓
Resultado (Vencedor + Estatísticas)
```

### **Modo Multiplayer**

```
Ecrã Inicial
    ↓
Escolher Modo → Multiplayer
    ↓
Escolher: Criar Sala / Entrar em Sala
    ↓
Criar Sala → Gerar Código (ex: ABC123)
ou
Entrar em Sala → Inserir Código
    ↓
Aguardar outro jogador
    ↓
Setup (Ambos posicionam navios)
    ↓
Jogo (Alternar disparos via servidor)
    ↓
Resultado (Vencedor + Estatísticas)
```

---

## 🔧 Configuração do Servidor

### **Configurar IP do Servidor**

O servidor deve ser configurado com o IP correto da máquina que o está a executar:

1. Descobrir IP da máquina:
   ```bash
   # Windows
   ipconfig
   
   # Mac/Linux
   ifconfig
   # ou
   ip addr show
   ```

2. Editar `server/index.js`:
   ```javascript
   const HOST = '192.168.1.69'; // MUDAR PARA TEU IP
   const PORT = 3000;
   ```

3. Editar `src/config/index.ts` (se existir):
   ```typescript
   export const SERVER_URL = 'ws://192.168.1.69:3000';
   ```

**IMPORTANTE**: Ambos dispositivos devem estar na mesma rede WiFi.

---

## 📊 Estatísticas

O jogo rastreia as seguintes estatísticas para cada jogador:

- **Jogos Jogados**: Total de partidas concluídas
- **Vitórias**: Total de vitórias
- **Derrotas**: Total de derrotas
- **Taxa de Vitória**: Percentagem de vitórias

As estatísticas são guardadas localmente em cada dispositivo usando `AsyncStorage`.

---

## 🐛 Resolução de Problemas

### **Servidor não conecta**

1. Verificar se servidor está em execução:
   ```bash
   cd server
   node index.js
   ```

2. Verificar se IP está correto (mesmo IP que aparece no terminal do servidor)

3. Verificar firewall (pode estar a bloquear porta 3000)

4. Certificar que ambos dispositivos estão na mesma rede WiFi

### **App não inicia**

1. Limpar cache do Expo:
   ```bash
   expo start -c
   ```

2. Reinstalar dependências:
   ```bash
   rm -rf node_modules
   npm install
   ```

3. Verificar versão do Node.js:
   ```bash
   node --version  # Deve ser v14 ou superior
   ```

### **Erros de TypeScript**

```bash
# Verificar tipos
npx tsc --noEmit
```

---

## 👨‍💻 Desenvolvimento

### **Estrutura de Desenvolvimento**

```bash
# Modo de desenvolvimento
npm start

# Executar linter
npm run lint

# Executar testes (se implementados)
npm test

# Build para produção
expo build:android  # Android
expo build:ios      # iOS
```

### **Convenções de Código**

- **Idioma**: Comentários e documentação em Português de Portugal
- **Nomenclatura**: camelCase para variáveis/funções, PascalCase para componentes
- **Tipos**: Sempre usar TypeScript strict mode
- **Imutabilidade**: Preferir operações imutáveis (spread, map, filter)
- **Componentes**: Componentes funcionais com hooks

---

## 📄 Licença

Este projeto foi desenvolvido como projeto académico para a disciplina de Programação em Dispositivos Móveis (PDM).

---

## ✨ Autor

**Carlos Azevedo** - 2026

---

## 🙏 Agradecimentos

- Professores da disciplina PDM
- Comunidade React Native
- Documentação do Expo
- Inspiração no jogo clássico Battleship

---

## 📞 Contacto

Para questões ou sugestões sobre o projeto, contactar através do GitHub.

---

## 📖 Documentação Adicional

Para mais informação sobre a arquitetura e implementação técnica, consultar:

- `ARCHITECTURE.pt.md` - Arquitetura detalhada do sistema
- Comentários no código - Documentação inline extensiva
- `src/types/index.ts` - Definições de tipos e interfaces

---

**Divirte-te a jogar Batalha Naval! ⚓🎯**
