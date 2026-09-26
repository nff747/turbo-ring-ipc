import { describe, it, expect } from 'vitest';
import { SpscRingBuffer } from '../src/spsc/ring-buffer.js';

describe('SpscRingBuffer Batch Operations', () => {
  it('pushes and pops bulk batches up to capacity', () => {
    const ring = new SpscRingBuffer(16);
    const source = [10, 20, 30, 40, 50];

    const pushed = ring.pushBatch(source);
    expect(pushed).toBe(5);
    expect(ring.size).toBe(5);

    const out = new Int32Array(5);
    const popped = ring.popBatch(out);
    expect(popped).toBe(5);
    expect(Array.from(out)).toEqual(source);
    expect(ring.isEmpty).toBe(true);
  });
});
