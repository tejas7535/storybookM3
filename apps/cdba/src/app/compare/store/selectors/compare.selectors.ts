import { getCompareState } from '@cdba/core/store/reducers';
import { DimensionAndWeightDetails } from '@cdba/detail/detail-tab/dimension-and-weight/model/dimension-and-weight-details.model';
import {
  BomIdentifier,
  BomItem,
  Calculation,
  ReferenceTypeIdentifier,
} from '@cdba/shared/models';
import { createSelector } from '@ngrx/store';

import { AdditionalInformation } from '../../details-tab/additional-information-widget/additional-information.model';
import { CompareState } from '../reducers/compare.reducer';

export const getSelectedReferenceTypeIdentifiers = createSelector(
  getCompareState,
  (state: CompareState): ReferenceTypeIdentifier[] =>
    Object.keys(state).map((index: string) => state[+index].referenceType)
);

export const getProductError = createSelector(
  getCompareState,
  (state: CompareState, index: number): string => state[index]?.details?.error
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
  (state: CompareState, index: number): AdditionalInformation => {
    const referenceType = state[index]?.details?.item;

    if (referenceType) {
      const {
        plant,
        procurementType,
        salesOrganization,
        plannedQuantities,
        actualQuantities,
      } = referenceType;

      return {
        plant,
        procurementType,
        salesOrganization,
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
  (state: CompareState, index: number) => state[index]?.calculations?.error
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
  (state: CompareState, index: number) => state[index]?.billOfMaterial?.error
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
