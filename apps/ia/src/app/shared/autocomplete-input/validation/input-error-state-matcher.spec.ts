import { FormControl } from '@angular/forms';

import { IdValue } from '../../models';
import { InputErrorStateMatcher } from './input-error-state-matcher';
import { ValidationUtils } from './validation-utils';

describe('InputErrorStateMatcher', () => {
  let matcher: InputErrorStateMatcher;
  const items = [
    new IdValue('one', 'One'),
    new IdValue('two', 'Two'),
    new IdValue('three', 'Three'),
  ];

  beforeEach(() => {
    matcher = new InputErrorStateMatcher(items);
  });

  it('should be created', () => {
    expect(matcher).toBeTruthy();
  });

  describe('isErrorState', () => {
    it('should call isInputInvalid function from ValidationUtils', () => {
      const control = new FormControl('');
      ValidationUtils.isInputInvalid = jest.fn();

      matcher.isErrorState(control);

      expect(ValidationUtils.isInputInvalid).toHaveBeenCalledWith(
        items,
        control
      );
    });
  });
});
