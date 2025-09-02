import { inject, Injectable } from '@angular/core';

import { MultiUnitValue } from '@lsa/shared/models';
import { Unitset } from '@lsa/shared/models/preferences.model';
import { LsaLengthPipe } from '@lsa/shared/pipes/units/length.pipe';
import { LsaTemperaturePipe } from '@lsa/shared/pipes/units/temperature.pipe';

@Injectable({
  providedIn: 'root',
})
export class UnitService {
  temperaturePipe = inject(LsaTemperaturePipe);
  lengthPipe = inject(LsaLengthPipe);

  public pickUnitset(property: MultiUnitValue, unitset: Unitset) {
    return property[unitset === Unitset.SI ? 'SI' : 'FPS'];
  }
}
