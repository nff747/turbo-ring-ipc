import { describe, it, expect } from 'vitest';
import { SharedBufferPool } from '../src/pool/buffer-pool';

describe('SharedBufferPool', () => {
  it('acquires and releases shared array buffers', () => {
    const pool = new SharedBufferPool(256, 2);
    expect(pool.availableCount()).toBe(2);

    const b1 = pool.acquire();
    expect(pool.availableCount()).toBe(1);

    pool.release(b1);
    expect(pool.availableCount()).toBe(2);
  });
});
