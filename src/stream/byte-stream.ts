export class ByteRingStream {
  private buffer: Uint8Array;
  private head = 0;
  private tail = 0;
  readonly capacity: number;

  constructor(sharedBuffer: SharedArrayBuffer, offset = 0, length = 1024) {
    this.buffer = new Uint8Array(sharedBuffer, offset, length);
    this.capacity = length;
  }

  write(src: Uint8Array): number {
    const available = this.capacity - (this.head - this.tail);
    const toWrite = Math.min(src.length, available);
    for (let i = 0; i < toWrite; i++) {
      this.buffer[(this.head + i) % this.capacity] = src[i];
    }
    this.head += toWrite;
    return toWrite;
  }

  read(dest: Uint8Array): number {
    const available = this.head - this.tail;
    const toRead = Math.min(dest.length, available);
    for (let i = 0; i < toRead; i++) {
      dest[i] = this.buffer[(this.tail + i) % this.capacity];
    }
    this.tail += toRead;
    return toRead;
  }
}
