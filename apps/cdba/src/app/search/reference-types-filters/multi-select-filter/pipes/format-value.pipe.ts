import { Pipe, PipeTransform } from '@angular/core';

import { StringOption } from '@schaeffler/inputs';

@Pipe({
  name: 'formatValue',
  standalone: false,
})
export class FormatValuePipe implements PipeTransform {
  transform(option: StringOption, isAutocomplete: boolean): any {
    return isAutocomplete ? option?.title : `${option?.id} | ${option?.title}`;
  }
}
