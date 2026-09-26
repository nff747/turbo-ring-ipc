export class ExponentialBackoff {
  private count = 0;
  private readonly maxSpins: number;

  constructor(maxSpins = 16) {
    this.maxSpins = maxSpins;
  }

  public spin(): void {
    if (this.count < this.maxSpins) {
      this.count++;
      // Busy spin micro-pause
      for (let i = 0; i < (1 << this.count); i++) {
        Math.sin(i);
      }
    } else {
      // Yield to scheduler
      this.count = 0;
    }
  }

  public reset(): void {
    this.count = 0;
  }
}
