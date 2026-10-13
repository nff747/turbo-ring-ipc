import { describe, it, expect } from 'vitest';
import { LatencyHistogram } from '../src/metrics/histogram';

describe('LatencyHistogram', () => {
  it('accurately computes p50 and p99 percentiles', () => {
    const hist = new LatencyHistogram();
    for (let i = 1; i <= 100; i++) {
      hist.record(i);
    }
    expect(hist.percentile(50)).toBe(50);
    expect(hist.percentile(99)).toBe(99);
  });
});
