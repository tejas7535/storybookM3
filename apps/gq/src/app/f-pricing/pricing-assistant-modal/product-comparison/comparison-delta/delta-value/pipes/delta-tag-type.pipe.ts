import { Pipe, PipeTransform } from '@angular/core';

import { PropertyDelta } from '@gq/core/store/f-pricing/models/property-delta.interface';

@Pipe({
  name: 'deltaTagType',
  standalone: true,
})
export class DeltaTagTypePipe implements PipeTransform {
  transform(value: PropertyDelta): 'error' | 'success' | 'neutral' {
    if (value?.absolute < 0) {
      return 'error';
    } else if (value?.absolute > 0) {
      return 'success';
    }

    return 'neutral';
  }
}
