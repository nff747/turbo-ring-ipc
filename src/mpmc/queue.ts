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

      // Initialize cell sequences: cell[i].seq = i
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
}
