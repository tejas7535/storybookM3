import { createSelector } from '@ngrx/store';

import { CalculationParametersOperationConditions } from '../../models';
import { getCalculationParametersState } from '../../reducers';

export const getOperationConditions = createSelector(
  getCalculationParametersState,
  (state): CalculationParametersOperationConditions => state.operationConditions
);

export const isCalculationMissingInput = createSelector(
  getCalculationParametersState,
  (state): boolean => state.isInputInvalid
);

export const getSelectedLoadcaseId = createSelector(
  getOperationConditions,
  (operationConditions) => operationConditions.selectedLoadcase
);

export const getLoadcases = createSelector(
  getOperationConditions,
  (operationConditions) =>
    operationConditions.loadCaseData.map(({ loadCaseName }, index) => ({
      index,
      loadCaseName,
    }))
);

export const getLoadcaseCount = createSelector(
  getLoadcases,
  (loadcases) => loadcases.length
);

export const getSelectedLoadcase = createSelector(
  getLoadcases,
  getSelectedLoadcaseId,
  (loadcases, selectedLoadcase) => loadcases[selectedLoadcase]
);
