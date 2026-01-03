# 🌐 Configuração de Rede para Multiplayer WLAN

## Visão Geral

O jogo Batalha Naval suporta multiplayer em rede local (WLAN) permitindo que dois jogadores em dispositivos diferentes joguem conectados à mesma rede WiFi.

## 📋 Requisitos de Rede

### Requisitos Mínimos
- Ambos os dispositivos devem estar na **mesma rede WLAN**
- Mesma sub-rede IP (ex: 192.168.1.x)
- Portas UDP/TCP não bloqueadas por firewall

### Configuração Recomendada
**Para garantir o melhor funcionamento, recomendamos:**

1. **Criar um Hotspot Móvel**
   - Use um smartphone para criar um hotspot WiFi
   - Conecte ambos os dispositivos de jogo ao hotspot
   - Isto garante que estão no mesmo segmento de rede

2. **Verificar Configurações de Firewall**
   - Desative temporariamente firewalls durante o teste
   - Certifique-se que a rede permite comunicação peer-to-peer

## 🔧 Passos para Avaliação

### 1. Criação do Interface ✅
**Status:** Completo
- Tela de Lobby com entrada de jogadores
- Tela de Setup para colocação de navios
- Tela de Jogo com dois tabuleiros
- Tela de Resultados com estatísticas

### 2. Permitir Lançar Ataque e Visualizar Resultado ✅
**Status:** Completo
- Sistema de turnos implementado
- Feedback visual de tiros (💦 Água, 💥 Acerto, 🔥 Afundado)
- Validação de células já atingidas
- Estatísticas em tempo real

### 3. Funcionamento em Rede ⏳
**Status:** Estrutura criada, implementação em progresso

#### Arquitetura de Rede

**Descoberta de Jogadores (UDP Broadcast)**
```
Porta: 41234
Tipo: UDP Broadcast
Mensagem: {"type": "discover", "playerId": "xxx"}
```

**Comunicação de Jogo (TCP)**
```
Porta: 41235
Tipo: TCP Socket
Mensagens: JSON com ações do jogo
```

#### Fluxo de Rede

1. **Descoberta**
   ```
   Host → Broadcast UDP → "Sala disponível: XXXXX"
   Cliente → Resposta → "Conectar à sala"
   ```

2. **Conexão**
   ```
   Cliente → TCP → Host (porta 41235)
   Host → Aceita → Envia estado inicial
   ```

3. **Setup**
   ```
   Jogador 1 → Coloca navios → Envia "ready"
   Jogador 2 → Coloca navios → Envia "ready"
   Host → Inicia jogo
   ```

4. **Jogo**
   ```
   Jogador atual → Disparo (row, col) → Envia via TCP
   Oponente → Processa → Retorna resultado
   Alterna turno
   ```

5. **Fim**
   ```
   Jogador → Afunda todos navios
   Sistema → Envia "gameOver" → Mostra vencedor
   ```

## 📦 Dependências Necessárias

Para implementação completa do multiplayer, são necessários:

```bash
# Instalar dependências de rede
npm install react-native-udp
npm install react-native-tcp-socket

# Configurar no Android (android/app/src/main/AndroidManifest.xml)
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

## 🧪 Teste de Rede

### Teste 1: Conectividade Básica
```bash
# No Host
adb shell ip addr show wlan0

# Verificar se ambos os dispositivos têm IPs na mesma sub-rede
```

### Teste 2: Comunicação UDP
```javascript
// Testar broadcast UDP
const socket = dgram.createSocket('udp4');
socket.bind(41234);
socket.setBroadcast(true);
socket.send('PING', 0, 4, 41234, '255.255.255.255');
```

### Teste 3: Jogo Completo
1. Device A cria sala
2. Device B descobre e conecta
3. Ambos colocam navios
4. Jogam alternadamente
5. Verificar sincronização de estado

## 🐛 Resolução de Problemas

### Problema: Jogadores não se descobrem
**Solução:**
- Verificar se estão na mesma rede
- Testar com hotspot móvel
- Desativar VPN se ativa

### Problema: Conexão perde durante o jogo
**Solução:**
- Verificar estabilidade da rede WiFi
- Aproximar dispositivos do router/hotspot
- Implementar reconexão automática

### Problema: Estado dessincronizado
**Solução:**
- Implementar sistema de confirmação de ações
- Adicionar números de sequência às mensagens
- Sincronizar estado completo periodicamente

## 📱 Implementação Atual

### ✅ Implementado
- Estrutura base do NetworkService
- Sistema de salas (room management)
- Interfaces TypeScript para mensagens
- Hook useNetwork para componentes

### ⏳ Pendente
- Implementação real de UDP/TCP
- Descoberta automática de jogadores
- Sincronização de estado em tempo real
- Tratamento de desconexões
- Reconexão automática

## 🎯 Próximos Passos

1. **Instalar dependências de rede**
   ```bash
   npm install react-native-udp react-native-tcp-socket
   ```

2. **Implementar UDP Broadcast**
   - Descoberta de jogadores
   - Criação/anúncio de salas

3. **Implementar TCP Socket**
   - Conexão entre jogadores
   - Envio de ações do jogo
   - Sincronização de estado

4. **Testar em Rede Real**
   - Dois dispositivos Android
   - Conectados ao mesmo hotspot
   - Jogar partida completa

## 📚 Referências

- [React Native UDP](https://github.com/tradle/react-native-udp)
- [React Native TCP Socket](https://github.com/Rapsssito/react-native-tcp-socket)
- [Expo Network Documentation](https://docs.expo.dev/versions/latest/sdk/network/)

---

**Nota:** Este documento será atualizado conforme a implementação progride.
