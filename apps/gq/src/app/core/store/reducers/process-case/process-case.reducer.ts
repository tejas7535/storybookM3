import { Action, createReducer, on } from '@ngrx/store';

import { TableService } from '../../../../shared/services/table-service/table.service';
import {
  addMaterialRowDataItem,
  addMaterials,
  addMaterialsFailure,
  addMaterialsSuccess,
  addToRemoveMaterials,
  clearProcessCaseRowData,
  deleteAddMaterialRowDataItem,
  loadCustomer,
  loadCustomerFailure,
  loadCustomerSuccess,
  loadQuotation,
  loadQuotationFailure,
  loadQuotationSuccess,
  pasteRowDataItemsToAddMaterial,
  removeMaterials,
  removeMaterialsFailure,
  removeMaterialsSuccess,
  selectQuotation,
  setSelectedQuotationDetail,
  updateQuotationDetails,
  updateQuotationDetailsFailure,
  updateQuotationDetailsSuccess,
  uploadOfferToSap,
  uploadOfferToSapFailure,
  uploadOfferToSapSuccess,
  validateAddMaterialsFailure,
  validateAddMaterialsSuccess,
} from '../../actions';
import {
  Customer,
  MaterialTableItem,
  Quotation,
  QuotationIdentifier,
  ValidationDescription,
} from '../../models';
import {
  dummyRowData,
  isDummyData,
} from '../create-case/config/dummy-row-data';

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
    addMaterialRowData: [dummyRowData],
    validationLoading: false,
    removeQuotationDetailsIds: [],
    errorMessage: undefined,
  },
};

