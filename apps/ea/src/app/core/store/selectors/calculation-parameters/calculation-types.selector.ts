import { createSelector } from '@ngrx/store';

import {
  CalculationParametersCalculationTypeConfig,
  CalculationParametersCalculationTypes,
} from '../../models';
import { getCalculationParametersState } from '../../reducers';

export const getCalculationTypes = createSelector(
  getCalculationParametersState,
  (state): CalculationParametersCalculationTypes => state.calculationTypes
);

export const getCalculationTypesGlobalSelectionState = createSelector(
  getCalculationTypes,
  (state): { selectAll: boolean; indeterminate: boolean } => {
    const items = Object.values(state);

    if (items.every((item) => item.selected)) {
      return { selectAll: true, indeterminate: false };
    }

    if (items.every((item) => !item.selected)) {
      return { selectAll: false, indeterminate: false };
    }

    return { selectAll: true, indeterminate: true };
  }
);

export const getCalculationTypesConfig = createSelector(
  getCalculationTypes,
  (state): CalculationParametersCalculationTypeConfig[] =>
    [
      {
        name: 'ratingLife' as const,
        ...state.ratingLife,
        icon: 'animation',
        label: 'calculationTypes.ratingLife',
      },
      {
        name: 'frictionalPowerloss' as const,
        ...state.frictionalPowerloss,
        icon: 'compress',
        label: 'calculationTypes.frictionalPowerloss',
      },
      {
        name: 'lubrication' as const,
        ...state.lubrication,
        svgIcon: 'water_drop',
        label: 'calculationTypes.lubrication',
      },
      {
        name: 'emission' as const,
        ...state.emission,
        svgIcon: 'co2',
        label: 'calculationTypes.co2',
      },
      {
        name: 'overrollingFrequency' as const,
        ...state.overrollingFrequency,
        svgIcon: 'airwaves',
        label: 'calculationTypes.overrollingFrequency',
      },
    ].filter((item) => item.visible)
);
