import { describe, it, expect } from 'vitest';
import { DuplexFramedChannel } from '../src/channel/duplex.js';
import { MessageType } from '../src/channel/types.js';

describe('DuplexFramedChannel Roundtrip', () => {
  it('transfers binary payload from endpoint A to endpoint B with zero-copy slab memory reuse', () => {
    const { endpointA, endpointB } = DuplexFramedChannel.createPair({ slabTotalChunks: 16, slabChunkSize: 64 });
    const payload = new Uint8Array([10, 20, 30, 40, 50, 60]);

    const sent = endpointA.send(MessageType.ONE_WAY, payload, 42);
    expect(sent).toBe(true);

    const received = endpointB.tryReceive();
    expect(received).not.toBeNull();
    expect(received?.type).toBe(MessageType.ONE_WAY);
    expect(received?.correlationId).toBe(42);
    expect(received?.payload).toEqual(payload);

    // Slab chunk should be freed and available for reuse
    const chunkAfter = endpointA.slab.allocateChunk();
    expect(chunkAfter).not.toBeNull();
    expect(chunkAfter?.chunkIndex).toBe(0);
  });

  it('transfers JSON payload bidirectionally across endpoints', () => {
    const { endpointA, endpointB } = DuplexFramedChannel.createPair();
    const data = { user: 'Alice', active: true, score: 98.6 };

    endpointA.send(MessageType.REQUEST, data, 101);
    const receivedB = endpointB.tryReceiveJson<typeof data>();
    expect(receivedB?.payload).toEqual(data);

    endpointB.send(MessageType.RESPONSE, { acknowledged: true }, 101);
    const receivedA = endpointA.tryReceiveJson<{ acknowledged: boolean }>();
    expect(receivedA?.payload?.acknowledged).toBe(true);
  });
});