export const processCaseReducer = createReducer(
  initialState,
  on(selectQuotation, (state: ProcessCaseState, { quotationIdentifier }) => ({
    ...state,
    quotationIdentifier,
  })),
  on(loadCustomer, (state: ProcessCaseState) => ({
    ...state,
    customer: {
      ...state.customer,
      customerLoading: true,
      item: initialState.customer.item,
      errorMessage: initialState.customer.errorMessage,
    },
  })),
  on(loadCustomerSuccess, (state: ProcessCaseState, { item }) => ({
    ...state,
    customer: {
      ...state.customer,
      item,
      customerLoading: false,
    },
  })),
  on(loadCustomerFailure, (state: ProcessCaseState, { errorMessage }) => ({
    ...state,
    customer: {
      ...state.customer,
      errorMessage,
      customerLoading: false,
    },
  })),
  on(loadQuotation, (state: ProcessCaseState) => ({
    ...state,
    quotation: {
      ...state.quotation,
      item: initialState.quotation.item,
      quotationLoading: true,
      errorMessage: initialState.quotation.errorMessage,
      updateLoading: false,
    },
  })),
  on(loadQuotationSuccess, (state: ProcessCaseState, { item }) => ({
    ...state,
    quotation: {
      ...state.quotation,
      item,
      quotationLoading: false,
      errorMessage: undefined,
    },
  })),
  on(loadQuotationFailure, (state: ProcessCaseState, { errorMessage }) => ({
    ...state,
    quotation: {
      ...state.quotation,
      errorMessage,
      quotationLoading: false,
    },
  })),
  on(updateQuotationDetails, (state: ProcessCaseState) => ({
    ...state,
    quotation: {
      ...state.quotation,
      updateLoading: true,
    },
  })),
  on(
    updateQuotationDetailsSuccess,
    (state: ProcessCaseState, { quotationDetails }) => ({
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
    (state: ProcessCaseState, { errorMessage }) => ({
      ...state,
      quotation: {
        ...state.quotation,
        errorMessage,
        updateLoading: false,
      },
    })
  ),
  on(clearProcessCaseRowData, (state: ProcessCaseState) => ({
    ...state,
    addMaterials: {
      ...state.addMaterials,
      addMaterialRowData: [dummyRowData],
    },
  })),
  on(addMaterials, (state: ProcessCaseState) => ({
    ...state,
    quotation: {
      ...state.quotation,
      updateLoading: true,
      errorMessage: initialState.quotation.errorMessage,
    },
    addMaterials: {
      ...state.addMaterials,
    },
  })),
  on(addMaterialsSuccess, (state: ProcessCaseState, { item }) => ({
    ...state,
    quotation: {
      ...state.quotation,
      item,
      updateLoading: false,
      errorMessage: undefined,
    },
    addMaterials: {
      ...state.addMaterials,
      addMaterialRowData: [dummyRowData],
    },
  })),
  on(addMaterialsFailure, (state: ProcessCaseState, { errorMessage }) => ({
    ...state,
    quotation: {
      ...state.quotation,
      errorMessage,
      updateLoading: false,
    },
  })),
  on(addMaterialRowDataItem, (state: ProcessCaseState, { items }) => ({
    ...state,
    addMaterials: {
      ...state.addMaterials,
      addMaterialRowData: [
        ...TableService.removeDashesFromTableItems(items),
        ...state.addMaterials.addMaterialRowData.filter(
          (val) => !isDummyData(val)
        ),
      ],
    },
  })),
  on(
    pasteRowDataItemsToAddMaterial,
    (state: ProcessCaseState, { items, pasteDestination }) => ({
      ...state,
      addMaterials: {
        ...state.addMaterials,
        addMaterialRowData: TableService.pasteItems(items, pasteDestination, [
          ...state.addMaterials.addMaterialRowData,
        ]),
        validationLoading: true,
      },
    })
  ),
  on(
    deleteAddMaterialRowDataItem,
    (state: ProcessCaseState, { materialNumber, quantity }) => ({
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
    (state: ProcessCaseState, { materialValidations }) => ({
      ...state,
      addMaterials: {
        ...state.addMaterials,
        errorMessage: undefined,
        addMaterialRowData: [...state.addMaterials.addMaterialRowData].map(
          (el) => {
            return TableService.validateData({ ...el }, materialValidations);
          }
        ),
        validationLoading: false,
      },
    })
  ),
  on(
    validateAddMaterialsFailure,
    (state: ProcessCaseState, { errorMessage }) => ({
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
  on(addToRemoveMaterials, (state: ProcessCaseState, { gqPositionIds }) => ({
    ...state,
    addMaterials: {
      ...state.addMaterials,
      removeQuotationDetailsIds: gqPositionIds,
    },
  })),
  on(removeMaterials, (state: ProcessCaseState) => ({
    ...state,
    quotation: {
      ...state.quotation,
      updateLoading: true,
    },
  })),
  on(removeMaterialsSuccess, (state: ProcessCaseState, { item }) => ({
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
  })),
  on(removeMaterialsFailure, (state: ProcessCaseState, { errorMessage }) => ({
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
  })),
  on(
    setSelectedQuotationDetail,
    (state: ProcessCaseState, { gqPositionId }) => ({
      ...state,
      quotation: {
        ...state.quotation,
        selectedQuotationDetail: gqPositionId,
      },
    })
  ),
  on(uploadOfferToSap, (state: ProcessCaseState) => ({
    ...state,
    quotation: {
      ...state.quotation,
      updateLoading: true,
    },
  })),
  on(uploadOfferToSapFailure, (state: ProcessCaseState, { errorMessage }) => ({
    ...state,
    quotation: {
      ...state.quotation,
      errorMessage,
      updateLoading: false,
    },
  })),
  on(uploadOfferToSapSuccess, (state: ProcessCaseState) => ({
    ...state,
    quotation: {
      ...state.quotation,
      updateLoading: false,
    },
  }))
);

// tslint:disable-next-line: only-arrow-functions
export function reducer(
  state: ProcessCaseState,
  action: Action
): ProcessCaseState {
  return processCaseReducer(state, action);
}
// tslint:disable-next-line: max-file-line-count
