import { FormControl } from '@angular/forms';

import { translate } from '@ngneat/transloco';

import { IdValue } from '../../models';
import { InputValidatorDirective } from './input-validator.directive';
import { ValidationUtils } from './validation-utils';

describe('InputValidatorDirective', () => {
  const validator: InputValidatorDirective = new InputValidatorDirective();
  beforeEach(() => {
    validator.items = [
      new IdValue('one', 'One'),
      new IdValue('two', 'Two'),
      new IdValue('three', 'Three'),
    ];
  });

  it('should be created', () => {
    expect(validator).toBeTruthy();
  });

  describe('validate', () => {
    it('should return error obj when input invalid', () => {
      const control = new FormControl('');
      ValidationUtils.isInputInvalid = jest.fn(() => true);

      const result = validator.validate(control);

      expect(ValidationUtils.isInputInvalid).toHaveBeenCalledWith(
        validator.items,
        control
      );
      expect(result).toEqual({
        invalidInput: translate('filters.invalidInputHint'),
      });
    });

    it('should return undefined when input valid', () => {
      const control = new FormControl('');
      ValidationUtils.isInputInvalid = jest.fn(() => false);

      const result = validator.validate(control);

      expect(ValidationUtils.isInputInvalid).toHaveBeenCalledWith(
        validator.items,
        control
      );
      expect(result).toBeUndefined();
    });
  });
});
