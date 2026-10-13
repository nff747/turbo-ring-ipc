import { describe, it, expect } from 'vitest';
import { SpscRingBuffer } from '../src/spsc/ring-buffer';
import { TLVMessagePacker } from '../src/protocol/message-packer';
import { CRC32 } from '../src/protocol/crc32';

describe('End-to-End Pipeline Integration', () => {
  it('encodes, transmits, and validates framed CRC32 payload across SPSC ring', () => {
    const ring = new SpscRingBuffer(8);
    const payload = new Uint8Array([10, 20, 30, 40]);
    const frame = TLVMessagePacker.pack(0xF00D, payload);
    const checksum = CRC32.compute(frame);

    expect(ring.tryPush(checksum)).toBe(true);

    const receivedChecksum = ring.tryPop();
    expect(receivedChecksum).toBe(checksum);

    const unpacked = TLVMessagePacker.unpack(frame);
    expect(unpacked.tag).toBe(0xF00D);
    expect(Array.from(unpacked.payload)).toEqual([10, 20, 30, 40]);
  });
});
