import { Component } from '@angular/core';

import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import {
  getDecimalSeparator,
  getNumberFromLocale,
  getThousandSeparator,
  numberIsAtStartOfDecimal,
  strictlyParseInteger,
  strictlyParseLocalFloat,
} from './number';
import { ValidationHelper } from './validation/validation-helper';

@Component({
  selector: 'd360-dummy',
  standalone: true,
  template: '',
})
class DummyComponent {}

describe('numbers', () => {
  let spectator: Spectator<DummyComponent>;

  const createComponent = createComponentFactory({
    component: DummyComponent,
  });

  beforeEach(() => {
    spectator = createComponent();
    ValidationHelper.localeService = spectator.query(TranslocoLocaleService);
  });

  test.each`
    input        | isValid
    ${'1'}       | ${true}
    ${'1200'}    | ${true}
    ${'1.2'}     | ${false}
    ${'1.2'}     | ${false}
    ${'1,1'}     | ${false}
    ${'1.200,5'} | ${false}
    ${'1,200.5'} | ${false}
    ${'-5'}      | ${false}
    ${'1,1,3'}   | ${false}
    ${'1.1.3'}   | ${false}
    ${'eins'}    | ${false}
    ${'0b101'}   | ${false}
    ${'0o13'}    | ${false}
    ${'0x0A'}    | ${false}
  `('strictlyParseInt parses $input correctly', ({ input, isValid }) => {
    const result = strictlyParseInteger(input);
    const resultValid = !Number.isNaN(result);
    expect(resultValid).toBe(isValid);
  });

  test.each`
    input        | decimalSeparator | isValid
    ${'1'}       | ${'COMMA'}       | ${true}
    ${'1200'}    | ${'COMMA'}       | ${true}
    ${'1.2'}     | ${'COMMA'}       | ${false}
    ${'1.2'}     | ${'PERIOD'}      | ${true}
    ${'1,1'}     | ${'COMMA'}       | ${true}
    ${'1,1'}     | ${'PERIOD'}      | ${false}
    ${'1.200,5'} | ${'COMMA'}       | ${true}
    ${'1.200,5'} | ${'PERIOD'}      | ${false}
    ${'1,200.5'} | ${'COMMA'}       | ${false}
    ${'1,200.5'} | ${'PERIOD'}      | ${true}
    ${'-5'}      | ${'COMMA'}       | ${false}
    ${'1,1,3'}   | ${'COMMA'}       | ${false}
    ${'1.1.3'}   | ${'COMMA'}       | ${false}
    ${'eins'}    | ${'COMMA'}       | ${false}
    ${'0b101'}   | ${'COMMA'}       | ${false}
    ${'0o13'}    | ${'COMMA'}       | ${false}
    ${'0x0A'}    | ${'COMMA'}       | ${false}
  `(
    'strictlyParseLocalFloat parses $input with locale $decimalSeparator correctly',
    ({ input, decimalSeparator, isValid }) => {
      const result = strictlyParseLocalFloat(input, decimalSeparator);
      const resultValid = !Number.isNaN(result);
      expect(resultValid).toBe(isValid);
    }
  );

  describe('getDecimalSeparator', () => {
    it('should return the correct decimal separator for "en-US"', () => {
      expect(getDecimalSeparator('en-US')).toBe('.');
    });

    it('should return the correct decimal separator for "de-DE"', () => {
      expect(getDecimalSeparator('de-DE')).toBe(',');
    });

    it('should return the correct decimal separator for "fr-FR"', () => {
      expect(getDecimalSeparator('fr-FR')).toBe(',');
    });

    it('should return . for unsupported locales', () => {
      expect(getDecimalSeparator('unknown-locale')).toBe('.');
    });
  });

  describe('getThousandSeparator', () => {
    it('should return the correct thousand separator for "en-US"', () => {
      expect(getThousandSeparator('en-US')).toBe(',');
    });

    it('should return the correct thousand separator for "de-DE"', () => {
      expect(getThousandSeparator('de-DE')).toBe('.');
    });

    it('should return the correct thousand separator for "fr-FR"', () => {
      expect(getThousandSeparator('fr-FR')).toBe('\u202F'); // Non-breaking space
    });

    it('should return , for unsupported locales', () => {
      expect(getThousandSeparator('unknown-locale')).toBe(',');
    });
  });

  describe('getNumberFromLocale', () => {
    it('should parse a number with US locale format correctly', () => {
      expect(getNumberFromLocale('1,234.56', 'en-US')).toBe(1234.56);
    });

    it('should parse a number with German locale format correctly', () => {
      expect(getNumberFromLocale('1.234,56', 'de-DE')).toBe(1234.56);
    });

    it('should parse a number with French locale format correctly', () => {
      expect(getNumberFromLocale('1 234,56', 'fr-FR')).toBe(1234.56);
    });

    it('should return NaN for invalid number strings', () => {
      expect(getNumberFromLocale('abc', 'en-US')).toBeNaN();
    });

    it('should handle numbers without formatting', () => {
      expect(getNumberFromLocale('1234.56', 'en-US')).toBe(1234.56);
    });

    it('should handle numbers with only a decimal separator', () => {
      expect(getNumberFromLocale('0.56', 'en-US')).toBe(0.56);
      expect(getNumberFromLocale('0,56', 'de-DE')).toBe(0.56);
    });
  });

  describe('numberIsAtStartOfDecimal', () => {
    it('should return true if the number ends with a decimal in US format', () => {
      expect(numberIsAtStartOfDecimal('1,234.', 'en-US')).toBe(true);
    });

    it('should return true if the number ends with a decimal in German format', () => {
      expect(numberIsAtStartOfDecimal('1.234,', 'de-DE')).toBe(true);
    });

    it('should return false if the number does not end with a decimal', () => {
      expect(numberIsAtStartOfDecimal('1,234.56', 'en-US')).toBe(false);
    });

    it('should return false for invalid number strings', () => {
      expect(numberIsAtStartOfDecimal('abc', 'en-US')).toBe(false);
    });

    it('should return true if the decimal separator is at the end of an incomplete number', () => {
      expect(numberIsAtStartOfDecimal('1 234,', 'fr-FR')).toBe(true);
    });
  });
});
