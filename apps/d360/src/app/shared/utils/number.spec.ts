import { Stub } from '../test/stub.class';
import {
  getDecimalSeparator,
  getNumberFromLocale,
  getThousandSeparator,
  numberIsAtStartOfDecimal,
  parseAndFormatNumber,
  strictlyParseLocalFloat,
} from './number';
import { ValidationHelper } from './validation/validation-helper';

describe('numbers', () => {
  beforeEach(() => Stub.initValidationHelper());

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

  describe('parseAndFormatNumber', () => {
    let agGridLocalizationServiceMock: {
      numberFormatter: jest.Mock;
    };

    beforeEach(() => {
      agGridLocalizationServiceMock = {
        numberFormatter: jest
          .fn()
          .mockImplementation((params) => `formatted-${params.value}`),
      };

      jest
        .spyOn(ValidationHelper, 'getDecimalSeparatorForActiveLocale')
        .mockReturnValue('COMMA');
    });

    it('should format string values by parsing and formatting them', () => {
      const params = { value: '1200,5' };

      const result = parseAndFormatNumber(
        params as any,
        agGridLocalizationServiceMock as any
      );

      expect(
        ValidationHelper.getDecimalSeparatorForActiveLocale
      ).toHaveBeenCalled();
      expect(result).toBe('formatted-1200.5');
      expect(
        agGridLocalizationServiceMock.numberFormatter
      ).toHaveBeenCalledWith({
        ...params,
        value: 1200.5,
      });
    });

    it('should return the original string value if parsing fails', () => {
      const params = { value: 'invalid-number' };

      const result = parseAndFormatNumber(
        params as any,
        agGridLocalizationServiceMock as any
      );

      expect(result).toBe('invalid-number');
      expect(
        agGridLocalizationServiceMock.numberFormatter
      ).not.toHaveBeenCalled();
    });

    it('should directly format number values without parsing', () => {
      const params = { value: 1234.56 };

      const result = parseAndFormatNumber(
        params as any,
        agGridLocalizationServiceMock as any
      );

      expect(result).toBe('formatted-1234.56');
      expect(
        agGridLocalizationServiceMock.numberFormatter
      ).toHaveBeenCalledWith(params);
    });

    it('should return the original value for non-string, non-number inputs', () => {
      const params = { value: null } as any;

      const result = parseAndFormatNumber(
        params as any,
        agGridLocalizationServiceMock as any
      );

      expect(result).toBe(null);
      expect(
        agGridLocalizationServiceMock.numberFormatter
      ).not.toHaveBeenCalled();
    });
  });
});
