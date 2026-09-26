export interface SharedWorkerDescriptor {
  readonly txBuffer: SharedArrayBuffer;
  readonly rxBuffer: SharedArrayBuffer;
  readonly slabBuffer: SharedArrayBuffer;
  readonly ringCapacity: number;
  readonly slabTotalChunks: number;
  readonly slabChunkSize: number;
}
