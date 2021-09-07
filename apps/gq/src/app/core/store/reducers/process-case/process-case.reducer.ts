/* eslint-disable max-lines */
import { Action, createReducer, on } from '@ngrx/store';

import { Quotation } from '../../../../shared/models';
import { Customer } from '../../../../shared/models/customer';
import {
  MaterialTableItem,
  ValidationDescription,
} from '../../../../shared/models/table';
import { TableService } from '../../../../shared/services/table-service/table.service';
import {
  addMaterialRowDataItem,
  addMaterials,
  addMaterialsFailure,
  addMaterialsSuccess,
  clearProcessCaseRowData,
  deleteAddMaterialRowDataItem,
  loadCustomer,
  loadCustomerFailure,
  loadCustomerSuccess,
  loadQuotation,
  loadQuotationFailure,
  loadQuotationSuccess,
  pasteRowDataItemsToAddMaterial,
  removePositions,
  removePositionsFailure,
  removePositionsSuccess,
  selectQuotation,
  setSelectedQuotationDetail,
  updateQuotationDetails,
  updateQuotationDetailsFailure,
  updateQuotationDetailsSuccess,
  uploadSelectionToSap,
  uploadSelectionToSapFailure,
  uploadSelectionToSapSuccess,
  validateAddMaterialsFailure,
  validateAddMaterialsSuccess,
} from '../../actions';
import { QuotationIdentifier } from './models';

export interface ProcessCaseState {
  quotationIdentifier: QuotationIdentifier;
  customer: {
    customerLoading: boolean;
    item: Customer;
    errorMessage: string;
  };
  quotation: {
    quotationLoading: boolean;
    item: Quotation;
    selectedQuotationDetail: string;
    errorMessage: string;
    updateLoading: boolean;
  };
  addMaterials: {
    addMaterialRowData: MaterialTableItem[];
    validationLoading: boolean;
    removeQuotationDetailsIds: string[];
    errorMessage: string;
  };
}

export const initialState: ProcessCaseState = {
  quotationIdentifier: undefined,
  customer: {
    customerLoading: false,
    item: undefined,
    errorMessage: undefined,
  },
  quotation: {
    quotationLoading: false,
    item: undefined,
    selectedQuotationDetail: undefined,
    errorMessage: undefined,
    updateLoading: false,
  },
  addMaterials: {
    addMaterialRowData: [],
    validationLoading: false,
    removeQuotationDetailsIds: [],
    errorMessage: undefined,
  },
};

