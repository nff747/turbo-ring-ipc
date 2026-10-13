import { describe, it, expect } from 'vitest';
import { AtomicBarrier } from '../src/sync/barrier';

describe('AtomicBarrier', () => {
  it('triggers generation change upon final arrival', () => {
    const sab = new SharedArrayBuffer(16);
    const barrier = new AtomicBarrier(sab, 2);
    expect(barrier.arrive()).toBe(false);
    expect(barrier.arrive()).toBe(true);
  });
});
