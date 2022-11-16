import { createSelector } from '@ngrx/store';

import { DetailViewQueryParams } from '../../../../app-routing.module';
import { TableContext } from '../../../../process-case-view/quotation-details-table/config/tablecontext.model';
import { Quotation, SimulatedQuotation } from '../../../../shared/models';
import { Customer } from '../../../../shared/models/customer';
import {
  Coefficients,
  MaterialDetails,
  QuotationDetail,
} from '../../../../shared/models/quotation-detail';
import { PriceUnitForQuotationItemId } from '../../../../shared/models/quotation-detail/price-units-for-quotation-item-ids.model';
import { SAP_SYNC_STATUS } from '../../../../shared/models/quotation-detail/sap-sync-status.enum';
import {
  MaterialQuantities,
  MaterialTableItem,
} from '../../../../shared/models/table';
import { TableService } from '../../../../shared/services/table-service/table.service';
import { getProcessCaseState } from '../../reducers';
import {
  AddQuotationDetailsRequest,
  QuotationIdentifier,
} from '../../reducers/process-case/models';
import { ProcessCaseState } from '../../reducers/process-case/process-case.reducer';

export const getCustomer = createSelector(
  getProcessCaseState,
  (state: ProcessCaseState): Customer => state.customer.item
);

export const getCustomerLoading = createSelector(
  getProcessCaseState,
  (state: ProcessCaseState): boolean => state.customer.customerLoading
);

export const getQuotation = createSelector(
  getProcessCaseState,
  (state: ProcessCaseState): Quotation => state.quotation.item
);

export const getQuotationCurrency = createSelector(
  getProcessCaseState,
  (state: ProcessCaseState): string => state.quotation.item.currency
);

export const getSimulatedQuotationDetailByItemId = (itemId: number) =>
  createSelector(
    getProcessCaseState,
    (state: ProcessCaseState): QuotationDetail | undefined =>
      state.quotation.simulatedItem?.quotationDetails.find(
        (detail: QuotationDetail) => detail.quotationItemId === itemId
      )
  );

export const getSimulatedQuotation = createSelector(
  getProcessCaseState,
  (state: ProcessCaseState): SimulatedQuotation => state.quotation.simulatedItem
);

export const getSimulationModeEnabled = createSelector(
  getProcessCaseState,
  (state: ProcessCaseState): boolean =>
    state.quotation.simulatedItem?.quotationDetails !== undefined &&
    state.quotation.simulatedItem?.quotationDetails.length > 0
);

export const getTableContextQuotationForCustomerCurrency = createSelector(
  getProcessCaseState,
  (state: ProcessCaseState): TableContext => ({
    quotation: state.quotation.item,
  })
);

export const getQuotationLoading = createSelector(
  getProcessCaseState,
  (state: ProcessCaseState): boolean => state.quotation.quotationLoading
);

export const getQuotationSapSyncStatus = createSelector(
  getProcessCaseState,
  (state: ProcessCaseState): SAP_SYNC_STATUS => state.quotation.sapSyncStatus
);

export const getSelectedQuotationIdentifier = createSelector(
  getProcessCaseState,
  (state: ProcessCaseState): QuotationIdentifier => state.quotationIdentifier
);

export const getSapId = createSelector(
  getProcessCaseState,
  (state: ProcessCaseState): string =>
    state.quotation.item ? state.quotation.item.sapId : undefined
);

export const getAddMaterialRowData = createSelector(
  getProcessCaseState,
  (state: ProcessCaseState): MaterialTableItem[] =>
    state.addMaterials.addMaterialRowData
);

export const getAddQuotationDetailsRequest = createSelector(
  getProcessCaseState,
  (state: ProcessCaseState): AddQuotationDetailsRequest => {
    const gqId = state.quotationIdentifier
      ? state.quotationIdentifier.gqId
      : undefined;

    // get the current biggest quotationItemId
    const quotationItemIds =
      state.quotation.item?.quotationDetails.map(
        (detail) => detail.quotationItemId
      ) || [];
    if (quotationItemIds && quotationItemIds.length === 0) {
      quotationItemIds.push(0);
    }
    const max = Math.max(...quotationItemIds);

    const items: MaterialQuantities[] =
      TableService.createMaterialQuantitiesFromTableItems(
        state.addMaterials.addMaterialRowData,
        max
      );

    return {
      gqId,
      items,
    };
  }
);

