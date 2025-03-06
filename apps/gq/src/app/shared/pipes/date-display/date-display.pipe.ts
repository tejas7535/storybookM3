import { Pipe, PipeTransform } from '@angular/core';

import { Keyboard } from '../../models';

@Pipe({
  name: 'dateDisplay',
  standalone: false,
})
export class DateDisplayPipe implements PipeTransform {
  transform(value: string): string {
    return value ? new Date(value).toLocaleDateString() : Keyboard.DASH;
  }
}
