import { inject, Injectable, Pipe, PipeTransform } from '@angular/core';

import { RestService } from '@lsa/core/services/rest.service';
import { Unitset } from '@lsa/shared/models/preferences.model';

import { metersToFeet } from './unit-conversion.helper';

@Pipe({
  name: 'lsaLengthPipe',
})
@Injectable({ providedIn: 'root' })
export class LsaLengthPipe implements PipeTransform {
  protected restService = inject(RestService);

  transform(metricInput: number, unitset: Unitset) {
    if (unitset === Unitset.SI) {
      return metricInput;
    }

    return `${metersToFeet(metricInput).toFixed(1)} ft`;
  }
}
