import { MpmcBoundedQueue } from '../mpmc/queue.js';
import { BenchResult } from './spsc-bench.js';

export function runMpmcBenchmark(iterations = 1_000_000): BenchResult {
  const queue = new MpmcBoundedQueue(65536);
  const start = performance.now();

  for (let i = 0; i < iterations; i++) {
    queue.enqueue(i);
    queue.dequeue();
  }

  const durationMs = performance.now() - start;
  const opsPerSec = Math.round((iterations * 2) / (durationMs / 1000));
  const avgLatencyNs = Math.round((durationMs * 1_000_000) / (iterations * 2));

  return {
    name: 'MPMC Vyukov Bounded Queue (Enqueue + Dequeue)',
    operations: iterations * 2,
    durationMs,
    opsPerSec,
    avgLatencyNs
  };
}
