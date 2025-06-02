import { FormControl, FormGroup } from '@angular/forms';

import { Stub } from '../../test/stub.class';
import { ValidationHelper } from './validation-helper';

describe('ValidationHelper', () => {
  beforeEach(() => {
    Stub.initValidationHelper();
  });

  it('should define the availableDecimalSeparators constant', () => {
    expect(ValidationHelper.availableDecimalSeparators).toBeDefined();
  });

  describe('getDecimalSeparatorForActiveLocale', () => {
    it('should return COMMA for locales with comma as decimal separator', () => {
      jest
        .spyOn(ValidationHelper.localeService, 'localizeNumber')
        .mockReturnValue('1,5');

      expect(ValidationHelper.getDecimalSeparatorForActiveLocale()).toEqual(
        'PERIOD'
      );
    });

    it('should return PERIOD for locales with period as decimal separator', () => {
      jest
        .spyOn(ValidationHelper.localeService, 'localizeNumber')
        .mockReturnValue('1.5');

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
        .spyOn(ValidationHelper.localeService, 'localizeDate')
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

      jest
        .spyOn(ValidationHelper, 'getDateFormat')
        .mockReturnValue('dd-yyyy-MM');

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

  describe('getCrossTotalExceedsLimit', () => {
    it('should return null if all keys are not present in the form group', () => {
      const formGroup = new FormGroup({
        key1: new FormControl(10),
        key2: new FormControl(20),
      });

      const result = ValidationHelper.getCrossTotalExceedsLimit(
        formGroup,
        ['key1', 'key2', 'key3'],
        100
      );

      expect(result).toBeNull();
    });

    it('should return null if the total does not exceed the limit', () => {
      const formGroup = new FormGroup({
        key1: new FormControl(10),
        key2: new FormControl(20),
        key3: new FormControl(30),
      });

      const result = ValidationHelper.getCrossTotalExceedsLimit(
        formGroup,
        ['key1', 'key2', 'key3'],
        100
      );

      expect(result).toBeNull();
    });

    it('should return an error if the total exceeds the limit', () => {
      const formGroup = new FormGroup({
        key1: new FormControl(50),
        key2: new FormControl(40),
        key3: new FormControl(30),
      });

      const result = ValidationHelper.getCrossTotalExceedsLimit(
        formGroup,
        ['key1', 'key2', 'key3'],
        100
      );

      expect(result).toEqual({ totalExceedsLimit: true });
    });

    it('should set errors on controls if the total exceeds the limit', () => {
      const formGroup = new FormGroup({
        key1: new FormControl(50),
        key2: new FormControl(40),
        key3: new FormControl(30),
      });

      ValidationHelper.getCrossTotalExceedsLimit(
        formGroup,
        ['key1', 'key2', 'key3'],
        100
      );

      expect(formGroup.get('key1').errors).toEqual({ totalExceedsLimit: true });
      expect(formGroup.get('key2').errors).toEqual({ totalExceedsLimit: true });
      expect(formGroup.get('key3').errors).toEqual({ totalExceedsLimit: true });
    });

    it('should clear errors on controls if the total does not exceed the limit', () => {
      const formGroup = new FormGroup({
        key1: new FormControl(50),
        key2: new FormControl(40),
        key3: new FormControl(30),
      });

      // Set initial errors
      formGroup.get('key1').setErrors({ totalExceedsLimit: true });
      formGroup.get('key2').setErrors({ totalExceedsLimit: true });
      formGroup.get('key3').setErrors({ totalExceedsLimit: true });

      ValidationHelper.getCrossTotalExceedsLimit(
        formGroup,
        ['key1', 'key2', 'key3'],
        150
      );

      expect(formGroup.get('key1').errors).toBeNull();
      expect(formGroup.get('key2').errors).toBeNull();
      expect(formGroup.get('key3').errors).toBeNull();
    });

    it('should handle null or undefined values in controls gracefully', () => {
      const formGroup = new FormGroup({
        key1: new FormControl(null),
        key2: new FormControl(undefined),
        key3: new FormControl(30),
      });

      const result = ValidationHelper.getCrossTotalExceedsLimit(
        formGroup,
        ['key1', 'key2', 'key3'],
        100
      );

      expect(result).toBeNull();
    });

    it('should preserve other errors when clearing totalExceedsLimit error', () => {
      const formGroup = new FormGroup({
        key1: new FormControl(30),
        key2: new FormControl(20),
      });

      // Set initial mixed errors
      formGroup.get('key1').setErrors({
        totalExceedsLimit: true,
        required: true,
      });

      ValidationHelper.getCrossTotalExceedsLimit(
        formGroup,
        ['key1', 'key2'],
        100
      );

      // Should keep the required error but remove totalExceedsLimit
      expect(formGroup.get('key1').errors).toEqual({ required: true });
    });
  });

  describe('condenseErrorsFromValidation', () => {
    it('should return a function that joins error messages with commas', () => {
      const mockValidator = () => ['Error1', 'Error2'];
      const condenseFn =
        ValidationHelper.condenseErrorsFromValidation(mockValidator);

      expect(typeof condenseFn).toBe('function');
      expect(condenseFn('test')).toEqual('Error1, Error2');
    });

    it('should return undefined when validator returns null', () => {
      const mockValidator = () => null as any;
      const condenseFn =
        ValidationHelper.condenseErrorsFromValidation(mockValidator);

      expect(condenseFn('test')).toBeUndefined();
    });

    it('should handle empty array of errors', () => {
      const mockValidator = () => [] as any;
      const condenseFn =
        ValidationHelper.condenseErrorsFromValidation(mockValidator);

      expect(condenseFn('test')).toEqual('');
    });
  });

  describe('fillZeroOnValueFunc', () => {
    it('should fill string with leading zeros to target length', () => {
      expect(ValidationHelper.fillZeroOnValueFunc(5, '123')).toEqual('00123');
    });

    it('should not add zeros when string is already at target length', () => {
      expect(ValidationHelper.fillZeroOnValueFunc(3, '123')).toEqual('123');
    });

    it('should not truncate string longer than target length', () => {
      expect(ValidationHelper.fillZeroOnValueFunc(3, '12345')).toEqual('12345');
    });

    it('should handle empty string', () => {
      expect(ValidationHelper.fillZeroOnValueFunc(3, '')).toEqual('000');
    });
  });

  describe('validateForLocalFloat with additional test cases', () => {
    it('should validate number with thousands separators for PERIOD format', () => {
      const result = ValidationHelper.validateForLocalFloat(
        '1,234.56',
        'PERIOD'
      );
      expect(result).toBeNull();
    });

    it('should validate number with thousands separators for COMMA format', () => {
      const result = ValidationHelper.validateForLocalFloat(
        '1.234,56',
        'COMMA'
      );
      expect(result).toBeNull();
    });

    it('should reject invalid format with wrong separators for PERIOD', () => {
      const result = ValidationHelper.validateForLocalFloat(
        '1.234,56',
        'PERIOD'
      );
      expect(result).toEqual('error.numbers.PERIOD');
    });

    it('should reject invalid format with wrong separators for COMMA', () => {
      const result = ValidationHelper.validateForLocalFloat(
        '1,234.56',
        'COMMA'
      );
      expect(result).toEqual('error.numbers.COMMA');
    });

    it('should reject string with letters for any format', () => {
      expect(
        ValidationHelper.validateForLocalFloat('123abc', 'PERIOD')
      ).toEqual('error.numbers.PERIOD');
      expect(ValidationHelper.validateForLocalFloat('123abc', 'COMMA')).toEqual(
        'error.numbers.COMMA'
      );
    });

    it('should reject negative numbers for any format', () => {
      expect(
        ValidationHelper.validateForLocalFloat('-123.45', 'PERIOD')
      ).toEqual('error.numbers.PERIOD');
      expect(
        ValidationHelper.validateForLocalFloat('-123,45', 'COMMA')
      ).toEqual('error.numbers.COMMA');
    });
  });

  describe('getStartEndDateValidationErrors with custom field names', () => {
    it('should work with custom control names', () => {
      const formGroup = new FormGroup({
        fromDate: new FormControl(new Date('2024-01-01')),
        endDate: new FormControl(new Date('2023-12-31')),
      });

      const result = ValidationHelper.getStartEndDateValidationErrors(
        formGroup,
        false,
        'fromDate',
        'endDate'
      );

      expect(result).toEqual({ endDate: ['end-before-start'] });
      expect(formGroup.get('endDate').errors).toHaveProperty(
        'toDateAfterFromDate'
      );
    });

    it('should mark fields as touched when touchFields is true', () => {
      const formGroup = new FormGroup({
        startDate: new FormControl(new Date('2023-01-01')),
        endDate: new FormControl(new Date('2023-12-31')),
      });

      const touchSpy = jest.spyOn(formGroup, 'markAllAsTouched');

      ValidationHelper.getStartEndDateValidationErrors(formGroup, true);

      expect(touchSpy).toHaveBeenCalled();
    });
  });
});
