export class FanoutBus {
  private subscribers: Array<(data: Uint8Array) => void> = [];

  subscribe(callback: (data: Uint8Array) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  broadcast(message: Uint8Array): number {
    for (const sub of this.subscribers) {
      sub(message);
    }
    return this.subscribers.length;
  }
}
