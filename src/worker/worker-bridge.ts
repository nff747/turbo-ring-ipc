import { SpscRingBuffer } from '../spsc/ring-buffer.js';
import { SharedMemorySlab } from '../memory/slab.js';
import { DuplexFramedChannel } from '../channel/duplex.js';
import { DuplexChannelConfig } from '../channel/types.js';
import { SharedWorkerDescriptor } from './types.js';

export class WorkerBridge {
  public static createDescriptors(config: DuplexChannelConfig = {}): {
    mainChannel: DuplexFramedChannel;
    workerDescriptor: SharedWorkerDescriptor;
  } {
    const ringCapacity = config.ringCapacity ?? 2048;
    const slabChunks = config.slabTotalChunks ?? 128;
    const chunkSize = config.slabChunkSize ?? 512;

    const ringMainToWorker = new SpscRingBuffer(ringCapacity);
    const ringWorkerToMain = new SpscRingBuffer(ringCapacity);
    const slab = new SharedMemorySlab(slabChunks, chunkSize);

    const mainChannel = new DuplexFramedChannel(ringMainToWorker, ringWorkerToMain, slab);

    const workerDescriptor: SharedWorkerDescriptor = {
      txBuffer: ringWorkerToMain.sharedBuffer,
      rxBuffer: ringMainToWorker.sharedBuffer,
      slabBuffer: slab.sharedBuffer,
      ringCapacity,
      slabTotalChunks: slabChunks,
      slabChunkSize: chunkSize
    };

    return { mainChannel, workerDescriptor };
  }

  public static attachWorker(descriptor: SharedWorkerDescriptor): DuplexFramedChannel {
    const txRing = new SpscRingBuffer(descriptor.txBuffer);
    const rxRing = new SpscRingBuffer(descriptor.rxBuffer);
    const slab = new SharedMemorySlab(descriptor.slabTotalChunks, descriptor.slabChunkSize, descriptor.slabBuffer);

    return new DuplexFramedChannel(txRing, rxRing, slab);
  }
}
