import { describe, it, expect } from 'vitest';
import { SharedMemorySlab } from '../src/memory/slab.js';

describe('SharedMemorySlab Reclamation', () => {
  it('frees and reallocates chunks without memory leakage', () => {
    const slab = new SharedMemorySlab(2, 32);
    const c1 = slab.allocateChunk();
    const c2 = slab.allocateChunk();
    expect(slab.allocateChunk()).toBeNull(); // Exhausted

    expect(slab.freeChunk(c1!.chunkIndex)).toBe(true);
    expect(slab.freeChunk(c1!.chunkIndex)).toBe(false); // Double free rejected

    const c1Reallocated = slab.allocateChunk();
    expect(c1Reallocated).not.toBeNull();
    expect(c1Reallocated?.chunkIndex).toBe(c1?.chunkIndex);
  });
});
