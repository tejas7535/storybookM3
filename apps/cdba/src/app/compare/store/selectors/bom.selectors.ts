import { getCompareState } from '@cdba/core/store/reducers';
import {
  BomItem,
  CostComponentSplit,
  CostComponentSplitType,
  OdataBomIdentifier,
} from '@cdba/shared/models';
import { addCostShareOfParent } from '@cdba/shared/utils';
import { createSelector } from '@ngrx/store';

import { CompareState } from '../reducers/compare.reducer';

export const getBomItems = createSelector(
  getCompareState,
  (state: CompareState, index: number) => state[index]?.billOfMaterial?.items
);

export const getBomLoading = createSelector(
  getCompareState,
  (state: CompareState, index: number) => state[index]?.billOfMaterial?.loading
);

export const getBomError = createSelector(
  getCompareState,
  (state: CompareState, index: number) =>
    state[index]?.billOfMaterial?.errorMessage
);

export const getChildrenOfSelectedBomItem = (index: number) =>
  createSelector(getCompareState, (state: CompareState): BomItem[] =>
    state[index]?.billOfMaterial?.selected
      ? state[index].billOfMaterial.items
          .filter(
            (item) =>
              item.predecessorsInTree[item.predecessorsInTree.length - 2] ===
                state[index].billOfMaterial.selected.materialDesignation &&
              item.level === state[index].billOfMaterial.selected.level + 1
          )
          .map((item) =>
            addCostShareOfParent(item, state[index].billOfMaterial.selected)
          )
      : undefined
  );

export const getBomIdentifierForSelectedBomItem = (index: number) =>
  createSelector(
    getCompareState,
    (state: CompareState): OdataBomIdentifier =>
      state[index]?.billOfMaterial?.selected
        ? state[index].billOfMaterial.selected.bomIdentifier
        : undefined
  );

export const getCostComponentSplitItems = (index: number) =>
  createSelector(getCompareState, (state: CompareState): CostComponentSplit[] =>
    state[index]?.costComponentSplit?.items
      ? state[index].costComponentSplit.items.filter(
          (item) =>
            item.splitType === state[index].costComponentSplit.selectedSplitType
        )
      : undefined
  );

export const getCostComponentSplitLoading = (index: number) =>
  createSelector(
    getCompareState,
    (state: CompareState) => state[index]?.costComponentSplit?.loading
  );

export const getCostComponentSplitError = (index: number) =>
  createSelector(
    getCompareState,
    (state: CompareState) => state[index]?.costComponentSplit?.errorMessage
  );

export const getCostComponentSplitSummary = (index: number) =>
  createSelector(getCompareState, (state: CompareState): CostComponentSplit[] =>
    state[index]?.costComponentSplit?.items?.filter(
      (item) => item.splitType === 'TOTAL'
    )
  );

export const getSelectedSplitType = (index: number) =>
  createSelector(
    getCompareState,
    (state: CompareState): CostComponentSplitType =>
      state[index]?.costComponentSplit?.selectedSplitType
  );
