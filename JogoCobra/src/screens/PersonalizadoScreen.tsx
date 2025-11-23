// src/screens/PersonalizadoScreen.tsx
// Ecrã para o modo personalizado com sliders (opção escolhida: sliders)
// Usa @react-native-community/slider (instalar se necessário)

import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import { useSettings } from "../context/SettingsContext";
import { useNavigation } from "@react-navigation/native";

export default function PersonalizadoScreen() {
  const nav = useNavigation();
  const { settings, setSettings } = useSettings();

  // estados locais (para live preview antes de guardar)
  const [velMs, setVelMs] = useState(settings.customVelocidadeMs);
  const [aumenta, setAumenta] = useState(settings.customAumentaVel);
  const [incMs, setIncMs] = useState(settings.customIncrementoMs);
  const [gridSize, setGridSize] = useState(settings.customGridSize);
  const [cobraInimiga, setCobraInimiga] = useState(settings.customCobraInimiga);
  const [corCobra, setCorCobra] = useState(settings.corCobra);
  const [corTab, setCorTab] = useState(settings.corTabuleiro);

  useEffect(() => {
    setVelMs(settings.customVelocidadeMs);
    setAumenta(settings.customAumentaVel);
    setIncMs(settings.customIncrementoMs);
    setGridSize(settings.customGridSize);
    setCobraInimiga(settings.customCobraInimiga);
    setCorCobra(settings.corCobra);
    setCorTab(settings.corTabuleiro);
  }, [settings]);

  function aplicar() {
    setSettings({
      ...settings,
      dificuldadeKey: "PERSONALIZADO",
      customVelocidadeMs: Math.round(velMs),
      customAumentaVel: aumenta,
      customIncrementoMs: Math.round(incMs),
      customGridSize: Math.round(gridSize),
      customCobraInimiga: cobraInimiga,
      corCobra,
      corTabuleiro: corTab,
    });
    nav.goBack();
  }

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Personalizar Jogo</Text>

      <Text style={styles.label}>Velocidade inicial (ms por passo): {Math.round(velMs)}</Text>
      <Slider
        minimumValue={120}
        maximumValue={600}
        step={10}
        value={velMs}
        onValueChange={(v) => setVelMs(v)}
      />

      <Text style={styles.label}>Aumentar velocidade com o score: {aumenta ? "Sim" : "Não"}</Text>
      <View style={{ flexDirection: "row", marginBottom: 10 }}>
        <TouchableOpacity style={styles.smallBtn} onPress={() => setAumenta(true)}>
          <Text>Sim</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.smallBtn, { marginLeft: 8 }]} onPress={() => setAumenta(false)}>
          <Text>Não</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Redução (ms) a cada 3 comidas: {Math.round(incMs)}</Text>
      <Slider minimumValue={0} maximumValue={80} step={5} value={incMs} onValueChange={(v) => setIncMs(v)} />

      <Text style={styles.label}>Tamanho do tabuleiro: {Math.round(gridSize)} x {Math.round(gridSize)}</Text>
      <Slider minimumValue={8} maximumValue={20} step={1} value={gridSize} onValueChange={(v) => setGridSize(v)} />

      <Text style={styles.label}>Cobra inimiga (ghost): {cobraInimiga ? "Ativa" : "Desligada"}</Text>
      <View style={{ flexDirection: "row", marginBottom: 10 }}>
        <TouchableOpacity style={styles.smallBtn} onPress={() => setCobraInimiga(true)}>
          <Text>Ativar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.smallBtn, { marginLeft: 8 }]} onPress={() => setCobraInimiga(false)}>
          <Text>Desativar</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Cor da Cobra</Text>
      <View style={{ flexDirection: "row", marginBottom: 10 }}>
        {["#43a047", "#1e88e5", "#e53935", "#fdd835", "#8e24aa"].map((c) => (
          <TouchableOpacity key={c} onPress={() => setCorCobra(c)} style={[styles.swatch, { backgroundColor: c, borderWidth: corCobra === c ? 2 : 0 }]} />
        ))}
      </View>

      <Text style={styles.label}>Cor do Tabuleiro</Text>
      <View style={{ flexDirection: "row", marginBottom: 18 }}>
        {["#ffffff", "#f5f5f5", "#e8f5e9", "#fff8e1", "#eeeeff"].map((c) => (
          <TouchableOpacity key={c} onPress={() => setCorTab(c)} style={[styles.swatch, { backgroundColor: c, borderWidth: corTab === c ? 2 : 0 }]} />
        ))}
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <TouchableOpacity style={styles.cancelBtn} onPress={() => nav.goBack()}>
          <Text>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.applyBtn} onPress={aplicar}>
          <Text style={{ color: "#fff", fontWeight: "700" }}>Aplicar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#111", padding: 18 },
  title: { color: "#fff", fontSize: 20, fontWeight: "700", marginBottom: 12 },
  label: { color: "#ccc", marginTop: 10, marginBottom: 6 },
  smallBtn: { padding: 8, backgroundColor: "#eee", borderRadius: 8, justifyContent: "center", alignItems: "center" },
  swatch: { width: 36, height: 36, borderRadius: 6, marginRight: 8, borderColor: "#fff" },
  cancelBtn: { padding: 12, backgroundColor: "#ccc", borderRadius: 8, width: "48%", alignItems: "center" },
  applyBtn: { padding: 12, backgroundColor: "#4caf50", borderRadius: 8, width: "48%", alignItems: "center" },
});
