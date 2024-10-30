import { minutesToMilliseconds } from './time';

describe('Minutes to milliseconds', () => {
  it('checks that the conversion of minutes to milliseconds is correct', async () => {
    expect(minutesToMilliseconds(10)).toBe(600_000);
  });
});
