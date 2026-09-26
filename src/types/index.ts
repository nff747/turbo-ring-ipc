export type RingBufferState = 'EMPTY' | 'READY' | 'PROCESSING' | 'CLOSED';

export interface RingBufferOptions {
  capacity: number;
  useFutex?: boolean;
}

export interface QueueMetrics {
  capacity: number;
  size: number;
  pushedCount: number;
  poppedCount: number;
  droppedCount: number;
  saturation: number;
}
