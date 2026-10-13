export class DeltaVarintCodec {
  static encode(n: number): number[] {
    const bytes: number[] = [];
    let val = n >>> 0;
    while (val >= 0x80) {
      bytes.push((val & 0x7F) | 0x80);
      val >>>= 7;
    }
    bytes.push(val);
    return bytes;
  }

  static decode(bytes: Uint8Array, offset = 0): { value: number; bytesRead: number } {
    let result = 0;
    let shift = 0;
    let i = offset;
    while (i < bytes.length) {
      const b = bytes[i];
      result |= (b & 0x7F) << shift;
      i++;
      if ((b & 0x80) === 0) break;
      shift += 7;
    }
    return { value: result, bytesRead: i - offset };
  }
}
