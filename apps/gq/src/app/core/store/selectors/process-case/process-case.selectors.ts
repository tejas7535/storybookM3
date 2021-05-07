import { createSelector } from '@ngrx/store';

import { Quotation } from '../../../../shared/models';
import { Customer } from '../../../../shared/models/customer';
import {
  MaterialDetails,
  QuotationDetail,
} from '../../../../shared/models/quotation-detail';
import {
  MaterialQuantities,
  MaterialTableItem,
} from '../../../../shared/models/table';
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

export const isCustomerLoading = createSelector(
  getProcessCaseState,
  (state: ProcessCaseState): boolean => state.customer.customerLoading
);

export const getQuotation = createSelector(
  getProcessCaseState,
  (state: ProcessCaseState): Quotation => state.quotation.item
);

export const isQuotationLoading = createSelector(
  getProcessCaseState,
  (state: ProcessCaseState): boolean => state.quotation.quotationLoading
);

export const getSelectedQuotationIdentifier = createSelector(
  getProcessCaseState,
  (state: ProcessCaseState): QuotationIdentifier => state.quotationIdentifier
);

export const getOffer = createSelector(
  getProcessCaseState,
  (state: ProcessCaseState): Quotation =>
    state.quotation.item === undefined
      ? undefined
      : {
          ...state.quotation.item,
          quotationDetails: state.quotation.item.quotationDetails.filter(
            (quotationDetail: QuotationDetail) => quotationDetail.addedToOffer
          ),
        }
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

    const items: MaterialQuantities[] = [];

    state.addMaterials.addMaterialRowData.forEach((el) => {
      items.push({
        materialId: el.materialNumber,
        quantity:
          typeof el.quantity === 'string'
            ? parseInt(el.quantity, 10)
            : el.quantity,
      });
    });

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
    let rowDataValid = rowData.length >= 1;
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
    state.quotation.item
      ? state.quotation.item.quotationDetails.find(
          (detail: QuotationDetail) =>
            detail.gqPositionId === state.quotation.selectedQuotationDetail
        )
      : undefined
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
