import { Injectable } from '@angular/core';

import { Keyboard } from '@gq/shared/models';
import { TranslocoLocaleService } from '@ngneat/transloco-locale';

@Injectable({
  providedIn: 'root',
})
export class TransformationService {
  constructor(
    private readonly translocoLocaleService: TranslocoLocaleService
  ) {}

  transformNumber(number: number, showDigits: boolean): string {
    if (number === undefined) {
      return Keyboard.DASH;
    }

    const locale = this.translocoLocaleService.getLocale();

    return this.translocoLocaleService.localizeNumber(
      number,
      'decimal',
      locale,
      {
        minimumFractionDigits: showDigits ? 2 : undefined,
        maximumFractionDigits: showDigits ? 2 : 0,
      }
    );
  }

  transformNumberExcel(number: number): string {
    if (!number) {
      return Keyboard.DASH;
    }

    return this.translocoLocaleService.localizeNumber(
      number,
      'decimal',
      'en-US', // en-US is needed for Excel export due to Excel import issues with other seperators
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        useGrouping: false,
      }
    );
  }

  transformNumberCurrency(
    number: number,
    currency: string,
    keepValue: boolean = false
  ): string {
    const locale = this.translocoLocaleService.getLocale();
    // when function localizeNumber() returns falsy value (undefined, null, NaN, 0, '') then define if to return a dash or the falsy value
    // in some places the '0' value is needed instead of the dash
    const falsyValueReturn = keepValue
      ? `${number} ${currency}`
      : Keyboard.DASH;

    return number
      ? this.translocoLocaleService.localizeNumber(number, 'currency', locale, {
          currency,
          currencyDisplay: 'code',
        })
      : falsyValueReturn;
  }

  transformPercentage(percentage: number): string {
    const locale = this.translocoLocaleService.getLocale();

    return percentage
      ? this.translocoLocaleService.localizeNumber(
          percentage / 100,
          'percent',
          locale,
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }
        )
      : Keyboard.DASH;
  }

  transformDate(date: string, includeTime: boolean = false): string {
    if (!date) {
      return '';
    }

    const locale = this.translocoLocaleService.getLocale();

    return this.translocoLocaleService.localizeDate(date, locale, {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: includeTime ? '2-digit' : undefined,
      minute: includeTime ? '2-digit' : undefined,
    });
  }
}
