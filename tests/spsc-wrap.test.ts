import { describe, it, expect } from 'vitest';
import { SpscRingBuffer } from '../src/spsc/ring-buffer.js';

describe('SpscRingBuffer Wraparound Invariants', () => {
  it('maintains strict sequence across thousands of continuous circular cycles', () => {
    const capacity = 8;
    const ring = new SpscRingBuffer(capacity);
    const totalItems = 5000;

    for (let i = 0; i < totalItems; i++) {
      expect(ring.tryPush(i)).toBe(true);
      const popped = ring.tryPop();
      expect(popped).toBe(i);
    }

    expect(ring.isEmpty).toBe(true);
  });
});
