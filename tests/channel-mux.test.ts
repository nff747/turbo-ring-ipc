import { describe, it, expect } from 'vitest';
import { ChannelMultiplexer } from '../src/mux/channel-mux';

describe('ChannelMultiplexer', () => {
  it('dispatches messages to targeted virtual channels', () => {
    const mux = new ChannelMultiplexer();
    let valA = 0, valB = 0;

    mux.registerChannel(1, (data) => { valA = data[0]; });
    mux.registerChannel(2, (data) => { valB = data[0]; });

    expect(mux.dispatch(1, new Uint8Array([77]))).toBe(true);
    expect(valA).toBe(77);
    expect(valB).toBe(0);

    expect(mux.dispatch(3, new Uint8Array([99]))).toBe(false);
  });
});
