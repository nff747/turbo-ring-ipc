import { describe, it, expect } from 'vitest';
import { MpmcBoundedQueue } from '../src/mpmc/queue.js';

describe('MpmcBoundedQueue Single-Thread Verification', () => {
  it('enqueues and dequeues with strict sequence preservation', () => {
    const queue = new MpmcBoundedQueue(8);
    expect(queue.isEmpty).toBe(true);

    expect(queue.tryEnqueue(100)).toBe(true);
    expect(queue.tryEnqueue(200)).toBe(true);
    expect(queue.tryEnqueue(300)).toBe(true);

    expect(queue.size).toBe(3);
    expect(queue.tryDequeue()).toBe(100);
    expect(queue.tryDequeue()).toBe(200);
    expect(queue.tryDequeue()).toBe(300);
    expect(queue.tryDequeue()).toBeUndefined();
    expect(queue.isEmpty).toBe(true);
  });
});
