import { createSelector } from '@ngrx/store';

import { CaseFilterItem, CaseTableItem } from '../../models';
import { getCaseState } from '../../reducers';
import { CaseState } from '../../reducers/create-case/create-case.reducer';

export const getCaseQuotation = createSelector(
  getCaseState,
  (state: CaseState): CaseFilterItem =>
    state.createCase.autocompleteItems.find((it) => it.filter === 'quotation')
);

export const getSelectedQuotation = createSelector(
  getCaseState,
  (state: CaseState): string => {
    let quotationNumber = '';

    const quotationOptions = state.createCase.autocompleteItems.find(
      (it) => it.filter === 'quotation'
    );
    quotationOptions.options.forEach((value) => {
      if (value.selected) {
        quotationNumber = value.value;
      }
    });

    return quotationNumber;
  }
);

export const getCaseCustomer = createSelector(
  getCaseState,
  (state: CaseState): CaseFilterItem =>
    state.createCase.autocompleteItems.find((it) => it.filter === 'customer')
);
export const getCaseMaterialnumber = createSelector(
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
  (state: CaseState): CaseTableItem[] => state.createCase.rowData
);

export const getCustomerConditionsValid = createSelector(
  getCaseState,
  (state: CaseState): boolean => {
    const rowData = [...state.createCase.rowData];
    let rowDataValid = rowData.length >= 1;

    for (const row of rowData) {
      if (row.materialNumber || row.quantity) {
        const error =
          !row.quantity ||
          (row.materialNumber && row.materialNumber.length === 0) ||
          !row.materialNumber ||
          !row.info;

        if (error) {
          rowDataValid = false;
          break;
        }
      }
    }
    const customerValid = state.createCase.autocompleteItems
      .find((el) => el.filter === 'customer')
      .options.find((opt) => opt.selected);

    return customerValid !== undefined ? rowDataValid : false;
  }
);
