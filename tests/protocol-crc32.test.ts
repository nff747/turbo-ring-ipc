import { describe, it, expect } from 'vitest';
import { CRC32 } from '../src/protocol/crc32';

describe('CRC32 Protocol Verification', () => {
  it('evaluates standard ASCII 123456789 test vector', () => {
    const bytes = new TextEncoder().encode('123456789');
    expect(CRC32.compute(bytes)).toBe(0xCBF43926);
  });
});
