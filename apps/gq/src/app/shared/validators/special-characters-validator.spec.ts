import { FormControl } from '@angular/forms';

import { specialCharactersValidator } from './special-characters-validator';

describe('Special Characters Validator', () => {
  test('should return undefined if input is valid', () => {
    const control = new FormControl('validInput123');
    const result = specialCharactersValidator()(control);
    expect(result).toBeUndefined();
  });

  test('should return validation error if input contains special characters', () => {
    const control = new FormControl('invalidInput/<>');
    const result = specialCharactersValidator()(control);
    expect(result).toEqual({ invalidCharacters: true });
  });
});
