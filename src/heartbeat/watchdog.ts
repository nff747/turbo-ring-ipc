export class WorkerWatchdog {
  private lastHeartbeat: number;
  readonly leaseTimeoutMs: number;

  constructor(leaseTimeoutMs = 1000) {
    this.leaseTimeoutMs = leaseTimeoutMs;
    this.lastHeartbeat = Date.now();
  }

  ping(): void {
    this.lastHeartbeat = Date.now();
  }

  isAlive(): boolean {
    return Date.now() - this.lastHeartbeat <= this.leaseTimeoutMs;
  }
}
