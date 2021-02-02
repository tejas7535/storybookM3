import { Pipe, PipeTransform } from '@angular/core';

import { TranslocoService } from '@ngneat/transloco';

import { FilterItemRange } from '../../../core/store/reducers/search/models';

@Pipe({
  name: 'rangeFilterValue',
})
export class RangeFilterValuePipe implements PipeTransform {
  constructor(private readonly transloco: TranslocoService) {}

  transform(filter: FilterItemRange): string {
    const filterTranslation = this.transloco.translate<string>(
      `search.referenceTypesFilters.names.${filter.name}`
    );
    const unit = filter.unit ? filter.unit : '';

    let value: string;

    // tslint:disable-next-line: prefer-conditional-expression
    if (filter.minSelected && !filter.maxSelected) {
      value = `Min. ${filterTranslation}: ${filter.minSelected}${unit}`;
    } else if (!filter.minSelected && filter.maxSelected) {
      value = `Max. ${filterTranslation}: ${filter.maxSelected}${unit}`;
    } else {
      // filter.minSelected && filter.maxSelected
      value = `${filter.minSelected}${unit} - ${filter.maxSelected}${unit}`;
    }

    return value;
  }
}
