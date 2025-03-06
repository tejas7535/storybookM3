import { Pipe, PipeTransform } from '@angular/core';

import { Keyboard } from '../../models';

@Pipe({
  name: 'undefinedToDash',
})
export class UndefinedToDashPipe implements PipeTransform {
  transform(value: any): any {
    return value === undefined || value === null ? Keyboard.DASH : value;
  }
}
