import { FormGroup } from '@angular/forms';

import { translate } from '@jsverse/transloco';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { isMatch, parse, startOfDay } from 'date-fns';

import { deduplicateArray } from '../array';

export type AvailableDecimalSeparators =
  (typeof ValidationHelper.availableDecimalSeparators)[number];

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class ValidationHelper {
  public static localeService: TranslocoLocaleService;

  /**
   * DECIMAL SEPARATOR --> This is from l10n.ts
   *
   * @static
   * @memberof ValidationHelper
   */
  public static readonly availableDecimalSeparators = [
    'PERIOD',
    'COMMA',
  ] as const;

  /**
   * Gets the decimal separator for the active locale.
   *
   * @return {AvailableDecimalSeparators}
   */
  public static getDecimalSeparatorForActiveLocale(): AvailableDecimalSeparators {
    return ValidationHelper.localeService
      .localizeNumber(1000.5, 'decimal')
      .split(/(\.)/g)[0] === '1'
      ? 'COMMA'
      : 'PERIOD';
  }

  /**
   * Validates a string for letter chars (case insensitive without umlauts).
   * An empty string is an error.
   *
   * @static
   * @param {string} value
   * @return {(string | null)}
   * @memberof ValidationHelper
   */
  public static validateForLetters(value: string): string | null {
    const regex = /^[A-Za-z]+$/;
    const valid = regex.test(value);

    return valid ? null : translate('error.letters');
  }

  /**
   * Validates a string for numbers chars.
   * An empty string is an error.
   *
   * @static
   * @param {string} value
   * @return {(string | null)}
   * @memberof ValidationHelper
   */
  public static validateForNumbers(value: string): string | null {
    const regex = /^\d+$/;
    const valid = regex.test(value);

    return valid ? null : translate('error.numbers.rootString');
  }

  public static detectLocaleAndValidateForLocalFloat(
    value: string
  ): string | null {
    return ValidationHelper.validateForLocalFloat(
      value,
      ValidationHelper.getDecimalSeparatorForActiveLocale()
    );
  }

  public static validateForLocalFloat(
    value: string,
    decimalSeparator: AvailableDecimalSeparators
  ): string | null {
    // only allow digits and . and , (no negative values or other special things)
    const regex =
      decimalSeparator === 'COMMA'
        ? /^\d+(\.\d{3})*(,\d+)?$/
        : /^\d+(,\d{3})*(\.\d+)?$/;
    const valid = regex.test(value);

    return valid ? null : translate(`error.numbers.${decimalSeparator}`);
  }

  /**
   * Validates a string for numbers chars with a star (*).
   * An empty string is an error.
   *
   * @static
   * @param {string} value
   * @return {(string | null)}
   * @memberof ValidationHelper
   */
  public static validateForNumbersWithStar(value: string): string | null {
    const regex = /^[\d*]+$/;
    const valid = regex.test(value);

    return valid ? null : translate('error.number_stars');
  }

  public static getDateFormat(): string {
    const dateInput = '2024-11-23';
    const formattedDate: string =
      ValidationHelper.localeService?.localizeDate(dateInput);

    const separator: string = formattedDate.match(/[./-]/)?.[0];
    const dateParts: string[] = formattedDate.split(/[./-]/);

    const year = dateParts[0]; // Germany: 2024
    const month = dateParts[1]; // Germany: 11

    let dateString: string;

    if (year === '2024') {
      dateString = `yyyy${separator}${month === '11' ? 'MM' : 'dd'}${separator}${month === '11' ? 'dd' : 'MM'}`;
    } else if (year === '11') {
      dateString = `MM${separator}dd${separator}yyyy`;
    } else {
      dateString = `dd${separator}${month === '11' ? 'MM' : 'yyyy'}${separator}${month === '11' ? 'yyyy' : 'MM'}`;
    }

    return dateString;
  }

  /**
   * Validates a string for date characters.
   * An empty string is an error.
   *
   * @static
   * @param {string} value
   * @return {(string | null)}
   * @memberof ValidationHelper
   */
  public static validateDateFormat(value: string): string | null {
    let valid = isMatch(value, ValidationHelper.getDateFormat());

    // we do always want a format with 10 signs (yyyy=4 + mm=2 + dd=2 + separator=2) = 10
    if (String(value).length < 10) {
      valid = false;
    }

    return valid
      ? null
      : `${translate('error.date.invalidFormat')} (${ValidationHelper.getDateFormat().toLocaleLowerCase()})`;
  }

  /**
   * Validates a string for date format and checks if it is greater than or equal to today's date.
   * An empty string is an error.
   *
   * @static
   * @param {string} value
   * @return {(string | null)}
   * @memberof ValidationHelper
   */
  public static validateDateFormatAndGreaterEqualThanToday(
    value: string
  ): string | null {
    const validFormatError = ValidationHelper.validateDateFormat(value);
    if (validFormatError) {
      return validFormatError;
    }

    const isDateGreaterEqualThanToday =
      parse(value, ValidationHelper.getDateFormat(), new Date()) >=
      startOfDay(Date.now());

    const dateIsGreaterEqualThanToday = isDateGreaterEqualThanToday
      ? null
      : translate('error.date.beforeMin');

    return dateIsGreaterEqualThanToday;
  }

  /**
   * Check a string for an exact length
   *
   * @static
   * @param {string} value
   * @param {number} targetLength
   * @return {(string | null)}
   * @memberof ValidationHelper
   */
  public static validateExactLength(
    value: string,
    targetLength: number
  ): string | null {
    return value.trim().length === targetLength
      ? null
      : translate('error.wrong_length', { targetLength });
  }

  /**
   * Check a string for an maximum length
   *
   * @static
   * @param {string} value
   * @param {number} maxLength
   * @return {(string | null)}
   * @memberof ValidationHelper
   */
  public static validateMaxLength(
    value: string,
    maxLength: number
  ): string | null {
    return value.trim().length <= maxLength
      ? null
      : translate('error.too_long', { maxLength });
  }

  /**
   * Returns a public static that fills a string with a number of leading zeros.
   * Does not check for number chars.
   * If the string is longer than than the requested string, returns the input.
   *´
   * @static
   * @param {number} targetLength
   * @return {(value: string) => string}
   * @memberof ValidationHelper
   */
  public static fillZeroFunc(targetLength: number): (value: string) => string {
    return (value: string): string =>
      ValidationHelper.fillZeroOnValueFunc(targetLength, value);
  }

  /**
   * Returns a value that fills the string of the params with a number of leading zeros.
   * Does not check for number chars.
   * If the string is longer than the requested string, returns the input.
   *
   * @static
   * @param {number} targetLength
   * @param {string} value
   * @return {string}
   * @memberof ValidationHelper
   */
  public static fillZeroOnValueFunc(
    targetLength: number,
    value: string
  ): string {
    return value.padStart(targetLength, '0');
  }

  /**
   * Condenses / aggregates an array of validation results
   * (null if validation succeeded or an error message if not)
   * to one array of error messages or null (if all validations succeeded).
   */
  public static condenseValidationResults(
    result: (string | null)[]
  ): string[] | null {
    const results = result.filter((r) => r != null) as string[];

    if (results.length === 0) {
      return null;
    }

    return deduplicateArray(results);
  }

  public static condenseErrorsFromValidation(
    fn: (value: string) => string[] | null
  ): (value: string) => string | undefined {
    return (value: string) => fn(value)?.join(', ');
  }

  public static getStartEndDateValidationErrors(
    formGroup: FormGroup,
    touchFields: boolean = false,
    startDateControlName: string = 'startDate',
    endDateControlName: string = 'endDate'
  ) {
    const errors: { [key: string]: string[] } = {};

    // touch start- / endDate, so we show directly all errors
    if (touchFields) {
      formGroup.markAllAsTouched();
    }

    // start- / endDate
    const startDate = formGroup.get(startDateControlName)?.value;
    const endDate = formGroup.get(endDateControlName)?.value;

    if (startDate && endDate && startDate > endDate) {
      formGroup
        .get(endDateControlName)
        .setErrors({ toDateAfterFromDate: true });
      errors.endDate = ['end-before-start'];
    } else {
      // we set the error manually, so we also need to clean up manually ;)
      let fieldErrors = formGroup.get(endDateControlName).errors;
      if (fieldErrors?.['toDateAfterFromDate']) {
        delete fieldErrors['toDateAfterFromDate'];

        // if fieldErrors is {} (empty object) after deleting the key,
        // we need to set null, otherwise it is still shown up as an error
        fieldErrors =
          Object.keys(fieldErrors).length === 0 ? null : fieldErrors;
      }

      // set the new error state
      formGroup.get(endDateControlName).setErrors(fieldErrors);
    }

    return Object.keys(errors).length > 0 ? errors : null;
  }

  /**
   * Creates a custom validator function that checks if the sum of the values
   * of specified form controls in a `FormGroup` exceeds a limit of 100.
   *
   * @static
   * @example
   * ```typescript
   * const formGroup = new FormGroup({
   *   control1: new FormControl(50),
   *   control2: new FormControl(60),
   * });
   *
   * const validator = ValidationHelper.getCrossTotalExceedsLimitValidator(['control1', 'control2']);
   * const result = validator(formGroup); // { totalExceedsLimit: true }
   * ```
   * @param {string[]} keys - An array of strings representing the keys of the form controls
   *                          to be included in the validation.
   * @returns {ValidatorFn} A `ValidatorFn` that validates the sum of the specified form controls.
   *                        Returns `null` if the total is less than or equal to 100 or if any
   *                        of the specified keys are missing. Otherwise, returns an error object
   *                        with the key `totalExceedsLimit`.
   *
   * @memberof ValidationHelper
   */
  public static getCrossTotalExceedsLimit(
    formGroup: FormGroup,
    keys: string[],
    limit: number
  ): { totalExceedsLimit: true } | null {
    const errorKey = 'totalExceedsLimit';

    // Check if all keys are present in the form group
    const allKeysPresent = keys.every((key) => formGroup.get(key) !== null);
    if (!allKeysPresent) {
      return null; // If not all keys are present, skip validation
    }

    // Calculate the total of the specified keys
    // and check if it exceeds the specified limit
    const total = keys.reduce(
      (sum, key) => sum + Number(formGroup.get(key)?.value || 0),
      0
    );

    if (total <= limit) {
      keys.forEach((key) => {
        const control = formGroup.get(key);
        if (control) {
          // we set the error manually, so we also need to clean up manually ;)
          let fieldErrors = control.errors;
          if (fieldErrors?.[errorKey]) {
            delete fieldErrors[errorKey];

            // if fieldErrors is {} (empty object) after deleting the key,
            // we need to set null, otherwise it is still shown up as an error
            fieldErrors =
              Object.keys(fieldErrors).length === 0 ? null : fieldErrors;
          }

          // set the new error state
          control.setErrors(fieldErrors);
        }
      });

      return null;
    }

    keys.forEach((key) => {
      const control = formGroup.get(key);
      control.markAsTouched();
      control.markAsDirty();
      if (control) {
        control.setErrors({ [errorKey]: true });
      }
    });

    return { [errorKey]: true };
  }
}
