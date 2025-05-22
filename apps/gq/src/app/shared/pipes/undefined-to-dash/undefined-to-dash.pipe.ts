import { Pipe, PipeTransform } from '@angular/core';

import { Keyboard } from '../../models';

@Pipe({
  name: 'undefinedToDash',
})
export class UndefinedToDashPipe implements PipeTransform {
  transform(value: any): any {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return Keyboard.DASH;
    }

    return value;
  }
}
