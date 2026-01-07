# Sistema de Salas com Códigos - Guia de Uso

## 🎯 Visão Geral

O novo sistema de salas elimina a necessidade de configuração manual de endereços IP, tornando o multiplayer simples e acessível.

## 🚀 Como Usar

### Para o Jogador que Cria a Sala (Anfitrião)

1. **Iniciar o Servidor** (apenas uma vez por rede)
   ```bash
   cd batalha-naval
   npm run server
   ```
   O servidor mostrará o IP da máquina, mas não é mais necessário configurá-lo manualmente!

2. **No Aplicativo**:
   - Abrir o app
   - Escolher "Multiplayer Online"
   - Selecionar "Criar Sala"
   - Aguardar enquanto a sala é criada
   - **Copiar o código de 6 caracteres** (ex: `ABC123`)
   - Compartilhar este código com o outro jogador
   - Aguardar o outro jogador entrar

### Para o Jogador que Entra na Sala (Convidado)

1. **No Aplicativo**:
   - Abrir o app
   - Escolher "Multiplayer Online"
   - Selecionar "Entrar em Sala"
   - **Digitar o código** recebido do anfitrião
   - Pressionar "Entrar"

### Quando Ambos Estiverem Conectados

- Ambos os jogadores serão automaticamente levados ao lobby
- Posicionar os navios no tabuleiro
- Começar a jogar!

## 📋 Especificações Técnicas

### Códigos de Sala

- **Formato**: 6 caracteres alfanuméricos (A-Z, 0-9)
- **Exemplo**: `ABC123`, `XYZ789`, `A1B2C3`
- **Geração**: Aleatória pelo servidor
- **Unicidade**: Garantida (verificação de duplicatas)

### Mensagens do Servidor

#### CREATE_ROOM
Criação de nova sala.

**Request**:
```json
{
  "type": "CREATE_ROOM"
}
```

**Response**:
```json
{
  "type": "ROOM_CREATED",
  "payload": {
    "code": "ABC123"
  }
}
```

#### JOIN_ROOM
Entrar em sala existente.

**Request**:
```json
{
  "type": "JOIN_ROOM",
  "payload": {
    "code": "ABC123"
  }
}
```

**Response (Sucesso)**:
```json
{
  "type": "ROOM_JOINED",
  "payload": {
    "code": "ABC123",
    "playerCount": 2
  }
}
```

**Response (Erro - Sala Cheia)**:
```json
{
  "type": "ROOM_FULL",
  "payload": {
    "code": "ABC123"
  }
}
```

**Response (Erro - Sala Não Encontrada)**:
```json
{
  "type": "ROOM_NOT_FOUND",
  "payload": {
    "code": "ABC123"
  }
}
```

#### ROOM_READY
Notificação quando ambos os jogadores conectam.

```json
{
  "type": "ROOM_READY",
  "payload": {
    "code": "ABC123"
  }
}
```

#### PLAYER_LEFT
Notificação quando um jogador desconecta.

```json
{
  "type": "PLAYER_LEFT",
  "payload": {
    "code": "ABC123"
  }
}
```

### Gerenciamento de Salas

- **Criação**: Automática quando o primeiro jogador requisita
- **Limite**: 2 jogadores por sala
- **Limpeza**: Automática quando todos os jogadores desconectam
- **Timeout**: Salas vazias são removidas após 30 minutos
- **Limpeza Periódica**: A cada 5 minutos

## 🔧 Configuração do Servidor

### Requisitos

- Node.js instalado
- Pacote `ws` (WebSocket)
- Pacote `uuid` para IDs únicos

### Instalação

```bash
cd batalha-naval/server
npm install
```

### Executar

```bash
npm start
# ou
node index.js
```

### Configurar URL do Servidor (Cliente)

O URL do servidor pode ser configurado de várias formas:

#### Opção 1: Variável de Ambiente (Recomendado)

Criar arquivo `.env` na raiz do projeto:

```bash
EXPO_PUBLIC_SERVER_URL=ws://SEU_IP:3000
```

#### Opção 2: Arquivo de Configuração

