import { describe, it, expect } from 'vitest';
import { DuplexFramedChannel } from '../src/channel/duplex.js';

describe('Duplex Channel Request-Response Multiplexing', () => {
  it('resolves asynchronous request when counterpart polls and dispatches response', async () => {
    const { endpointA, endpointB } = DuplexFramedChannel.createPair();

    endpointB.setHandler(msg => {
      const text = new TextDecoder().decode(msg.payload!);
      return `Processed: ${text}`;
    });

    const requestPromise = endpointA.request('compute-job', 1000);

    // Process on endpoint B
    const handledB = endpointB.poll();
    expect(handledB).toBe(1);

    // Endpoint A polls response
    await new Promise(resolve => setTimeout(resolve, 10));
    const handledA = endpointA.poll();
    expect(handledA).toBe(1);

    const result = await requestPromise;
    expect(result).not.toBeNull();
    const str = new TextDecoder().decode(result!);
    expect(str).toContain('compute-job');
  });

  it('rejects pending request on timeout', async () => {
    const { endpointA } = DuplexFramedChannel.createPair();
    await expect(endpointA.request('unanswered', 50)).rejects.toThrow('timed out');
  });
});
