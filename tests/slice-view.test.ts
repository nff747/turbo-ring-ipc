import { describe, it, expect } from 'vitest';
import { ZeroCopySliceView } from '../src/stream/slice-view';

describe('ZeroCopySliceView', () => {
  it('shares underlying memory between Float32 and Uint8 projections', () => {
    const sab = new SharedArrayBuffer(16);
    const f32View = ZeroCopySliceView.getFloat32View(sab, 0, 4);
    f32View[0] = 3.14159;

    const u8View = ZeroCopySliceView.getUint8View(sab, 0, 16);
    expect(u8View[0] !== 0 || u8View[1] !== 0).toBe(true);
  });
});
