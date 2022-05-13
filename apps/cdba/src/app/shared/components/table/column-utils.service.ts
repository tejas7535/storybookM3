import { Injectable } from '@angular/core';

import { ValueFormatterParams } from '@ag-grid-enterprise/all-modules';
import { TranslocoLocaleService } from '@ngneat/transloco-locale';
import {
  DateFormatOptions,
  NumberTypes,
} from '@ngneat/transloco-locale/lib/transloco-locale.types';

@Injectable({ providedIn: 'root' })
export class ColumnUtilsService {
  constructor(private readonly localeService: TranslocoLocaleService) {}

  /**
   * Transform an ag-grid number value into the current locale's number format.
   * * @usageNotes
   *
   * ### options
   *
   * The value's decimal representation is specified by the `options`
   * parameter. The most common props are:
   *
   *  - `minimumIntegerDigits`:
   * The minimum number of integer digits before the decimal point.
   * Default is 1.
   *
   * - `minimumFractionDigits`:
   * The minimum number of digits after the decimal point.
   * Default is 0.
   *
   *  - `maximumFractionDigits`:
   * The maximum number of digits after the decimal point.
   * Default is 3.
   *
   * If the formatted value is truncated it will be rounded using the "to-nearest" method
   *
   * For further information on number formatters see
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat
   *
   * For further information on ag grid value formatters see
   * https://www.ag-grid.com/angular-data-grid/value-formatters
   */
  public formatNumber = (
    params: ValueFormatterParams,
    options?: Intl.NumberFormatOptions,
    type: NumberTypes = 'decimal'
  ): string =>
    this.localeService.localizeNumber(params.value, type, undefined, options);

  /**
   * Transform an ag-grid date value into the current locale's date format.
   *
   * * @usageNotes
   *
   * ### date
   * date can be a `Date` object, a number (milliseconds since UTC epoch),
   * or an ISO string (https://www.w3.org/TR/NOTE-datetime).
   *
   * ### options
   *
   * Supports Intl calendar types
   *
   * For further information on ag grid value formatters see
   * https://www.ag-grid.com/angular-data-grid/value-formatters
   */
  public formatDate = (
    params: ValueFormatterParams,
    options?: DateFormatOptions
  ): string =>
    params.value
      ? this.localeService.localizeDate(params.value, undefined, options)
      : '';
}
