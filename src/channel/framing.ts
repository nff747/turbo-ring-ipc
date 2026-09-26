import { FrameDescriptor, MessageType } from './types.js';

export const FRAME_DESCRIPTOR_INTS = 4;

export class FrameEncoder {
  public static pack(type: MessageType, correlationId: number, chunkIndex: number, length: number): Int32Array {
    const arr = new Int32Array(FRAME_DESCRIPTOR_INTS);
    arr[0] = type;
    arr[1] = correlationId;
    arr[2] = chunkIndex;
    arr[3] = length;
    return arr;
  }

  public static unpack(slice: ArrayLike<number>): FrameDescriptor {
    if (slice.length < FRAME_DESCRIPTOR_INTS) {
      throw new Error(`Insufficient ints for frame descriptor: expected ${FRAME_DESCRIPTOR_INTS}, got ${slice.length}`);
    }
    return {
      type: slice[0] as MessageType,
      correlationId: slice[1],
      chunkIndex: slice[2],
      payloadLength: slice[3]
    };
  }
}
