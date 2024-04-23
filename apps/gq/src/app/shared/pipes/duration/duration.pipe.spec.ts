import { Duration } from '@gq/shared/models';
import { translate } from '@jsverse/transloco';
import { when } from 'jest-when';

import { DurationPipe } from './duration.pipe';

describe('DurationPipe', () => {
  beforeEach(() => jest.resetAllMocks());

  test('create an instance', () => {
    const pipe = new DurationPipe();
    expect(pipe).toBeTruthy();
  });

  test('should return a dash if duration is undefined', () => {
    const pipe = new DurationPipe();
    const result = pipe.transform(undefined as Duration);

    expect(result).toBe('-');
    expect(translate).not.toHaveBeenCalled();
  });

  test('should build duration string with years, months and days', () => {
    const pipe = new DurationPipe();
    const duration: Duration = {
      years: 2,
      months: 1,
      days: 25,
    };

    when(translate)
      .calledWith('shared.duration.years')
      .mockReturnValue('years');
    when(translate)
      .calledWith('shared.duration.month')
      .mockReturnValue('month');
    when(translate).calledWith('shared.duration.days').mockReturnValue('days');

    const result = pipe.transform(duration);

    expect(result).toBe('2 years 1 month 25 days');

    expect(translate).toHaveBeenCalledTimes(3);
    expect(translate).toHaveBeenNthCalledWith(1, 'shared.duration.years');
    expect(translate).toHaveBeenNthCalledWith(2, 'shared.duration.month');
    expect(translate).toHaveBeenNthCalledWith(3, 'shared.duration.days');
  });

  test('should build duration string with months and days only', () => {
    const pipe = new DurationPipe();
    const duration: Duration = {
      years: 0,
      months: 6,
      days: 1,
    };

    when(translate)
      .calledWith('shared.duration.months')
      .mockReturnValue('months');
    when(translate).calledWith('shared.duration.day').mockReturnValue('day');

    const result = pipe.transform(duration);

    expect(result).toBe('6 months 1 day');

    expect(translate).toHaveBeenCalledTimes(2);
    expect(translate).toHaveBeenNthCalledWith(1, 'shared.duration.months');
    expect(translate).toHaveBeenNthCalledWith(2, 'shared.duration.day');
  });
});
