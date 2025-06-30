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

  describe('validateNumericInputWithDecimals', () => {
    test('should return null when value is null', () => {
      const control = new FormControl(null);
      const result = service.validateNumericInputWithDecimals()(control);
      expect(result).toEqual(null);
    });

    test('should return an error when value is 0', () => {
      const control = new FormControl('0');
      const result = service.validateNumericInputWithDecimals()(control);
      expect(result).toEqual({ notAllowedNegativeValues: true });
    });

    test('should return an error when value is 0.00', () => {
      const control = new FormControl('0.00');
      const result = service.validateNumericInputWithDecimals()(control);
      expect(result).toEqual({ notAllowedNegativeValues: true });
    });

    test('should return an error when value is 0,00', () => {
      const control = new FormControl('0,00');
      const result = service.validateNumericInputWithDecimals()(control);
      expect(result).toEqual({ notAllowedNegativeValues: true });
    });

    test('should return an error when value has leading zeros', () => {
      const control = new FormControl('001');
      const result = service.validateNumericInputWithDecimals()(control);
      expect(result).toEqual({ notAllowedNegativeValues: true });
    });

    test('should return an error when value has leading zeros and comma', () => {
      const control = new FormControl('001,');
      const result = service.validateNumericInputWithDecimals()(control);
      expect(result).toEqual({ notAllowedNegativeValues: true });
    });

    test('should return an error when value has leading zeros and dot', () => {
      const control = new FormControl('001.');
      const result = service.validateNumericInputWithDecimals()(control);
      expect(result).toEqual({ notAllowedNegativeValues: true });
    });

    test('should return an error when value is less than zero and contains dot', () => {
      const control = new FormControl('-21.23');
      const result = service.validateNumericInputWithDecimals()(control);
      expect(result).toEqual({ notAllowedNegativeValues: true });
    });

    test('should return an error when value is less than zero and contains letter', () => {
      const control = new FormControl('-21a');
      const result = service.validateNumericInputWithDecimals()(control);
      expect(result).toEqual({ notValid: true });
    });

    test('should return an error when value is longer than max length allowed', () => {
      const control = new FormControl('12345');
      const result = service.validateNumericInputWithDecimals(4)(control);
      expect(result).toEqual({ maxlength: true });
    });

    test('should return an error when value is longer than max digits allowed', () => {
      const control = new FormControl('12345.67');
      const result = service.validateNumericInputWithDecimals(4)(control);
      expect(result).toEqual({ maxlength: true });
    });

    test('should return null for valid numeric values', () => {
      const control = new FormControl('123.45');
      const result = service.validateNumericInputWithDecimals()(control);
      expect(result).toBeNull();
    });

    test('should return an error object for non-numeric values', () => {
      const control = new FormControl('abc');
      const result = service.validateNumericInputWithDecimals()(control);
      expect(result).toEqual({ notValid: true });
    });

    test('should return null for empty value', () => {
      const control = new FormControl(' ');
      const result = service.validateNumericInputWithDecimals()(control);
      expect(result).toEqual({ notValid: true });
    });

    test('should return maxDecimalsAllowed when value has more than two decimal places', () => {
      const control = new FormControl('123.456');
      const result = service.validateNumericInputWithDecimals()(control);
      expect(result).toEqual({ maxDecimalsAllowed: true });
    });

    test('should return notValid when value has more than one decimal part', () => {
      const control = new FormControl('123.45.56');
      const result = service.validateNumericInputWithDecimals()(control);
      expect(result).toEqual({ notValid: true });
    });
  });

  describe('validateNumericInputWithoutDecimals', () => {
    test('should return null when value is empty', () => {
      const control = new FormControl(' ');
      const result = service.validateNumericInputWithoutDecimals()(control);
      expect(result).toEqual({ notAllowedDecimals: true });
    });
    test('should return null when value is null', () => {
      const control = new FormControl(null);
      const result = service.validateNumericInputWithoutDecimals()(control);
      expect(result).toEqual(null);
    });
    test('should return an error when value has leading zeros', () => {
      const control = new FormControl('001');
      const result = service.validateNumericInputWithoutDecimals()(control);
      expect(result).toEqual({ notAllowedNegativeValues: true });
    });
    test('should return an error when value contains dot', () => {
      const control = new FormControl('123.45');
      const result = service.validateNumericInputWithoutDecimals()(control);
      expect(result).toEqual({ notAllowedDecimals: true });
    });
    test('should return an error when value contains comma', () => {
      const control = new FormControl('123,45');
      const result = service.validateNumericInputWithoutDecimals()(control);
      expect(result).toEqual({ notAllowedDecimals: true });
    });
    test('should return an error when value contains not allowed characters', () => {
      const control = new FormControl('-21.asd334');
      const result = service.validateNumericInputWithoutDecimals()(control);
      expect(result).toEqual({ notAllowedDecimals: true });
    });
    test('should return an error when value is less than zero', () => {
      const control = new FormControl('-21');
      const result = service.validateNumericInputWithoutDecimals()(control);
      expect(result).toEqual({ notAllowedNegativeValues: true });
    });
    test('should return an error when value is less than zero and contains dot', () => {
      const control = new FormControl('-21.23');
      const result = service.validateNumericInputWithoutDecimals()(control);
      expect(result).toEqual({ notAllowedDecimals: true });
    });
    test('should return an error when value is less than zero and contains comma', () => {
      const control = new FormControl('-21,23');
      const result = service.validateNumericInputWithoutDecimals()(control);
      expect(result).toEqual({ notAllowedDecimals: true });
    });
    test('should return an error when value is longer than max length allowed', () => {
      const control = new FormControl('12345');
      const result = service.validateNumericInputWithoutDecimals(4)(control);
      expect(result).toEqual({ maxlength: true });
    });
  });
});
