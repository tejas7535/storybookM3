import { inject, Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { getNumberFilterRegex, LOCALE_DE } from '@gq/shared/constants';
import { Keyboard } from '@gq/shared/models';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';

@Injectable({
  providedIn: 'root',
})
export class ValidationHelper {
  readonly translocoLocaleService = inject(TranslocoLocaleService);

  public validateNumericInputWithDecimals(maxLength: number = 11): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | undefined => {
      const { value } = control;

      if (value === null || value === undefined) {
        return null;
      }

      const valueAsString = value.toString();
      const leadingZerosPattern = /^0\d+/;
      // 1. Check for leading zeros
      if (leadingZerosPattern.test(valueAsString)) {
        return { notAllowedNegativeValues: true };
      }

      // 2. Check if value is number and greater than zero or contains only zeros
      if (this.valueIsNegativeOrContainsOnlyZeros(valueAsString)) {
        return { notAllowedNegativeValues: true };
      }

      const decimalSeparator =
        this.translocoLocaleService?.getLocale() === LOCALE_DE.id
          ? Keyboard.COMMA
          : Keyboard.DOT;
      // 3. Check if the value contains more than one decimal separator
      const parts = valueAsString?.split(decimalSeparator);
      if (parts?.length > 2) {
        return { notValid: true };
      }

      // 4. If just numeric regex does not match, return notValid
      if (
        !getNumberFilterRegex(this.translocoLocaleService?.getLocale()).test(
          value
        )
      ) {
        // 5. Check if the value has more than two decimal places
        if (parts?.length === 2 && parts[1]?.length > 2) {
          return { maxDecimalsAllowed: true };
        }

        return { notValid: true };
      }

      // 6. Check max length of all digits
      if (parts[0]?.length > maxLength) {
        return { maxlength: true };
      }

      return null;
    };
  }

  private valueIsNegativeOrContainsOnlyZeros(valueAsString: string) {
    const cleanedString = valueAsString.replaceAll(/[,.]/g, '');

    return (
      (!Number.isNaN(Number(valueAsString)) &&
        Number.parseFloat(valueAsString) <= 0) ||
      [...cleanedString].every((char) => char === '0')
    );
  }

  public validateNumericInputWithoutDecimals(maxLength: number = 13) {
    return (control: AbstractControl): ValidationErrors | undefined => {
      const { value } = control;

      if (value === null || value === undefined) {
        return null;
      }

      // Check if the value is a string representation of a number
      const valueAsString = value.toString();
      const leadingZerosPattern = /^0\d+/;
      // Check for leading zeros
      if (leadingZerosPattern.test(valueAsString)) {
        return { notAllowedNegativeValues: true };
      }

      // Regex pattern to match valid numeric input without letters
      const validNumericPattern = /^-?\d+(\.\d+)?$/;

      // Check for decimal values
      if (
        valueAsString.includes(Keyboard.DOT) ||
        valueAsString.includes(Keyboard.COMMA) ||
        !validNumericPattern.test(valueAsString)
      ) {
        return { notAllowedDecimals: true }; // Error for decimals
      }

      // Check for negative values
      if (this.valueIsNegativeOrContainsOnlyZeros(valueAsString)) {
        return { notAllowedNegativeValues: true }; // Error for negative values
      }

      // 3. Check max length of all digits
      if (valueAsString?.length > maxLength) {
        return { maxlength: true };
      }

      return null;
    };
  }
}