Editar `src/config/index.ts`:

```typescript
export const DEFAULT_SERVER_URL = 'ws://SEU_IP:3000';
```

#### Opção 3: Descoberta Automática de IP (Futuro)

Sistema pode ser estendido para descobrir automaticamente o servidor na rede local usando mDNS/Bonjour.

### Testar

```bash
node test-rooms.js
```

## 📱 Configuração do Cliente (App)

### Dependências Adicionadas

```json
{
  "expo-clipboard": "para copiar código da sala"
}
```

### Instalação

```bash
cd batalha-naval
npm install
```

## 🎨 Interfaces Criadas

### 1. MultiplayerModeScreen
Tela de seleção entre criar ou entrar em sala.

**Navegação**: `/multiplayer-mode`

### 2. CreateRoomScreen
Tela para criar sala e mostrar código.

**Navegação**: `/create-room`

**Funcionalidades**:
- Cria sala automaticamente ao abrir
- Mostra código em destaque
- Botão para copiar código
- Aguarda segundo jogador
- Navega para lobby quando ambos conectados

### 3. JoinRoomScreen
Tela para entrar em sala com código.

**Navegação**: `/join-room`

**Funcionalidades**:
- Input para código de 6 caracteres
- Validação em tempo real
- Apenas letras e números (uppercase)
- Botão desabilitado até código válido
- Navega para lobby quando conexão bem-sucedida

## 🔒 Segurança e Validação

### Validação de Código

```typescript
function validateCode(code: string): boolean {
  const regex = /^[A-Z0-9]{6}$/;
  return regex.test(code);
}
```

### Tratamento de Erros

1. **Sala não encontrada**: Mensagem clara ao usuário
2. **Sala cheia**: Informa que a sala já tem 2 jogadores
3. **Timeout de conexão**: 10 segundos para cada operação
4. **Desconexão**: Notifica o outro jogador

## 🎯 Benefícios

### Antes (Sistema Antigo)
- ❌ Configurar IP manualmente
- ❌ Editar `app.json`
- ❌ Descobrir IP da máquina
- ❌ Reconfigurar em cada WiFi
- ❌ Conhecimento técnico necessário

### Agora (Novo Sistema)
- ✅ Apenas um código de 6 caracteres
- ✅ Zero configuração
- ✅ Funciona em qualquer WiFi
- ✅ Interface intuitiva
- ✅ Experiência profissional

## 🐛 Troubleshooting

### Erro: "Não foi possível criar a sala"
- Verificar se o servidor está rodando
- Verificar conexão de rede
- Verificar se a porta 3000 está disponível

### Erro: "Sala não encontrada"
- Verificar se o código está correto
- Verificar se o código tem 6 caracteres
- Verificar se o outro jogador criou a sala
- Verificar se a sala não foi fechada (timeout)

### Erro: "Sala cheia"
- A sala já tem 2 jogadores
- Pedir ao anfitrião para criar nova sala

### Jogador desconectou
- O outro jogador receberá notificação
- Pode aguardar reconexão ou sair da sala

## 📊 Status do Projeto

✅ **Completo e Funcional**

- [x] Sistema de códigos implementado
- [x] Interfaces criadas
- [x] Servidor atualizado
- [x] Testes automatizados
- [x] Documentação completa
- [x] Compatibilidade com sistema legado mantida

## 🔄 Compatibilidade

O sistema antigo (`JOIN_OR_CREATE` com `roomId`) ainda funciona para compatibilidade com versões antigas, mas o novo sistema de códigos é o recomendado.

## 📞 Suporte

Para problemas ou dúvidas, consultar:
1. Esta documentação
2. Logs do servidor (`console.log`)
3. Testes automatizados (`test-rooms.js`)
4. Código-fonte nos diretórios:
   - `src/screens/MultiplayerModeScreen.tsx`
   - `src/screens/CreateRoomScreen.tsx`
   - `src/screens/JoinRoomScreen.tsx`
   - `src/context/GameContext.tsx`
   - `src/services/network.ts`
   - `server/index.js`
