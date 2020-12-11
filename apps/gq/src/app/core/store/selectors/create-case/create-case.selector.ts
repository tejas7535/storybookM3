import { createSelector } from '@ngrx/store';

import {
  CaseFilterItem,
  CreateCase,
  CreateCaseResponse,
  ImportCaseResponse,
  MaterialQuantities,
  MaterialTableItem,
  SapQuotation,
} from '../../models';
import { getCaseState } from '../../reducers';
import { CaseState } from '../../reducers/create-case/create-case.reducer';

export const getCaseQuotation = createSelector(
  getCaseState,
  (state: CaseState): CaseFilterItem =>
    state.createCase.autocompleteItems.find((it) => it.filter === 'quotation')
);

export const getSelectedQuotation = createSelector(
  getCaseState,
  (state: CaseState): ImportCaseResponse => {
    let quotation: ImportCaseResponse = {};
    const quotationOptions = state.createCase.autocompleteItems.find(
      (it) => it.filter === 'quotation'
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
    state.createCase.autocompleteItems.find((it) => it.filter === 'customer')
);
export const getCaseMaterialNumber = createSelector(
  getCaseState,
  (state: CaseState): CaseFilterItem =>
    state.createCase.autocompleteItems.find(
      (it) => it.filter === 'materialNumber'
    )
);

export const getCaseAutocompleteLoading = createSelector(
  getCaseState,
  (state: CaseState, autocompleteItem: string): boolean =>
    state.createCase.autocompleteLoading === autocompleteItem
);
export const getCaseRowData = createSelector(
  getCaseState,
  (state: CaseState): MaterialTableItem[] => state.createCase.rowData
);

export const getCustomerConditionsValid = createSelector(
  getCaseState,
  (state: CaseState): boolean => {
    const rowData = state ? [...state.createCase.rowData] : [];
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
      ? state.createCase.autocompleteItems
          .find((el) => el.filter === 'customer')
          .options.find((opt) => opt.selected)
      : undefined;

    return customerValid !== undefined ? rowDataValid : false;
  }
);
export const getCreateCaseData = createSelector(
  getCaseState,
  (state: CaseState): CreateCase => {
    const customer = state.createCase.autocompleteItems
      .find((it) => it.filter === 'customer')
      .options.find((opt) => opt.selected);
    const customerId = customer ? customer.id : undefined;
    const materialQuantities: MaterialQuantities[] = [];
    state.createCase.rowData.forEach((el) => {
      materialQuantities.push({
        materialId: el.materialNumber,
        quantity:
          typeof el.quantity === 'string'
            ? parseInt(el.quantity, 10)
            : el.quantity,
      });
    });

    return {
      customerId,
      materialQuantities,
    };
  }
);

export const getCreatedCase = createSelector(
  getCaseState,
  (state: CaseState): CreateCaseResponse => state.createCase.createdCase
);
