import { Action, createReducer, on } from '@ngrx/store';
import { TableService } from '../../../../shared/services/tableService/table.service';

import {
  addMaterialRowDataItem,
  addMaterials,
  addMaterialsFailure,
  addMaterialsSuccess,
  addQuotationDetailToOffer,
  addToRemoveMaterials,
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
  removeQuotationDetailFromOffer,
  selectQuotation,
  updateQuotationDetailsFailure,
  updateQuotationDetailsSuccess,
  validateAddMaterialsFailure,
  validateAddMaterialsSuccess,
} from '../../actions';
import {
  Customer,
  MaterialTableItem,
  Quotation,
  QuotationIdentifier,
  UpdateQuotationDetail,
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
    errorMessage: string;
    updateDetails: UpdateQuotationDetail[];
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
    errorMessage: undefined,
    updateDetails: undefined,
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
    quotationIdentifier: {
      ...state.quotationIdentifier,
      customerNumber: quotationIdentifier.customerNumber,
      gqId: quotationIdentifier.gqId,
    },
  })),
  on(loadCustomer, (state: ProcessCaseState) => ({
    ...state,
    customer: {
      ...state.customer,
      customerLoading: true,
      item: undefined,
      errorMessage: undefined,
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
      item: undefined,
      quotationLoading: true,
      errorMessage: undefined,
      updateDetails: undefined,
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
  on(
    addQuotationDetailToOffer,
    (state: ProcessCaseState, { quotationDetailIDs }) => ({
      ...state,
      quotation: {
        ...state.quotation,
        item: {
          ...state.quotation.item,
          quotationDetails: [
            ...state.quotation.item.quotationDetails.map((quotationDetail) =>
              quotationDetailIDs.some(
                (item) => item.gqPositionId === quotationDetail.gqPositionId
              )
                ? {
                    ...quotationDetail,
                    addedToOffer: true,
                  }
                : quotationDetail
            ),
          ],
        },
        updateDetails: quotationDetailIDs,
      },
    })
  ),
  on(
    removeQuotationDetailFromOffer,
    (state: ProcessCaseState, { quotationDetailIDs }) => ({
      ...state,
      quotation: {
        ...state.quotation,
        item: {
          ...state.quotation.item,
          quotationDetails: [
            ...state.quotation.item.quotationDetails.map((quotationDetail) =>
              quotationDetailIDs.some(
                (item) => item.gqPositionId === quotationDetail.gqPositionId
              )
                ? {
                    ...quotationDetail,
                    addedToOffer: false,
                  }
                : quotationDetail
            ),
          ],
        },
        updateDetails: quotationDetailIDs,
      },
    })
  ),
  on(updateQuotationDetailsSuccess, (state: ProcessCaseState) => ({
    ...state,
    quotation: {
      ...state.quotation,
      updateDetails: undefined,
      errorMessage: undefined,
    },
  })),
  on(
    updateQuotationDetailsFailure,
    (state: ProcessCaseState, { errorMessage }) => ({
      ...state,
      quotation: {
        ...state.quotation,
        errorMessage,
      },
    })
  ),
  on(addMaterials, (state: ProcessCaseState) => ({
    ...state,
    quotation: {
      ...state.quotation,
      item: undefined,
      quotationLoading: true,
      errorMessage: undefined,
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
      quotationLoading: false,
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
      quotationLoading: false,
    },
  })),
  on(addMaterialRowDataItem, (state: ProcessCaseState, { items }) => ({
    ...state,
    addMaterials: {
      ...state.addMaterials,
      addMaterialRowData: [
        ...items,
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
    (state: ProcessCaseState, { materialNumber }) => ({
      ...state,
      addMaterials: {
        ...state.addMaterials,
        addMaterialRowData: TableService.deleteItem(materialNumber, [
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
      quotationLoading: true,
    },
  })),
  on(removeMaterialsSuccess, (state: ProcessCaseState, { item }) => ({
    ...state,
    quotation: {
      ...state.quotation,
      item,
      quotationLoading: false,
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
      quotationLoading: false,
    },
    addMaterials: {
      ...state.addMaterials,
      removeQuotationDetailsIds: [],
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
