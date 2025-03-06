import { Pipe, PipeTransform } from '@angular/core';

import { Keyboard } from '@gq/shared/models';

@Pipe({
  name: 'isDashOrEmptyString',
  standalone: false,
})
export class IsDashOrEmptyStringPipe implements PipeTransform {
  transform(value: string): boolean {
    return !value || value === Keyboard.DASH ? true : false;
  }
}
