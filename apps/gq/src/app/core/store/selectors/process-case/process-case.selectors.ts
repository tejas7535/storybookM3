import { Customer } from '@gq/shared/models';
import { createSelector } from '@ngrx/store';

import {
  MaterialQuantities,
  MaterialTableItem,
} from '../../../../shared/models/table';
import { TableService } from '../../../../shared/services/table/table.service';
import {
  activeCaseFeature,
  ActiveCaseState,
} from '../../active-case/active-case.reducer';
import { AddQuotationDetailsRequest } from '../../active-case/models';
import { getProcessCaseState } from '../../reducers';
import { ProcessCaseState } from '../../reducers/process-case/process-case.reducer';

export const getAddMaterialRowData = createSelector(
  getProcessCaseState,
  activeCaseFeature.selectCustomer,
  (state: ProcessCaseState, customer: Customer): MaterialTableItem[] =>
    TableService.addCurrencyToMaterialItems(
      state.addMaterialRowData,
      customer?.currency
    )
);

export const getAddQuotationDetailsRequest = createSelector(
  getProcessCaseState,
  activeCaseFeature.selectActiveCaseState,
  (
    state: ProcessCaseState,
    activeCaseState: ActiveCaseState
  ): AddQuotationDetailsRequest => {
    const gqId = activeCaseState.quotationIdentifier?.gqId;

    // get the current biggest quotationItemId
    const quotationItemIds =
      activeCaseState.quotation?.quotationDetails.map(
        (detail) => detail.quotationItemId
      ) || [];
    if (quotationItemIds && quotationItemIds.length === 0) {
      quotationItemIds.push(0);
    }
    const max = Math.max(...quotationItemIds);

    const items: MaterialQuantities[] =
      TableService.createMaterialQuantitiesFromTableItems(
        state.addMaterialRowData,
        max
      );

    return {
      gqId,
      items,
    };
  }
);

export const getAddMaterialRowDataValid = createSelector(
  getProcessCaseState,
  (state: ProcessCaseState): boolean => {
    const rowData = state ? [...state.addMaterialRowData] : [];
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
