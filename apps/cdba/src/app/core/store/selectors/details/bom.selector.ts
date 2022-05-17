import {
  BomIdentifier,
  BomItem,
  CostComponentSplit,
  CostComponentSplitType,
  OdataBomIdentifier,
  RawMaterialAnalysis,
} from '@cdba/shared/models';
import {
  addCostShareAndPriceValuesToRawMaterialAnalyses,
  addCostShareOfParent,
  extractRawMaterials,
  getRawMaterialAnalysisSummary,
  mapBomItemsToRawMaterialAnalyses,
} from '@cdba/shared/utils';
import { createSelector } from '@ngrx/store';

import { getDetailState } from '../../reducers';
import { DetailState } from '../../reducers/detail/detail.reducer';

export const getBomItems = createSelector(
  getDetailState,
  (state: DetailState) => state.bom.items
);

export const getBomLoading = createSelector(
  getDetailState,
  (state: DetailState) => state.bom.loading
);

export const getBomError = createSelector(
  getDetailState,
  (state: DetailState) => state.bom.errorMessage
);

export const getDirectChildrenOfSelectedBomItem = createSelector(
  getDetailState,
  (state: DetailState): BomItem[] =>
    state.bom.items
      ? state.bom.items
          .filter(
            (item: BomItem) =>
              item.predecessorsInTree[item.predecessorsInTree.length - 2] ===
                state.bom.selectedItem.materialDesignation &&
              item.level === state.bom.selectedItem.level + 1
          )
          .map((item) => addCostShareOfParent(item, state.bom.selectedItem))
      : undefined
);

export const getSelectedBomItem = createSelector(
  getDetailState,
  (state: DetailState): BomItem => state.bom.selectedItem
);

export const getAllChildrenOfSelectedBomItem = createSelector(
  getSelectedBomItem,
  getDetailState,
  (selectedBomItem: BomItem, state: DetailState): BomItem[] => {
    if (state.bom.items && selectedBomItem) {
      const allBomItems = state.bom.items;
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

export const getBomIdentifierForSelectedBomItem = createSelector(
  getSelectedBomItem,
  (selectedBomItem: BomItem): OdataBomIdentifier =>
    selectedBomItem?.bomIdentifier
);

export const getRawMaterialAnalysisForSelectedBomItem = createSelector(
  getSelectedBomItem,
  getAllChildrenOfSelectedBomItem,
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

export const getRawMaterialAnalysisSummaryForSelectedBom = createSelector(
  getRawMaterialAnalysisForSelectedBomItem,
  (rawMaterialAnalysisData: RawMaterialAnalysis[]): RawMaterialAnalysis[] =>
    getRawMaterialAnalysisSummary(rawMaterialAnalysisData)
);

export const getCostComponentSplitItems = createSelector(
  getDetailState,
  (state: DetailState): CostComponentSplit[] =>
    state.costComponentSplit.items?.filter(
      (item) => item.splitType === state.costComponentSplit.selectedSplitType
    )
);

export const getCostComponentSplitLoading = createSelector(
  getDetailState,
  (state: DetailState) => state.costComponentSplit.loading
);

export const getCostComponentSplitError = createSelector(
  getDetailState,
  (state: DetailState) => state.costComponentSplit.errorMessage
);

export const getCostComponentSplitSummary = createSelector(
  getDetailState,
  (state: DetailState): CostComponentSplit[] =>
    state.costComponentSplit.items?.filter((item) => item.splitType === 'TOTAL')
);

export const getSelectedSplitType = createSelector(
  getDetailState,
  (state: DetailState): CostComponentSplitType =>
    state.costComponentSplit.selectedSplitType
);

export const getBomIdentifierForSelectedCalculation = createSelector(
  getDetailState,
  (state: DetailState): BomIdentifier => {
    const calculation = state.calculations.selectedCalculation?.calculation;

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
