import { describe, it, expect } from 'vitest';
import { CacheLinePaddedCursor } from '../src/ring/ring-cursor';

describe('CacheLinePaddedCursor', () => {
  it('atomically increments and retrieves counter value', () => {
    const sab = new SharedArrayBuffer(128);
    const cursor = new CacheLinePaddedCursor(sab, 0);
    cursor.set(100);
    expect(cursor.get()).toBe(100);
    cursor.increment();
    expect(cursor.get()).toBe(101);
  });
});
