import { FormControl } from '@angular/forms';

import { InputErrorStateMatcher } from './input-error-state-matcher';
import { ValidationUtils } from './validation-utils';

describe('InputErrorStateMatcher', () => {
  let matcher: InputErrorStateMatcher;

  beforeEach(() => {
    matcher = new InputErrorStateMatcher();
  });

  it('should be created', () => {
    expect(matcher).toBeTruthy();
  });

  describe('isErrorState', () => {
    it('should call isInputInvalid function from ValidationUtils', () => {
      const control = new FormControl('');
      ValidationUtils.isInputInvalid = jest.fn();

      matcher.isErrorState(control);

      expect(ValidationUtils.isInputInvalid).toHaveBeenCalledWith(control);
    });
  });
});
