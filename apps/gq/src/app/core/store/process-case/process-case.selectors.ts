import {
  activeCaseFeature,
  ActiveCaseState,
} from '@gq/core/store/active-case/active-case.reducer';
import { AddQuotationDetailsRequest } from '@gq/core/store/active-case/models';
import { Customer } from '@gq/shared/models';
import { MaterialQuantities, MaterialTableItem } from '@gq/shared/models/table';
import { TableService } from '@gq/shared/services/table/table.service';
import { createSelector } from '@ngrx/store';

import { processCaseFeature, ProcessCaseState } from './process-case.reducer';

export const getAddMaterialRowData = createSelector(
  processCaseFeature.selectProcessCaseState,
  activeCaseFeature.selectCustomer,
  (state: ProcessCaseState, customer: Customer): MaterialTableItem[] =>
    TableService.addCurrencyToMaterialItems(
      state.addMaterialRowData,
      customer?.currency
    )
);

export const getAddQuotationDetailsRequest = createSelector(
  processCaseFeature.selectProcessCaseState,
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
  processCaseFeature.selectProcessCaseState,
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
