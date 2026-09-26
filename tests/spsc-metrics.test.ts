import { describe, it, expect } from 'vitest';
import { SpscRingBuffer } from '../src/spsc/ring-buffer.js';
import { computeSpscMetrics } from '../src/spsc/metrics.js';

describe('SpscRingBuffer Metrics', () => {
  it('accurately computes buffer saturation percentage', () => {
    const ring = new SpscRingBuffer(8);
    ring.tryPush(1);
    ring.tryPush(2);

    const metrics = computeSpscMetrics(ring);
    expect(metrics.size).toBe(2);
    expect(metrics.capacity).toBe(8);
    expect(metrics.saturation).toBeCloseTo(0.25);
  });
});
