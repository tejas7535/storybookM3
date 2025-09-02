import { Injectable, Pipe, PipeTransform } from '@angular/core';

import { Unitset } from '@lsa/shared/models/preferences.model';

import { celciusToFahrenheit } from './unit-conversion.helper';

@Pipe({
  name: 'lsaTemperaturePipe',
  standalone: true,
})
@Injectable({ providedIn: 'root' })
export class LsaTemperaturePipe implements PipeTransform {
  transform(celciusInput: number, unitset: Unitset) {
    if (unitset === Unitset.SI) {
      return celciusInput;
    }

    return celciusToFahrenheit(celciusInput);
  }
}
