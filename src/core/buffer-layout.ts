import { CACHE_LINE_BYTES, HEADER_TOTAL_BYTES } from './constants.js';
import { nextPowerOfTwo } from '../utils/math.js';

export interface RingBufferLayout {
  capacity: number;
  mask: number;
  totalBytes: number;
  dataOffsetBytes: number;
}

export function computeRingBufferLayout(requestedCapacity: number, elementSizeBytes = 4): RingBufferLayout {
  const capacity = nextPowerOfTwo(requestedCapacity);
  const mask = capacity - 1;
  const dataBytes = capacity * elementSizeBytes;
  // Pad data section to 64-byte boundary
  const alignedDataBytes = (dataBytes + (CACHE_LINE_BYTES - 1)) & ~(CACHE_LINE_BYTES - 1);
  const totalBytes = HEADER_TOTAL_BYTES + alignedDataBytes;

  return {
    capacity,
    mask,
    totalBytes,
    dataOffsetBytes: HEADER_TOTAL_BYTES
  };
}
