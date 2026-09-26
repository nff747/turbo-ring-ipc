import { describe, it, expect } from 'vitest';
import { SpscRingBuffer } from '../src/spsc/ring-buffer.js';

describe('SpscRingBuffer Basic Operations', () => {
  it('pushes and pops single items in FIFO order', () => {
    const ring = new SpscRingBuffer(4);
    expect(ring.capacity).toBe(4);
    expect(ring.isEmpty).toBe(true);

    expect(ring.tryPush(10)).toBe(true);
    expect(ring.tryPush(20)).toBe(true);
    expect(ring.size).toBe(2);

    expect(ring.tryPop()).toBe(10);
    expect(ring.tryPop()).toBe(20);
    expect(ring.tryPop()).toBeUndefined();
    expect(ring.isEmpty).toBe(true);
  });

  it('rejects pushes when capacity is reached', () => {
    const ring = new SpscRingBuffer(4);
    expect(ring.tryPush(1)).toBe(true);
    expect(ring.tryPush(2)).toBe(true);
    expect(ring.tryPush(3)).toBe(true);
    expect(ring.tryPush(4)).toBe(true);

    expect(ring.isFull).toBe(true);
    expect(ring.tryPush(5)).toBe(false); // Should fail

    expect(ring.tryPop()).toBe(1);
    expect(ring.tryPush(5)).toBe(true); // Now succeeds
  });
});
