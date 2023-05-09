import { Action, createReducer, on } from '@ngrx/store';

import {
  MaterialTableItem,
  ValidationDescription,
} from '../../../../shared/models/table';
import { TableService } from '../../../../shared/services/table/table.service';
import {
  addMaterialRowDataItems,
  clearProcessCaseRowData,
  deleteMaterialRowDataItem,
  duplicateMaterialRowDataItem,
  updateMaterialRowDataItem,
  validateAddMaterialsOnCustomerAndSalesOrgFailure,
  validateAddMaterialsOnCustomerAndSalesOrgSuccess,
} from '../../actions';
import { ActiveCaseActions } from '../../active-case/active-case.action';

export interface ProcessCaseState {
  addMaterialRowData: MaterialTableItem[];
  validationLoading: boolean;
  errorMessage: string;
}

export const initialState: ProcessCaseState = {
  addMaterialRowData: [],
  validationLoading: false,
  errorMessage: undefined,
};

export const processCaseReducer = createReducer(
  initialState,

  on(
    clearProcessCaseRowData,
    (state: ProcessCaseState): ProcessCaseState => ({
      ...state,
      addMaterialRowData: initialState.addMaterialRowData,
    })
  ),
  on(
    ActiveCaseActions.addMaterialsToQuotationSuccess,
    (state: ProcessCaseState): ProcessCaseState => ({
      ...state,
      addMaterialRowData: initialState.addMaterialRowData,
    })
  ),
  on(
    addMaterialRowDataItems,
    (state: ProcessCaseState, { items }): ProcessCaseState => ({
      ...state,
      addMaterialRowData: TableService.addItems(items, [
        ...state.addMaterialRowData,
      ]),
      validationLoading: true,
    })
  ),
  on(
    duplicateMaterialRowDataItem,
    (state: ProcessCaseState, { itemId }): ProcessCaseState => ({
      ...state,
      addMaterialRowData: TableService.duplicateItem(itemId, [
        ...state.addMaterialRowData,
      ]),
      validationLoading: true,
    })
  ),
  on(
    updateMaterialRowDataItem,
    (state: ProcessCaseState, { item, revalidate }) => ({
      ...state,
      addMaterialRowData: TableService.updateItem(
        item,
        state.addMaterialRowData,
        revalidate
      ),
    })
  ),
  on(
    deleteMaterialRowDataItem,
    (state: ProcessCaseState, { id }): ProcessCaseState => ({
      ...state,
      addMaterialRowData: TableService.deleteItem(id, [
        ...state.addMaterialRowData,
      ]),
    })
  ),
  on(
    validateAddMaterialsOnCustomerAndSalesOrgSuccess,
    (state: ProcessCaseState, { materialValidations }): ProcessCaseState => ({
      ...state,
      errorMessage: undefined,
      addMaterialRowData: [...state.addMaterialRowData].map((el) =>
        TableService.validateData(
          { ...el },
          materialValidations.find(
            (item) => item.materialNumber15 === el.materialNumber
          )
        )
      ),
      validationLoading: false,
    })
  ),
  on(
    validateAddMaterialsOnCustomerAndSalesOrgFailure,
    (state: ProcessCaseState, { errorMessage }): ProcessCaseState => ({
      ...state,
      errorMessage,
      addMaterialRowData: [...state.addMaterialRowData].map((el) => {
        if (el.info.description[0] === ValidationDescription.Valid) {
          return el;
        }

        return {
          ...el,
          info: {
            ...el.info,
            description: [ValidationDescription.ValidationFailure],
          },
        };
      }),
      validationLoading: false,
    })
  )
);

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function reducer(
  state: ProcessCaseState,
  action: Action
): ProcessCaseState {
  return processCaseReducer(state, action);
}
