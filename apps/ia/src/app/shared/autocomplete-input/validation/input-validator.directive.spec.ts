import { FormControl } from '@angular/forms';

import { translate } from '@ngneat/transloco';
import * as transloco from '@ngneat/transloco';

import { InputValidatorDirective } from './input-validator.directive';
import { ValidationUtils } from './validation-utils';

describe('InputValidatorDirective', () => {
  const validator: InputValidatorDirective = new InputValidatorDirective();

  it('should be created', () => {
    expect(validator).toBeTruthy();
  });

  describe('validate', () => {
    it('should return too short error msg obj when input input initial state', () => {
      const control = new FormControl('');
      ValidationUtils.isInitialEmptyState = jest.fn(() => true);

      const result = validator.validate(control);

      expect(transloco.translate).toHaveBeenCalledWith(
        'filters.invalidInputTooShortHint'
      );

      expect(result).toEqual({
        invalidInput: translate('filters.invalidInputTooShortHint'),
      });
    });

    it('should return too short error msg obj when input too short', () => {
      const control = new FormControl('');
      ValidationUtils.isInitialEmptyState = jest.fn(() => false);
      ValidationUtils.isInputTooShort = jest.fn(() => true);

      const result = validator.validate(control);

      expect(transloco.translate).toHaveBeenCalledWith(
        'filters.invalidInputTooShortHint'
      );

      expect(result).toEqual({
        invalidInput: translate('filters.invalidInputTooShortHint'),
      });
    });

    it('should return invalid input dropdown error msg obj when input originates from typing', () => {
      const control = new FormControl('');
      ValidationUtils.isInitialEmptyState = jest.fn(() => false);
      ValidationUtils.isInputTooShort = jest.fn(() => false);
      ValidationUtils.isInputValueFromTyping = jest.fn(() => true);

      const result = validator.validate(control);

      expect(transloco.translate).toHaveBeenCalledWith(
        'filters.invalidInputDropdownHint'
      );

      expect(result).toEqual({
        invalidInput: translate('filters.invalidInputDropdownHint'),
      });
    });

    it('should return undefined when input valid', () => {
      const control = new FormControl('');
      ValidationUtils.isInitialEmptyState = jest.fn(() => false);
      ValidationUtils.isInputTooShort = jest.fn(() => false);
      ValidationUtils.isInputValueFromTyping = jest.fn(() => false);

      const result = validator.validate(control);

      expect(result).toBeUndefined();
    });
  });
});
