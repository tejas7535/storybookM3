import { Pipe, PipeTransform } from '@angular/core';

import { Keyboard } from '../../models';
import { MaterialClassificationSOP } from '../../models/quotation-detail';

@Pipe({
  name: 'materialClassificationSOP',
  standalone: false,
})
export class MaterialClassificationSOPPipe implements PipeTransform {
  transform(value: string): string {
    if (value === '0') {
      return MaterialClassificationSOP.OP;
    }

    if (value === '1') {
      return MaterialClassificationSOP.AP;
    }

    if (value === '3') {
      return MaterialClassificationSOP.SP;
    }

    return Keyboard.DASH;
  }
}
