import { Injectable } from '@angular/core';

import {
  IDMM_HYDRAULIC_NUT_TYPE,
  IDMM_INNER_RING_EXPANSION,
  IDMM_INNER_SHAFT_DIAMETER,
  IDMM_MEASSURING_METHOD,
  IDMM_MODULUS_OF_ELASTICITY,
  IDMM_NUMBER_OF_PREVIOUS_MOUNTINGS,
  IDMM_POISSON_RATIO,
  IDMM_RADIAL_CLEARANCE_REDUCTION,
  IDMM_SHAFT_MATERIAL,
} from '@mm/shared/constants/dialog-constant';
import {
  MMBearingPreflightField,
  MMBearingPreflightResponse,
} from '@mm/shared/models';

import { PreflightData } from './preflight-data.interface';

@Injectable({
  providedIn: 'root',
})
export class PreflightDataParserService {
  public formatPreflightData(data: MMBearingPreflightResponse): PreflightData {
    const allFields: MMBearingPreflightField[] = Array.isArray(data.data.input)
      ? data.data.input.flatMap(({ fields }) => fields)
      : [];

    const nutField = allFields.find(({ id }) => id === IDMM_HYDRAULIC_NUT_TYPE);

    if (!nutField || !nutField.range) {
      throw new Error(`Cannot find ${IDMM_HYDRAULIC_NUT_TYPE} field`);
    }

    const hudraulicNutType = {
      value: nutField.defaultValue,
      options: nutField.range.map(({ id, title }) => ({
        value: id,
        label: title,
      })),
    };

    const modulus = this.getValueForKey(allFields, IDMM_MODULUS_OF_ELASTICITY);

    return {
      hudraulicNutType,
      innerRingExpansion: this.getValueForKey(
        allFields,
        IDMM_INNER_RING_EXPANSION
      ),
      radialClearanceReduction: this.getValueForKey(
        allFields,
        IDMM_RADIAL_CLEARANCE_REDUCTION
      ),
      shaftDiameter: this.getValueForKey(allFields, IDMM_INNER_SHAFT_DIAMETER),
      shaftMaterial: this.getValueForKey(allFields, IDMM_SHAFT_MATERIAL),
      modulusOfElasticity: modulus,
      poissonRatio: this.getValueForKey(allFields, IDMM_POISSON_RATIO),
      numberOfPreviousMountings: this.getValueForKey(
        allFields,
        IDMM_NUMBER_OF_PREVIOUS_MOUNTINGS
      ),
      mountingOption: this.getValueForKey(allFields, IDMM_MEASSURING_METHOD),
    };
  }

  private getValueForKey(
    values: MMBearingPreflightField[],
    key: string
  ): string {
    return values.find(({ id }) => id === key).defaultValue;
  }
}
