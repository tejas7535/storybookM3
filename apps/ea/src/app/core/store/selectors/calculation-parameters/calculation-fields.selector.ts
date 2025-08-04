import { SLEWING_BEARING_TYPE } from '@ea/shared/constants/products';
import { createSelector } from '@ngrx/store';

import { CalculationParameterGroup, CalculationType } from '../../models';
import {
  getBearingProductClass,
  isCo2DownstreamCalculationPossible,
} from '../product-selection/product-selection.selector';
import { getCalculationTypes } from './calculation-types.selector';

const mandatoryFieldMapping: Record<
  CalculationType,
  Partial<Record<CalculationParameterGroup, boolean>>
> = {
  ratingLife: {
    load: true,
    rotatingCondition: true,
    lubrication: false,
    contamination: false,
    operatingTemperature: false,
  },
  frictionalPowerloss: {
    load: true,
    rotatingCondition: true,
    lubrication: true,
    operatingTemperature: false,
    energySource: false,
    time: false,
    contamination: false,
  },
  lubrication: {
    load: true,
    rotatingCondition: true,
    lubrication: true,
    ambientTemperature: true,
    operatingTemperature: true,
  },
  emission: {
    load: true,
    rotatingCondition: true,
    lubrication: false,
    energySource: false,
    time: false,
    operatingTemperature: false,
  },
  overrollingFrequency: {
    load: true,
    rotatingCondition: true,
    conditionOfRotation: true,
  },
};

const slewingBearingFieldMapping: Record<
  CalculationType,
  Partial<Record<CalculationParameterGroup, boolean>>
> = {
  ratingLife: {
    rotatingCondition: true,
    time: true,
    force: true,
    moment: true,
  },
  emission: {
    rotatingCondition: true,
  },
  lubrication: {},
  frictionalPowerloss: {},

  overrollingFrequency: {},
};

export const getCalculationFieldsConfig = createSelector(
  getCalculationTypes,
  isCo2DownstreamCalculationPossible,
  getBearingProductClass,
  (
    state,
    co2DownstreamCalculationPossible,
    bearingProductClass
  ): {
    required: CalculationParameterGroup[];
    preset: CalculationParameterGroup[];
  } => {
    let result = {
      required: [] as CalculationParameterGroup[],
      preset: [] as CalculationParameterGroup[],
    };

    for (const [calculationType, value] of Object.entries(state)) {
      if (!value.selected || !value.visible) {
        continue;
      }
      let fieldMapping: [string, boolean][] = [];

      const co2DownstreamFields = new Set(['energySource', 'time']);

      fieldMapping =
        bearingProductClass === SLEWING_BEARING_TYPE
          ? Object.entries(
              slewingBearingFieldMapping[calculationType as CalculationType]
            ).filter(([key, _value]) =>
              co2DownstreamFields.has(key)
                ? co2DownstreamCalculationPossible
                : true
            )
          : Object.entries(
              mandatoryFieldMapping[calculationType as CalculationType]
            ).filter(([key, _value]) =>
              co2DownstreamFields.has(key)
                ? co2DownstreamCalculationPossible
                : true
            );

      result = { ...mapCalculationFields(result, fieldMapping) };
    }

    return result;
  }
);

const mapCalculationFields = (
  result: {
    required: CalculationParameterGroup[];
    preset: CalculationParameterGroup[];
  },
  entries: [string, boolean][]
): {
  required: CalculationParameterGroup[];
  preset: CalculationParameterGroup[];
} => {
  for (const entry of entries) {
    const fieldName = entry[0] as CalculationParameterGroup;
    const isMandatory = entry[1] as boolean;

    if (isMandatory) {
      // remove from preset list if present
      if (result.preset.includes(fieldName)) {
        result.preset.splice(result.preset.indexOf(fieldName), 1);
      }

      // add to required list if not alredy there
      if (!result.required.includes(fieldName)) {
        result.required.push(fieldName);
      }
    } else if (
      // add to preset list if not on either list
      !result.required.includes(fieldName) &&
      !result.preset.includes(fieldName)
    ) {
      result.preset.push(fieldName);
    }
  }

  return result;
};
