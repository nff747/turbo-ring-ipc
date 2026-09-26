export interface SlabHeader {
  totalChunks: number;
  chunkSizeBytes: number;
  allocatedChunks: number;
}

export interface ChunkAllocation {
  chunkIndex: number;
  byteOffset: number;
  byteLength: number;
}
