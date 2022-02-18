import {
  BomIdentifier,
  BomItem,
  Calculation,
  CustomerDetails,
  DimensionAndWeightDetails,
  Drawing,
  ExcludedCalculations,
  PriceDetails,
  ProductionDetails,
  QuantitiesDetails,
  ReferenceType,
  ReferenceTypeIdentifier,
  SalesDetails,
} from '@cdba/shared/models';
import { translate } from '@ngneat/transloco';
import { createSelector } from '@ngrx/store';

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
          referenceType.pcmCalculations?.[0]?.projectName,
          referenceType.productDescription
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

export const getCalculations = createSelector(
  getDetailState,
  (state: DetailState): Calculation[] => state.calculations.items
);

export const getExcludedCalculations = createSelector(
  getDetailState,
  (state: DetailState): ExcludedCalculations => state.calculations.excludedItems
);

export const getCalculationsLoading = createSelector(
  getDetailState,
  (state: DetailState) => state.calculations.loading
);

export const getCalculationsError = createSelector(
  getDetailState,
  (state: DetailState) => state.calculations.errorMessage
);

export const getSelectedCalculation = createSelector(
  getDetailState,
  (state: DetailState) => state.calculations.selectedCalculation?.calculation
);

export const getSelectedCalculationNodeId = createSelector(
  getDetailState,
  (state: DetailState): string[] =>
    state.calculations.selectedCalculation?.nodeId
      ? [state.calculations.selectedCalculation.nodeId]
      : undefined
);

export const getSelectedCalculationNodeIds = createSelector(
  getDetailState,
  (state: DetailState): string[] => state.calculations.selectedNodeIds
);

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

export const getChildrenOfSelectedBomItem = createSelector(
  getDetailState,
  (state: DetailState): BomItem[] =>
    state.bom.items
      ? state.bom.items
          .filter(
            (item: BomItem) =>
              item.predecessorsInTree[item.predecessorsInTree.length - 2] ===
              state.bom.selectedItem.materialDesignation
          )
          .map((item) => ({
            ...item,
            costShareOfParent:
              item.totalPricePerPc / state.bom.selectedItem.totalPricePerPc,
          }))
      : undefined
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

export const getSelectedReferenceTypeIdentifier = createSelector(
  getDetailState,
  (state: DetailState): ReferenceTypeIdentifier => state.selectedReferenceType
);

export const getDrawings = createSelector(
  getDetailState,
  (state: DetailState): Drawing[] => state.drawings.items
);

export const getDrawingsLoading = createSelector(
  getDetailState,
  (state: DetailState) => state.drawings.loading
);

export const getDrawingsError = createSelector(
  getDetailState,
  (state: DetailState) => {
    if (state.drawings.errorMessage) {
      return state.drawings.errorMessage;
    }

    if (!state.drawings.loading && state.drawings.items?.length === 0) {
      return translate<string>('detail.drawings.noDrawingsText');
    }

    return undefined;
  }
);

export const getNodeIdOfSelectedDrawing = createSelector(
  getDetailState,
  (state: DetailState) => state.drawings.selected?.nodeId
);
