import { describe, it, expect } from 'vitest';
import { TicketSpinlock } from '../src/lock/spinlock';

describe('TicketSpinlock', () => {
  it('locks and unlocks in single-thread sequence', () => {
    const sab = new SharedArrayBuffer(16);
    const lock = new TicketSpinlock(sab);
    lock.lock();
    lock.unlock();
  });
});
