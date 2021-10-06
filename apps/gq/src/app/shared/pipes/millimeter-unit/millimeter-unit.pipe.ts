import { Pipe, PipeTransform } from '@angular/core';

import { Keyboard } from '../../models';

@Pipe({
  name: 'millimeterUnit',
})
export class MillimeterUnitPipe implements PipeTransform {
  transform(value: string): string {
    return value ? `${value}mm` : Keyboard.DASH;
  }
}
