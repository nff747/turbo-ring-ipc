export interface PendingRequest<T = unknown> {
  resolve: (value: T) => void;
  reject: (reason: Error) => void;
  timer: ReturnType<typeof setTimeout>;
}

export class RequestCorrelator<T = unknown> {
  private nextId = 1;
  private pending = new Map<number, PendingRequest<T>>();

  public allocateId(): number {
    const id = this.nextId++;
    if (this.nextId >= 0x7FFFFFFF) {
      this.nextId = 1;
    }
    return id;
  }

  public register(id: number, timeoutMs: number, onTimeout?: () => void): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        if (onTimeout) onTimeout();
        reject(new Error(`Request ${id} timed out after ${timeoutMs}ms`));
      }, timeoutMs);

      this.pending.set(id, { resolve, reject, timer });
    });
  }

  public resolve(id: number, value: T): boolean {
    const req = this.pending.get(id);
    if (!req) return false;
    clearTimeout(req.timer);
    this.pending.delete(id);
    req.resolve(value);
    return true;
  }

  public reject(id: number, reason: Error): boolean {
    const req = this.pending.get(id);
    if (!req) return false;
    clearTimeout(req.timer);
    this.pending.delete(id);
    req.reject(reason);
    return true;
  }

  public get pendingCount(): number {
    return this.pending.size;
  }

  public clear(): void {
    for (const [id, req] of this.pending) {
      clearTimeout(req.timer);
      req.reject(new Error(`Correlator cleared, request ${id} cancelled`));
    }
    this.pending.clear();
  }
}
