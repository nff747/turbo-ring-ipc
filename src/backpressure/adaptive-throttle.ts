export class AdaptiveThrottle {
  private consecutiveFails = 0;
  readonly minSpin = 10;
  readonly maxSpin = 1000;

  recordFailure(): void {
    this.consecutiveFails = Math.min(20, this.consecutiveFails + 1);
  }

  recordSuccess(): void {
    this.consecutiveFails = 0;
  }

  getSpinCycles(): number {
    if (this.consecutiveFails === 0) return this.minSpin;
    return Math.min(this.maxSpin, this.minSpin * Math.pow(1.5, this.consecutiveFails));
  }
}
