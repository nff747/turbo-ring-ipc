import { describe, it, expect } from 'vitest';
import { SharedMemoryTransport } from '../src/transport/shared-memory-transport';

describe('SharedMemoryTransport', () => {
  it('transmits and retrieves payloads sequentially', () => {
    const transport = new SharedMemoryTransport();
    transport.send(new Uint8Array([1, 2]));
    transport.send(new Uint8Array([3, 4]));

    expect(transport.receive()).toEqual(new Uint8Array([1, 2]));
    expect(transport.receive()).toEqual(new Uint8Array([3, 4]));
    expect(transport.receive()).toBeNull();
  });
});
