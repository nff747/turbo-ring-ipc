# TurboRing IPC Architecture Specifications

TurboRing IPC is an ultra-low latency, lock-free, zero-allocation Inter-Process Communication (IPC) library engineered on top of JavaScript's `SharedArrayBuffer` and `Atomics` primitives.

```
+-----------------------------------------------------------+
|                   TurboRing Shared Buffer                 |
+-----------------------------------------------------------+
| [ Cache Line 0 ] (64B) Producer State (Head Index)        |
+-----------------------------------------------------------+
| [ Padding Line ] (64B) False-Sharing Isolation Barrier    |
+-----------------------------------------------------------+
| [ Cache Line 1 ] (64B) Consumer State (Tail Index)        |
+-----------------------------------------------------------+
| [ Padding Line ] (64B) False-Sharing Isolation Barrier    |
+-----------------------------------------------------------+
| [ Circular Data Buffer ] (Power-of-2 Slots)               |
| - SPSC Slot Array / MPMC Cell Sequence Headers            |
| - Slab Payload Pointers                                   |
+-----------------------------------------------------------+
```

### Key Technical Pillars
1. **False-Sharing Elimination**: Write heads and read tails are anchored to distinct 64-byte aligned hardware cache lines to prevent CPU L1/L2 cache invalidation thrashing across cores.
2. **Wait-Free & Lock-Free SPSC**: Enqueue and dequeue execute using atomic load/store operations without locks, mutexes, or busy loops.
3. **Ticket-Based MPMC**: Multi-Producer Multi-Consumer bounded queue using atomic sequence tickets (Dmitry Vyukov design).
4. **Futex-Style Wakeups**: Native `Atomics.wait()` and `Atomics.notify()` avoiding spinning when empty or full.
