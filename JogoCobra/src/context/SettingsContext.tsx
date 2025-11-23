// src/context/SettingsContext.tsx
// Contexto global para definições do jogo
// - guarda persistente via AsyncStorage
// - disponibiliza getters / setters e a dificuldade seleccionada

import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DIFICULDADES, DificuldadeDef } from "../config/dificuldades";

export type Settings = {
  // presets
  dificuldadeKey: "FACIL" | "MEDIO" | "DIFICIL" | "PERSONALIZADO";

  // personalizados (usados quando dificuldadeKey === "PERSONALIZADO")
  customVelocidadeMs: number;   // ms per passo (ex: 300)
  customAumentaVel: boolean;
  customIncrementoMs: number;   // redução por 3 comidas
  customGridSize: number;       // 8..20
  customCobraInimiga: boolean;
  // visuais
  corCobra: string;             // hex
  corTabuleiro: string;         // hex
};

const DEFAULT_SETTINGS: Settings = {
  dificuldadeKey: "MEDIO",
  customVelocidadeMs: DIFICULDADES.MEDIO.velocidadeBaseMs,
  customAumentaVel: DIFICULDADES.MEDIO.aumentaVelocidade,
  customIncrementoMs: DIFICULDADES.MEDIO.incrementoPor3ComidasMs ?? 20,
  customGridSize: 12,
  customCobraInimiga: false,
  corCobra: "#43a047",
  corTabuleiro: "#ffffff",
};

const STORAGE_KEY = "@JogoCobra_Settings_v2";

type ContextType = {
  settings: Settings;
  setSettings: (s: Settings) => void;
  // utilitários
  getActiveDificuldade: () => DificuldadeDef | null;
};

const SettingsContext = createContext<ContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettingsState] = useState<Settings>(DEFAULT_SETTINGS);

  // Carregar de AsyncStorage no arranque
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<Settings>;
          setSettingsState((prev) => ({ ...prev, ...parsed }));
        }
      } catch (e) {
        console.warn("SettingsContext: falha a carregar settings", e);
      }
    })();
  }, []);

  // Guardar automaticamente quando settings mudam
  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      } catch (e) {
        console.warn("SettingsContext: falha a gravar settings", e);
      }
    })();
  }, [settings]);

  function setSettings(s: Settings) {
    setSettingsState(s);
  }

  // Devolve a definição activa baseada na dificuldade seleccionada
  function getActiveDificuldade(): DificuldadeDef | null {
    if (settings.dificuldadeKey === "PERSONALIZADO") {
      // construir objecto "virtual" baseado em custom settings
      return {
        key: "FACIL", // apenas placeholder
        label: "Personalizado",
        velocidadeBaseMs: settings.customVelocidadeMs,
        aumentaVelocidade: settings.customAumentaVel,
        incrementoPor3ComidasMs: settings.customIncrementoMs,
        cobraInimiga: settings.customCobraInimiga,
        inimigaSpeedFactor: settings.customCobraInimiga ? 1.1 : 1.0,
      };
    }
    return DIFICULDADES[settings.dificuldadeKey] ?? null;
  }

  return (
    <SettingsContext.Provider value={{ settings, setSettings, getActiveDificuldade }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings deve ser usado dentro do SettingsProvider");
  return ctx;
}
