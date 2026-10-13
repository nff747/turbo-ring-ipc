export class RingRpcClient {
  private pending = new Map<number, (res: Uint8Array) => void>();
  private nextId = 1;

  createRequest(payload: Uint8Array): { id: number; frame: Uint8Array } {
    const id = this.nextId++;
    const frame = new Uint8Array(4 + payload.length);
    const view = new DataView(frame.buffer, frame.byteOffset, frame.byteLength);
    view.setUint32(0, id, true);
    frame.set(payload, 4);
    return { id, frame };
  }

  handleResponse(frame: Uint8Array): void {
    const view = new DataView(frame.buffer, frame.byteOffset, frame.byteLength);
    const id = view.getUint32(0, true);
    const payload = frame.subarray(4);
    const resolver = this.pending.get(id);
    if (resolver) {
      resolver(payload);
      this.pending.delete(id);
    }
  }
}
