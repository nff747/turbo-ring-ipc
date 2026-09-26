import { SpscRingBuffer } from './ring-buffer.js';
import { QueueMetrics } from '../types/index.js';

export function computeSpscMetrics(ring: SpscRingBuffer, dropped = 0): QueueMetrics {
  const sz = ring.size;
  const cap = ring.capacity;
  return {
    capacity: cap,
    size: sz,
    pushedCount: sz,
    poppedCount: 0,
    droppedCount: dropped,
    saturation: cap > 0 ? sz / cap : 0
  };
}
