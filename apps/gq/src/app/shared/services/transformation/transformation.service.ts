import { Injectable } from '@angular/core';

import { Keyboard } from '@gq/shared/models';
import {
  TranslocoCurrencyPipe,
  TranslocoDatePipe,
  TranslocoDecimalPipe,
  TranslocoPercentPipe,
} from '@ngneat/transloco-locale';

@Injectable({
  providedIn: 'root',
})
export class TransformationService {
  constructor(
    private readonly translocoCurrencyPipe: TranslocoCurrencyPipe,
    private readonly translocoDatePipe: TranslocoDatePipe,
    private readonly translocoPercentPipe: TranslocoPercentPipe,
    private readonly translocoDecimalPipe: TranslocoDecimalPipe
  ) {}

  transformNumber(number: number, showDigits: boolean): string {
    if (number === undefined) {
      return Keyboard.DASH;
    }

    return this.translocoDecimalPipe.transform(number, {
      minimumFractionDigits: showDigits ? 2 : undefined,
      maximumFractionDigits: showDigits ? 2 : 0,
    });
  }

  transformNumberExcel(number: number): string {
    if (!number) {
      return Keyboard.DASH;
    }

    return this.translocoDecimalPipe.transform(
      number,
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        useGrouping: false,
      },
      'en-US'
    );
  }

  transformNumberCurrency(number: string, currency: string): string {
    return number
      ? this.translocoCurrencyPipe.transform(
          number,
          'code',
          undefined,
          currency
        )
      : Keyboard.DASH;
  }

  transformMarginDetails(value: number, currency: string): string {
    if (!value) {
      return Keyboard.DASH;
    }

    return this.transformNumberCurrency(value.toString(), currency);
  }

  transformPercentage(percentage: number): string {
    return percentage
      ? this.translocoPercentPipe.transform(percentage / 100, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : Keyboard.DASH;
  }

  transformDate(date: string, includeTime: boolean = false): string {
    if (!date) {
      return '';
    }

    return this.translocoDatePipe.transform(date, {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: includeTime ? '2-digit' : undefined,
      minute: includeTime ? '2-digit' : undefined,
    });
  }
}
