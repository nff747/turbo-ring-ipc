import { SpscRingBuffer } from './ring-buffer.js';

export class SpscFloat32Buffer extends SpscRingBuffer {
  private floatView: Float32Array;

  constructor(sharedBufferOrCapacity: SharedArrayBuffer | number) {
    super(sharedBufferOrCapacity);
    this.floatView = new Float32Array(this.sharedBuffer, this.layout.dataOffsetBytes);
  }

  public tryPushFloat(val: number): boolean {
    // Reinterpret float as bits
    const slot = this.size;
    if (this.isFull) return false;
    this.floatView[slot & this.layout.mask] = val;
    return this.tryPush(0); // Trigger sequence advance
  }
}
