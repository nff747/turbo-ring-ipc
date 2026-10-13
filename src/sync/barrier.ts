export class AtomicBarrier {
  private view: Int32Array;
  readonly threadCount: number;

  constructor(sab: SharedArrayBuffer, threadCount: number, offset = 0) {
    this.threadCount = threadCount;
    this.view = new Int32Array(sab, offset, 2); // [count, generation]
  }

  arrive(): boolean {
    const arrived = Atomics.add(this.view, 0, 1) + 1;
    if (arrived === this.threadCount) {
      Atomics.store(this.view, 0, 0); // reset count
      Atomics.add(this.view, 1, 1);   // next generation
      return true;
    }
    return false;
  }
}
