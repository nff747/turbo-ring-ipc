export enum MessageType {
  HEARTBEAT = 0,
  REQUEST = 1,
  RESPONSE = 2,
  ONE_WAY = 3,
  ERROR = 4
}

export interface MessageEnvelope<T = unknown> {
  readonly type: MessageType;
  readonly correlationId: number;
  readonly payload: T;
  readonly byteLength: number;
  readonly timestamp: number;
}

export interface FrameDescriptor {
  readonly type: MessageType;
  readonly correlationId: number;
  readonly chunkIndex: number;
  readonly payloadLength: number;
}

export interface DuplexChannelConfig {
  readonly ringCapacity?: number;
  readonly slabTotalChunks?: number;
  readonly slabChunkSize?: number;
}

export interface ChannelStats {
  readonly messagesSent: number;
  readonly messagesReceived: number;
  readonly bytesSent: number;
  readonly bytesReceived: number;
}
