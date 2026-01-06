# 🚀 Servidor WebSocket - Batalha Naval

Este é o servidor WebSocket para o jogo multiplayer Batalha Naval. Ele gerencia a comunicação em tempo real entre dois jogadores conectados na mesma rede WiFi.

## 📋 Pré-requisitos

- **Node.js** versão 14 ou superior
- **npm** (geralmente vem com Node.js)
- **Rede WiFi** ou hotspot móvel para conectar os dispositivos

## 🔧 Instalação

1. Navegue até o diretório do servidor:
```bash
cd server
```

2. Instale as dependências:
```bash
npm install
```

## ▶️ Como Executar o Servidor

### Método 1: Execução Normal
```bash
npm start
```

### Método 2: Modo Desenvolvimento (com auto-reload)
```bash
npm run dev
```

### Método 3: Do diretório raiz do projeto
```bash
npm run server
```

## 🌐 Descobrindo o Endereço IP

Após iniciar o servidor, você verá uma mensagem como:
```
🚀 Batalha Naval WebSocket server running on port 3000
📡 Clients can connect to ws://<your-ip>:3000
```

### Para descobrir seu IP:

**Windows:**
```bash
ipconfig
```
Procure por "Endereço IPv4" na seção da sua conexão WiFi (geralmente algo como `192.168.x.x`)

**macOS/Linux:**
```bash
ifconfig
# ou
ip addr show
```
Procure por `inet` seguido de um endereço IP (geralmente `192.168.x.x`)

**Alternativa fácil (Node.js):**
Execute este comando no terminal:
```bash
node -e "require('os').networkInterfaces()['Wi-Fi']?.forEach(i => i.family === 'IPv4' && console.log(i.address))"
```

## 📱 Configurando os Clientes

1. **Anote o endereço IP** mostrado ao iniciar o servidor
2. **Abra o app** em cada dispositivo móvel
3. **Selecione "Multiplayer Online"**
4. **Digite o endereço do servidor** no formato: `ws://SEU-IP:3000`
   - Exemplo: `ws://192.168.1.100:3000`
5. **Digite o mesmo ID de sala** em ambos os dispositivos
6. **Digite seu nome** e clique em "Conectar"

## 🔌 Estrutura de Mensagens

### Mensagens do Cliente → Servidor

#### JOIN_OR_CREATE
Criar ou entrar em uma sala:
```json
{
  "type": "JOIN_OR_CREATE",
  "roomId": "sala1",
  "playerName": "João"
}
```

#### PLAYER_READY
Indicar que o jogador terminou de posicionar os navios:
```json
{
  "type": "PLAYER_READY",
  "ships": [
    {
      "id": "uuid",
      "type": "carrier",
      "size": 5,
      "positions": [{"row": 0, "col": 0}, ...],
      "hits": 0,
      "sunk": false
    }
  ]
}
```

#### FIRE
Disparar em uma posição:
```json
{
  "type": "FIRE",
  "position": {"row": 3, "col": 5}
}
```

#### RESET
Reiniciar o jogo:
```json
{
  "type": "RESET"
}
```

### Mensagens do Servidor → Cliente

#### SERVER_STATE
Estado completo do jogo:
```json
{
  "type": "SERVER_STATE",
  "gameState": {
    "roomId": "sala1",
    "players": [player1, player2],
    "currentTurn": 0,
    "phase": "playing",
    "mode": "multiplayer",
    "winner": undefined
  }
}
```

#### ERROR
Mensagem de erro:
```json
{
  "type": "ERROR",
  "message": "Room is full"
}
```

#### DISCONNECT
Notificação de desconexão:
```json
{
  "type": "DISCONNECT",
  "message": "Opponent disconnected"
}
```

## 🏠 Configuração de Rede

### Opção 1: Hotspot Móvel (Mais Fácil)

1. **Ative o hotspot** em um dos smartphones
2. **Conecte o computador** (que rodará o servidor) ao hotspot
3. **Conecte o outro smartphone** ao mesmo hotspot
4. **Execute o servidor** no computador
5. **Use o IP do computador** nos apps dos smartphones

