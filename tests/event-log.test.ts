import { describe, it, expect } from 'vitest';
import { CircularEventLog } from '../src/telemetry/event-log';

describe('CircularEventLog', () => {
  it('preserves most recent events within capacity bound', () => {
    const logger = new CircularEventLog(3);
    logger.log('event_1');
    logger.log('event_2');
    logger.log('event_3');
    logger.log('event_4');

    const recent = logger.recentEvents(2);
    expect(recent).toEqual(['event_4', 'event_3']);
  });
});
