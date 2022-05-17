import {
  BomIdentifier,
  BomItem,
  CostComponentSplit,
  CostComponentSplitType,
  OdataBomIdentifier,
  RawMaterialAnalysis,
} from '@cdba/shared/models';
import { addCostShareOfParent } from '@cdba/shared/utils';
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
    const rawMaterialBomItems: BomItem[] = childrenOfSelectedBomItem?.filter(
      (item) =>
        item.materialCharacteristics?.type === 'ROH' &&
        item.itemCategory === 'M'
    );

    if (rawMaterialBomItems) {
      const aggregatedRawMaterials: Map<string, RawMaterialAnalysis> =
        new Map();

      rawMaterialBomItems.forEach((bomItem) => {
        if (aggregatedRawMaterials.has(bomItem.materialDesignation)) {
          // aggregate existing
          const rawMaterialAnalysis = aggregatedRawMaterials.get(
            bomItem.materialDesignation
          );
          rawMaterialAnalysis.operatingWeight += bomItem.quantities.quantity;
          rawMaterialAnalysis.totalCosts += bomItem.costing.costAreaTotalValue;

          // eslint-disable-next-line no-console
          console.assert(
            rawMaterialAnalysis.supplier ===
              bomItem.procurement.vendorDescription,
            'vendor differs'
          );

          // eslint-disable-next-line no-console
          console.assert(
            rawMaterialAnalysis.unitOfWeight ===
              bomItem.quantities.baseUnitOfMeasure,
            'unit of measure differs'
          );
        } else {
          const rawMaterialAnalysis: RawMaterialAnalysis = {
            materialDesignation: bomItem.materialDesignation,
            materialNumber: bomItem.materialNumber,
            costShare: undefined,
            supplier: bomItem.procurement.vendorDescription,
            operatingWeight: bomItem.quantities.quantity,
            unitOfWeight: bomItem.quantities.baseUnitOfMeasure,
            price: undefined,
            totalCosts: bomItem.costing.costAreaTotalValue,
            currency: bomItem.costing.costAreaCurrency,
          };

          aggregatedRawMaterials.set(
            rawMaterialAnalysis.materialDesignation,
            rawMaterialAnalysis
          );
        }
      });

      return [...aggregatedRawMaterials.values()].map((analysis) => ({
        ...analysis,
        costShare:
          analysis.totalCosts / selectedBomItem.costing.costAreaTotalValue,
        price: calculatePricePerKg(
          analysis.totalCosts,
          analysis.operatingWeight,
          analysis.unitOfWeight
        ),
      }));
    } else {
      return undefined;
    }
  }
);

const calculatePricePerKg = (
  totalCosts: number,
  operatingWeight: number,
  unitOfDimension: string
): number =>
  unitOfDimension === 'G'
    ? (totalCosts / operatingWeight) * 1000
    : totalCosts / operatingWeight;

export const getRawMaterialAnalysisSummaryForSelectedBom = createSelector(
  getRawMaterialAnalysisForSelectedBomItem,
  (rawMaterialAnalysisData: RawMaterialAnalysis[]): RawMaterialAnalysis[] =>
    rawMaterialAnalysisData?.length > 0
      ? [
          {
            materialDesignation: undefined,
            materialNumber: undefined,
            costShare: undefined,
            supplier: undefined,
            operatingWeight: undefined,
            unitOfWeight: undefined,
            price: undefined,
            currency: rawMaterialAnalysisData[0].currency,
            totalCosts: rawMaterialAnalysisData
              .map((item) => item.totalCosts)
              .reduce(
                (current: number, previous: number) => previous + current
              ),
          },
        ]
      : undefined
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
