import { FormControl } from '@angular/forms';

import * as transloco from '@ngneat/transloco';
import { translate } from '@ngneat/transloco';

import {
  createAutocompleteInputValidator,
  createSelectInputValidator,
} from './autocomplete-validator-functions';
import { ValidationUtils } from './validation-utils';

describe('Autocomplete Validator Functions', () => {
  const dimensionName = 'Country';

  describe('createAutocompleteInputValidator', () => {
    it('should return too short error msg obj when input input initial state', () => {
      const control = new FormControl('');
      ValidationUtils.isInitialEmptyState = jest.fn(() => true);
      const resultFn = createAutocompleteInputValidator(dimensionName);

      const result = resultFn(control);

      expect(transloco.translate).toHaveBeenCalledWith(
        'filters.invalidInputTooShortHint',
        {
          dimensionName,
        }
      );

      expect(result).toEqual({
        invalidInput: translate('filters.invalidInputTooShortHint', {
          dimensionName,
        }),
      });
    });

    it('should return too short error msg obj when input too short', () => {
      const control = new FormControl('');
      ValidationUtils.isInitialEmptyState = jest.fn(() => false);
      ValidationUtils.isInputTooShort = jest.fn(() => true);
      const resultFn = createAutocompleteInputValidator(dimensionName);

      const result = resultFn(control);

      expect(transloco.translate).toHaveBeenCalledWith(
        'filters.invalidInputTooShortHint',
        {
          dimensionName,
        }
      );

      expect(result).toEqual({
        invalidInput: translate('filters.invalidInputTooShortHint', {
          dimensionName,
        }),
      });
    });

    it('should return invalid input dropdown error msg obj when input originates from typing', () => {
      const control = new FormControl('');
      ValidationUtils.isInitialEmptyState = jest.fn(() => false);
      ValidationUtils.isInputTooShort = jest.fn(() => false);
      ValidationUtils.isInputValueFromTyping = jest.fn(() => true);
      const resultFn = createAutocompleteInputValidator(dimensionName);

      const result = resultFn(control);

      expect(transloco.translate).toHaveBeenCalledWith(
        'filters.invalidInputDropdownHint',
        {
          dimensionName,
        }
      );

      expect(result).toEqual({
        invalidInput: translate('filters.invalidInputDropdownHint', {
          dimensionName,
        }),
      });
    });

    it('should return undefined when input valid', () => {
      const control = new FormControl('');
      ValidationUtils.isInitialEmptyState = jest.fn(() => false);
      ValidationUtils.isInputTooShort = jest.fn(() => false);
      ValidationUtils.isInputValueFromTyping = jest.fn(() => false);
      const resultFn = createAutocompleteInputValidator(dimensionName);

      const result = resultFn(control);

      expect(result).toBeUndefined();
    });
  });

  describe('createSelectInputValidator', () => {
    it('should return invalid input dropdown error msg obj when input input initial state', () => {
      const control = new FormControl('');
      ValidationUtils.isInitialEmptyState = jest.fn(() => true);
      const resultFn = createSelectInputValidator(dimensionName);

      const result = resultFn(control);

      expect(transloco.translate).toHaveBeenCalledWith(
        'filters.invalidInputDropdownHint',
        {
          dimensionName,
        }
      );

      expect(result).toEqual({
        invalidInput: translate('filters.invalidInputDropdownHint', {
          dimensionName,
        }),
      });
    });

    it('should return invalid input dropdown error msg obj when input originates from typing', () => {
      const control = new FormControl('');
      ValidationUtils.isInitialEmptyState = jest.fn(() => false);
      ValidationUtils.isInputValueFromTyping = jest.fn(() => true);
      const resultFn = createSelectInputValidator(dimensionName);

      const result = resultFn(control);

      expect(transloco.translate).toHaveBeenCalledWith(
        'filters.invalidInputDropdownHint',
        {
          dimensionName,
        }
      );

      expect(result).toEqual({
        invalidInput: translate('filters.invalidInputDropdownHint', {
          dimensionName,
        }),
      });
    });

    it('should return undefined when input valid', () => {
      const control = new FormControl('');
      ValidationUtils.isInitialEmptyState = jest.fn(() => false);
      ValidationUtils.isInputValueFromTyping = jest.fn(() => false);
      const resultFn = createSelectInputValidator(dimensionName);

      const result = resultFn(control);

      expect(result).toBeUndefined();
    });
  });
});
