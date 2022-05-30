import { Pipe, PipeTransform } from '@angular/core';

import { TranslocoLocaleService } from '@ngneat/transloco-locale';

import { RangeFilter } from './range-filter.model';

@Pipe({
  name: 'rangeFilterValue',
})
export class RangeFilterValuePipe implements PipeTransform {
  constructor(private readonly localeService: TranslocoLocaleService) {}

  transform(filter: RangeFilter): string {
    let value: string;

    if (filter.minSelected && !filter.maxSelected) {
      value = `Min. ${this.formatRangeNumber(filter.minSelected)} ${
        filter.unit || ''
      }`;
    } else if (!filter.minSelected && filter.maxSelected) {
      value = `Max. ${this.formatRangeNumber(filter.maxSelected)} ${
        filter.unit || ''
      }`;
    } else {
      // filter.minSelected && filter.maxSelected
      value = `${this.formatRangeNumber(filter.minSelected)} ${
        filter.unit || ''
      } - ${this.formatRangeNumber(filter.maxSelected)} ${filter.unit || ''}`;
    }

    return value;
  }

  private formatRangeNumber(value: number): string {
    const numberFormatOptions: Intl.NumberFormatOptions = {
      maximumFractionDigits: 2,
    };

    return this.localeService.localizeNumber(
      value,
      'decimal',
      undefined,
      numberFormatOptions
    );
  }
}
