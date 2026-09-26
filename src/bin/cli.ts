#!/usr/bin/env node
import { runSpscBenchmark } from '../bench/spsc-bench.js';
import { runMpmcBenchmark } from '../bench/mpmc-bench.js';
import { runSlabBenchmark } from '../bench/slab-bench.js';
import { CACHE_LINE_BYTES } from '../core/constants.js';

function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}

function runBenchmarks() {
  console.log('\n⚡ ===============================================================');
  console.log('⚡  TURBO-RING-IPC: HIGH-PERFORMANCE LOCK-FREE BENCHMARK SUITE');
  console.log('⚡ ===============================================================\n');

  const spsc = runSpscBenchmark(2_000_000);
  const mpmc = runMpmcBenchmark(1_000_000);
  const slab = runSlabBenchmark(500_000);

  console.log('┌──────────────────────────────────────────────┬───────────────┬──────────────┬──────────────┐');
  console.log('│ Benchmark Target                             │ Total Ops     │ Latency (avg)│ Throughput   │');
  console.log('├──────────────────────────────────────────────┼───────────────┼──────────────┼──────────────┤');
  for (const b of [spsc, mpmc, slab]) {
    const name = b.name.padEnd(44);
    const ops = formatNumber(b.operations).padStart(13);
    const lat = `${b.avgLatencyNs} ns`.padStart(12);
    const thr = `${formatNumber(b.opsPerSec)} ops/s`.padStart(12);
    console.log(`│ ${name} │ ${ops} │ ${lat} │ ${thr} │`);
  }
  console.log('└──────────────────────────────────────────────┴───────────────┴──────────────┴──────────────┘\n');
}

function printInfo() {
  console.log('\n⚡ TurboRingIPC System Topology & Alignment Diagnostics');
  console.log('------------------------------------------------------');
  console.log(`Cache Line Size (Hardware Padding):  ${CACHE_LINE_BYTES} bytes`);
  console.log(`SharedArrayBuffer Supported:         ${typeof SharedArrayBuffer !== 'undefined' ? 'YES' : 'NO'}`);
  console.log(`Atomics Futex Wait/Notify:          ${typeof Atomics.wait === 'function' ? 'YES' : 'NO'}\n`);
}

const arg = process.argv[2] ?? 'bench';
if (arg === 'bench') {
  runBenchmarks();
} else if (arg === 'info') {
  printInfo();
} else {
  console.log('Usage: turbo-ring-ipc [bench | info]');
}
