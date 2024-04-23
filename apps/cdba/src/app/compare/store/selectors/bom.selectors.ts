import { createSelector } from '@ngrx/store';

import { getCompareState } from '@cdba/core/store/reducers';
import {
  BomIdentifier,
  BomItem,
  CostComponentSplit,
  CostComponentSplitType,
  RawMaterialAnalysis,
} from '@cdba/shared/models';
import {
  addCostShareAndPriceValuesToRawMaterialAnalyses,
  extractRawMaterials,
  getRawMaterialAnalysisSummary,
  mapBomItemsToRawMaterialAnalyses,
} from '@cdba/shared/utils';

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

export const getDirectChildrenOfSelectedBomItem = (index: number) =>
  createSelector(getCompareState, (state: CompareState): BomItem[] =>
    state[index]?.billOfMaterial?.selected
      ? state[index].billOfMaterial.items.filter(
          (item) =>
            item.predecessorsInTree.at(-2) ===
              state[index].billOfMaterial.selected.materialDesignation &&
            item.level === state[index].billOfMaterial.selected.level + 1
        )
      : undefined
  );

export const getSelectedBomItem = (index: number) =>
  createSelector(
    getCompareState,
    (state: CompareState): BomItem => state[index]?.billOfMaterial?.selected
  );

export const getBomIdentifierForSelectedBomItem = (index: number) =>
  createSelector(
    getSelectedBomItem(index),
    (selectedBomItem: BomItem): BomIdentifier => selectedBomItem?.bomIdentifier
  );

export const getAllChildrenOfSelectedBomItem = (index: number) =>
  createSelector(
    getSelectedBomItem(index),
    getCompareState,
    (selectedBomItem: BomItem, state: CompareState): BomItem[] => {
      if (state[index]?.billOfMaterial?.items && selectedBomItem) {
        const allBomItems = state[index].billOfMaterial.items;
        const allChildren: BomItem[] = [];

        for (
          let i = allBomItems.indexOf(selectedBomItem) + 1;
          i < allBomItems.length;
          i += 1
        ) {
          if (allBomItems[i].level <= selectedBomItem.level) {
            break;
          } else {
            allChildren.push(allBomItems[i]);
          }
        }

        return allChildren;
      } else {
        return undefined;
      }
    }
  );

export const getRawMaterialAnalysisForSelectedBomItem = (index: number) =>
  createSelector(
    getSelectedBomItem(index),
    getAllChildrenOfSelectedBomItem(index),
    (
      selectedBomItem: BomItem,
      childrenOfSelectedBomItem: BomItem[]
    ): RawMaterialAnalysis[] => {
      if (selectedBomItem && childrenOfSelectedBomItem) {
        const rawMaterialBomItems: BomItem[] = extractRawMaterials(
          childrenOfSelectedBomItem
        );

        if (rawMaterialBomItems) {
          const aggregatedRawMaterialAnalyses: RawMaterialAnalysis[] =
            mapBomItemsToRawMaterialAnalyses(rawMaterialBomItems);

          return addCostShareAndPriceValuesToRawMaterialAnalyses(
            aggregatedRawMaterialAnalyses,
            selectedBomItem
          );
        } else {
          return undefined;
        }
      } else {
        return undefined;
      }
    }
  );

export const getRawMaterialAnalysisSummaryForSelectedBom = (index: number) =>
  createSelector(
    getRawMaterialAnalysisForSelectedBomItem(index),
    (rawMaterialAnalysisData: RawMaterialAnalysis[]): RawMaterialAnalysis[] =>
      getRawMaterialAnalysisSummary(rawMaterialAnalysisData)
  );

export const getCostComponentSplitItems = (index: number) =>
  createSelector(
    getCompareState,
    (state: CompareState): CostComponentSplit[] =>
      state[index]?.costComponentSplit?.items
        ? state[index].costComponentSplit.items.filter(
            (item) =>
              item.splitType ===
              state[index].costComponentSplit.selectedSplitType
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
