export class SharedBufferPool {
  private pool: SharedArrayBuffer[] = [];
  readonly bufferSize: number;

  constructor(bufferSize = 1024, initialCount = 4) {
    this.bufferSize = bufferSize;
    for (let i = 0; i < initialCount; i++) {
      this.pool.push(new SharedArrayBuffer(bufferSize));
    }
  }

  acquire(): SharedArrayBuffer {
    return this.pool.pop() || new SharedArrayBuffer(this.bufferSize);
  }

  release(buffer: SharedArrayBuffer): void {
    if (buffer.byteLength === this.bufferSize) {
      this.pool.push(buffer);
    }
  }

  availableCount(): number {
    return this.pool.length;
  }
}
