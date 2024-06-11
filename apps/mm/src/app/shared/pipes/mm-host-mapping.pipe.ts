import { Pipe, PipeTransform } from '@angular/core';

import { environment } from '@mm/environments/environment';

@Pipe({
  name: 'mmHostMapping',
})
/**
 * This pipe is used to map the wrong host to the correct one, till API is fixed.
 */
export class MmHostMappingPipe implements PipeTransform {
  private readonly wrongURL = 'http://10.0.1.22:80/MountingManager';

  transform(value: string): any {
    if (value.includes(this.wrongURL)) {
      const baseURL = environment.baseUrl.replace('/v1', '');

      const replacedValue = value.replace(this.wrongURL, baseURL);

      return replacedValue;
    }

    return value;
  }
}
