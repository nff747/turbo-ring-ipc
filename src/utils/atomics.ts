export class AtomicUtils {
  public static loadRelaxed(arr: Int32Array, index: number): number {
    return Atomics.load(arr, index);
  }

  public static storeRelease(arr: Int32Array, index: number, value: number): void {
    Atomics.store(arr, index, value);
  }

  public static wait(arr: Int32Array, index: number, expected: number, timeoutMs?: number): 'ok' | 'not-equal' | 'timed-out' {
    return Atomics.wait(arr, index, expected, timeoutMs);
  }

  public static notify(arr: Int32Array, index: number, count = 1): number {
    return Atomics.notify(arr, index, count);
  }

  public static compareExchange(arr: Int32Array, index: number, expected: number, replacement: number): number {
    return Atomics.compareExchange(arr, index, expected, replacement);
  }

  public static add(arr: Int32Array, index: number, value: number): number {
    return Atomics.add(arr, index, value);
  }
}
