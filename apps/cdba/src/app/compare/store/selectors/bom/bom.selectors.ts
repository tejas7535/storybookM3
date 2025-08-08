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

import { CompareState } from '../..';

export const getBomItems = (props: { index: number }) =>
  createSelector(
    getCompareState,
    (state: CompareState) => state[props.index]?.billOfMaterial?.items
  );

export const getBomLoading = (props: { index: number }) =>
  createSelector(
    getCompareState,
    (state: CompareState) => state[props.index]?.billOfMaterial?.loading
  );

export const getBomError = (props: { index: number }) =>
  createSelector(
    getCompareState,
    (state: CompareState) => state[props.index]?.billOfMaterial?.errorMessage
  );

export const getDirectChildrenOfSelectedBomItem = (props: { index: number }) =>
  createSelector(getCompareState, (state: CompareState): BomItem[] =>
    state[props.index]?.billOfMaterial?.selected
      ? state[props.index].billOfMaterial.items.filter(
          (item) =>
            item.predecessorsInTree.at(-2) ===
              state[props.index].billOfMaterial.selected.materialDesignation &&
            item.level === state[props.index].billOfMaterial.selected.level + 1
        )
      : undefined
  );

export const getSelectedBomItem = (props: { index: number }) =>
  createSelector(
    getCompareState,
    (state: CompareState): BomItem =>
      state[props.index]?.billOfMaterial?.selected
  );

export const getComparingBoms = createSelector(
  getCompareState,
  (state: CompareState) => [state[0]?.billOfMaterial, state[1]?.billOfMaterial]
);

export const areBomIdentifiersForSelectedBomItemsLoaded = createSelector(
  getCompareState,
  (state: CompareState): boolean =>
    state[0]?.billOfMaterial?.selected?.bomIdentifier !== undefined &&
    state[1]?.billOfMaterial?.selected?.bomIdentifier !== undefined
);

export const getBomIdentifiersForSelectedBomItems = createSelector(
  getCompareState,
  (state: CompareState): BomIdentifier[] => [
    state[0].billOfMaterial.selected.bomIdentifier,
    state[1].billOfMaterial.selected.bomIdentifier,
  ]
);

export const areBomItemsValidForComparison = createSelector(
  getCompareState,
  (state: CompareState): boolean =>
    [0, 1].every(
      (i) =>
        !state[i].billOfMaterial?.loading &&
        !!state[i].billOfMaterial?.items?.length
    )
);

export const getBomIdentifierForSelectedBomItem = (props: { index: number }) =>
  createSelector(
    getSelectedBomItem(props),
    (selectedBomItem: BomItem): BomIdentifier => selectedBomItem?.bomIdentifier
  );

export const getAllChildrenOfSelectedBomItem = (props: { index: number }) =>
  createSelector(
    getSelectedBomItem(props),
    getCompareState,
    (selectedBomItem: BomItem, state: CompareState): BomItem[] => {
      if (state[props.index]?.billOfMaterial?.items && selectedBomItem) {
        const allBomItems = state[props.index].billOfMaterial.items;
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

export const getRawMaterialAnalysisForSelectedBomItem = (props: {
  index: number;
}) =>
  createSelector(
    getSelectedBomItem(props),
    getAllChildrenOfSelectedBomItem(props),
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

export const getRawMaterialAnalysisSummaryForSelectedBom = (props: {
  index: number;
}) =>
  createSelector(
    getRawMaterialAnalysisForSelectedBomItem(props),
    (rawMaterialAnalysisData: RawMaterialAnalysis[]): RawMaterialAnalysis[] =>
      getRawMaterialAnalysisSummary(rawMaterialAnalysisData)
  );

export const getCostComponentSplitItems = (props: { index: number }) =>
  createSelector(
    getCompareState,
    (state: CompareState): CostComponentSplit[] =>
      state[props.index]?.costComponentSplit?.items
        ? state[props.index].costComponentSplit.items.filter(
            (item) =>
              item.splitType ===
              state[props.index].costComponentSplit.selectedSplitType
          )
        : undefined
  );

export const getCostComponentSplitLoading = (props: { index: number }) =>
  createSelector(
    getCompareState,
    (state: CompareState) => state[props.index]?.costComponentSplit?.loading
  );

export const getCostComponentSplitError = (props: { index: number }) =>
  createSelector(
    getCompareState,
    (state: CompareState) =>
      state[props.index]?.costComponentSplit?.errorMessage
  );

export const getCostComponentSplitSummary = (props: { index: number }) =>
  createSelector(getCompareState, (state: CompareState): CostComponentSplit[] =>
    state[props.index]?.costComponentSplit?.items?.filter(
      (item) => item.splitType === 'TOTAL'
    )
  );

export const getSelectedSplitType = (props: { index: number }) =>
  createSelector(
    getCompareState,
    (state: CompareState): CostComponentSplitType =>
      state[props.index]?.costComponentSplit?.selectedSplitType
  );