### Opção 2: Rede WiFi Doméstica

1. **Conecte todos os dispositivos** (computador + smartphones) à mesma rede WiFi
2. **Execute o servidor** no computador
3. **Use o IP do computador** nos apps dos smartphones

### ⚠️ Importante

- Certifique-se de que o **firewall** não está bloqueando a porta 3000
- Todos os dispositivos devem estar na **mesma rede**
- Alguns roteadores podem ter **isolamento AP** ativado, o que impede dispositivos de se comunicarem

## 🐛 Troubleshooting

### Problema: "Connection timeout" ou "Cannot connect"

**Soluções:**
1. Verifique se o servidor está rodando
2. Confirme que o IP está correto
3. Verifique se o firewall não está bloqueando a porta 3000
4. Certifique-se de que todos estão na mesma rede
5. Tente desativar temporariamente o firewall para testar

**Windows - Abrir porta no firewall:**
```
1. Painel de Controle → Sistema e Segurança → Firewall do Windows
2. Configurações Avançadas → Regras de Entrada
3. Nova Regra → Porta → TCP → Porta 3000 → Permitir
```

### Problema: "Room is full"

**Causa:** A sala já tem 2 jogadores conectados

**Solução:** Use um ID de sala diferente ou aguarde um jogador sair

### Problema: "Opponent disconnected"

**Causa:** O oponente perdeu a conexão

**Soluções:**
1. Verifique a conexão de rede
2. Reconecte ao servidor
3. Entre na mesma sala novamente

### Problema: Servidor não inicia

**Soluções:**
1. Verifique se o Node.js está instalado: `node --version`
2. Reinstale as dependências: `npm install`
3. Verifique se a porta 3000 não está em uso: `netstat -an | grep 3000` (Linux/macOS) ou `netstat -an | findstr 3000` (Windows)

## 📊 Logs do Servidor

O servidor registra eventos importantes:

```
🚀 Batalha Naval WebSocket server running on port 3000
📡 Clients can connect to ws://<your-ip>:3000
👤 New client connected
🏠 Creating room: sala1
✅ Player 1 joined room: sala1
👥 Player 2 joining room: sala1
✅ Player 2 joined room: sala1
✅ Player 1 is ready in room: sala1
✅ Player 2 is ready in room: sala1
🎮 Game starting in room: sala1
💥 Player 1 fired at (3, 5) - HIT
🏆 Player 1 wins in room: sala1
👋 Client disconnected
🗑️ Room deleted: sala1
```

## 🔒 Segurança

- O servidor **valida todas as mensagens** recebidas
- O servidor mantém o **estado autoritativo** do jogo
- Jogadores **não podem disparar fora do seu turno**
- **Inputs são sanitizados** para prevenir injeção

## 🛠️ Desenvolvimento

Para modificar o servidor:

1. Edite `server/index.js`
2. Reinicie o servidor (ou use `npm run dev` para auto-reload)
3. Teste com os clientes

### Estrutura do Código

- **Gerenciamento de Salas:** Map de roomId → Room
- **Estado do Jogo:** Mantido em memória por sala
- **Validação:** Todas as ações são validadas no servidor
- **Broadcast:** Estado é enviado a todos os clientes da sala após cada ação

## 📝 Notas Adicionais

- **Limite de Salas:** Sem limite (memória do servidor é o limite)
- **Persistência:** Estado não é persistido (reiniciar servidor limpa tudo)
- **Escalabilidade:** Adequado para uso local/pequena escala
- **Produção:** Para produção, considere adicionar autenticação, persistência (Redis/DB), e usar cluster

## 🆘 Suporte

Se encontrar problemas:

1. Verifique os logs do servidor
2. Verifique os logs do app (console do Expo)
3. Teste a conexão com o botão "Testar Conexão"
4. Revise a seção de Troubleshooting acima

## 📄 Licença

MIT License
