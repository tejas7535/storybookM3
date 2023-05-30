import { createSelector } from '@ngrx/store';

import {
  CustomerDetails,
  DimensionAndWeightDetails,
  PriceDetails,
  ProductionDetails,
  QuantitiesDetails,
  ReferenceType,
  ReferenceTypeIdentifier,
  SalesDetails,
} from '@cdba/shared/models';

import { getDetailState } from '../../reducers';
import { DetailState } from '../../reducers/detail/detail.reducer';

export const getReferenceType = createSelector(
  getDetailState,
  (state: DetailState): ReferenceType => state.detail.referenceType
);

export const getReferenceTypeLoading = createSelector(
  getDetailState,
  (state: DetailState) => state.detail.loading
);

export const getReferenceTypeError = createSelector(
  getDetailState,
  (state: DetailState) => state.detail.errorMessage
);

export const getMaterialDesignation = createSelector(
  getDetailState,
  (state: DetailState) => state?.detail.referenceType?.materialDesignation
);

export const getSalesDetails = createSelector(
  getReferenceType,
  (referenceType: ReferenceType): SalesDetails =>
    referenceType
      ? new SalesDetails(
          referenceType.materialNumber,
          referenceType.materialDesignation,
          referenceType.materialShortDescription,
          referenceType.productLine,
          referenceType.pcmCalculations?.[0]?.rfq,
          referenceType.salesOrganizations,
          referenceType.salesOrganizationsDescriptions,
          referenceType.pcmCalculations?.[0]?.projectName,
          referenceType.productDescription,
          referenceType.materialClass,
          referenceType.materialClassDescription
        )
      : undefined
);

export const getPriceDetails = createSelector(
  getReferenceType,
  (referenceType: ReferenceType): PriceDetails =>
    referenceType
      ? new PriceDetails(
          referenceType.pcmCalculations,
          referenceType.sqvSapLatestMonth,
          referenceType.sqvDate,
          referenceType.gpcLatestYear,
          referenceType.gpcDate,
          referenceType.puUm,
          referenceType.currency,
          referenceType.averagePrices && referenceType.averagePrices.length > 0
            ? referenceType.averagePrices[0]
            : undefined
        )
      : undefined
);

export const getDimensionAndWeightDetails = createSelector(
  getReferenceType,
  (referenceType: ReferenceType): DimensionAndWeightDetails =>
    referenceType
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
      : undefined
);

export const getCustomerDetails = createSelector(
  getReferenceType,
  (referenceType: ReferenceType) =>
    referenceType
      ? new CustomerDetails(
          referenceType.customers,
          referenceType.customerGroups
        )
      : undefined
);

export const getQuantitiesDetails = createSelector(
  getReferenceType,
  (referenceType: ReferenceType): QuantitiesDetails =>
    referenceType
      ? new QuantitiesDetails(
          referenceType.pcmCalculations,
          referenceType.netSales,
          referenceType.budgetQuantityCurrentYear,
          referenceType.budgetQuantitySoco,
          referenceType.actualQuantities,
          referenceType.plannedQuantities,
          referenceType.currency
        )
      : undefined
);

export const getProductionDetails = createSelector(
  getReferenceType,
  (referenceType: ReferenceType): ProductionDetails =>
    referenceType
      ? new ProductionDetails(
          referenceType.procurementType,
          referenceType.plant,
          referenceType.specialProcurement,
          referenceType.purchasePriceValidFrom,
          referenceType.purchasePriceValidUntil,
          referenceType.supplier
        )
      : undefined
);

export const getSelectedReferenceTypeIdentifier = createSelector(
  getDetailState,
  (state: DetailState): ReferenceTypeIdentifier => state.selectedReferenceType
);
