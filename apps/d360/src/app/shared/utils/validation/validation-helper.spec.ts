import { FormControl, FormGroup } from '@angular/forms';

import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { ValidationHelper } from './validation-helper';

jest.mock('@jsverse/transloco', () => ({
  translate: jest.fn((key, _) => `${key}`),
}));

describe('ValidationHelper', () => {
  let spectator: SpectatorService<TranslocoLocaleService>;
  const createService = createServiceFactory(TranslocoLocaleService);

  beforeEach(() => {
    spectator = createService();
    ValidationHelper.localeService = spectator.service;
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('should define the availableDecimalSeparators constant', () => {
    expect(ValidationHelper.availableDecimalSeparators).toBeDefined();
  });

  describe('getDecimalSeparatorForActiveLocale', () => {
    it('should return COMMA for locales with comma as decimal separator', () => {
      jest.spyOn(spectator.service, 'localizeNumber').mockReturnValue('1,5');

      expect(ValidationHelper.getDecimalSeparatorForActiveLocale()).toEqual(
        'PERIOD'
      );
    });

    it('should return PERIOD for locales with period as decimal separator', () => {
      jest.spyOn(spectator.service, 'localizeNumber').mockReturnValue('1.5');

      expect(ValidationHelper.getDecimalSeparatorForActiveLocale()).toEqual(
        'COMMA'
      );
    });
  });

  describe('validateForLetters', () => {
    it('should return null for valid letters input', () => {
      const result = ValidationHelper.validateForLetters('TestString');
      expect(result).toBeNull();
    });

    it('should return error message for invalid letters input', () => {
      const result = ValidationHelper.validateForLetters('Test123String');
      expect(result).toEqual('error.letters');
    });
  });

  describe('validateForNumbers', () => {
    it('should return null for valid numbers input', () => {
      const result = ValidationHelper.validateForNumbers('12345');
      expect(result).toBeNull();
    });

    it('should return error message for invalid numbers input', () => {
      const result = ValidationHelper.validateForNumbers('TestString');
      expect(result).toEqual('error.numbers.rootString');
    });
  });

  describe('detectLocaleAndValidateForLocalFloat', () => {
    it('should call validateForLocalFloat with the correct decimal separator', () => {
      const spy = jest
        .spyOn(ValidationHelper, 'getDecimalSeparatorForActiveLocale')
        .mockReturnValue('COMMA');
      const mockValidateForLocalFloat = jest
        .spyOn(ValidationHelper, 'validateForLocalFloat')
        .mockReturnValue(null);
      ValidationHelper.detectLocaleAndValidateForLocalFloat('1,123.45');
      expect(mockValidateForLocalFloat).toHaveBeenCalledWith(
        '1,123.45',
        'COMMA'
      );

      spy.mockClear();
      mockValidateForLocalFloat.mockClear();
    });
  });

  describe('validateForLocalFloat', () => {
    it('should return null for valid local float input with "comma" comma separator', () => {
      const result = ValidationHelper.validateForLocalFloat(
        '1.123,45',
        'COMMA'
      );
      expect(result).toBeNull();
    });

    it('should return error message for invalid local float input with "decimal" comma separator', () => {
      const result = ValidationHelper.validateForLocalFloat(
        '1,123.45',
        'COMMA'
      );
      expect(result).toEqual('error.numbers.COMMA');
    });
  });

  describe('validateForNumbersWithStar', () => {
    it('should return null for valid numbers with star input', () => {
      const result = ValidationHelper.validateForNumbersWithStar('123*45');
      expect(result).toBeNull();
    });

    it('should return error message for invalid numbers with star input', () => {
      const result = ValidationHelper.validateForNumbersWithStar('TestString');
      expect(result).toEqual('error.number_stars');
    });
  });

  describe('getDateFormat', () => {
    it('should return the correct date format for the active locale', () => {
      jest
        .spyOn(spectator.service, 'localizeDate')
        .mockReturnValue('23.11.2024');
      expect(ValidationHelper.getDateFormat()).toEqual('dd.MM.yyyy');
    });
  });

  describe('validateDateFormat', () => {
    it('should return null for valid date format input', () => {
      jest
        .spyOn(ValidationHelper, 'getDateFormat')
        .mockReturnValue('dd.MM.yyyy');
      const result = ValidationHelper.validateDateFormat('23.11.2024');
      expect(result).toBeNull();
    });

    it('should return error message for invalid date format input', () => {
      jest
        .spyOn(ValidationHelper, 'getDateFormat')
        .mockReturnValue('MM/dd/yyyy');
      const result = ValidationHelper.validateDateFormat('23-11-2024');
      expect(result).toEqual(`${'error.date.invalidFormat'} (mm/dd/yyyy)`);
    });
  });

  describe('validateDateFormatAndGreaterEqualThanToday', () => {
    it('should return null for valid date format input and greater or equal to today', () => {
      jest.spyOn(ValidationHelper, 'validateDateFormat').mockReturnValue(null);
      jest
        .spyOn(ValidationHelper, 'getDateFormat')
        .mockReturnValue('yyyy-mm-dd');
      jest.mock('date-fns', () => ({ isMatch: jest.fn(() => true) }));
      const result =
        ValidationHelper.validateDateFormatAndGreaterEqualThanToday(
          '9999-12-31'
        );
      expect(result).toBeNull();
    });

    it('should return error message for valid date format input but less than today', () => {
      jest.spyOn(ValidationHelper, 'validateDateFormat').mockReturnValue(null);
      jest.mock('date-fns', () => ({ isMatch: jest.fn(() => true) }));

      const result =
        ValidationHelper.validateDateFormatAndGreaterEqualThanToday(
          '2023-12-31'
        );
      expect(result).toEqual('error.date.beforeMin');
    });
  });

  describe('validateExactLength', () => {
    it('should return null for input with exact length', () => {
      const result = ValidationHelper.validateExactLength('TestString', 10);
      expect(result).toBeNull();
    });

    it('should return error message for input with incorrect length', () => {
      const result = ValidationHelper.validateExactLength('TestString', 5);
      expect(result).toEqual('error.wrong_length');
    });
  });

  describe('validateMaxLength', () => {
    it('should return null for input with length less than or equal to max length', () => {
      const result = ValidationHelper.validateMaxLength('TestString', 10);
      expect(result).toBeNull();
    });

    it('should return error message for input with length greater than max length', () => {
      const result = ValidationHelper.validateMaxLength('TestString', 5);
      expect(result).toEqual('error.too_long');
    });
  });

  describe('fillZeroFunc', () => {
    it('should return a function that fills input with leading zeros', () => {
      const fillZero = ValidationHelper.fillZeroFunc(12);
      expect(typeof fillZero).toBe('function');
      expect(fillZero('TestString')).toEqual('00TestString');
    });
  });

  describe('condenseValidationResults', () => {
    it('should return null if all validation results are null', () => {
      const result = ValidationHelper.condenseValidationResults([null, null]);
      expect(result).toBeNull();
    });

    it('should condense and deduplicate validation errors', () => {
      const result = ValidationHelper.condenseValidationResults([
        'Error1',
        'Error2',
        'Error1',
      ]);
      expect(result).toEqual(['Error1', 'Error2']);
    });
  });

  describe('getStartEndDateValidationErrors', () => {
    it('should return null if start date is less than or equal to end date', () => {
      const formGroup = new FormGroup({
        startDate: new FormControl(new Date('2023-12-30')),
        endDate: new FormControl(new Date('2024-01-01')),
      });
      const result =
        ValidationHelper.getStartEndDateValidationErrors(formGroup);
      expect(result).toBeNull();
    });

    it('should return errors object if start date is greater than end date', () => {
      const formGroup = new FormGroup({
        startDate: new FormControl(new Date('2024-01-01')),
        endDate: new FormControl(new Date('2023-12-31')),
      });
      const result =
        ValidationHelper.getStartEndDateValidationErrors(formGroup);
      expect(result).toEqual({ endDate: ['end-before-start'] });
    });
  });
});
