import { describe, it, expect } from 'vitest';
import { DeltaVarintCodec } from '../src/codec/delta-varint';

describe('DeltaVarintCodec', () => {
  it('correctly compresses integers into variable bytes', () => {
    const values = [0, 1, 127, 128, 300, 16384, 1000000];
    for (const v of values) {
      const enc = DeltaVarintCodec.encode(v);
      const dec = DeltaVarintCodec.decode(new Uint8Array(enc));
      expect(dec.value).toBe(v);
    }
  });
});
