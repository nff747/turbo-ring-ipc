import { HEADER_HEAD_OFFSET, HEADER_TAIL_OFFSET, HEADER_TOTAL_INTS } from '../core/constants.js';
import { computeRingBufferLayout, RingBufferLayout } from '../core/buffer-layout.js';
import { AtomicUtils } from '../utils/atomics.js';

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

  public tryPush(value: number): boolean {
    const head = AtomicUtils.loadRelaxed(this.header, HEADER_HEAD_OFFSET);
    const tail = AtomicUtils.loadRelaxed(this.header, HEADER_TAIL_OFFSET);

    if (head - tail >= this.layout.capacity) {
      return false;
    }

    const slot = head & this.layout.mask;
    this.data[slot] = value;
    AtomicUtils.storeRelease(this.header, HEADER_HEAD_OFFSET, head + 1);
    return true;
  }

  public tryPop(): number | undefined {
    const tail = AtomicUtils.loadRelaxed(this.header, HEADER_TAIL_OFFSET);
    const head = AtomicUtils.loadRelaxed(this.header, HEADER_HEAD_OFFSET);

    if (head === tail) {
      return undefined;
    }

    const slot = tail & this.layout.mask;
    const value = this.data[slot];
    AtomicUtils.storeRelease(this.header, HEADER_TAIL_OFFSET, tail + 1);
    return value;
  }

  public pushBatch(values: ArrayLike<number>): number {
    let pushed = 0;
    for (let i = 0; i < values.length; i++) {
      if (!this.tryPush(values[i])) {
        break;
      }
      pushed++;
    }
    return pushed;
  }

  public popBatch(outBuffer: Int32Array, maxCount = outBuffer.length): number {
    let count = 0;
    while (count < maxCount) {
      const val = this.tryPop();
      if (val === undefined) break;
      outBuffer[count++] = val;
    }
    return count;
  }

  public clear(): void {
    const head = AtomicUtils.loadRelaxed(this.header, HEADER_HEAD_OFFSET);
    AtomicUtils.storeRelease(this.header, HEADER_TAIL_OFFSET, head);
  }

  public get size(): number {
    const head = AtomicUtils.loadRelaxed(this.header, HEADER_HEAD_OFFSET);
    const tail = AtomicUtils.loadRelaxed(this.header, HEADER_TAIL_OFFSET);
    return Math.max(0, head - tail);
  }

  public get isFull(): boolean {
    return this.size >= this.layout.capacity;
  }

  public get isEmpty(): boolean {
    return this.size === 0;
  }
}
