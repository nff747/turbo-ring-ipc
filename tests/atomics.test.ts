import { describe, it, expect } from 'vitest';
import { AtomicUtils } from '../src/utils/atomics.js';

describe('Atomic Operations Utility', () => {
  it('performs atomic stores, loads, and exchanges', () => {
    const sab = new SharedArrayBuffer(64);
    const view = new Int32Array(sab);

    AtomicUtils.storeRelease(view, 0, 42);
    expect(AtomicUtils.loadRelaxed(view, 0)).toBe(42);

    const old = AtomicUtils.compareExchange(view, 0, 42, 99);
    expect(old).toBe(42);
    expect(AtomicUtils.loadRelaxed(view, 0)).toBe(99);
  });
});
