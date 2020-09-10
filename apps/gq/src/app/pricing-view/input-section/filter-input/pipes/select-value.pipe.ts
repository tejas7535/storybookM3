import { Pipe, PipeTransform } from '@angular/core';

import { IdValue } from '../../../../core/store/models';

@Pipe({
  name: 'selectValue',
})
export class SelectValuePipe implements PipeTransform {
  /**
   * Transform selected values like '(count) item1, item2'
   */
  public transform(idValue: IdValue): any {
    return idValue ? idValue.value : '';
  }
}
