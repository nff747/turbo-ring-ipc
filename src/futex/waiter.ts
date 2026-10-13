export class FutexWaiter {
  static wait(typedArray: Int32Array, index: number, expectedValue: number, timeoutMs = 100): 'ok' | 'not-equal' | 'timed-out' {
    if (typeof Atomics.wait === 'function') {
      return Atomics.wait(typedArray, index, expectedValue, timeoutMs);
    }
    const start = Date.now();
    while (Atomics.load(typedArray, index) === expectedValue) {
      if (Date.now() - start > timeoutMs) return 'timed-out';
    }
    return 'ok';
  }

  static notify(typedArray: Int32Array, index: number, count = 1): number {
    if (typeof Atomics.notify === 'function') {
      return Atomics.notify(typedArray, index, count);
    }
    return 1;
  }
}
