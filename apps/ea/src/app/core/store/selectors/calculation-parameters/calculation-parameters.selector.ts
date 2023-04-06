import { createSelector } from '@ngrx/store';

import {
  CalculationParametersEnergySource,
  CalculationParametersOperationConditions,
} from '../../models';
import { getCalculationParametersState } from '../../reducers';

export const getOperationConditions = createSelector(
  getCalculationParametersState,
  (state): CalculationParametersOperationConditions => state.operationConditions
);

export const getEnergySource = createSelector(
  getCalculationParametersState,
  (state): CalculationParametersEnergySource => state.energySource
);

export const isCalculationMissingInput = createSelector(
  getCalculationParametersState,
  (state): boolean =>
    state.operationConditions?.axialLoad === undefined ||
    state.operationConditions?.radialLoad === undefined ||
    state.operationConditions?.rotationalSpeed === undefined
);
