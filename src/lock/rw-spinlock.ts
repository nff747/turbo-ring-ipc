export class ReadWriteSpinlock {
  private view: Int32Array;

  constructor(sab: SharedArrayBuffer, offset = 0) {
    this.view = new Int32Array(sab, offset, 1);
  }

  readLock(): void {
    while (true) {
      const val = Atomics.load(this.view, 0);
      if (val >= 0) {
        if (Atomics.compareExchange(this.view, 0, val, val + 1) === val) {
          break;
        }
      }
    }
  }

  readUnlock(): void {
    Atomics.sub(this.view, 0, 1);
  }

  writeLock(): void {
    while (true) {
      if (Atomics.compareExchange(this.view, 0, 0, -1) === 0) {
        break;
      }
    }
  }

  writeUnlock(): void {
    Atomics.store(this.view, 0, 0);
  }
}
