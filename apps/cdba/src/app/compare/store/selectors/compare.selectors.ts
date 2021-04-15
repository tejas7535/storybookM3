import { createSelector } from '@ngrx/store';

import { getCompareState } from '@cdba/core/store/reducers';

import {
  BomIdentifier,
  ReferenceTypeIdentifier,
} from '../../../core/store/reducers/detail/models';
import { CompareState } from '../reducers/compare.reducer';

export const getSelectedReferenceTypeIdentifier = createSelector(
  getCompareState,
  (state: CompareState, props: { index: number }): ReferenceTypeIdentifier =>
    state[props.index]?.referenceType
);

export const getSelectedReferenceTypeIdentifiers = createSelector(
  getCompareState,
  (state: CompareState): ReferenceTypeIdentifier[] =>
    Object.keys(state).map((index: string) => state[+index]?.referenceType)
);

export const getBomIdentifierForSelectedCalculation = createSelector(
  getCompareState,
  (state: CompareState, props: { index: number }): BomIdentifier => {
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
        bomCostingDate,
        bomCostingNumber,
        bomCostingType,
        bomCostingVersion,
        bomEnteredManually,
        bomReferenceObject,
        bomValuationVariant,
      };
    }

    return undefined;
  }
);

export const getBomItems = createSelector(
  getCompareState,
  (state: CompareState, index: number) => state[index]?.billOfMaterial?.items
);

export const getBomLoading = createSelector(
  getCompareState,
  (state: CompareState, index: number) => state[index]?.billOfMaterial?.loading
);

export const getBomErrorMessage = createSelector(
  getCompareState,
  (state: CompareState, index: number) =>
    state[index]?.billOfMaterial?.error.message
);
