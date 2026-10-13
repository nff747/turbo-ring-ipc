export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export class CircuitBreaker {
  private failures = 0;
  private state: CircuitState = 'CLOSED';
  readonly maxFailures: number;

  constructor(maxFailures = 3) {
    this.maxFailures = maxFailures;
  }

  getState(): CircuitState {
    return this.state;
  }

  recordSuccess(): void {
    this.failures = 0;
    this.state = 'CLOSED';
  }

  recordFailure(): void {
    this.failures++;
    if (this.failures >= this.maxFailures) {
      this.state = 'OPEN';
    }
  }
}
