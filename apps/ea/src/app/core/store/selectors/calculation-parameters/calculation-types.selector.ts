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
        name: 'emission' as const,
        ...state.emission,
        svgIcon: 'co2',
        label: 'calculationTypes.co2',
      },
      {
        name: 'friction' as const,
        ...state.friction,
        icon: 'compress',
        label: 'calculationTypes.frictionalPowerloss',
      },
    ].filter((item) => item.visible)
);
