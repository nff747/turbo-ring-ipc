import { SlabHeader, ChunkAllocation } from './types.js';
import { AtomicUtils } from '../utils/atomics.js';
import { CACHE_LINE_BYTES } from '../core/constants.js';

export class SharedMemorySlab {
  public readonly sharedBuffer: SharedArrayBuffer;
  public readonly totalChunks: number;
  public readonly chunkSize: number;
  protected readonly bitmap: Int32Array;
  public readonly payloadOffsetBytes: number;

  constructor(totalChunks = 64, chunkSize = 256) {
    this.totalChunks = totalChunks;
    this.chunkSize = chunkSize;

    const bitmapInts = Math.ceil(totalChunks / 32);
    const headerBytes = (bitmapInts * 4 + (CACHE_LINE_BYTES - 1)) & ~(CACHE_LINE_BYTES - 1);
    this.payloadOffsetBytes = headerBytes;

    const totalBytes = headerBytes + (totalChunks * chunkSize);
    this.sharedBuffer = new SharedArrayBuffer(totalBytes);
    this.bitmap = new Int32Array(this.sharedBuffer, 0, bitmapInts);
  }

  public allocateChunk(): ChunkAllocation | null {
    const numInts = this.bitmap.length;
    for (let word = 0; word < numInts; word++) {
      while (true) {
        const current = AtomicUtils.loadRelaxed(this.bitmap, word);
        if (current === -1) {
          break; // All 32 bits taken in this word
        }

        // Find first zero bit
        const freeBit = (~current) & -(~current);
        const bitIndex = 31 - Math.clz32(freeBit);
        const chunkIndex = (word * 32) + bitIndex;
        if (chunkIndex >= this.totalChunks) {
          return null; // Beyond pool limits
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
}
