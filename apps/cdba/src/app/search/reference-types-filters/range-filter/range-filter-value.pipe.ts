import { Pipe, PipeTransform } from '@angular/core';

import { TranslocoService } from '@ngneat/transloco';
import { TranslocoLocaleService } from '@ngneat/transloco-locale';

import { FilterItemRange } from '../../../core/store/reducers/search/models';

@Pipe({
  name: 'rangeFilterValue',
})
export class RangeFilterValuePipe implements PipeTransform {
  constructor(
    private readonly transloco: TranslocoService,
    private readonly localeService: TranslocoLocaleService
  ) {}

  transform(filter: FilterItemRange): string {
    let value: string;

    const unitTranslation: string = filter.unit
      ? this.getTranslationOrMissing(
          `search.referenceTypesFilters.units.${filter.unit}`
        )
      : '';

    if (filter.minSelected && !filter.maxSelected) {
      value = `Min. ${this.formatRangeNumber(
        filter.minSelected
      )}${unitTranslation}`;
    } else if (!filter.minSelected && filter.maxSelected) {
      value = `Max. ${this.formatRangeNumber(
        filter.maxSelected
      )}${unitTranslation}`;
    } else {
      // filter.minSelected && filter.maxSelected
      value = `${this.formatRangeNumber(
        filter.minSelected
      )}${unitTranslation} - ${this.formatRangeNumber(
        filter.maxSelected
      )}${unitTranslation}`;
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

  private getTranslationOrMissing(key: string): string {
    const translation = this.transloco.translate(key);

    return translation === key ? '' : translation;
  }
}
