import {
  MaterialTableItem,
  ValidationDescription,
} from '@gq/shared/models/table';
import { TableService } from '@gq/shared/services/table/table.service';
import { createFeature, createReducer, on } from '@ngrx/store';

import { ActiveCaseActions } from '../active-case/active-case.action';
import { ProcessCaseActions } from './process-case.action';

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

export const processCaseFeature = createFeature({
  name: 'processCase',
  reducer: createReducer(
    initialState,
    on(
      ProcessCaseActions.clearRowData,
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
      ProcessCaseActions.addNewItemsToMaterialTable,
      (state: ProcessCaseState, { items }): ProcessCaseState => ({
        ...state,
        addMaterialRowData: TableService.addItems(items, [
          ...state.addMaterialRowData,
        ]),
        validationLoading: true,
      })
    ),
    on(
      ProcessCaseActions.duplicateItemFromMaterialTable,
      (state: ProcessCaseState, { itemId }): ProcessCaseState => ({
        ...state,
        addMaterialRowData: TableService.duplicateItem(itemId, [
          ...state.addMaterialRowData,
        ]),
        validationLoading: true,
      })
    ),
    on(
      ProcessCaseActions.updateItemFromMaterialTable,
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
      ProcessCaseActions.deleteItemFromMaterialTable,
      (state: ProcessCaseState, { id }): ProcessCaseState => ({
        ...state,
        addMaterialRowData: TableService.deleteItem(id, [
          ...state.addMaterialRowData,
        ]),
      })
    ),
    on(
      ProcessCaseActions.validateMaterialTableItemsSuccess,
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
      ProcessCaseActions.validateMaterialTableItemsFailure,
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
  ),
});
