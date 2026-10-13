import { describe, it, expect } from 'vitest';
import { TLVMessagePacker } from '../src/protocol/message-packer';

describe('TLVMessagePacker', () => {
  it('encodes tag and payload cleanly', () => {
    const payload = new Uint8Array([1, 2, 3, 4, 5]);
    const frame = TLVMessagePacker.pack(0xA1B2, payload);
    const decoded = TLVMessagePacker.unpack(frame);

    expect(decoded.tag).toBe(0xA1B2);
    expect(Array.from(decoded.payload)).toEqual([1, 2, 3, 4, 5]);
  });
});
