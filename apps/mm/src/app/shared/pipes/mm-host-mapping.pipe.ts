import { Pipe, PipeTransform } from '@angular/core';

import { environment } from '@mm/environments/environment';

@Pipe({
  name: 'mmHostMapping',
})
/**
 * This pipe is used to map the wrong host to the correct one, till API is fixed.
 */
export class MmHostMappingPipe implements PipeTransform {
  transform(value: string): any {
    const wrongHostPattern = /^http:\/\/10\.0\.\d+\.\d+:80\/MountingManager/;

    if (wrongHostPattern.test(value)) {
      const baseURL = environment.baseUrl.replace('/v1', '');

      const replacedValue = value.replace(wrongHostPattern, baseURL);

      return replacedValue;
    }

    return value;
  }
}
