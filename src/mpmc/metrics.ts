import { MpmcBoundedQueue } from './queue.js';
import { QueueMetrics } from '../types/index.js';

export function computeMpmcMetrics(queue: MpmcBoundedQueue): QueueMetrics {
  const sz = queue.size;
  const cap = queue.capacity;
  return {
    capacity: cap,
    size: sz,
    pushedCount: sz,
    poppedCount: 0,
    droppedCount: 0,
    saturation: cap > 0 ? sz / cap : 0
  };
}
