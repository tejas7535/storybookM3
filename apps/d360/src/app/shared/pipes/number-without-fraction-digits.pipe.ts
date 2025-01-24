import { inject, Pipe, PipeTransform } from '@angular/core';

import { TranslocoLocaleService } from '@jsverse/transloco-locale';

@Pipe({
  name: 'numberWithoutFractionDigits',
  standalone: true,
})
export class NumberWithoutFractionDigitsPipe implements PipeTransform {
  private readonly translocoLocaleService: TranslocoLocaleService = inject(
    TranslocoLocaleService
  );

  public transform(value: number | string | null | undefined): string | null {
    if (value === undefined || value === null) {
      return '';
    }

    const numberValue = typeof value === 'number' ? value : Number(value);
    if (Number.isNaN(numberValue)) {
      return '';
    }

    return this.translocoLocaleService.localizeNumber(
      numberValue,
      'decimal',
      this.translocoLocaleService.getLocale(),
      {
        maximumFractionDigits: 0,
      }
    );
  }
}
