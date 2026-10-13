export class CacheLinePaddedCursor {
  private view: Int32Array;
  // 64 bytes cache line = 16 int32s per slot
  static readonly STRIDE = 16;

  constructor(sab: SharedArrayBuffer, slotIndex = 0) {
    this.view = new Int32Array(sab, slotIndex * CacheLinePaddedCursor.STRIDE * 4, CacheLinePaddedCursor.STRIDE);
  }

  get(): number {
    return Atomics.load(this.view, 0);
  }

  set(val: number): void {
    Atomics.store(this.view, 0, val);
  }

  increment(): number {
    return Atomics.add(this.view, 0, 1);
  }
}
