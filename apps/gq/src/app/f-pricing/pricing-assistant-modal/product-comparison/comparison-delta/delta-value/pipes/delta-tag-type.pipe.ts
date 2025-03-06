import { Pipe, PipeTransform } from '@angular/core';

import { PropertyDelta } from '@gq/core/store/f-pricing/models/property-delta.interface';

@Pipe({
  name: 'deltaTagType',
})
export class DeltaTagTypePipe implements PipeTransform {
  transform(value: PropertyDelta): 'error' | 'success' | 'category2' {
    if (value?.absolute < 0) {
      return 'error';
    } else if (value?.absolute > 0) {
      return 'success';
    }

    return 'category2';
  }
}
