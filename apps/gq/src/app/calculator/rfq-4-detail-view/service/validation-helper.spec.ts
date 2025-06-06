import { FormControl } from '@angular/forms';

import { ValidationHelper } from '@gq/calculator/rfq-4-detail-view/service/validation-helper';
import { provideTranslocoLocale } from '@jsverse/transloco-locale';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { sharedTranslocoLocaleConfig } from '@schaeffler/transloco';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

describe('ValidationHelper', () => {
  let service: ValidationHelper;
  let spectator: SpectatorService<ValidationHelper>;

  const createService = createServiceFactory({
    service: ValidationHelper,
    providers: [provideTranslocoLocale(sharedTranslocoLocaleConfig)],
    imports: [provideTranslocoTestingModule({ en: {} })],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  describe('validateNoDecimalsAllowed', () => {
    test('should return null for integer values', () => {
      const control = new FormControl('123');
      const result = service.validateNoDecimalsAllowed()(control);
      expect(result).toBeNull();
    });

    test('should return an error object for decimal values', () => {
      const control = new FormControl('123.45');
      const result = service.validateNoDecimalsAllowed()(control);
      expect(result).toEqual({ notAllowedDecimals: true });
    });

    test('should return an error object for values with commas', () => {
      const control = new FormControl('123,45');
      const result = service.validateNoDecimalsAllowed()(control);
      expect(result).toEqual({ notAllowedDecimals: true });
    });
  });

  describe('validateOnlyNumbersAllowed', () => {
    test('should return null for integer values', () => {
      const control = new FormControl('123');
      const result = service.validateOnlyNumbersAllowed()(control);
      expect(result).toBeNull();
    });

    test('should return an error object for decimal values', () => {
      const control = new FormControl('123.45');
      const result = service.validateOnlyNumbersAllowed()(control);
      expect(result).toEqual({ notValid: true });
    });

    test('should return an error object for values with letters', () => {
      const control = new FormControl('123aa');
      const result = service.validateOnlyNumbersAllowed()(control);
      expect(result).toEqual({ notValid: true });
    });
  });

  describe('validateNegativeValue', () => {
    test('should return null for positive values', () => {
      const control = new FormControl('123');
      const result = service.validateNegativeValue()(control);
      expect(result).toBeNull();
    });

    test('should return an error object for negative values', () => {
      const control = new FormControl('-123');
      const result = service.validateNegativeValue()(control);
      expect(result).toEqual({ notAllowedNegativeValues: true });
    });

    test('should return an error object for zero value', () => {
      const control = new FormControl('0');
      const result = service.validateNegativeValue()(control);
      expect(result).toEqual({ notAllowedNegativeValues: true });
    });
  });

  describe('validateMaxLengthWithDecimals', () => {
    test('should return null for valid length', () => {
      const control = new FormControl('123.45');
      const result = service.validateMaxLengthWithDecimals(6)(control);
      expect(result).toBeNull();
    });

    test('should return an error object for exceeding length', () => {
      const control = new FormControl('123456.78');
      const result = service.validateMaxLengthWithDecimals(6)(control);
      expect(result).toEqual({ maxlength: true });
    });

    test('should return an error object for exceeding length with commas and dots', () => {
      const control = new FormControl('123,456.78');
      const result = service.validateMaxLengthWithDecimals(6)(control);
      expect(result).toEqual({ maxlength: true });
    });

    test('should return null for empty value', () => {
      const control = new FormControl('');
      const result = service.validateMaxLengthWithDecimals(6)(control);
      expect(result).toBeNull();
    });
  });

  describe('validateForNumericWithMaxDecimals', () => {
    test('should return null for valid numeric values', () => {
      const control = new FormControl('123.45');
      const result = service.validateForNumericWithMaxDecimals()(control);
      expect(result).toBeNull();
    });

    test('should return an error object for non-numeric values', () => {
      const control = new FormControl('abc');
      const result = service.validateForNumericWithMaxDecimals()(control);
      expect(result).toEqual({ notValid: true });
    });

    test('should return null for empty value', () => {
      const control = new FormControl(' ');
      const result = service.validateForNumericWithMaxDecimals()(control);
      expect(result).toEqual({ notValid: true });
    });

    test('should return maxDecimalsAllowed when value has more than two decimal places', () => {
      const control = new FormControl('123.456');
      const result = service.validateForNumericWithMaxDecimals()(control);
      expect(result).toEqual({ maxDecimalsAllowed: true });
    });

    test('should return notValid when value has more than one decimal part', () => {
      const control = new FormControl('123.45.56');
      const result = service.validateForNumericWithMaxDecimals()(control);
      expect(result).toEqual({ notValid: true });
    });
  });
});
