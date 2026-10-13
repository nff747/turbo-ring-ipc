export interface ITransport {
  send(data: Uint8Array): boolean;
  receive(): Uint8Array | null;
}

export class SharedMemoryTransport implements ITransport {
  private queue: Uint8Array[] = [];

  send(data: Uint8Array): boolean {
    this.queue.push(data);
    return true;
  }

  receive(): Uint8Array | null {
    return this.queue.shift() || null;
  }
}
