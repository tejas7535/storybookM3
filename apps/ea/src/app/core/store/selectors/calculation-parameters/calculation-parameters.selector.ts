import { CalculationParameters } from '@ea/shared/models';
import { CALCULATION_PARAMETERS_MOCK } from '@ea/testing/mocks';
import { createSelector } from '@ngrx/store';

import { getCalculationParametersState } from '../../reducers';

export const getCalculationParameters = createSelector(
  getCalculationParametersState,
  (_state): CalculationParameters => CALCULATION_PARAMETERS_MOCK
);