export const processCaseReducer = createReducer(
  initialState,
  on(
    selectQuotation,
    (state: ProcessCaseState, { quotationIdentifier }): ProcessCaseState => ({
      ...state,
      quotationIdentifier,
    })
  ),
  on(
    loadCustomer,
    (state: ProcessCaseState): ProcessCaseState => ({
      ...state,
      customer: {
        ...state.customer,
        customerLoading: true,
        item: initialState.customer.item,
        errorMessage: initialState.customer.errorMessage,
      },
    })
  ),
  on(
    loadCustomerSuccess,
    (state: ProcessCaseState, { item }): ProcessCaseState => ({
      ...state,
      customer: {
        ...state.customer,
        item,
        customerLoading: false,
      },
    })
  ),
  on(
    loadCustomerFailure,
    (state: ProcessCaseState, { errorMessage }): ProcessCaseState => ({
      ...state,
      customer: {
        ...state.customer,
        errorMessage,
        customerLoading: false,
      },
    })
  ),
  on(
    loadQuotation,
    (state: ProcessCaseState): ProcessCaseState => ({
      ...state,
      quotation: {
        ...state.quotation,
        item: initialState.quotation.item,
        quotationLoading: true,
        errorMessage: initialState.quotation.errorMessage,
        updateLoading: false,
      },
    })
  ),
  on(
    loadQuotationSuccess,
    (state: ProcessCaseState, { item }): ProcessCaseState => ({
      ...state,
      quotation: {
        ...state.quotation,
        item,
        quotationLoading: false,
        errorMessage: undefined,
      },
    })
  ),
  on(
    loadQuotationFailure,
    (state: ProcessCaseState, { errorMessage }): ProcessCaseState => ({
      ...state,
      quotation: {
        ...state.quotation,
        errorMessage,
        quotationLoading: false,
      },
    })
  ),
  on(
    updateQuotationDetails,
    (state: ProcessCaseState): ProcessCaseState => ({
      ...state,
      quotation: {
        ...state.quotation,
        updateLoading: true,
      },
    })
  ),
  on(
    updateQuotationDetailsSuccess,
    (state: ProcessCaseState, { quotationDetails }): ProcessCaseState => ({
      ...state,
      quotation: {
        ...state.quotation,
        item: {
          ...state.quotation.item,
          quotationDetails: [...state.quotation.item.quotationDetails].map(
            (el) => {
              const update = quotationDetails.find(
                (detail) => detail.gqPositionId === el.gqPositionId
              );

              return update ?? el;
            }
          ),
        },
        updateLoading: false,
        errorMessage: undefined,
      },
    })
  ),
  on(
    updateQuotationDetailsFailure,
    (state: ProcessCaseState, { errorMessage }): ProcessCaseState => ({
      ...state,
      quotation: {
        ...state.quotation,
        errorMessage,
        updateLoading: false,
      },
    })
  ),
  on(
    clearProcessCaseRowData,
    (state: ProcessCaseState): ProcessCaseState => ({
      ...state,
      addMaterials: {
        ...state.addMaterials,
        addMaterialRowData: initialState.addMaterials.addMaterialRowData,
      },
    })
  ),
  on(
    addMaterials,
    (state: ProcessCaseState): ProcessCaseState => ({
      ...state,
      quotation: {
        ...state.quotation,
        updateLoading: true,
        errorMessage: initialState.quotation.errorMessage,
      },
      addMaterials: {
        ...state.addMaterials,
      },
    })
  ),
  on(
    addMaterialsSuccess,
    (state: ProcessCaseState, { item }): ProcessCaseState => ({
      ...state,
      quotation: {
        ...state.quotation,
        item,
        updateLoading: false,
        errorMessage: undefined,
      },
      addMaterials: {
        ...state.addMaterials,
        addMaterialRowData: initialState.addMaterials.addMaterialRowData,
      },
    })
  ),
  on(
    addMaterialsFailure,
    (state: ProcessCaseState, { errorMessage }): ProcessCaseState => ({
      ...state,
      quotation: {
        ...state.quotation,
        errorMessage,
        updateLoading: false,
      },
    })
  ),
  on(
    addMaterialRowDataItem,
    (state: ProcessCaseState, { items }): ProcessCaseState => ({
      ...state,
      addMaterials: {
        ...state.addMaterials,
        addMaterialRowData: [
          ...state.addMaterials.addMaterialRowData,
          ...TableService.removeDashesFromTableItems(items),
        ],
      },
    })
  ),
  on(
    pasteRowDataItemsToAddMaterial,
    (state: ProcessCaseState, { items }): ProcessCaseState => ({
      ...state,
      addMaterials: {
        ...state.addMaterials,
        addMaterialRowData: TableService.pasteItems(items, [
          ...state.addMaterials.addMaterialRowData,
        ]),
        validationLoading: true,
      },
    })
  ),
  on(
    deleteAddMaterialRowDataItem,
    (
      state: ProcessCaseState,
      { materialNumber, quantity }
    ): ProcessCaseState => ({
      ...state,
      addMaterials: {
        ...state.addMaterials,
        addMaterialRowData: TableService.deleteItem(materialNumber, quantity, [
          ...state.addMaterials.addMaterialRowData,
        ]),
      },
    })
  ),
  on(
    validateAddMaterialsSuccess,
    (state: ProcessCaseState, { materialValidations }): ProcessCaseState => ({
      ...state,
      addMaterials: {
        ...state.addMaterials,
        errorMessage: undefined,
        addMaterialRowData: [...state.addMaterials.addMaterialRowData].map(
          (el) =>
            TableService.validateData(
              { ...el },
              materialValidations.find(
                (item) => item.materialNumber15 === el.materialNumber
              )
            )
        ),
        validationLoading: false,
      },
    })
  ),
  on(
    validateAddMaterialsFailure,
    (state: ProcessCaseState, { errorMessage }): ProcessCaseState => ({
      ...state,
      addMaterials: {
        ...state.addMaterials,
        errorMessage,
        addMaterialRowData: [...state.addMaterials.addMaterialRowData].map(
          (el) => {
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
          }
        ),
        validationLoading: false,
      },
    })
  ),
  on(
    removePositions,
    (state: ProcessCaseState, { gqPositionIds }): ProcessCaseState => ({
      ...state,
      addMaterials: {
        ...state.addMaterials,
        removeQuotationDetailsIds: gqPositionIds,
      },
      quotation: {
        ...state.quotation,
        updateLoading: true,
      },
    })
  ),
  on(
    removePositionsSuccess,
    (state: ProcessCaseState, { item }): ProcessCaseState => ({
      ...state,
      quotation: {
        ...state.quotation,
        item,
        updateLoading: false,
        errorMessage: undefined,
      },
      addMaterials: {
        ...state.addMaterials,
        removeQuotationDetailsIds: [],
      },
    })
  ),
  on(
    removePositionsFailure,
    (state: ProcessCaseState, { errorMessage }): ProcessCaseState => ({
      ...state,
      quotation: {
        ...state.quotation,
        errorMessage,
        updateLoading: false,
      },
      addMaterials: {
        ...state.addMaterials,
        removeQuotationDetailsIds: [],
      },
    })
  ),
  on(
    setSelectedQuotationDetail,
    (state: ProcessCaseState, { gqPositionId }): ProcessCaseState => ({
      ...state,
      quotation: {
        ...state.quotation,
        selectedQuotationDetail: gqPositionId,
      },
    })
  ),
  on(
    uploadSelectionToSap,
    (state: ProcessCaseState): ProcessCaseState => ({
      ...state,
      quotation: {
        ...state.quotation,
        updateLoading: true,
      },
    })
  ),
  on(
    uploadSelectionToSapFailure,
    (state: ProcessCaseState, { errorMessage }): ProcessCaseState => ({
      ...state,
      quotation: {
        ...state.quotation,
        errorMessage,
        updateLoading: false,
      },
    })
  ),
  on(
    uploadSelectionToSapSuccess,
    (state: ProcessCaseState): ProcessCaseState => ({
      ...state,
      quotation: {
        ...state.quotation,
        updateLoading: false,
      },
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
