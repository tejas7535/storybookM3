import { createSelector } from '@ngrx/store';

import { getCompareState } from '@cdba/core/store/reducers';
import {
  AdditionalInformationDetails,
  DimensionAndWeightDetails,
  ReferenceTypeIdentifier,
} from '@cdba/shared/models';

import { CompareState } from '../../reducers/compare.reducer';

export const getSelectedReferenceTypeIdentifiers = createSelector(
  getCompareState,
  (state: CompareState): ReferenceTypeIdentifier[] => {
    if (state['0'] && state['1']) {
      return [state['0'].referenceType, state['1'].referenceType];
    }

    return [];
  }
);

export const getProductError = (props: { index: number }) =>
  createSelector(
    getCompareState,
    (state: CompareState): string => state[props.index]?.details?.errorMessage
  );

export const getDimensionAndWeightDetails = (props: { index: number }) =>
  createSelector(
    getCompareState,
    (state: CompareState): DimensionAndWeightDetails => {
      const referenceType = state[props.index]?.details?.item;

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

export const getAdditionalInformation = (props: { index: number }) =>
  createSelector(
    getCompareState,
    (state: CompareState): AdditionalInformationDetails => {
      const referenceType = state[props.index]?.details?.item;

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

export const getMaterialDesignation = (props: { index: number }) =>
  createSelector(
    getCompareState,
    (state: CompareState) =>
      state[props.index]?.details?.item?.materialDesignation
  );

export const getObjectsAreEqual = createSelector(
  getCompareState,
  (state: CompareState) =>
    state[0] &&
    state[1] &&
    state[0].referenceType.materialNumber ===
      state[1].referenceType.materialNumber
);
