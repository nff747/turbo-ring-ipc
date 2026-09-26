import { HEADER_HEAD_OFFSET, HEADER_TAIL_OFFSET, HEADER_TOTAL_INTS } from '../core/constants.js';
import { nextPowerOfTwo } from '../utils/math.js';
import { CELL_INTS, CELL_BYTES, SEQ_OFFSET, VAL_OFFSET } from './cell.js';
import { AtomicUtils } from '../utils/atomics.js';

export class MpmcBoundedQueue {
  public readonly capacity: number;
  public readonly mask: number;
  public readonly sharedBuffer: SharedArrayBuffer;
  protected readonly header: Int32Array;
  protected readonly cells: Int32Array;

  constructor(sharedBufferOrCapacity: SharedArrayBuffer | number) {
    if (typeof sharedBufferOrCapacity === 'number') {
      this.capacity = nextPowerOfTwo(sharedBufferOrCapacity);
      this.mask = this.capacity - 1;
      const totalBytes = (HEADER_TOTAL_INTS * 4) + (this.capacity * CELL_BYTES);
      this.sharedBuffer = new SharedArrayBuffer(totalBytes);
      this.header = new Int32Array(this.sharedBuffer, 0, HEADER_TOTAL_INTS);
      this.cells = new Int32Array(this.sharedBuffer, HEADER_TOTAL_INTS * 4);

      for (let i = 0; i < this.capacity; i++) {
        this.cells[(i * CELL_INTS) + SEQ_OFFSET] = i;
      }
    } else {
      this.sharedBuffer = sharedBufferOrCapacity;
      this.header = new Int32Array(this.sharedBuffer, 0, HEADER_TOTAL_INTS);
      const cellsByteLen = this.sharedBuffer.byteLength - (HEADER_TOTAL_INTS * 4);
      const numCells = cellsByteLen / CELL_BYTES;
      this.capacity = nextPowerOfTwo(numCells);
      this.mask = this.capacity - 1;
      this.cells = new Int32Array(this.sharedBuffer, HEADER_TOTAL_INTS * 4);
    }
  }

  public tryEnqueue(value: number): boolean {
    while (true) {
      const pos = AtomicUtils.loadRelaxed(this.header, HEADER_HEAD_OFFSET);
      const cellIdx = (pos & this.mask) * CELL_INTS;
      const seq = AtomicUtils.loadRelaxed(this.cells, cellIdx + SEQ_OFFSET);
      const dif = seq - pos;

      if (dif === 0) {
        if (AtomicUtils.compareExchange(this.header, HEADER_HEAD_OFFSET, pos, pos + 1) === pos) {
          this.cells[cellIdx + VAL_OFFSET] = value;
          AtomicUtils.storeRelease(this.cells, cellIdx + SEQ_OFFSET, pos + 1);
          return true;
        }
      } else if (dif < 0) {
        return false;
      }
    }
  }

  public tryDequeue(): number | undefined {
    while (true) {
      const pos = AtomicUtils.loadRelaxed(this.header, HEADER_TAIL_OFFSET);
      const cellIdx = (pos & this.mask) * CELL_INTS;
      const seq = AtomicUtils.loadRelaxed(this.cells, cellIdx + SEQ_OFFSET);
      const dif = seq - (pos + 1);

      if (dif === 0) {
        if (AtomicUtils.compareExchange(this.header, HEADER_TAIL_OFFSET, pos, pos + 1) === pos) {
          const val = this.cells[cellIdx + VAL_OFFSET];
          AtomicUtils.storeRelease(this.cells, cellIdx + SEQ_OFFSET, pos + this.capacity);
          return val;
        }
      } else if (dif < 0) {
        return undefined; // Empty
      }
    }
  }

  public get size(): number {
    const head = AtomicUtils.loadRelaxed(this.header, HEADER_HEAD_OFFSET);
    const tail = AtomicUtils.loadRelaxed(this.header, HEADER_TAIL_OFFSET);
    return Math.max(0, head - tail);
  }

  public get isEmpty(): boolean {
    return this.size === 0;
  }

  public get isFull(): boolean {
    return this.size >= this.capacity;
  }
}
