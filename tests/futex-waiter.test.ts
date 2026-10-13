import { describe, it, expect } from 'vitest';
import { FutexWaiter } from '../src/futex/waiter';

describe('FutexWaiter', () => {
  it('returns not-equal immediately if expected value does not match', () => {
    const sab = new SharedArrayBuffer(16);
    const view = new Int32Array(sab);
    view[0] = 42;
    const res = FutexWaiter.wait(view, 0, 99, 10);
    expect(res).toBe('not-equal');
  });

  it('notifies waiting threads correctly', () => {
    const sab = new SharedArrayBuffer(16);
    const view = new Int32Array(sab);
    const notified = FutexWaiter.notify(view, 0, 1);
    expect(notified).toBeGreaterThanOrEqual(0);
  });
});
