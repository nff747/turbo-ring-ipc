export class BatchDrainer {
  static drainAll<T>(dequeueFn: () => T | undefined, maxBatch = 64): T[] {
    const batch: T[] = [];
    for (let i = 0; i < maxBatch; i++) {
      const item = dequeueFn();
      if (item === undefined) break;
      batch.push(item);
    }
    return batch;
  }
}
