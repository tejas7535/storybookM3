import { createSelector } from '@ngrx/store';

import { FilterNames } from '../../../../shared/autocomplete-input/filter-names.enum';
import { IdValue } from '../../../../shared/models/search';
import {
  MaterialQuantities,
  MaterialTableItem,
} from '../../../../shared/models/table';
import { TableService } from '../../../../shared/services/table-service/table.service';
import { getCaseState } from '../../reducers';
import { CaseState } from '../../reducers/create-case/create-case.reducer';
import {
  CaseFilterItem,
  CreateCase,
  CreateCaseResponse,
  SalesOrg,
} from '../../reducers/create-case/models';

export const getCaseQuotation = createSelector(
  getCaseState,
  (state: CaseState): CaseFilterItem =>
    state.autocompleteItems.find(
      (it) => it.filter === FilterNames.SAP_QUOTATION
    )
);

export const getSelectedQuotation = createSelector(
  getCaseState,
  (state: CaseState): IdValue => {
    const quotationOptions = state.autocompleteItems.find(
      (it) => it.filter === FilterNames.SAP_QUOTATION
    )?.options;
    for (const item of quotationOptions) {
      if (item.selected) {
        return item;
      }
    }

    return undefined;
  }
);

export const getCaseCustomer = createSelector(
  getCaseState,
  (state: CaseState): CaseFilterItem =>
    state.autocompleteItems.find((it) => it.filter === FilterNames.CUSTOMER)
);
export const getCaseMaterialNumber = createSelector(
  getCaseState,
  (state: CaseState): CaseFilterItem =>
    state.autocompleteItems.find((it) => it.filter === FilterNames.MATERIAL)
);

export const getCaseAutocompleteLoading = createSelector(
  getCaseState,
  (state: CaseState, autocompleteItem: string): boolean =>
    state.autocompleteLoading === autocompleteItem
);
export const getCaseRowData = createSelector(
  getCaseState,
  (state: CaseState): MaterialTableItem[] => state.rowData
);

export const getCustomerConditionsValid = createSelector(
  getCaseState,
  (state: CaseState): boolean => {
    const rowData = state ? [...state.rowData] : [];
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

    const customerValid = state
      ? state.autocompleteItems
          .find((el) => el.filter === FilterNames.CUSTOMER)
          .options.find((opt: IdValue) => opt.selected)
      : undefined;

    return customerValid !== undefined ? rowDataValid : false;
  }
);
export const getCreateCaseData = createSelector(
  getCaseState,
  (state: CaseState): CreateCase => {
    const { customerId } = state.customer;
    const salesOrg = state.customer.salesOrgs.find((org) => org.selected)?.id;

    const materialQuantities: MaterialQuantities[] =
      TableService.createMaterialQuantitiesFromTableItems(state.rowData, 0);

    return {
      materialQuantities,
      customer: {
        customerId,
        salesOrg,
      },
    };
  }
);

export const getCreatedCase = createSelector(
  getCaseState,
  (state: CaseState): CreateCaseResponse => state.createdCase
);

export const getSalesOrgs = createSelector(
  getCaseState,
  (state: CaseState): SalesOrg[] => state.customer.salesOrgs
);

export const getSelectedSalesOrg = createSelector(
  getCaseState,
  (state: CaseState): SalesOrg =>
    state.customer.salesOrgs.find((salesOrg) => salesOrg.selected)
);

export const getCreateCaseLoading = createSelector(
  getCaseState,
  (state: CaseState): boolean => state.createCaseLoading
);
