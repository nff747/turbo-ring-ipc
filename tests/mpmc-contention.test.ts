import { describe, it, expect } from 'vitest';
import { MpmcBoundedQueue } from '../src/mpmc/queue.js';
import { ExponentialBackoff } from '../src/mpmc/backoff.js';

describe('MPMC Simulated Contention', () => {
  it('handles interleaved multi-actor bursts without dropping elements', () => {
    const queue = new MpmcBoundedQueue(64);
    const backoff = new ExponentialBackoff();
    const count = 500;

    for (let i = 0; i < count; i++) {
      while (!queue.tryEnqueue(i)) {
        backoff.spin();
      }
      backoff.reset();

      const popped = queue.tryDequeue();
      expect(popped).toBe(i);
    }

    expect(queue.isEmpty).toBe(true);
  });
});
