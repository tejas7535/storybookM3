import { inject, Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import {
  getNumberFilterRegex,
  LOCALE_DE,
  numbersRegex,
} from '@gq/shared/constants';
import { Keyboard } from '@gq/shared/models';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';

@Injectable({
  providedIn: 'root',
})
export class ValidationHelper {
  readonly translocoLocaleService = inject(TranslocoLocaleService);

  public validateForNumericWithMaxDecimals(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | undefined => {
      const { value } = control;

      // 1. If numeric regex with max decimals
      const decimalSeparator =
        this.translocoLocaleService?.getLocale() === LOCALE_DE.id
          ? Keyboard.COMMA
          : Keyboard.DOT;
      // Check if the value contains more than one decimal separator
      const parts = value?.split(decimalSeparator);
      if (parts?.length > 2) {
        return { notValid: true };
      }

      // Check if the value has more than two decimal places
      if (
        !getNumberFilterRegex(this.translocoLocaleService?.getLocale()).test(
          value
        ) &&
        parts?.length === 2 &&
        parts[1]?.length > 2
      ) {
        return { maxDecimalsAllowed: true };
      }

      // 2. If just numeric regex does not match, return notValid
      if (
        !getNumberFilterRegex(this.translocoLocaleService?.getLocale()).test(
          value
        )
      ) {
        return { notValid: true };
      }

      return null;
    };
  }

  public validateMaxLengthWithDecimals(maxLength: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const { value } = control;
      let valueWithoutCommaOrDot = value?.replaceAll(Keyboard.DOT, '');
      valueWithoutCommaOrDot = valueWithoutCommaOrDot?.replaceAll(
        Keyboard.COMMA,
        ''
      );
      const check = valueWithoutCommaOrDot?.length <= maxLength;

      return check ? null : { maxlength: true };
    };
  }

  public validateNoDecimalsAllowed() {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const check = numbersRegex.test(control.value);

      return check ? null : { notAllowedDecimals: true };
    };
  }

  public validateOnlyNumbersAllowed() {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const check = numbersRegex.test(control.value);

      return check ? null : { notValid: true };
    };
  }

  public validateNegativeValue() {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const { value } = control;
      const check = value <= '0' || value?.startsWith(Keyboard.DASH);

      return check ? { notAllowedNegativeValues: true } : null;
    };
  }
}
