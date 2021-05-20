import { formatNumber } from '@angular/common';
import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';

import { TranslocoService } from '@ngneat/transloco';

import { FilterItemRange } from '../../../core/store/reducers/search/models';

@Pipe({
  name: 'rangeFilterValue',
})
export class RangeFilterValuePipe implements PipeTransform {
  constructor(
    @Inject(LOCALE_ID) private readonly locale: string,
    private readonly transloco: TranslocoService
  ) {}

  transform(filter: FilterItemRange): string {
    const filterTranslation = this.transloco.translate<string>(
      `search.referenceTypesFilters.names.${filter.name}`
    );
    const unit = filter.unit ? filter.unit : '';

    let value: string;

    // eslint-disable-next-line
    const filterValueIsASum = filter.name === 'budget_quantity';

    if (filter.minSelected && !filter.maxSelected) {
      value = `Min. ${filterTranslation}: ${this.formatRangeNumber(
        filter.minSelected,
        filterValueIsASum
      )}${unit}`;
    } else if (!filter.minSelected && filter.maxSelected) {
      value = `Max. ${filterTranslation}: ${this.formatRangeNumber(
        filter.maxSelected,
        filterValueIsASum
      )}${unit}`;
    } else {
      // filter.minSelected && filter.maxSelected
      value = `${this.formatRangeNumber(
        filter.minSelected,
        filterValueIsASum
      )}${unit} - ${this.formatRangeNumber(
        filter.maxSelected,
        filterValueIsASum
      )}${unit}`;
    }

    return value;
  }

  private formatRangeNumber(
    value: number,
    filterValueIsASum = false
  ): number | string {
    const digitsInfo = filterValueIsASum ? '1.0-0' : '1.2-2';

    return formatNumber(value, this.locale, digitsInfo);
  }
}
