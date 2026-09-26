import { SharedMemorySlab } from './slab.js';
import { AtomicUtils } from '../utils/atomics.js';

export interface SlabMetrics {
  totalChunks: number;
  allocatedChunks: number;
  freeChunks: number;
  utilization: number;
}

export function computeSlabMetrics(slab: SharedMemorySlab): SlabMetrics {
  let allocated = 0;
  for (let i = 0; i < slab.totalChunks; i++) {
    const word = i >> 5;
    const bit = i & 31;
    // Access protected property via prototype or check bit
    const val = Atomics.load(new Int32Array(slab.sharedBuffer, 0, Math.ceil(slab.totalChunks / 32)), word);
    if ((val & (1 << bit)) !== 0) {
      allocated++;
    }
  }

  return {
    totalChunks: slab.totalChunks,
    allocatedChunks: allocated,
    freeChunks: slab.totalChunks - allocated,
    utilization: slab.totalChunks > 0 ? allocated / slab.totalChunks : 0
  };
}
