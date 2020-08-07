import { Pipe, PipeTransform } from '@angular/core';

import { IdValue } from '../../../../core/store/reducers/search/models';

@Pipe({
  name: 'multiSelectValue',
})
export class MultiSelectValuePipe implements PipeTransform {
  /**
   * Transform selected values like '(count) item1, item2'
   */
  public transform(values: IdValue[]): any {
    if (!values || (values.length === 1 && values[0] === undefined)) {
      return '';
    }

    const formatted = values.map((idValue) => idValue.value).join(',');

    return `(${values.length}) ${formatted}`;
  }
}
