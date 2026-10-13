export class LatencyHistogram {
  private samples: number[] = [];

  record(latencyMicros: number): void {
    this.samples.push(latencyMicros);
  }

  percentile(p: number): number {
    if (this.samples.length === 0) return 0;
    this.samples.sort((a, b) => a - b);
    const idx = Math.min(this.samples.length - 1, Math.max(0, Math.ceil((p / 100) * this.samples.length) - 1));
    return this.samples[idx];
  }
}
