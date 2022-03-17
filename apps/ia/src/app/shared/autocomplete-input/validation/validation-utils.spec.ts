import { FormControl } from '@angular/forms';

import { ValidationUtils } from './validation-utils';

describe('ValidationUtils', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });
  describe('isInputInvalid', () => {
    it('should return true if control dirty and isInputValueFromTyping', () => {
      const control = new FormControl('xd');
      control.markAsDirty();

      jest
        .spyOn(ValidationUtils, 'isInputValueFromTyping')
        .mockReturnValue(true);

      const result = ValidationUtils.isInputInvalid(control);

      expect(result).toBeTruthy();
      expect(ValidationUtils.isInputValueFromTyping).toHaveBeenCalledWith(
        control
      );
    });

    it('should return true if control dirty and isInitialEmptyState', () => {
      const control = new FormControl('xd');
      control.markAsDirty();

      jest
        .spyOn(ValidationUtils, 'isInputValueFromTyping')
        .mockReturnValue(false);
      jest.spyOn(ValidationUtils, 'isInitialEmptyState').mockReturnValue(true);
      const result = ValidationUtils.isInputInvalid(control);

      expect(result).toBeTruthy();
      expect(ValidationUtils.isInputValueFromTyping).toHaveBeenCalledWith(
        control
      );
      expect(ValidationUtils.isInitialEmptyState).toHaveBeenCalledWith(control);
    });

    it('should return true if control dirty and isInputTooShort', () => {
      const control = new FormControl('xd');
      control.markAsDirty();

      jest
        .spyOn(ValidationUtils, 'isInputValueFromTyping')
        .mockReturnValue(false);
      jest.spyOn(ValidationUtils, 'isInitialEmptyState').mockReturnValue(false);
      jest.spyOn(ValidationUtils, 'isInputTooShort').mockReturnValue(true);
      const result = ValidationUtils.isInputInvalid(control);

      expect(result).toBeTruthy();
      expect(ValidationUtils.isInputValueFromTyping).toHaveBeenCalledWith(
        control
      );
      expect(ValidationUtils.isInitialEmptyState).toHaveBeenCalledWith(control);
      expect(ValidationUtils.isInputTooShort).toHaveBeenCalledWith(control);
    });

    it('should return true if control touched and isInputValueFromTyping', () => {
      const control = new FormControl('xd');
      control.markAsTouched();

      jest
        .spyOn(ValidationUtils, 'isInputValueFromTyping')
        .mockReturnValue(true);
      const result = ValidationUtils.isInputInvalid(control);

      expect(result).toBeTruthy();
      expect(ValidationUtils.isInputValueFromTyping).toHaveBeenCalledWith(
        control
      );
    });

    it('should return true if control touched and isInitialEmptyState', () => {
      const control = new FormControl('xd');
      control.markAsTouched();

      jest
        .spyOn(ValidationUtils, 'isInputValueFromTyping')
        .mockReturnValue(false);
      jest.spyOn(ValidationUtils, 'isInitialEmptyState').mockReturnValue(true);
      const result = ValidationUtils.isInputInvalid(control);

      expect(result).toBeTruthy();
      expect(ValidationUtils.isInputValueFromTyping).toHaveBeenCalledWith(
        control
      );
      expect(ValidationUtils.isInitialEmptyState).toHaveBeenCalledWith(control);
    });

    it('should return true if control touched and isInputTooShort', () => {
      const control = new FormControl('xd');
      control.markAsTouched();

      jest
        .spyOn(ValidationUtils, 'isInputValueFromTyping')
        .mockReturnValue(false);
      jest.spyOn(ValidationUtils, 'isInitialEmptyState').mockReturnValue(false);
      jest.spyOn(ValidationUtils, 'isInputTooShort').mockReturnValue(true);
      const result = ValidationUtils.isInputInvalid(control);

      expect(result).toBeTruthy();
      expect(ValidationUtils.isInputValueFromTyping).toHaveBeenCalledWith(
        control
      );
      expect(ValidationUtils.isInitialEmptyState).toHaveBeenCalledWith(control);
      expect(ValidationUtils.isInputTooShort).toHaveBeenCalledWith(control);
    });

    it('should return false if control undefined', () => {
      const control: any = new FormControl(undefined);

      const result = ValidationUtils.isInputInvalid(control);

      expect(result).toBeFalsy();
    });
  });

  describe('isInputValueFromTyping', () => {
    test('should return true if value null', () => {
      // eslint-disable-next-line unicorn/no-null
      const control: FormControl = new FormControl(null);

      const result = ValidationUtils.isInputValueFromTyping(control);

      expect(result).toBeTruthy();
    });

    test('should return true if type of value is string', () => {
      const control: FormControl = new FormControl('a');

      const result = ValidationUtils.isInputValueFromTyping(control);

      expect(result).toBeTruthy();
    });

    test('should return false if type of value is object', () => {
      const control: FormControl = new FormControl({});

      const result = ValidationUtils.isInputValueFromTyping(control);

      expect(result).toBeFalsy();
    });
  });

  describe('isInputTooShort', () => {
    beforeEach(() => {
      jest.restoreAllMocks();
    });
    test('should return true if type of value is string and length <= 1', () => {
      const control = new FormControl('a');

      const result = ValidationUtils.isInputTooShort(control);

      expect(result).toBeTruthy();
    });

    test('should return false if value of type object', () => {
      const control = new FormControl({});

      const result = ValidationUtils.isInputTooShort(control);

      expect(result).toBeFalsy();
    });

    test('should return false if value length > 1', () => {
      const control = new FormControl('dsadsa');

      const result = ValidationUtils.isInputTooShort(control);

      expect(result).toBeFalsy();
    });
  });
});
