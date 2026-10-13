import { describe, it, expect } from 'vitest';
import { BatchDrainer } from '../src/batch/batch-drainer';

describe('BatchDrainer', () => {
  it('drains available items up to batch limit', () => {
    const queue = [1, 2, 3, 4, 5];
    const drained = BatchDrainer.drainAll(() => queue.shift(), 3);
    expect(drained).toEqual([1, 2, 3]);
    expect(queue).toEqual([4, 5]);
  });
});
