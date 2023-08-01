import { createSelector } from '@ngrx/store';

import { CalculationParameterGroup, CalculationType } from '../../models';
import { getCalculationTypes } from './calculation-types.selector';

const mandatoryFieldMapping: Record<
  CalculationType,
  Partial<Record<CalculationParameterGroup, boolean>>
> = {
  ratingLife: {
    load: true,
    rotatingCondition: true,
    time: false,
    lubrication: false,
    contamination: false,
    operatingTemperature: false,
  },
  frictionalPowerloss: {
    load: true,
    rotatingCondition: true,
    lubrication: true,
    time: false,
    operatingTemperature: false,
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
    time: false,
    lubrication: false,
    energySource: false,
    operatingTemperature: false,
  },
  overrollingFrequency: {
    load: true,
    rotatingCondition: true,
    conditionOfRotation: true,
  },
};

export const getCalculationFieldsConfig = createSelector(
  getCalculationTypes,
  (
    state
  ): {
    required: CalculationParameterGroup[];
    preset: CalculationParameterGroup[];
  } => {
    const result = {
      required: [] as CalculationParameterGroup[],
      preset: [] as CalculationParameterGroup[],
    };

    for (const [calculationType, value] of Object.entries(state)) {
      if (!value.selected || !value.visible) {
        continue;
      }

      const fieldMapping =
        mandatoryFieldMapping[calculationType as CalculationType];

      for (const entry of Object.entries(fieldMapping)) {
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
    }

    return result;
  }
);
