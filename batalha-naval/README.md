# ⚓ Batalha Naval - Multiplayer WebSocket Game

Jogo de Batalha Naval (Battleship) multiplayer para dispositivos móveis com React Native e Expo, suportando modo local e multiplayer via WiFi usando WebSocket.

![Batalha Naval](https://img.shields.io/badge/Platform-iOS%20%7C%20Android-blue)
![Tech](https://img.shields.io/badge/Tech-React%20Native%20%7C%20Expo%20%7C%20WebSocket-green)

## 🎮 Sobre o Jogo

Batalha Naval é um jogo clássico de estratégia onde dois jogadores tentam afundar a frota de navios um do outro. Esta implementação oferece:

- **Modo Local**: Jogue com um amigo no mesmo dispositivo (turnos alternados)
- **Modo Multiplayer**: Jogue via WiFi com dois dispositivos diferentes em tempo real
- **Interface intuitiva**: UI moderna e responsiva
- **Sincronização em tempo real**: Estado do jogo sincronizado via WebSocket

## 📋 Requisitos

- **Node.js** 14 ou superior
- **npm** ou **yarn**
- **Expo Go** app instalado nos smartphones (para testar)
- Para multiplayer: Dispositivos na mesma rede WiFi ou hotspot móvel

## 🚀 Início Rápido

### 1. Instalar Dependências

```bash
npm install
```

### 2. Executar o App (Cliente)

```bash
npm start
```

Escaneie o QR code com o app **Expo Go** em seu smartphone.

### 3. Para Modo Multiplayer

Consulte os guias detalhados:

- **[MULTIPLAYER_GUIDE.md](./MULTIPLAYER_GUIDE.md)** - Guia passo-a-passo completo
- **[SERVER_README.md](./SERVER_README.md)** - Documentação técnica do servidor

**Resumo rápido:**

1. Instale as dependências do servidor:
   ```bash
   cd server
   npm install
   cd ..
   ```

2. Execute o servidor:
   ```bash
   npm run server
   ```

3. Anote o endereço IP mostrado
4. Configure o app com esse IP em cada dispositivo
5. Entre na mesma sala e jogue!

## 📁 Estrutura do Projeto

```
batalha-naval/
├── app/                      # Rotas do Expo Router
│   ├── index.tsx            # Tela inicial
│   ├── multiplayer-connect.tsx
│   ├── lobby.tsx
│   ├── setup.tsx
│   ├── game.tsx
│   └── result.tsx
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── Board.tsx        # Tabuleiro do jogo
│   │   └── ShipSelector.tsx # Seletor de navios
│   ├── context/
│   │   └── GameContext.tsx  # Estado global do jogo
│   ├── screens/             # Telas do jogo
│   │   ├── HomeScreen.tsx
│   │   ├── MultiplayerConnectScreen.tsx
│   │   ├── LobbyScreen.tsx
│   │   ├── SetupScreen.tsx
│   │   ├── GameScreen.tsx
│   │   └── ResultScreen.tsx
│   ├── services/
│   │   └── network.ts       # Cliente WebSocket
│   ├── types/
│   │   └── index.ts         # Definições de tipos
│   └── utils/
│       └── boardUtils.ts    # Lógica do tabuleiro
├── server/
│   ├── index.js             # Servidor WebSocket
│   └── package.json
├── MULTIPLAYER_GUIDE.md     # Guia completo para jogar multiplayer
└── SERVER_README.md         # Documentação do servidor

```

## 🎯 Como Jogar

### Modo Local

1. Abra o app
2. Toque em **"Jogo Local"**
3. Cada jogador posiciona seus navios em seu turno
4. Alternem os turnos para atacar
5. Primeiro a afundar todos os navios do oponente vence!

### Modo Multiplayer

1. **Jogador 1**: Inicia o servidor em um computador
2. **Ambos**: Abrem o app em seus dispositivos
3. **Ambos**: Selecionam **"Multiplayer Online"**
4. **Ambos**: Digitam o mesmo endereço do servidor e ID de sala
5. **Ambos**: Posicionam seus navios
6. **Jogue!** O jogo sincroniza automaticamente

## 🎨 Características

- ✅ Jogo completo de Batalha Naval
- ✅ Modo Local e Multiplayer
- ✅ Interface moderna e intuitiva
- ✅ Sincronização em tempo real via WebSocket
- ✅ Detecção automática de vitória
- ✅ Indicadores visuais de turno
- ✅ Tratamento de desconexões
- ✅ Reconexão automática
- ✅ Botão de teste de conexão
- ✅ Documentação completa

## 🛠️ Tecnologias

- **React Native** - Framework mobile
- **Expo** - Ferramentas e serviços
- **TypeScript** - Tipagem estática
- **Expo Router** - Navegação baseada em arquivos
- **WebSocket** - Comunicação em tempo real
- **Node.js** - Servidor backend

## 📚 Documentação

- **[MULTIPLAYER_GUIDE.md](./MULTIPLAYER_GUIDE.md)** - Guia passo-a-passo para jogar multiplayer
- **[SERVER_README.md](./SERVER_README.md)** - Documentação técnica do servidor WebSocket
- **[Expo Documentation](https://docs.expo.dev/)** - Documentação oficial do Expo

## 🧪 Scripts Disponíveis

```bash
# Executar o app
npm start

# Executar em plataformas específicas
npm run android
npm run ios
npm run web

# Executar o servidor WebSocket
npm run server

# Linting
npm run lint
```

## ⚙️ Configuração

### Configurar IP do Servidor

Edite `app.json` e altere o IP do servidor:

```json
{
  "expo": {
    "extra": {
      "serverUrl": "ws://SEU-IP-AQUI:3000"
    }
  }
}
```

Ou configure diretamente no app na tela de conexão multiplayer.

## 🐛 Troubleshooting

### Não consigo conectar ao servidor

1. Verifique se o servidor está rodando
2. Confirme que todos os dispositivos estão na mesma rede
3. Verifique o firewall (porta 3000 deve estar aberta)
4. Use o botão "Testar Conexão" no app

### App não carrega

1. Certifique-se de que o Expo Go está instalado
2. Verifique se os dispositivos estão na mesma rede que o computador
3. Tente digitar manualmente o endereço no Expo Go

### Jogo desconecta durante partida

1. Verifique a qualidade da conexão WiFi
2. Aproxime os dispositivos do roteador/hotspot
3. Evite usar apps que consumam muita banda

## 🤝 Contribuindo

Este projeto foi desenvolvido para fins educacionais (PDM - Programação para Dispositivos Móveis).

## 📄 Licença

MIT License

## 👥 Desenvolvido por

Projeto desenvolvido para a disciplina de Programação para Dispositivos Móveis.

---

**🎮 Divirta-se jogando Batalha Naval! ⚓**
