import { describe, it, expect } from 'vitest';
import { ByteRingStream } from '../src/stream/byte-stream';

describe('ByteRingStream', () => {
  it('writes and reads bytes with wrap-around', () => {
    const sab = new SharedArrayBuffer(8);
    const stream = new ByteRingStream(sab, 0, 8);

    const payload = new Uint8Array([10, 20, 30, 40, 50]);
    expect(stream.write(payload)).toBe(5);

    const out = new Uint8Array(5);
    expect(stream.read(out)).toBe(5);
    expect(Array.from(out)).toEqual([10, 20, 30, 40, 50]);

    // Next write wraps around ring end
    const payload2 = new Uint8Array([60, 70, 80, 90]);
    expect(stream.write(payload2)).toBe(4);

    const out2 = new Uint8Array(4);
    expect(stream.read(out2)).toBe(4);
    expect(Array.from(out2)).toEqual([60, 70, 80, 90]);
  });
});
