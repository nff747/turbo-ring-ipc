import { describe, it, expect } from 'vitest';
import { CircuitBreaker } from '../src/circuit/breaker';

describe('CircuitBreaker', () => {
  it('trips from CLOSED to OPEN after failure threshold', () => {
    const cb = new CircuitBreaker(2);
    expect(cb.getState()).toBe('CLOSED');
    cb.recordFailure();
    expect(cb.getState()).toBe('CLOSED');
    cb.recordFailure();
    expect(cb.getState()).toBe('OPEN');
    cb.recordSuccess();
    expect(cb.getState()).toBe('CLOSED');
  });
});
