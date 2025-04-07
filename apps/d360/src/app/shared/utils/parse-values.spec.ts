import { DemandCharacteristic } from '../../feature/material-customer/model';
import {
  combineParseFunctionsForFields,
  formatISODateToISODateString,
  parseDateIfPossible,
  parseDemandCharacteristicIfPossible,
  parseDemandValidationPeriodTypeIfPossible,
  parseReplacementTypeIfPossible,
  parseToStringLiteralTypeIfPossible,
} from './parse-values';
import { ValidationHelper } from './validation/validation-helper';

jest.mock('@jsverse/transloco', () => ({
  translate: jest.fn((key, _) => `${key}`),
}));

describe('Parse Values', () => {
  describe('parseDateIfPossible', () => {
    it('should return the same string if date validation fails', () => {
      jest
        .spyOn(ValidationHelper, 'validateDateFormat')
        .mockReturnValue('error');

      const input = 'invalid-date';
      const result = parseDateIfPossible(input);

      expect(result).toEqual(input);
    });

    it('should return the formatted string if date validation was successful', () => {
      ValidationHelper.localeService = {
        localizeDate: () => '2023-31-12',
        getLocale: () => 'yyyy-dd-mm',
      } as any;

      jest.spyOn(ValidationHelper, 'validateDateFormat').mockReturnValue(null);

      const input = '2023-31-12';
      const result = parseDateIfPossible(input);

      expect(result).toEqual(input);
    });
  });

  describe('formatISODateToISODateString', () => {
    it('should format a date to an ISO date string', () => {
      const input = new Date('2021-12-31');
      const result = formatISODateToISODateString(input);

      expect(result).toEqual('2021-12-31');
    });

    it('should return null if input is null', () => {
      const result = formatISODateToISODateString(null);

      expect(result).toBeNull();
    });
  });

  describe('parseDemandCharacteristicIfPossible', () => {
    it('should return the localized string if a match is found', () => {
      const input = 'SE';
      const result = parseDemandCharacteristicIfPossible(input);

      expect(result).toEqual('SE');
    });

    it('should return the same string if no match is found', () => {
      const input = 'InvalidOption';
      const result = parseDemandCharacteristicIfPossible(input);

      expect(result).toEqual(input);
    });
  });

  describe('parseReplacementTypeIfPossible', () => {
    it('should return the localized string if a match is found', () => {
      const input = 'RELOCATION';
      const result = parseReplacementTypeIfPossible(input);

      expect(result).toEqual('RELOCATION');
    });

    it('should return the same string if no match is found', () => {
      const input = 'InvalidType';
      const result = parseReplacementTypeIfPossible(input);

      expect(result).toEqual(input);
    });
  });

  describe('combineParseFunctionsForFields', () => {
    it('should return undefined if functionMap is not provided', () => {
      const result = combineParseFunctionsForFields();

      expect(result).toBeUndefined();
    });

    it('should return a combined parse function', () => {
      const mockParseFunction = jest.fn((value) => `${value} parsed`);
      const functionMap = new Map([['field1', mockParseFunction]]);
      const combineFunc = combineParseFunctionsForFields(functionMap);

      expect(combineFunc).toBeDefined();
      if (combineFunc) {
        const result = combineFunc('field1', 'test');

        // eslint-disable-next-line jest/no-conditional-expect
        expect(mockParseFunction).toHaveBeenCalledWith('test');
        // eslint-disable-next-line jest/no-conditional-expect
        expect(result).toEqual('test parsed');
      }
    });
  });

  describe('parseToStringLiteralTypeIfPossible', () => {
    it('should return the string literal if a match is found (case insensitive)', () => {
      const input = 'option1';
      const stringLiterals: readonly DemandCharacteristic[] = ['OPTION1'];
      const result = parseToStringLiteralTypeIfPossible(input, stringLiterals);

      expect(result).toEqual('OPTION1');
    });

    it('should return undefined if no match is found', () => {
      const input = 'invalidOption';
      const stringLiterals: readonly DemandCharacteristic[] = ['OPTION1'];
      const result = parseToStringLiteralTypeIfPossible(input, stringLiterals);

      expect(result).toBeUndefined();
    });
  });

  describe('parseDemandValidationPeriodTypeIfPossible', () => {
    it('should return "M" when input is "M"', () => {
      const result = parseDemandValidationPeriodTypeIfPossible('M');

      expect(result).toBe('M');
    });

    it('should return "W" when input is "W"', () => {
      const result = parseDemandValidationPeriodTypeIfPossible('W');

      expect(result).toBe('W');
    });

    it('should return "M" when input is "m"', () => {
      const result = parseDemandValidationPeriodTypeIfPossible('m');

      expect(result).toBe('M');
    });

    it('should return "W" when input is "w"', () => {
      const result = parseDemandValidationPeriodTypeIfPossible('w');

      expect(result).toBe('W');
    });

    it('should return undefined when input does not match any valid option', () => {
      const result = parseDemandValidationPeriodTypeIfPossible('INVALID');

      expect(result).toBeUndefined();
    });
  });
});
