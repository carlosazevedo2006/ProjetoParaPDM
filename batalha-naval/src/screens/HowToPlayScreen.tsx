// How to Play screen - comprehensive tutorial
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function HowToPlayScreen() {
  const router = useRouter();

  function handleBack() {
    router.back();
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.mainTitle}>📚 Como Jogar</Text>
        
        {/* Secção: Objetivo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 Objetivo</Text>
          <Text style={styles.text}>
            Afundar todos os navios do adversário antes que ele afunde os teus!
          </Text>
        </View>

        {/* Secção: Frota */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚢 Frota</Text>
          <Text style={styles.bulletText}>• Porta-aviões: 5 células</Text>
          <Text style={styles.bulletText}>• Cruzador: 4 células</Text>
          <Text style={styles.bulletText}>• Contratorpedeiro: 3 células</Text>
          <Text style={styles.bulletText}>• Submarino: 3 células</Text>
          <Text style={styles.bulletText}>• Patrulha: 2 células</Text>
          <Text style={styles.textSmall}>Total: 5 navios por jogador</Text>
        </View>

        {/* Secção: Como Jogar */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Como Jogar</Text>
          
          <Text style={styles.stepTitle}>1️⃣ Colocação de Navios</Text>
          <Text style={styles.bulletText}>• Clica em "Colocação Aleatória" para rapidez</Text>
          <Text style={styles.bulletText}>• Navios não podem sobrepor</Text>
          <Text style={styles.bulletText}>• Navios não podem encostar (nem diagonal)</Text>
          
          <Text style={styles.stepTitle}>2️⃣ Disparar no Tabuleiro Inimigo</Text>
          <Text style={styles.bulletText}>• Clica numa célula do "Radar Inimigo"</Text>
          <Text style={styles.bulletText}>• 💦 Água = tiro na água</Text>
          <Text style={styles.bulletText}>• 💥 Acerto = atingiu um navio</Text>
          <Text style={styles.bulletText}>• 🔥 Afundado = navio completamente destruído</Text>
          
          <Text style={styles.stepTitle}>3️⃣ Turnos</Text>
          <Text style={styles.bulletText}>• Os turnos alternam automaticamente</Text>
          <Text style={styles.bulletText}>• Só podes disparar no teu turno</Text>
          <Text style={styles.bulletText}>• Indicador mostra de quem é o turno</Text>
          
          <Text style={styles.stepTitle}>4️⃣ Vitória</Text>
          <Text style={styles.bulletText}>• Primeiro a afundar TODOS os navios ganha!</Text>
          <Text style={styles.bulletText}>• Estatísticas são guardadas automaticamente</Text>
        </View>

        {/* Secção: Modo Local */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📱 Modo Local (Mesmo Dispositivo)</Text>
          <Text style={styles.bulletText}>1️⃣ No menu, escolhe "Jogar" → "Local"</Text>
          <Text style={styles.bulletText}>2️⃣ Insere os nomes dos 2 jogadores</Text>
          <Text style={styles.bulletText}>3️⃣ Cada jogador coloca os seus navios</Text>
          <Text style={styles.bulletText}>4️⃣ Durante o jogo, alterna o dispositivo a cada turno</Text>
          <Text style={styles.warningText}>⚠️ Não mostres o ecrã ao adversário durante a colocação!</Text>
        </View>

        {/* Secção: Modo Multiplayer */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌐 Modo Multiplayer (Mesma WLAN)</Text>
          
          <Text style={styles.subsectionTitle}>📡 Requisitos:</Text>
          <Text style={styles.bulletText}>• Dois dispositivos na mesma rede WiFi</Text>
          <Text style={styles.bulletText}>• Servidor WebSocket em execução</Text>
          <Text style={styles.bulletText}>• IP do servidor configurado</Text>
          
          <Text style={styles.subsectionTitle}>🔧 Configuração:</Text>
          
          <Text style={styles.stepTitle}>1️⃣ Executar o Servidor</Text>
          <Text style={styles.codeText}>cd batalha-naval/server{'\n'}node index.js</Text>
          <Text style={styles.bulletText}>• Anota o IP mostrado (ex: 192.168.43.1)</Text>
          
          <Text style={styles.stepTitle}>2️⃣ Conectar os Dispositivos</Text>
          <Text style={styles.bulletText}>• No menu, escolhe "Jogar" → "Multiplayer"</Text>
          <Text style={styles.bulletText}>• Insere o URL: ws://[IP]:3000</Text>
          <Text style={styles.bulletText}>• Clica em "Conectar"</Text>
          <Text style={styles.bulletText}>• Repete em AMBOS os dispositivos</Text>
          
          <Text style={styles.stepTitle}>3️⃣ Criar a Sala</Text>
          <Text style={styles.bulletText}>• No Lobby, ambos inserem os MESMOS nomes</Text>
          <Text style={styles.bulletText}>• Ordem não importa!</Text>
          <Text style={styles.exampleText}>
            Exemplo:{'\n'}
            Dispositivo 1: "Alice" e "Bob"{'\n'}
            Dispositivo 2: "Bob" e "Alice"
          </Text>
          
          <Text style={styles.stepTitle}>4️⃣ Jogar</Text>
          <Text style={styles.bulletText}>• Cada um coloca navios no SEU dispositivo</Text>
          <Text style={styles.bulletText}>• Jogo sincroniza automaticamente</Text>
          <Text style={styles.bulletText}>• Tiros aparecem em tempo real!</Text>
          
          <Text style={styles.tipText}>💡 Dica: Usa hotspot móvel para conexão mais estável</Text>
        </View>

        {/* Secção: Dicas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 Dicas & Truques</Text>
          
          <Text style={styles.subsectionTitle}>🎲 Colocação:</Text>
          <Text style={styles.bulletText}>• Espalha os navios pelo tabuleiro</Text>
          <Text style={styles.bulletText}>• Evita padrões previsíveis</Text>
          <Text style={styles.bulletText}>• Usa os cantos e bordas</Text>
          
          <Text style={styles.subsectionTitle}>🎯 Ataque:</Text>
          <Text style={styles.bulletText}>• Começa com padrão xadrez</Text>
          <Text style={styles.bulletText}>• Quando acertas, dispara nas células vizinhas</Text>
          <Text style={styles.bulletText}>• Marca mentalmente onde já disparaste</Text>
          
          <Text style={styles.subsectionTitle}>🌐 Multiplayer:</Text>
          <Text style={styles.bulletText}>• Certifica-te que ambos estão na mesma rede</Text>
          <Text style={styles.bulletText}>• Usa hotspot para melhor estabilidade</Text>
          <Text style={styles.bulletText}>• Se desconectar, reinicia o servidor</Text>
        </View>

        {/* Secção: Tabuleiros */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🗺️ Os Dois Tabuleiros</Text>
          
          <Text style={styles.subsectionTitle}>📍 Meu Oceano (Esquerda)</Text>
          <Text style={styles.bulletText}>• Mostra os TEUS navios</Text>
          <Text style={styles.bulletText}>• Mostra onde o adversário disparou</Text>
          <Text style={styles.bulletText}>• Azul = água intacta</Text>
          <Text style={styles.bulletText}>• Cinza = água atingida</Text>
          <Text style={styles.bulletText}>• Vermelho = navio atingido</Text>
          
          <Text style={styles.subsectionTitle}>🔭 Radar Inimigo (Direita)</Text>
          <Text style={styles.bulletText}>• AQUI dispara no adversário</Text>
          <Text style={styles.bulletText}>• NÃO mostra os navios do adversário</Text>
          <Text style={styles.bulletText}>• 💦 Água | 💥 Acerto | 🔥 Afundado</Text>
        </View>

        {/* Botão Voltar */}
        <Pressable style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>← Voltar ao Menu</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E3A5F',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4A90E2',
    textAlign: 'center',
    marginBottom: 30,
  },
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 15,
  },
  subsectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4A90E2',
    marginTop: 15,
    marginBottom: 10,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E0E0E0',
    marginTop: 12,
    marginBottom: 8,
  },
  text: {
    fontSize: 15,
    color: '#E0E0E0',
    lineHeight: 22,
    marginBottom: 10,
  },
  bulletText: {
    fontSize: 14,
    color: '#E0E0E0',
    lineHeight: 22,
    marginBottom: 6,
  },
  textSmall: {
    fontSize: 13,
    color: '#999',
    marginTop: 8,
    fontStyle: 'italic',
  },
  warningText: {
    fontSize: 14,
    color: '#ff9800',
    marginTop: 10,
    fontWeight: '600',
  },
  tipText: {
    fontSize: 14,
    color: '#4A90E2',
    marginTop: 10,
    fontWeight: '600',
  },
  codeText: {
    fontSize: 13,
    color: '#4A90E2',
    backgroundColor: '#0f3460',
    padding: 10,
    borderRadius: 6,
    fontFamily: 'monospace',
    marginVertical: 8,
  },
  exampleText: {
    fontSize: 13,
    color: '#999',
    backgroundColor: '#0f3460',
    padding: 10,
    borderRadius: 6,
    marginVertical: 8,
    fontStyle: 'italic',
  },
  backButton: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
