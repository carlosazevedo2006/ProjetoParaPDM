# 🎮 Guia Multiplayer - Batalha Naval

Guia completo passo-a-passo para jogar Batalha Naval multiplayer via WiFi com dois dispositivos.

## 📋 O Que Você Precisa

- **2 smartphones** (Android ou iOS) com Expo Go instalado
- **1 computador** para rodar o servidor
- **Rede WiFi** ou **Hotspot móvel**
- **Node.js** instalado no computador

## 🚀 Passo 1: Preparar o Ambiente

### 1.1 Instalar Dependências

No computador, abra o terminal e execute:

```bash
cd batalha-naval
npm install
```

Depois, instale as dependências do servidor:

```bash
cd server
npm install
cd ..
```

### 1.2 Instalar Expo Go nos Smartphones

1. Abra a **Google Play Store** (Android) ou **App Store** (iOS)
2. Procure por **"Expo Go"**
3. Instale o app em **ambos os smartphones**

## 🌐 Passo 2: Configurar a Rede

### Opção A: Usando Hotspot Móvel (Recomendado para Iniciantes)

1. **No Smartphone 1:**
   - Vá em Configurações → Rede → Hotspot/Tethering
   - Ative o **Hotspot WiFi**
   - Anote o **nome da rede** e **senha**

2. **No Computador:**
   - Conecte à rede WiFi do hotspot criado
   - Anote o endereço IP do computador (veremos como no próximo passo)

3. **No Smartphone 2:**
   - Conecte à mesma rede WiFi do hotspot

### Opção B: Usando Rede WiFi Doméstica

1. Conecte **todos os dispositivos** (computador + 2 smartphones) à **mesma rede WiFi**
2. Certifique-se de que o roteador permite comunicação entre dispositivos

## 🖥️ Passo 3: Iniciar o Servidor

### 3.1 Executar o Servidor

No terminal do computador:

```bash
cd batalha-naval
npm run server
```

Você verá uma mensagem como:

```
🚀 Batalha Naval WebSocket server running on port 3000
📡 Clients can connect to ws://<your-ip>:3000
```

### 3.2 Descobrir o IP do Computador

**Windows:**
```bash
ipconfig
```
Procure por **"Endereço IPv4"** (algo como `192.168.x.x`)

**macOS:**
```bash
ifconfig
```
Procure por **`inet`** seguido de um IP (algo como `192.168.x.x`)

**Linux:**
```bash
ip addr show
```
Procure por **`inet`** seguido de um IP (algo como `192.168.x.x`)

**Exemplo de IP:** `192.168.43.100`

### 3.3 Anote o Endereço Completo

Formato: `ws://SEU-IP:3000`

Exemplo: `ws://192.168.43.100:3000`

## 📱 Passo 4: Configurar o App

### 4.1 Abrir o Projeto no Expo

No terminal do computador (em outra aba/janela):

```bash
cd batalha-naval
npx expo start
```

Um QR code aparecerá no terminal.

### 4.2 Abrir o App nos Smartphones

1. Abra o **Expo Go** em cada smartphone
2. Escaneie o **QR code** mostrado no terminal
3. O app será carregado automaticamente

**Dica:** Se o QR code não funcionar, você pode digitar manualmente o endereço exp://SEU-IP:8081 no Expo Go.

## 🎮 Passo 5: Jogar!

### 5.1 Conectar ao Servidor

**No Smartphone 1 (Jogador 1):**
1. Toque em **"🌐 Multiplayer Online"**
2. Digite o endereço do servidor: `ws://192.168.43.100:3000` (use seu IP)
3. Clique em **"🔍 Testar Conexão"** para verificar
4. Digite um **ID de sala**, exemplo: `sala1`
5. Digite seu **nome**, exemplo: `João`
6. Clique em **"Conectar e Entrar na Sala"**

**No Smartphone 2 (Jogador 2):**
1. Toque em **"🌐 Multiplayer Online"**
2. Digite o **mesmo endereço do servidor**: `ws://192.168.43.100:3000`
3. Digite o **mesmo ID de sala**: `sala1`
4. Digite seu **nome**, exemplo: `Maria`
5. Clique em **"Conectar e Entrar na Sala"**

### 5.2 Aguardar na Sala de Espera

Quando ambos os jogadores estiverem conectados, você verá:
- ✅ Todos os jogadores conectados!
- A tela mudará automaticamente para a fase de posicionamento

### 5.3 Posicionar os Navios

**Cada jogador (nos seus respectivos dispositivos):**

