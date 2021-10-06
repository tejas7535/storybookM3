import { Pipe, PipeTransform } from '@angular/core';

import { Keyboard } from '../../models';

@Pipe({
  name: 'materialTransform',
})
export class MaterialTransformPipe implements PipeTransform {
  transform(value: string): string {
    if (value?.length === 15) {
      return `${value.slice(0, 9)}-${value.slice(9, 13)}-${value.slice(13)}`;
    } else if (value?.length === 13) {
      return `${value.slice(0, 9)}-${value.slice(9, 13)}`;
    } else {
      return value || Keyboard.DASH;
    }
  }
}
