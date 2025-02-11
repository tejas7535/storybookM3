import { TranslocoLocaleService } from '@jsverse/transloco-locale';

import { LocalizedOffsetDatetimePipe } from './localized-offset-datetime.pipe';

describe('LocalizedOffsetDatetimePipe', () => {
  let pipe: LocalizedOffsetDatetimePipe;

  beforeEach(() => {
    pipe = new LocalizedOffsetDatetimePipe({} as TranslocoLocaleService);
  });

  it('should handle en-US locale', () => {
    pipe['localeService'].getLocale = jest.fn(() => 'en-US');
    jest
      .spyOn(Date.prototype, 'toLocaleString')
      .mockReturnValue('2/9/2025, 1:39:45 PM');

    const result = pipe.transform('2025-02-09 13:39:45.9400000 +00:00');

    expect(result).toBe('2/9/2025, 1:39:45 PM');
  });

  it('should handle de-DE locale', () => {
    pipe['localeService'].getLocale = jest.fn(() => 'de-DE');
    jest
      .spyOn(Date.prototype, 'toLocaleString')
      .mockReturnValue('9.2.2025, 13:39:45');

    const result = pipe.transform('2025-02-09 13:39:45.9400000 +00:00');

    expect(result).toBe('9.2.2025, 13:39:45');
  });

  it('should throw exception', () => {
    pipe['localeService'].getLocale = jest.fn(() => 'xx-ZZ');

    expect(() => pipe.transform('2025-02-09 13:39:45.9400000 +00:00')).toThrow(
      'Unsupported locale xx-ZZ'
    );
  });

  it('should return undefined', () => {
    const result = pipe.transform(undefined);

    expect(result).toBeUndefined();
  });
});
