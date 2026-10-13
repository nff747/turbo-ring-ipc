export class DualPriorityLane<T> {
  private highLane: T[] = [];
  private lowLane: T[] = [];

  enqueue(item: T, isHighPriority: boolean): void {
    if (isHighPriority) {
      this.highLane.push(item);
    } else {
      this.lowLane.push(item);
    }
  }

  dequeue(): T | undefined {
    if (this.highLane.length > 0) {
      return this.highLane.shift();
    }
    return this.lowLane.shift();
  }

  isEmpty(): boolean {
    return this.highLane.length === 0 && this.lowLane.length === 0;
  }
}
