import { describe, it, expect } from 'vitest';
import { WorkerWatchdog } from '../src/heartbeat/watchdog';

describe('WorkerWatchdog', () => {
  it('maintains alive state under continuous pings', () => {
    const dog = new WorkerWatchdog(500);
    expect(dog.isAlive()).toBe(true);
    dog.ping();
    expect(dog.isAlive()).toBe(true);
  });
});
