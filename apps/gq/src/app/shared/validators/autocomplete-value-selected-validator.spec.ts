import { AbstractControl, FormControl, ValidationErrors } from '@angular/forms';

import { ActiveDirectoryUser } from '../models';
import { autocompleteValueSelectedValidator } from './autocomplete-value-selected-validator';

describe('autocompleteValueSelectedValidator', () => {
  test('should return valid because value is undefined', () => {
    const control: AbstractControl = new FormControl(undefined);
    const result = autocompleteValueSelectedValidator([])(control) as
      | ValidationErrors
      | undefined;
    expect(result).toBeUndefined();
  });
  test('should return valid because value is found in List', () => {
    const user: ActiveDirectoryUser = {
      userId: 'schlesni',
    } as ActiveDirectoryUser;
    const control: AbstractControl = new FormControl(user);

    const result = autocompleteValueSelectedValidator([user])(control) as
      | ValidationErrors
      | undefined;
    expect(result).toBeUndefined();
  });
  test('should return invalid because value is NOT found in List', () => {
    const user: ActiveDirectoryUser = {
      userId: 'schlesni',
    } as ActiveDirectoryUser;
    const userList: ActiveDirectoryUser = {
      userId: 'herpisef',
    } as ActiveDirectoryUser;
    const control: AbstractControl = new FormControl(user);

    const result = autocompleteValueSelectedValidator([userList])(control) as
      | ValidationErrors
      | undefined;
    expect(result).toStrictEqual({ invalidSelection: true });
  });
});
