import { describe, it, expect } from 'vitest';
import { SharedMemorySlab } from '../src/memory/slab.js';

describe('SharedMemorySlab Allocation', () => {
  it('allocates chunks, writes data and reads zero-copy views', () => {
    const slab = new SharedMemorySlab(4, 64);
    const chunk = slab.allocateChunk();
    expect(chunk).not.toBeNull();
    expect(chunk?.chunkIndex).toBe(0);

    const payload = new Uint8Array([1, 2, 3, 4, 5]);
    slab.writePayload(chunk!, payload);

    const readBack = slab.readPayload(chunk!.chunkIndex, payload.length);
    expect(Array.from(readBack)).toEqual([1, 2, 3, 4, 5]);
  });
});
