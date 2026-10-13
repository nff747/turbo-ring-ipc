import { describe, it, expect } from 'vitest';
import { FanoutBus } from '../src/broadcast/fanout-bus';

describe('FanoutBus', () => {
  it('fans out payload to registered subscribers', () => {
    const bus = new FanoutBus();
    let r1 = 0, r2 = 0;
    bus.subscribe((msg) => { r1 = msg[0]; });
    const unsub = bus.subscribe((msg) => { r2 = msg[0]; });

    bus.broadcast(new Uint8Array([42]));
    expect(r1).toBe(42);
    expect(r2).toBe(42);

    unsub();
    bus.broadcast(new Uint8Array([99]));
    expect(r1).toBe(99);
    expect(r2).toBe(42); // unchanged
  });
});
