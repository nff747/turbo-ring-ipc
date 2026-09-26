import { SpscRingBuffer } from '../spsc/ring-buffer.js';
import { SharedMemorySlab } from '../memory/slab.js';
import { MessageType, MessageEnvelope, DuplexChannelConfig, ChannelStats } from './types.js';
import { FRAME_DESCRIPTOR_INTS, FrameEncoder } from './framing.js';
import { RequestCorrelator } from './correlator.js';

export interface ChannelEndpoints {
  endpointA: DuplexFramedChannel;
  endpointB: DuplexFramedChannel;
}

export type MessageHandler = (message: MessageEnvelope<Uint8Array | null>) => unknown | Promise<unknown>;

export class DuplexFramedChannel {
  public readonly txRing: SpscRingBuffer;
  public readonly rxRing: SpscRingBuffer;
  public readonly slab: SharedMemorySlab;
  protected readonly correlator = new RequestCorrelator<Uint8Array | null>();
  protected handler?: MessageHandler;
  protected stats = { messagesSent: 0, messagesReceived: 0, bytesSent: 0, bytesReceived: 0 };

  constructor(txRing: SpscRingBuffer, rxRing: SpscRingBuffer, slab: SharedMemorySlab) {
    this.txRing = txRing;
    this.rxRing = rxRing;
    this.slab = slab;
  }

  public static createPair(config: DuplexChannelConfig = {}): ChannelEndpoints {
    const ringCapacity = config.ringCapacity ?? 1024;
    const slabChunks = config.slabTotalChunks ?? 128;
    const chunkSize = config.slabChunkSize ?? 512;

    const ringA = new SpscRingBuffer(ringCapacity);
    const ringB = new SpscRingBuffer(ringCapacity);
    const slab = new SharedMemorySlab(slabChunks, chunkSize);

    const endpointA = new DuplexFramedChannel(ringA, ringB, slab);
    const endpointB = new DuplexFramedChannel(ringB, ringA, slab);

    return { endpointA, endpointB };
  }

  public getChannelStats(): ChannelStats {
    return { ...this.stats };
  }
}
