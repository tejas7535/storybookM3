import { Pipe, PipeTransform } from '@angular/core';

import { Keyboard } from '../../models';

@Pipe({
  name: 'nullableString',
  standalone: false,
})
export class NullableStringPipe implements PipeTransform {
  transform(value: string): string {
    return value && value.length > 0 ? value : Keyboard.DASH;
  }
}
