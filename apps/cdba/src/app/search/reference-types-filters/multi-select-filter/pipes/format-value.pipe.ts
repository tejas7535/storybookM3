import { Pipe, PipeTransform } from '@angular/core';

import { StringOption } from '@schaeffler/inputs';

@Pipe({
  name: 'formatValue',
})
export class FormatValuePipe implements PipeTransform {
  transform(option: StringOption, isAutocomplete: boolean): any {
    return !isAutocomplete ? `${option?.id} | ${option?.title}` : option?.title;
  }
}
