import { createSelector } from '@ngrx/store';

import { CalculationParameterField, CalculationType } from '../../models';
import { getCalculationTypes } from './calculation-types.selector';

const mandatoryFieldMapping: Record<
  CalculationType,
  Partial<Record<CalculationParameterField, boolean>>
> = {
  ratingLife: {
    rpm: true,
    load: true,
    time: false,
    lubrication: false,
    contamination: false,
    operatingTemperature: false,
  },
  frictionalPowerloss: {
    rpm: true,
    load: true,
    lubrication: true,
    time: false,
    operatingTemperature: false,
    contamination: false,
  },
  lubrication: {
    lubrication: true,
    rpm: true,
    ambientTemperature: true,
    operatingTemperature: true,
    load: true,
  },
  emission: {
    rpm: true,
    load: true,
    time: false,
    lubrication: false,
    energySource: false,
    operatingTemperature: false,
  },
  overrollingFrequency: {
    rotatingCondition: true,
    rpm: true,
    load: true,
  },
};

export const getCalculationFieldsConfig = createSelector(
  getCalculationTypes,
  (
    state
  ): {
    required: CalculationParameterField[];
    optional: CalculationParameterField[];
  } => {
    const result = {
      required: [] as CalculationParameterField[],
      optional: [] as CalculationParameterField[],
    };

    for (const [calculationType, value] of Object.entries(state)) {
      if (!value.selected || !value.visible) {
        continue;
      }

      const fieldMapping =
        mandatoryFieldMapping[calculationType as CalculationType];

      for (const entry of Object.entries(fieldMapping)) {
        const fieldName = entry[0] as CalculationParameterField;
        const isMandatory = entry[1] as boolean;

        if (isMandatory) {
          // remove from optional list if present
          if (result.optional.includes(fieldName)) {
            result.optional.splice(result.optional.indexOf(fieldName), 1);
          }

          // add to required list if not alredy there
          if (!result.required.includes(fieldName)) {
            result.required.push(fieldName);
          }
        } else if (
          // add to optional list if not on either list
          !result.required.includes(fieldName) &&
          !result.optional.includes(fieldName)
        ) {
          result.optional.push(fieldName);
        }
      }
    }

    return result;
  }
);
