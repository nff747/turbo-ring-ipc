import { HEADER_HEAD_OFFSET, HEADER_TAIL_OFFSET, HEADER_TOTAL_INTS } from '../core/constants.js';
import { computeRingBufferLayout, RingBufferLayout } from '../core/buffer-layout.js';
import { AtomicUtils } from '../utils/atomics.js';
import { QueueMetrics } from '../types/index.js';

export class SpscRingBuffer {
  public readonly sharedBuffer: SharedArrayBuffer;
  public readonly layout: RingBufferLayout;
  protected readonly header: Int32Array;
  protected readonly data: Int32Array;

  constructor(sharedBufferOrCapacity: SharedArrayBuffer | number) {
    if (typeof sharedBufferOrCapacity === 'number') {
      this.layout = computeRingBufferLayout(sharedBufferOrCapacity, 4);
      this.sharedBuffer = new SharedArrayBuffer(this.layout.totalBytes);
    } else {
      this.sharedBuffer = sharedBufferOrCapacity;
      const totalInts = this.sharedBuffer.byteLength / 4;
      const dataInts = totalInts - HEADER_TOTAL_INTS;
      this.layout = computeRingBufferLayout(dataInts, 4);
    }

    this.header = new Int32Array(this.sharedBuffer, 0, HEADER_TOTAL_INTS);
    this.data = new Int32Array(this.sharedBuffer, this.layout.dataOffsetBytes);
  }

  public get capacity(): number {
    return this.layout.capacity;
  }
}
