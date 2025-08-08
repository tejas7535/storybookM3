import { createSelector } from '@ngrx/store';

import { getCompareState } from '@cdba/core/store/reducers';
import { BomIdentifier, Calculation } from '@cdba/shared/models';

import { CompareState } from '../../reducers/compare.reducer';

export const getBomIdentifierForSelectedCalculation = (props: {
  index: number;
}) =>
  createSelector(getCompareState, (state: CompareState): BomIdentifier => {
    const calculation = state[props.index]?.calculations?.selected;

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
  });

export const getCalculations = (props: { index: number }) =>
  createSelector(
    getCompareState,
    (state: CompareState): Calculation[] =>
      state[props.index]?.calculations?.items
  );

export const getCalculationsLoading = (props: { index: number }) =>
  createSelector(
    getCompareState,
    (state: CompareState) => state[props.index]?.calculations?.loading
  );

export const getCalculationsError = (props: { index: number }) =>
  createSelector(
    getCompareState,
    (state: CompareState) => state[props.index]?.calculations?.errorMessage
  );

export const getSelectedCalculationNodeId = (props: { index: number }) =>
  createSelector(getCompareState, (state: CompareState): string[] =>
    state[props.index]?.calculations?.selectedNodeId
      ? [state[props.index].calculations.selectedNodeId]
      : undefined
  );

export const getSelectedCalculation = (props: { index: number }) =>
  createSelector(
    getCompareState,
    (state: CompareState): Calculation =>
      state[props.index]?.calculations?.selected
  );

export const getSelectedCalculations = createSelector(
  getCompareState,
  (state: CompareState): Calculation[] => [
    state[0]?.calculations?.selected,
    state[1]?.calculations?.selected,
  ]
);
