import { describe, it, expect } from 'vitest';
import {
  SpscRingBuffer,
  MpmcBoundedQueue,
  SharedMemorySlab,
  WorkerBridge,
  MessageType
} from '../src/index.js';

describe('turbo-ring-ipc End-to-End Integration Suite', () => {
  it('combines SPSC, MPMC, and Slab into a unified zero-copy processing pipeline', async () => {
    // 1. WorkerBridge setup
    const { mainChannel, workerDescriptor } = WorkerBridge.createDescriptors({
      ringCapacity: 512,
      slabTotalChunks: 32,
      slabChunkSize: 256
    });
    const workerChannel = WorkerBridge.attachWorker(workerDescriptor);

    // 2. High-speed SPSC streaming
    const spsc = new SpscRingBuffer(64);
    for (let i = 0; i < 32; i++) {
      spsc.tryPush(i * 10);
    }
    expect(spsc.size).toBe(32);

    // 3. Concurrent MPMC Task Distribution
    const mpmc = new MpmcBoundedQueue(64);
    while (spsc.size > 0) {
      const val = spsc.tryPop()!;
      mpmc.enqueue(val);
    }
    expect(mpmc.size).toBe(32);

    // 4. WorkerChannel Duplex Request-Response with Zero-Copy Slab Memory
    workerChannel.setHandler(msg => {
      const reqVal = new TextDecoder().decode(msg.payload!);
      return `Processed-${reqVal}`;
    });

    const requestPayload = 'TelemetryFrame_#999';
    const reqPromise = mainChannel.request(requestPayload, 1000);

    // Worker polls request
    const polledWorker = workerChannel.poll();
    expect(polledWorker).toBe(1);

    // Main polls response
    await new Promise(r => setTimeout(r, 10));
    const polledMain = mainChannel.poll();
    expect(polledMain).toBe(1);

    const response = await reqPromise;
    expect(response).not.toBeNull();
    const respStr = new TextDecoder().decode(response!);
    expect(respStr).toContain('Processed-TelemetryFrame_#999');

    // 5. Verify stats
    const mainStats = mainChannel.getChannelStats();
    expect(mainStats.messagesSent).toBe(1);
    expect(mainStats.messagesReceived).toBe(1);
  });
});
