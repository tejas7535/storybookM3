import { Pipe, PipeTransform } from '@angular/core';

import { IdValue } from '../../../../core/store/reducers/search/models';

@Pipe({
  name: 'formatValue',
})
export class FormatValuePipe implements PipeTransform {
  transform(idValue: IdValue, isAutocomplete: boolean): any {
    return !isAutocomplete
      ? `${idValue?.id} | ${idValue?.value}`
      : idValue?.value;
  }
}
