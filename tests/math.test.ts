import { describe, it, expect } from 'vitest';
import { nextPowerOfTwo, isPowerOfTwo } from '../src/utils/math.js';

describe('Bitwise Math Utilities', () => {
  it('correctly rounds up to the next power of two', () => {
    expect(nextPowerOfTwo(5)).toBe(8);
    expect(nextPowerOfTwo(16)).toBe(16);
    expect(nextPowerOfTwo(1000)).toBe(1024);
  });

  it('detects power-of-two values accurately', () => {
    expect(isPowerOfTwo(16)).toBe(true);
    expect(isPowerOfTwo(1024)).toBe(true);
    expect(isPowerOfTwo(15)).toBe(false);
    expect(isPowerOfTwo(0)).toBe(false);
  });
});
