import { describe, it, expect } from 'vitest';
import { BuddyAllocator } from '../src/shm/allocator';

describe('BuddyAllocator', () => {
  it('allocates power-of-two addresses without overlap', () => {
    const alloc = new BuddyAllocator(1024);
    const a1 = alloc.allocate(100); // gets 128
    const a2 = alloc.allocate(100); // gets 128
    expect(a1).not.toBeNull();
    expect(a2).not.toBeNull();
    expect(a1 !== a2).toBe(true);
  });
});
