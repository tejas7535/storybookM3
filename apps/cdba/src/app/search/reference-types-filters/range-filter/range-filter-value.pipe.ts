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
    let filterTranslation: string;

    filterTranslation = ` ${this.transloco.translate<string>(
      `search.referenceTypesFilters.names.${filter.name}`
    )}`;
    const unit = filter.unit ? filter.unit : '';

    if (filter.name === 'budget_quantity') {
      filterTranslation = ''; // because it is too long to be displayed in the form field
    }

    if (filter.minSelected && !filter.maxSelected) {
      value = `Min.${filterTranslation}: ${this.formatRangeNumber(
        filter.minSelected
      )}${unit}`;
    } else if (!filter.minSelected && filter.maxSelected) {
      value = `Max.${filterTranslation}: ${this.formatRangeNumber(
        filter.maxSelected
      )}${unit}`;
    } else {
      // filter.minSelected && filter.maxSelected
      value = `${this.formatRangeNumber(
        filter.minSelected
      )}${unit} - ${this.formatRangeNumber(filter.maxSelected)}${unit}`;
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
