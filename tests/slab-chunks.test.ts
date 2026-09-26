import { describe, it, expect } from 'vitest';
import { SharedMemorySlab } from '../src/memory/slab.js';

describe('SharedMemorySlab Sizing', () => {
  it('correctly calculates chunk counts for variable byte sizes', () => {
    const slab = new SharedMemorySlab(16, 128);
    expect(slab.requiredChunks(50)).toBe(1);
    expect(slab.requiredChunks(128)).toBe(1);
    expect(slab.requiredChunks(129)).toBe(2);
    expect(slab.requiredChunks(500)).toBe(4);
  });
});
