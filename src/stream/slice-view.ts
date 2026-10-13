export class ZeroCopySliceView {
  static getFloat32View(sab: SharedArrayBuffer, byteOffset: number, count: number): Float32Array {
    return new Float32Array(sab, byteOffset, count);
  }

  static getInt32View(sab: SharedArrayBuffer, byteOffset: number, count: number): Int32Array {
    return new Int32Array(sab, byteOffset, count);
  }

  static getUint8View(sab: SharedArrayBuffer, byteOffset: number, count: number): Uint8Array {
    return new Uint8Array(sab, byteOffset, count);
  }
}
