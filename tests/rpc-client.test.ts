import { describe, it, expect } from 'vitest';
import { RingRpcClient } from '../src/channel/rpc-client';

describe('RingRpcClient', () => {
  it('creates framed request with monotonic ID', () => {
    const client = new RingRpcClient();
    const req = client.createRequest(new Uint8Array([1, 2, 3]));
    expect(req.id).toBe(1);
    expect(req.frame.length).toBe(7);
  });
});