export const getRemoveQuotationDetailsRequest = createSelector(
  getProcessCaseState,
  (state: ProcessCaseState): string[] =>
    state.addMaterials.removeQuotationDetailsIds
);

export const getAddMaterialRowDataValid = createSelector(
  getProcessCaseState,
  (state: ProcessCaseState): boolean => {
    const rowData = state ? [...state.addMaterials.addMaterialRowData] : [];
    let rowDataValid = rowData.length > 0;
    for (const row of rowData) {
      if (row.materialNumber || row.quantity) {
        const error =
          !row.quantity ||
          (row.materialNumber && row.materialNumber.length === 0) ||
          !row.materialNumber ||
          !row.info.valid;

        if (error) {
          rowDataValid = false;
          break;
        }
      }
    }

    return rowDataValid;
  }
);

export const getSelectedQuotationDetailId = createSelector(
  getProcessCaseState,
  (state: ProcessCaseState): string => state.quotation.selectedQuotationDetail
);

export const getSelectedQuotationDetail = createSelector(
  getProcessCaseState,
  (state: ProcessCaseState): QuotationDetail =>
    state.quotation.item?.quotationDetails.find(
      (detail: QuotationDetail) =>
        detail.gqPositionId === state.quotation.selectedQuotationDetail
    )
);

export const getQuotationDetails = createSelector(
  getProcessCaseState,
  (state: ProcessCaseState): QuotationDetail[] =>
    state.quotation.item?.quotationDetails
);

export const getCustomerCurrency = createSelector(
  getProcessCaseState,
  (state: ProcessCaseState): string => state.customer.item?.currency
);

export const getMaterialOfSelectedQuotationDetail = createSelector(
  getSelectedQuotationDetail,
  (detail: QuotationDetail): MaterialDetails => detail?.material
);

export const getPriceUnitOfSelectedQuotationDetail = createSelector(
  getSelectedQuotationDetail,
  (detail: QuotationDetail): number => detail?.material?.priceUnit
);

export const getPriceUnitsForQuotationItemIds = createSelector(
  getQuotationDetails,
  (quotationDetails: QuotationDetail[]): PriceUnitForQuotationItemId[] =>
    quotationDetails.map((quotationDetail: QuotationDetail) => ({
      quotationItemId: quotationDetail.quotationItemId,
      priceUnit: quotationDetail.material.priceUnit,
    }))
);

export const getUpdateLoading = createSelector(
  getProcessCaseState,
  (state: ProcessCaseState): boolean => state.quotation.updateLoading
);

export const getQuotationErrorMessage = createSelector(
  getProcessCaseState,
  (state: ProcessCaseState): string => state.quotation.errorMessage
);

export const getGqId = createSelector(
  getProcessCaseState,
  (state: ProcessCaseState): number => state.quotationIdentifier?.gqId
);

export const isManualCase = createSelector(
  getProcessCaseState,
  (state: ProcessCaseState): boolean => !state.quotation.item?.sapId
);

export const getCoefficients = createSelector(
  getSelectedQuotationDetail,
  (detail: QuotationDetail): Coefficients => ({
    coefficient1: detail?.coefficient1,
    coefficient2: detail?.coefficient2,
  })
);

export const getDetailViewQueryParams = createSelector(
  getProcessCaseState,
  (
    state: ProcessCaseState
  ): { queryParams: DetailViewQueryParams; id: number } => ({
    queryParams: {
      customer_number: state.customer.item?.identifier.customerId,
      sales_org: state.customer.item?.identifier.salesOrg,
      quotation_number: state.quotation.item?.gqId,
      gqPositionId: state.quotation.selectedQuotationDetail,
    },
    id: state.quotation.item?.quotationDetails.find(
      (detail) =>
        detail.gqPositionId === state.quotation.selectedQuotationDetail
    )?.quotationItemId,
  })
);

export const getSelectedQuotationDetailItemId = createSelector(
  getProcessCaseState,
  (state: ProcessCaseState): number =>
    state.quotation.item?.quotationDetails.find(
      (detail) =>
        detail.gqPositionId === state.quotation.selectedQuotationDetail
    )?.quotationItemId
);

export const getSelectedQuotationDetailIds = createSelector(
  getProcessCaseState,
  (state: ProcessCaseState): string[] =>
    state?.quotation.selectedQuotationDetails
);
