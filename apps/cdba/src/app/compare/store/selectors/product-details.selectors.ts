import { createSelector } from '@ngrx/store';

import { getCompareState } from '@cdba/core/store/reducers';
import {
  AdditionalInformationDetails,
  DimensionAndWeightDetails,
  ReferenceTypeIdentifier,
} from '@cdba/shared/models';

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
        salesOrganizationDetails,
        plannedQuantities,
        actualQuantities,
      } = referenceType;

      return {
        plant,
        procurementType,
        salesOrganizationDetails,
        plannedQuantities,
        actualQuantities,
      };
    }

    return undefined;
  }
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
