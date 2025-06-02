import { Component } from '@angular/core';

import { Stub } from '../test/stub.class';
import { NumberWithoutFractionDigitsPipe } from './number-without-fraction-digits.pipe';

@Component({
  selector: 'd360-app-test',
  template: '',
})
class TestComponent {}

describe('NumberWithoutFractionDigitsPipe', () => {
  let pipe: NumberWithoutFractionDigitsPipe;

  beforeEach(() => {
    Stub.getForEffect({
      component: TestComponent,
      providers: [NumberWithoutFractionDigitsPipe],
    });
    pipe = Stub.inject(NumberWithoutFractionDigitsPipe);
  });

  it('should be created', () => {
    expect(pipe).toBeTruthy();
  });

  describe('transform', () => {
    it('should return empty string for null input', () => {
      expect(pipe.transform(null)).toBe('');
    });

    it('should return empty string for undefined input', () => {
      expect(pipe.transform(undefined as any)).toBe('');
    });

    it('should format a number value', () => {
      jest
        .spyOn(pipe['translocoLocaleService'], 'getLocale')
        .mockReturnValue('en-US');
      jest.spyOn(pipe['translocoLocaleService'], 'localizeNumber');
      const testValue = 123.456;
      pipe.transform(testValue);

      expect(pipe['translocoLocaleService'].getLocale).toHaveBeenCalled();
      expect(
        pipe['translocoLocaleService'].localizeNumber
      ).toHaveBeenCalledWith(testValue, 'decimal', 'en-US', {
        maximumFractionDigits: 0,
      });
    });

    it('should convert a string value to number and format it', () => {
      jest
        .spyOn(pipe['translocoLocaleService'], 'getLocale')
        .mockReturnValue('en-US');
      jest.spyOn(pipe['translocoLocaleService'], 'localizeNumber');
      const testValue = '123.456';
      pipe.transform(testValue);

      expect(
        pipe['translocoLocaleService'].localizeNumber
      ).toHaveBeenCalledWith(123.456, 'decimal', 'en-US', {
        maximumFractionDigits: 0,
      });
    });

    it('should return empty string for non-numeric string input', () => {
      expect(pipe.transform('abc')).toBe('');
    });

    it('should return the value from localizeNumber service', () => {
      jest
        .spyOn(pipe['translocoLocaleService'], 'getLocale')
        .mockReturnValue('en-US');
      jest
        .spyOn(pipe['translocoLocaleService'], 'localizeNumber')
        .mockReturnValue('456');

      const result = pipe.transform(456);

      expect(result).toBe('456');
    });
  });
});
