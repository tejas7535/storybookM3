import { createSelector } from '@ngrx/store';

import { getCompareState } from '@cdba/core/store/reducers';
import { BomIdentifier, Calculation } from '@cdba/shared/models';

import { CompareState } from '../reducers/compare.reducer';

export const getBomIdentifierForSelectedCalculation = createSelector(
  getCompareState,
  (state: CompareState, index: number): BomIdentifier => {
    const calculation = state[index]?.calculations?.selected;

    if (calculation) {
      const {
        bomCostingDate,
        bomCostingNumber,
        bomCostingType,
        bomCostingVersion,
        bomEnteredManually,
        bomReferenceObject,
        bomValuationVariant,
      } = calculation;

      return {
        costingDate: bomCostingDate,
        costingNumber: bomCostingNumber,
        costingType: bomCostingType,
        version: bomCostingVersion,
        enteredManually: bomEnteredManually,
        referenceObject: bomReferenceObject,
        valuationVariant: bomValuationVariant,
      };
    }

    return undefined;
  }
);

export const getCalculations = createSelector(
  getCompareState,
  (state: CompareState, index: number): Calculation[] =>
    state[index]?.calculations?.items
);

export const getCalculationsLoading = createSelector(
  getCompareState,
  (state: CompareState, index: number) => state[index]?.calculations?.loading
);

export const getCalculationsError = createSelector(
  getCompareState,
  (state: CompareState, index: number) =>
    state[index]?.calculations?.errorMessage
);

export const getSelectedCalculationNodeId = createSelector(
  getCompareState,
  (state: CompareState, index: number): string[] =>
    state[index]?.calculations?.selectedNodeId
      ? [state[index].calculations.selectedNodeId]
      : undefined
);

export const getSelectedCalculation = createSelector(
  getCompareState,
  (state: CompareState, index: number): Calculation =>
    state[index]?.calculations?.selected
);
