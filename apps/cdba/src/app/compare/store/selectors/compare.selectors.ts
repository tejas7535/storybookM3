import { getCompareState } from '@cdba/core/store/reducers';
import {
  AdditionalInformationDetails,
  BomIdentifier,
  BomItem,
  Calculation,
  CostComponentSplit,
  CostComponentSplitType,
  DimensionAndWeightDetails,
  OdataBomIdentifier,
  ReferenceTypeIdentifier,
} from '@cdba/shared/models';
import { addCostShareOfParent } from '@cdba/shared/utils';
import { createSelector } from '@ngrx/store';

import { CompareState } from '../reducers/compare.reducer';

export const getSelectedReferenceTypeIdentifiers = createSelector(
  getCompareState,
  (state: CompareState): ReferenceTypeIdentifier[] =>
    Object.keys(state).map((index: string) => state[+index].referenceType)
);

export const getProductError = createSelector(
  getCompareState,
  (state: CompareState, index: number): string =>
    state[index]?.details?.errorMessage
);

export const getDimensionAndWeightDetails = createSelector(
  getCompareState,
  (state: CompareState, index: number): DimensionAndWeightDetails => {
    const referenceType = state[index]?.details?.item;

    return referenceType
      ? new DimensionAndWeightDetails(
          referenceType.height,
          referenceType.width,
          referenceType.length,
          referenceType.unitOfDimension,
          referenceType.volumeCubic,
          referenceType.volumeUnit,
          referenceType.weight,
          referenceType.weightUnit
        )
      : undefined;
  }
);

export const getAdditionalInformation = createSelector(
  getCompareState,
  (state: CompareState, index: number): AdditionalInformationDetails => {
    const referenceType = state[index]?.details?.item;

    if (referenceType) {
      const {
        plant,
        procurementType,
        salesOrganizations,
        plannedQuantities,
        actualQuantities,
      } = referenceType;

      return {
        plant,
        procurementType,
        salesOrganizations,
        plannedQuantities,
        actualQuantities,
      };
    }

    return undefined;
  }
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

export const getMaterialDesignation = createSelector(
  getCompareState,
  (state: CompareState, index: number) =>
    state[index]?.details?.item?.materialDesignation
);

export const getObjectsAreEqual = createSelector(
  getCompareState,
  (state: CompareState) =>
    state[0] &&
    state[1] &&
    state[0].referenceType.materialNumber ===
      state[1].referenceType.materialNumber
);
