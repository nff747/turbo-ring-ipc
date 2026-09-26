import { SlabHeader, ChunkAllocation } from './types.js';
import { AtomicUtils } from '../utils/atomics.js';
import { CACHE_LINE_BYTES } from '../core/constants.js';

export class SharedMemorySlab {
  public readonly sharedBuffer: SharedArrayBuffer;
  public readonly totalChunks: number;
  public readonly chunkSize: number;
  protected readonly bitmap: Int32Array;
  public readonly payloadOffsetBytes: number;

  constructor(totalChunks = 64, chunkSize = 256, sharedBuffer?: SharedArrayBuffer) {
    this.totalChunks = totalChunks;
    this.chunkSize = chunkSize;

    const bitmapInts = Math.ceil(totalChunks / 32);
    const headerBytes = (bitmapInts * 4 + (CACHE_LINE_BYTES - 1)) & ~(CACHE_LINE_BYTES - 1);
    this.payloadOffsetBytes = headerBytes;

    const totalBytes = headerBytes + (totalChunks * chunkSize);
    this.sharedBuffer = sharedBuffer ?? new SharedArrayBuffer(totalBytes);
    this.bitmap = new Int32Array(this.sharedBuffer, 0, bitmapInts);
  }

  public allocateChunk(): ChunkAllocation | null {
    const numInts = this.bitmap.length;
    for (let word = 0; word < numInts; word++) {
      while (true) {
        const current = AtomicUtils.loadRelaxed(this.bitmap, word);
        if (current === -1) {
          break;
        }

        const freeBit = (~current) & -(~current);
        const bitIndex = 31 - Math.clz32(freeBit);
        const chunkIndex = (word * 32) + bitIndex;
        if (chunkIndex >= this.totalChunks) {
          return null;
        }

        const next = current | (1 << bitIndex);
        if (AtomicUtils.compareExchange(this.bitmap, word, current, next) === current) {
          return {
            chunkIndex,
            byteOffset: this.payloadOffsetBytes + (chunkIndex * this.chunkSize),
            byteLength: this.chunkSize
          };
        }
      }
    }
    return null;
  }

  public freeChunk(chunkIndex: number): boolean {
    if (chunkIndex < 0 || chunkIndex >= this.totalChunks) {
      return false;
    }
    const word = chunkIndex >> 5;
    const bitIndex = chunkIndex & 31;
    const mask = ~(1 << bitIndex);

    while (true) {
      const current = AtomicUtils.loadRelaxed(this.bitmap, word);
      if ((current & (1 << bitIndex)) === 0) {
        return false;
      }
      const next = current & mask;
      if (AtomicUtils.compareExchange(this.bitmap, word, current, next) === current) {
        return true;
      }
    }
  }

  public writePayload(chunk: ChunkAllocation, data: Uint8Array): void {
    if (data.length > chunk.byteLength) {
      throw new RangeError(`Data length ${data.length} exceeds chunk capacity ${chunk.byteLength}`);
    }
    const dest = new Uint8Array(this.sharedBuffer, chunk.byteOffset, data.length);
    dest.set(data);
  }

  public readPayload(chunkIndex: number, length: number): Uint8Array {
    const byteOffset = this.payloadOffsetBytes + (chunkIndex * this.chunkSize);
    return new Uint8Array(this.sharedBuffer, byteOffset, length);
  }

  public requiredChunks(bytes: number): number {
    return Math.ceil(bytes / this.chunkSize);
  }
}
