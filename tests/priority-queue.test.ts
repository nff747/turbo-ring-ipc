import { describe, it, expect } from 'vitest';
import { DualPriorityLane } from '../src/priority/priority-queue';

describe('DualPriorityLane', () => {
  it('drains high priority items before low priority items', () => {
    const lane = new DualPriorityLane<string>();
    lane.enqueue('low-1', false);
    lane.enqueue('low-2', false);
    lane.enqueue('high-urgent', true);

    expect(lane.dequeue()).toBe('high-urgent');
    expect(lane.dequeue()).toBe('low-1');
    expect(lane.dequeue()).toBe('low-2');
  });
});