1. Selecione um **navio** da lista
2. Escolha a **orientação** (Horizontal ➡️ ou Vertical ⬇️)
3. Toque no **tabuleiro** onde deseja posicionar
4. Repita até posicionar todos os 5 navios:
   - Porta-aviões (5 casas)
   - Encouraçado (4 casas)
   - Cruzador (3 casas)
   - Submarino (3 casas)
   - Destroyer (2 casas)
5. Clique em **"✅ Estou Pronto!"**

### 5.4 Jogar a Batalha

**Quando ambos estiverem prontos, o jogo começa!**

- No **topo da tela**, você verá se é **SUA VEZ** ou **VEZ DO OPONENTE**
- **Tabuleiro do Oponente (topo):** Clique para atacar
- **Seu Tabuleiro (baixo):** Veja seus navios e ataques recebidos

**No seu turno:**
1. Toque em uma **casa do tabuleiro do oponente**
2. Se acertar: ✕ vermelho
3. Se errar: ○ cinza
4. O turno passa para o oponente

**Aguarde o oponente jogar quando não for sua vez.**

### 5.5 Vencer o Jogo

- O jogo termina quando **todos os navios de um jogador** forem afundados
- A tela de resultado mostra:
  - 🎉 **VITÓRIA!** se você venceu
  - 😔 **DERROTA** se perdeu
  - Estatísticas do jogo

## ❓ Problemas Comuns e Soluções

### "Connection timeout" ou "Não foi possível conectar"

**Causas:**
- Servidor não está rodando
- IP incorreto
- Dispositivos em redes diferentes
- Firewall bloqueando a porta 3000

**Soluções:**
1. Verifique se o servidor está rodando (deve mostrar logs no terminal)
2. Confirme que o IP está correto
3. Certifique-se de que todos os dispositivos estão na mesma rede
4. No Windows, adicione exceção no firewall para a porta 3000
5. Tente usar um hotspot móvel em vez de WiFi doméstico

### "Room is full"

**Causa:** A sala já tem 2 jogadores

**Solução:** Use um **ID de sala diferente** ou aguarde um jogador sair

### App carrega mas não conecta ao servidor

**Soluções:**
1. Verifique se o endereço está no formato correto: `ws://IP:3000`
2. Use o botão **"Testar Conexão"** antes de entrar
3. Verifique se não há **espaços** no endereço digitado

### "Aguardando oponente..." por muito tempo

**Causas:**
- Oponente ainda não conectou
- Oponente usou ID de sala diferente

**Solução:**
- Confirme que ambos digitaram o **mesmo ID de sala**
- Peça ao oponente para reconectar

### Jogo trava ou desconecta durante partida

**Soluções:**
1. Verifique a qualidade da conexão WiFi
2. Aproxime os dispositivos do roteador/hotspot
3. Evite usar outras apps que consumam muita rede
4. Reinicie o servidor e reconecte

## 💡 Dicas e Truques

### Para Melhor Experiência

1. **Use Hotspot Móvel:** Geralmente mais confiável que WiFi doméstico
2. **Mantenha o Servidor Visível:** Deixe o terminal aberto para ver logs
3. **Anote o IP:** Escreva em um papel para facilitar
4. **Teste Antes:** Use o botão "Testar Conexão" antes de jogar

### Estratégias de Jogo

1. **Não coloque navios juntos:** Deixe pelo menos 1 casa de distância
2. **Varie seus ataques:** Não ataque sempre no mesmo padrão
3. **Marque seus acertos:** O jogo marca automaticamente com ✕
4. **Preste atenção nos padrões:** Após um acerto, tente as casas adjacentes

## 🔄 Jogar Novamente

Após uma partida:

1. Na tela de resultado, clique em **"Voltar ao Menu"**
2. Reconecte ao servidor
3. Entre na **mesma sala** ou **crie uma nova**
4. Jogue novamente!

## 📊 Modos de Jogo

### 🎮 Local
- 2 jogadores no **mesmo dispositivo**
- Turnos alternados
- Ideal para jogar com alguém ao seu lado

### 🌐 Multiplayer Online
- 2 jogadores em **dispositivos diferentes**
- Jogue via WiFi
- Cada um vê apenas seu próprio tabuleiro

## 🆘 Precisa de Ajuda?

1. **Verifique os logs do servidor** no terminal
2. **Leia o SERVER_README.md** para detalhes técnicos
3. **Use o botão "Testar Conexão"** para diagnosticar problemas
4. **Revise esta seção de problemas comuns**

## 🎉 Divirta-se!

Agora você está pronto para jogar Batalha Naval multiplayer! Boa sorte e que vença o melhor estrategista! ⚓🎯

---

**Desenvolvido para PDM - Programação para Dispositivos Móveis**
