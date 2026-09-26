import { SlabHeader, ChunkAllocation } from './types.js';
import { AtomicUtils } from '../utils/atomics.js';
import { CACHE_LINE_BYTES } from '../core/constants.js';

export class SharedMemorySlab {
  public readonly sharedBuffer: SharedArrayBuffer;
  public readonly totalChunks: number;
  public readonly chunkSize: number;
  protected readonly bitmap: Int32Array;
  protected readonly payloadOffsetBytes: number;

  constructor(totalChunks = 64, chunkSize = 256) {
    this.totalChunks = totalChunks;
    this.chunkSize = chunkSize;

    // Bitmap: 1 bit per chunk
    const bitmapInts = Math.ceil(totalChunks / 32);
    const headerBytes = (bitmapInts * 4 + (CACHE_LINE_BYTES - 1)) & ~(CACHE_LINE_BYTES - 1);
    this.payloadOffsetBytes = headerBytes;

    const totalBytes = headerBytes + (totalChunks * chunkSize);
    this.sharedBuffer = new SharedArrayBuffer(totalBytes);
    this.bitmap = new Int32Array(this.sharedBuffer, 0, bitmapInts);
  }
}
