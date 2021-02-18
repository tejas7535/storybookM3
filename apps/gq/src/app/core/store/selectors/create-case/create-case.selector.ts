import { createSelector } from '@ngrx/store';

import { FilterNames } from '../../../../shared/autocomplete-input/filter-names.enum';
import {
  CaseFilterItem,
  CreateCase,
  CreateCaseResponse,
  ImportCaseResponse,
  MaterialQuantities,
  MaterialTableItem,
  SalesOrg,
  SapQuotation,
} from '../../models';
import { getCaseState } from '../../reducers';
import { CaseState } from '../../reducers/create-case/create-case.reducer';

export const getCaseQuotation = createSelector(
  getCaseState,
  (state: CaseState): CaseFilterItem =>
    state.autocompleteItems.find((it) => it.filter === FilterNames.QUOTATION)
);

export const getSelectedQuotation = createSelector(
  getCaseState,
  (state: CaseState): ImportCaseResponse => {
    let quotation: ImportCaseResponse = {};
    const quotationOptions = state.autocompleteItems.find(
      (it) => it.filter === FilterNames.QUOTATION
    );
    (quotationOptions.options as SapQuotation[]).forEach((value) => {
      if (value.selected) {
        quotation = {
          customerId: value.customerId,
          sapId: value.id,
        };
      }
    });

    return quotation;
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
          .options.find((opt) => opt.selected)
      : undefined;

    return customerValid !== undefined ? rowDataValid : false;
  }
);
export const getCreateCaseData = createSelector(
  getCaseState,
  (state: CaseState): CreateCase => {
    const customerId = state.customer.customerId;
    const salesOrg = state.customer.salesOrgs.find((org) => org.selected)?.id;

    const materialQuantities: MaterialQuantities[] = [];
    state.rowData.forEach((el) => {
      materialQuantities.push({
        materialId: el.materialNumber,
        quantity:
          typeof el.quantity === 'string'
            ? parseInt(el.quantity, 10)
            : el.quantity,
      });
    });

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
