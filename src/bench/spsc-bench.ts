import { SpscRingBuffer } from '../spsc/ring-buffer.js';

export interface BenchResult {
  name: string;
  operations: number;
  durationMs: number;
  opsPerSec: number;
  avgLatencyNs: number;
}

export function runSpscBenchmark(iterations = 2_000_000): BenchResult {
  const ring = new SpscRingBuffer(65536);
  const start = performance.now();

  for (let i = 0; i < iterations; i++) {
    ring.tryPush(i);
    ring.tryPop();
  }

  const durationMs = performance.now() - start;
  const opsPerSec = Math.round((iterations * 2) / (durationMs / 1000));
  const avgLatencyNs = Math.round((durationMs * 1_000_000) / (iterations * 2));

  return {
    name: 'SPSC Lock-Free RingBuffer (Push + Pop)',
    operations: iterations * 2,
    durationMs,
    opsPerSec,
    avgLatencyNs
  };
}
