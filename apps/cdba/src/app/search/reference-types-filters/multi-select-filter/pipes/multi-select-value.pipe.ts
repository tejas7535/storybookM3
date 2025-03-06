import { Pipe, PipeTransform } from '@angular/core';

import { StringOption } from '@schaeffler/inputs';

@Pipe({
  name: 'multiSelectValue',
  standalone: false,
})
export class MultiSelectValuePipe implements PipeTransform {
  /**
   * Transform selected values like '(count) item1, item2'
   */
  public transform(values: StringOption[]): any {
    if (!values || (values.length === 1 && values[0] === undefined)) {
      return '';
    }

    const formatted = values.map((option) => option.title).join(',');

    return `(${values.length}) ${formatted}`;
  }
}
