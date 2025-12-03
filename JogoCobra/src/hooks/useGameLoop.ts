// src/hooks/useGameLoop.ts
import { useEffect, useRef } from "react";

export default function useGameLoop(jogando: boolean, velocidade: number, callback: () => void) {
  const last = useRef(0);
  const raf = useRef<number | null>(null);

  function loop(t: number) {
    if (!last.current) last.current = t;

    const delta = t - last.current;

    if (jogando && delta >= velocidade) {
      callback();
      last.current = t;
    }

    raf.current = requestAnimationFrame(loop);
  }

  useEffect(() => {
    raf.current = requestAnimationFrame(loop);

    return () => {
      if (raf.current) {
        cancelAnimationFrame(raf.current);
      }
    };
}, [jogando, velocidade, callback]);
}
