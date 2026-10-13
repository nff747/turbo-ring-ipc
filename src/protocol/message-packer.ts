export class TLVMessagePacker {
  static pack(tag: number, payload: Uint8Array): Uint8Array {
    const frame = new Uint8Array(8 + payload.length);
    const view = new DataView(frame.buffer, frame.byteOffset, frame.byteLength);
    view.setUint32(0, tag, true);
    view.setUint32(4, payload.length, true);
    frame.set(payload, 8);
    return frame;
  }

  static unpack(frame: Uint8Array): { tag: number; payload: Uint8Array } {
    const view = new DataView(frame.buffer, frame.byteOffset, frame.byteLength);
    const tag = view.getUint32(0, true);
    const len = view.getUint32(4, true);
    const payload = frame.subarray(8, 8 + len);
    return { tag, payload };
  }
}
