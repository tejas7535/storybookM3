import { Pipe, PipeTransform } from '@angular/core';

import { MediasFeatureTableEntry } from './grease-recommendation-promo.component';

@Pipe({
  name: 'optionalIcon',
})
export class OptionalIconPipe implements PipeTransform {
  transform(value: MediasFeatureTableEntry): string {
    if (typeof value === 'object') {
      return value.icon;
    }

    return '';
  }
}
