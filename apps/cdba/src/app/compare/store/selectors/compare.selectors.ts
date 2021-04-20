import { createSelector } from '@ngrx/store';

import { getCompareState } from '@cdba/core/store/reducers';
import {
  BomIdentifier,
  BomItem,
  Calculation,
  ReferenceTypeIdentifier,
} from '@cdba/shared/models';

import { CompareState } from '../reducers/compare.reducer';

export const getSelectedReferenceTypeIdentifiers = createSelector(
  getCompareState,
  (state: CompareState): ReferenceTypeIdentifier[] =>
    Object.keys(state).map((index: string) => state[+index].referenceType)
);

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

export const getCalculations = createSelector(
  getCompareState,
  (state: CompareState, index: number): Calculation[] =>
    state[index]?.calculations?.items
);

export const getCalculationsLoading = createSelector(
  getCompareState,
  (state: CompareState, index: number) => state[index]?.calculations?.loading
);

export const getCalculationsErrorMessage = createSelector(
  getCompareState,
  (state: CompareState, index: number) =>
    state[index]?.calculations?.error?.message
);

export const getSelectedCalculationNodeId = createSelector(
  getCompareState,
  (state: CompareState, index: number): string =>
    state[index]?.calculations?.selectedNodeId
);

export const getSelectedCalculation = createSelector(
  getCompareState,
  (state: CompareState, index: number): Calculation =>
    state[index]?.calculations?.selected
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
    state[index]?.billOfMaterial?.error?.message
);

export const getChildrenOfSelectedBomItem = createSelector(
  getCompareState,
  (state: CompareState, index: number): BomItem[] =>
    state[index]?.billOfMaterial?.selected
      ? state[index].billOfMaterial.items.filter(
          (item: BomItem) =>
            item.predecessorsInTree[item.predecessorsInTree.length - 2] ===
            state[index].billOfMaterial.selected.materialDesignation
        )
      : undefined
);

// TODO: refactor to use materialDesignation from details (earlier available)
export const getMaterialDesignation = createSelector(
  getCompareState,
  (state: CompareState, index: number) => {
    const bomItems = state[index]?.billOfMaterial?.items;

    if (bomItems && bomItems[0]) {
      return bomItems[0].materialDesignation;
    }

    return undefined;
  }
);
