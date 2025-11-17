import { useEffect, useRef } from 'react';

/**
 * Hook personalizado para setInterval no React
 * Resolve problemas comuns do setInterval em componentes React
 * @param callback Função a ser executada a cada intervalo
 * @param delay Delay em milissegundos (null pausa o intervalo)
 */
export const useGameInterval = (
  callback: () => void, 
  delay: number | null
) => {
  // useRef guarda o callback entre renders sem causar re-renders
  const savedCallback = useRef<() => void>();

  // Atualiza o ref sempre que o callback mudar
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Configura e limpa o intervalo
  useEffect(() => {
    function tick() {
      // Executa o callback atual
      savedCallback.current?.();
    }
    
    // Só cria intervalo se delay não for null
    if (delay !== null) {
      // Cria o intervalo
      const id = setInterval(tick, delay);
      // Função de cleanup - remove o intervalo quando o componente desmontar
      return () => clearInterval(id);
    }
  }, [delay]); // Re-executa quando delay mudar
};