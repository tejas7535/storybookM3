import { Inject, Injectable } from '@angular/core';

import { LOCAL_STORAGE } from '@ng-web-apis/common';

import { measurementUnitsDefault } from '@ga/shared/constants';
import { MeasurementUnits } from '@ga/shared/models';

@Injectable({
  providedIn: 'root',
})
export class MeasurementUnitsService {
  private readonly storageKeyPrefix = 'measurement_units';

  constructor(@Inject(LOCAL_STORAGE) private readonly localStorage: Storage) {}

  public getMeasurementUnits = (): `${MeasurementUnits}` => {
    const storageValue = this.localStorage.getItem(this.storageKeyPrefix);

    if (
      Object.values(MeasurementUnits).includes(storageValue as MeasurementUnits)
    ) {
      return storageValue as `${MeasurementUnits}`;
    }

    return measurementUnitsDefault;
  };

  public setMeasurementUnits = (units: `${MeasurementUnits}`): void => {
    this.localStorage.setItem(this.storageKeyPrefix, units);
  };
}
