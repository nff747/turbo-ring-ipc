import { SharedMemorySlab } from '../memory/slab.js';
import { BenchResult } from './spsc-bench.js';

export function runSlabBenchmark(iterations = 500_000): BenchResult {
  const slab = new SharedMemorySlab(256, 128);
  const dummyPayload = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
  const start = performance.now();

  for (let i = 0; i < iterations; i++) {
    const chunk = slab.allocateChunk();
    if (chunk) {
      slab.writePayload(chunk, dummyPayload);
      slab.freeChunk(chunk.chunkIndex);
    }
  }

  const durationMs = performance.now() - start;
  const opsPerSec = Math.round((iterations * 3) / (durationMs / 1000));
  const avgLatencyNs = Math.round((durationMs * 1_000_000) / (iterations * 3));

  return {
    name: 'SharedMemorySlab (Allocate + Write + Free)',
    operations: iterations * 3,
    durationMs,
    opsPerSec,
    avgLatencyNs
  };
}
