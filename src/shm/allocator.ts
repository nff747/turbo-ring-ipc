export class BuddyAllocator {
  readonly totalSize: number;
  private freeBlocks: Map<number, number[]> = new Map();

  constructor(totalSize = 4096) {
    this.totalSize = totalSize;
    this.freeBlocks.set(totalSize, [0]);
  }

  allocate(size: number): number | null {
    let target = 16;
    while (target < size) target <<= 1;
    if (target > this.totalSize) return null;

    for (let s = target; s <= this.totalSize; s <<= 1) {
      const blocks = this.freeBlocks.get(s);
      if (blocks && blocks.length > 0) {
        const addr = blocks.pop()!;
        // Split down if needed
        let curr = s;
        while (curr > target) {
          curr >>= 1;
          const buddy = addr + curr;
          if (!this.freeBlocks.has(curr)) this.freeBlocks.set(curr, []);
          this.freeBlocks.get(curr)!.push(buddy);
        }
        return addr;
      }
    }
    return null;
  }
}
