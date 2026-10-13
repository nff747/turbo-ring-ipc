export class CircularEventLog {
  private entries: string[];
  private cursor = 0;
  readonly capacity: number;

  constructor(capacity = 32) {
    this.capacity = capacity;
    this.entries = new Array(capacity);
  }

  log(event: string): void {
    this.entries[this.cursor % this.capacity] = event;
    this.cursor++;
  }

  recentEvents(count = 5): string[] {
    const list: string[] = [];
    const available = Math.min(this.cursor, this.capacity);
    const toFetch = Math.min(count, available);
    for (let i = 0; i < toFetch; i++) {
      const idx = (this.cursor - 1 - i + this.capacity) % this.capacity;
      list.push(this.entries[idx]);
    }
    return list;
  }
}
