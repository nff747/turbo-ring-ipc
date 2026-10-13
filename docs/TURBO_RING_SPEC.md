# Turbo-Ring-IPC Specification

## Memory Layout Architecture

Turbo-Ring-IPC achieves sub-microsecond cross-worker inter-process communication using `SharedArrayBuffer` and `Atomics`.

### Cache-Line Alignment
- Sequenced indices (head and tail cursors) are separated by 64-byte padding strides (16 `int32` entries) to prevent CPU cache-line bouncing and false sharing.

### Watermarked Backpressure
- Producers monitor write headroom. If headroom drops below the safety watermark, the `AdaptiveThrottle` shifts from active spinning into `FutexWaiter.wait()` async parking.
