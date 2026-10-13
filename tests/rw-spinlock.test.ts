import { describe, it, expect } from 'vitest';
import { ReadWriteSpinlock } from '../src/lock/rw-spinlock';

describe('ReadWriteSpinlock', () => {
  it('permits multiple concurrent readers', () => {
    const sab = new SharedArrayBuffer(16);
    const rw = new ReadWriteSpinlock(sab);
    rw.readLock();
    rw.readLock();
    rw.readUnlock();
    rw.readUnlock();

    rw.writeLock();
    rw.writeUnlock();
  });
});
