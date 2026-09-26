import { describe, it, expect } from 'vitest';
import { MpmcBoundedQueue } from '../src/mpmc/queue.js';

describe('MpmcBoundedQueue Drain', () => {
  it('drains all available elements cleanly', () => {
    const queue = new MpmcBoundedQueue(8);
    queue.tryEnqueue(10);
    queue.tryEnqueue(20);
    queue.tryEnqueue(30);

    const drained = queue.drain();
    expect(drained).toEqual([10, 20, 30]);
    expect(queue.isEmpty).toBe(true);
  });
});
