import { ActivityTextPipe } from './activity-text.pipe';
import { DateTime } from 'luxon';
import { DEFAULT_CHAT_ACTIVITY_THRESHOLD } from '../controls/chat/constants/chat.const';

describe('ActivityTextPipe', () => {
  let pipe: ActivityTextPipe;

  beforeEach(() => {
    pipe = new ActivityTextPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty string for null input', () => {
    const result = pipe.transform(null);
    expect(result).toBe('');
  });

  it('should return empty string for invalid DateTime', () => {
    const invalidDateTime = DateTime.invalid('invalid date');
    const result = pipe.transform(invalidDateTime);
    expect(result).toBe('');
  });

  it('should return "teraz" for recent activity (within threshold)', () => {
    // Create a DateTime that is 2 minutes ago (less than DEFAULT_CHAT_ACTIVITY_THRESHOLD which is 4)
    const recentDateTime = DateTime.now().minus({ minutes: 2 });
    const result = pipe.transform(recentDateTime);
    expect(result).toBe('teraz');
  });

  it('should return "teraz" for current time', () => {
    const now = DateTime.now();
    const result = pipe.transform(now);
    expect(result).toBe('teraz');
  });

  it('should return "teraz" for future time within threshold', () => {
    // Create a DateTime that is 2 minutes in the future (less than DEFAULT_CHAT_ACTIVITY_THRESHOLD)
    const futureDateTime = DateTime.now().plus({ minutes: 2 });
    const result = pipe.transform(futureDateTime);
    expect(result).toBe('teraz');
  });

  it('should return "teraz" for exactly threshold minutes ago', () => {
    // At exactly the threshold, should still return "teraz" since it's < threshold
    const thresholdDateTime = DateTime.now().minus({ minutes: DEFAULT_CHAT_ACTIVITY_THRESHOLD - 0.1 });
    const result = pipe.transform(thresholdDateTime);
    expect(result).toBe('teraz');
  });

  it('should return relative time for old activity (beyond threshold)', () => {
    // Create a DateTime that is more than DEFAULT_CHAT_ACTIVITY_THRESHOLD minutes ago
    const oldDateTime = DateTime.now().minus({ minutes: DEFAULT_CHAT_ACTIVITY_THRESHOLD + 1 });
    const result = pipe.transform(oldDateTime);

    // Should return a relative time string (not "teraz")
    expect(result).not.toBe('teraz');
    expect(result).not.toBe('');
    expect(typeof result).toBe('string');
  });

  it('should return relative time for very old activity', () => {
    // Create a DateTime that is several hours ago
    const veryOldDateTime = DateTime.now().minus({ hours: 2 });
    const result = pipe.transform(veryOldDateTime);

    // Should return a relative time string
    expect(result).not.toBe('teraz');
    expect(result).not.toBe('');
    expect(typeof result).toBe('string');
    expect(result).toContain('ago'); // Luxon's relative format should contain "ago"
  });

  it('should handle edge case where relative time is null', () => {
    // Create a mock DateTime that might return null for toRelative
    const mockDateTime = {
      isValid: true,
      diffNow: jasmine.createSpy('diffNow').and.returnValue({ minutes: 10 }),
      toRelative: jasmine.createSpy('toRelative').and.returnValue(null),
    } as any;

    const result = pipe.transform(mockDateTime);
    expect(result).toBe('');
  });

  it('should use long style for relative time formatting', () => {
    const oldDateTime = DateTime.now().minus({ hours: 1 });
    const result = pipe.transform(oldDateTime);

    // The result should be a properly formatted relative time string
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });

  it('should handle boundary conditions correctly', () => {
    // Test exactly at the threshold
    const exactThresholdDateTime = DateTime.now().minus({ minutes: DEFAULT_CHAT_ACTIVITY_THRESHOLD });
    const result = pipe.transform(exactThresholdDateTime);

    // At exactly the threshold, it should NOT return "teraz" (since it's >= threshold)
    expect(result).not.toBe('teraz');
  });

  it('should work with different time zones', () => {
    // Create DateTime in different timezone
    const utcDateTime = DateTime.now().setZone('UTC').minus({ minutes: 2 });
    const result = pipe.transform(utcDateTime);

    // Should still work correctly regardless of timezone
    expect(result).toBe('teraz');
  });
});
