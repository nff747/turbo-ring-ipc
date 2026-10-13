import { describe, it, expect } from 'vitest';
import { AdaptiveThrottle } from '../src/backpressure/adaptive-throttle';

describe('AdaptiveThrottle', () => {
  it('escalates spin cycles on failures and resets on success', () => {
    const throttle = new AdaptiveThrottle();
    expect(throttle.getSpinCycles()).toBe(10);

    throttle.recordFailure();
    expect(throttle.getSpinCycles()).toBeGreaterThan(10);

    throttle.recordSuccess();
    expect(throttle.getSpinCycles()).toBe(10);
  });
});
