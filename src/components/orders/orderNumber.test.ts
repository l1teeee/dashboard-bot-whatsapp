import { describe, expect, it } from 'vitest';
import { formatOrderNumber } from './orderNumber';

describe('formatOrderNumber', () => {
  it('uses the daily number when present', () => {
    expect(formatOrderNumber({ id: 42, daily_number: 3 })).toBe('#3');
  });

  it('falls back to the internal id when daily_number is null', () => {
    expect(formatOrderNumber({ id: 42, daily_number: null })).toBe('#42');
  });
});
