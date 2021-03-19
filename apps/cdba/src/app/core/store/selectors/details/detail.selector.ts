import { createSelector } from '@ngrx/store';

import { CustomerDetails } from '../../../../detail/detail-tab/customer/model/customer.details.model';
import { DimensionAndWeightDetails } from '../../../../detail/detail-tab/dimension-and-weight/model/dimension-and-weight-details.model';
import { PriceDetails } from '../../../../detail/detail-tab/pricing/model/price.details.model';
import { ProductionDetails } from '../../../../detail/detail-tab/production/model/production.details.model';
import { QuantitiesDetails } from '../../../../detail/detail-tab/quantities/model/quantities.model';
import { SalesDetails } from '../../../../detail/detail-tab/sales-and-description/model/sales-details.model';
import { getDetailState } from '../../reducers';
import { DetailState } from '../../reducers/detail/detail.reducer';
import {
  BomIdentifier,
  BomItem,
  ReferenceTypeIdentifier,
} from '../../reducers/detail/models';
import { ReferenceType } from '../../reducers/shared/models';
import { Calculation } from '../../reducers/shared/models/calculation.model';

export const getReferenceType = createSelector(
  getDetailState,
  (state: DetailState): ReferenceType => state.detail.referenceType
);

export const getReferenceTypeLoading = createSelector(
  getDetailState,
  (state: DetailState) => state.detail.loading
);

export const getReferenceTypeErrorMessage = createSelector(
  getDetailState,
  (state: DetailState) => state.detail.errorMessage
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
          referenceType.rfq,
          referenceType.salesOrganization,
          referenceType.projectName,
          referenceType.productDescription
        )
      : undefined
);

export const getPriceDetails = createSelector(
  getReferenceType,
  (referenceType: ReferenceType): PriceDetails =>
    referenceType
      ? new PriceDetails(
          referenceType.pcmSqv,
          referenceType.pcmCalculationDate,
          referenceType.sqvSapLatestMonth,
          referenceType.sqvDate,
          referenceType.gpcLatestYear,
          referenceType.gpcDate,
          referenceType.puUm,
          referenceType.currency,
          referenceType.averagePrices[0]
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
      ? new CustomerDetails(referenceType.customer, referenceType.customerGroup)
      : undefined
);

export const getQuantitiesDetails = createSelector(
  getReferenceType,
  (referenceType: ReferenceType): QuantitiesDetails =>
    referenceType
      ? new QuantitiesDetails(
          referenceType.pcmQuantity,
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
          referenceType.saleableItem,
          '', // TODO add productionTechnology and manufacturingProcess
          '',
          referenceType.specialProcurement,
          referenceType.purchasePriceValidFrom,
          referenceType.purchasePriceValidUntil,
          referenceType.supplier
        )
      : undefined
);

export const getCalculations = createSelector(
  getDetailState,
  (state: DetailState): Calculation[] => state.calculations.items
);

export const getCalculationsLoading = createSelector(
  getDetailState,
  (state: DetailState) => state.calculations.loading
);

export const getCalculationsErrorMessage = createSelector(
  getDetailState,
  (state: DetailState) => state.calculations.errorMessage
);

export const getBomItems = createSelector(
  getDetailState,
  (state: DetailState) => state.bom.items
);

export const getBomLoading = createSelector(
  getDetailState,
  (state: DetailState) => state.bom.loading
);

export const getBomErrorMessage = createSelector(
  getDetailState,
  (state: DetailState) => state.bom.errorMessage
);

export const getChildrenOfSelectedBomItem = createSelector(
  getDetailState,
  (state: DetailState): BomItem[] =>
    state.bom.items
      ? state.bom.items.filter(
          (item: BomItem) =>
            item.predecessorsInTree[item.predecessorsInTree.length - 2] ===
            state.bom.selectedItem.materialDesignation
        )
      : undefined
);

export const getSelectedNodeId = createSelector(
  getDetailState,
  (state: DetailState): string => state.calculations.selected?.nodeId
);

export const getBomIdentifierForSelectedCalculation = createSelector(
  getDetailState,
  (state: DetailState): BomIdentifier => {
    const calculation = state.calculations.selected?.calculation;

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

export const getSelectedReferenceTypeIdentifier = createSelector(
  getDetailState,
  (state: DetailState): ReferenceTypeIdentifier => state.selectedReferenceType
);
