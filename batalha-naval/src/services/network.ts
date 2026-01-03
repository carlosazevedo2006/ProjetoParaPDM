type Handler = (payload: any) => void;

export class Network {
  private ws?: WebSocket;
  private handlers: Record<string, Handler[]> = {};

  async connect(serverUrl: string) {
    return new Promise<void>((resolve, reject) => {
      this.ws = new WebSocket(serverUrl);
      this.ws.onopen = () => resolve();
      this.ws.onerror = (e) => reject(e);
      this.ws.onmessage = (ev) => {
        try {
          const msg = JSON.parse(ev.data);
          this.handlers[msg.type]?.forEach(h => h(msg.payload));
        } catch {}
      };
    });
  }

  on(type: string, handler: Handler) {
    if (!this.handlers[type]) this.handlers[type] = [];
    this.handlers[type].push(handler);
  }

  emit(type: string, payload: any) {
    this.ws?.send(JSON.stringify({ type, payload }));
  }

  makePlayerId() {
    return `p_${Math.random().toString(36).slice(2, 8)}`;
  }
}