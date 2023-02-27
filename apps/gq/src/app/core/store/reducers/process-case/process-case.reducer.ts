/* eslint-disable max-lines */
import { Action, createReducer, on } from '@ngrx/store';

import { Quotation, SimulatedQuotation } from '../../../../shared/models';
import { Customer } from '../../../../shared/models/customer';
import { QuotationDetail } from '../../../../shared/models/quotation-detail';
import {
  MaterialTableItem,
  ValidationDescription,
} from '../../../../shared/models/table';
import { PriceService } from '../../../../shared/services/price-service/price.service';
import { TableService } from '../../../../shared/services/table-service/table.service';
import {
  addMaterialRowDataItem,
  addMaterials,
  addMaterialsFailure,
  addMaterialsSuccess,
  addSimulatedQuotation,
  clearProcessCaseRowData,
  createSapQuote,
  createSapQuoteFailure,
  createSapQuoteSuccess,
  deleteAddMaterialRowDataItem,
  deselectQuotationDetail,
  loadCustomer,
  loadCustomerFailure,
  loadCustomerSuccess,
  loadQuotationFailure,
  loadQuotationInInterval,
  loadQuotationSuccess,
  pasteRowDataItemsToAddMaterial,
  refreshSapPricing,
  refreshSapPricingFailure,
  refreshSapPricingSuccess,
  removePositions,
  removePositionsFailure,
  removePositionsSuccess,
  removeSimulatedQuotationDetail,
  resetSimulatedQuotation,
  selectQuotation,
  selectQuotationDetail,
  setSelectedQuotationDetail,
  updateMaterialRowDataItem,
  updateQuotation,
  updateQuotationDetails,
  updateQuotationDetailsFailure,
  updateQuotationDetailsSuccess,
  updateQuotationFailure,
  updateQuotationSuccess,
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
    simulatedItem?: SimulatedQuotation;
    selectedQuotationDetails: string[];
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
    simulatedItem: undefined,
    selectedQuotationDetail: undefined,
    errorMessage: undefined,
    updateLoading: false,
    selectedQuotationDetails: [],
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
    loadQuotationInInterval,
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
        item: {
          ...item,
          quotationDetails: sortQuotationDetails(item.quotationDetails),
        },
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
    (state: ProcessCaseState, { updatedQuotation }): ProcessCaseState => ({
      ...state,
      quotation: {
        ...state.quotation,
        item: {
          ...updatedQuotation,
          quotationDetails: [
            ...sortQuotationDetails(state.quotation.item.quotationDetails),
          ].map((el) => {
            const update = updatedQuotation.quotationDetails.find(
              (detail) => detail.gqPositionId === el.gqPositionId
            );

            return update ?? el;
          }),
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
    (state: ProcessCaseState, { updatedQuotation }): ProcessCaseState => ({
      ...state,
      quotation: {
        ...state.quotation,
        item: {
          ...updatedQuotation,
          quotationDetails: [
            ...sortQuotationDetails(updatedQuotation.quotationDetails),
          ],
        },
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
  on(updateMaterialRowDataItem, (state: ProcessCaseState, { item }) => ({
    ...state,
    addMaterials: {
      ...state.addMaterials,
      addMaterialRowData: TableService.updateItem(
        item,
        state.addMaterials.addMaterialRowData
      ),
    },
  })),
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
    (state: ProcessCaseState, { updatedQuotation }): ProcessCaseState => ({
      ...state,
      quotation: {
        ...state.quotation,
        item: {
          ...updatedQuotation,
          quotationDetails: sortQuotationDetails(
            updatedQuotation.quotationDetails
          ),
        },
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
    (
      state: ProcessCaseState,
      { errorMessage, updatedQuotation }
    ): ProcessCaseState => ({
      ...state,
      quotation: {
        ...state.quotation,
        errorMessage,
        item: {
          ...updatedQuotation,
          quotationDetails: sortQuotationDetails(
            updatedQuotation.quotationDetails
          ),
        },
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
    (state: ProcessCaseState, { updatedQuotation }): ProcessCaseState => ({
      ...state,
      quotation: {
        ...state.quotation,
        updateLoading: false,
        item: {
          ...updatedQuotation,
          quotationDetails: sortQuotationDetails(
            state.quotation.item.quotationDetails.map(
              (oldQuotationDetail: QuotationDetail) => {
                const idx = updatedQuotation.quotationDetails.findIndex(
                  (updatedQuotationDetail: QuotationDetail) =>
                    updatedQuotationDetail.gqPositionId ===
                    oldQuotationDetail.gqPositionId
                );

                if (idx === -1) {
                  return oldQuotationDetail;
                }

                return updatedQuotation.quotationDetails[idx];
              }
            )
          ),
        },
      },
    })
  ),
  on(
    refreshSapPricing,
    (state: ProcessCaseState): ProcessCaseState => ({
      ...state,
      quotation: {
        ...state.quotation,
        updateLoading: true,
      },
    })
  ),
  on(
    refreshSapPricingSuccess,
    (state: ProcessCaseState, { quotation }): ProcessCaseState => ({
      ...state,
      quotation: {
        ...state.quotation,
        item: {
          ...quotation,
          quotationDetails: sortQuotationDetails(quotation.quotationDetails),
        },
        updateLoading: false,
      },
    })
  ),
  on(
    refreshSapPricingFailure,
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
    updateQuotation,
    (state: ProcessCaseState): ProcessCaseState => ({
      ...state,
      quotation: {
        ...state.quotation,
        quotationLoading: true,
      },
    })
  ),
  on(
    updateQuotationSuccess,
    (state: ProcessCaseState, { quotation }): ProcessCaseState => ({
      ...state,
      quotation: {
        ...state.quotation,
        item: {
          ...quotation,
          quotationDetails: sortQuotationDetails(quotation.quotationDetails),
        },
        quotationLoading: false,
      },
    })
  ),
  on(
    updateQuotationFailure,
    (state: ProcessCaseState, { errorMessage }): ProcessCaseState => ({
      ...state,
      quotation: {
        ...state.quotation,
        quotationLoading: false,
        errorMessage,
      },
    })
  ),
  on(
    addSimulatedQuotation,
    (
      state: ProcessCaseState,
      { gqId, quotationDetails }
    ): ProcessCaseState => ({
      ...state,
      quotation: {
        ...state.quotation,
        simulatedItem: buildSimulatedQuotation(
          gqId,
          quotationDetails,
          state.quotation.item.quotationDetails
        ),
      },
    })
  ),
  on(
    resetSimulatedQuotation,
    (state: ProcessCaseState): ProcessCaseState => ({
      ...state,
      quotation: {
        ...state.quotation,
        simulatedItem: undefined,
      },
    })
  ),
  on(
    removeSimulatedQuotationDetail,
    (state: ProcessCaseState, { gqPositionId }): ProcessCaseState => ({
      ...state,
      quotation: {
        ...state.quotation,
        simulatedItem: {
          ...state.quotation.simulatedItem,
          quotationDetails:
            state.quotation.simulatedItem.quotationDetails.filter(
              (detail: QuotationDetail) => detail.gqPositionId !== gqPositionId
            ),
          simulatedStatusBar: {
            ...PriceService.calculateStatusBarValues(
              getSimulatedDetails(
                state.quotation.item.quotationDetails,
                state.quotation.simulatedItem.quotationDetails.filter(
                  (detail: QuotationDetail) =>
                    detail.gqPositionId !== gqPositionId
                )
              )
            ),
          },
        },
      },
    })
  ),
  on(
    selectQuotationDetail,
    (state: ProcessCaseState, { gqPositionId }): ProcessCaseState => ({
      ...state,
      quotation: {
        ...state.quotation,
        selectedQuotationDetails: [
          ...state.quotation.selectedQuotationDetails,
          gqPositionId,
        ],
      },
    })
  ),
  on(
    deselectQuotationDetail,
    (state: ProcessCaseState, { gqPositionId }): ProcessCaseState => ({
      ...state,
      quotation: {
        ...state.quotation,
        selectedQuotationDetails: [
          ...state.quotation.selectedQuotationDetails.filter(
            (id) => id !== gqPositionId
          ),
        ],
      },
    })
  ),
  on(
    createSapQuote,
    (state: ProcessCaseState): ProcessCaseState => ({
      ...state,
      quotation: {
        ...state.quotation,
        quotationLoading: true,
      },
    })
  ),
  on(
    createSapQuoteSuccess,
    (state: ProcessCaseState, { quotation }): ProcessCaseState => ({
      ...state,
      quotation: {
        ...state.quotation,
        item: {
          ...quotation,
          quotationDetails: sortQuotationDetails(quotation.quotationDetails),
        },
        quotationLoading: false,
      },
    })
  ),
  on(
    createSapQuoteFailure,
    (state: ProcessCaseState, { errorMessage }): ProcessCaseState => ({
      ...state,
      quotation: {
        ...state.quotation,
        quotationLoading: false,
        errorMessage,
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

const buildSimulatedQuotation = (
  gqId: number,
  simulatedDetails: QuotationDetail[],
  details: QuotationDetail[]
): SimulatedQuotation => ({
  gqId,
  quotationDetails: simulatedDetails,
  simulatedStatusBar: {
    ...PriceService.calculateStatusBarValues(
      getSimulatedDetails(details, simulatedDetails)
    ),
  },
  previousStatusBar: { ...PriceService.calculateStatusBarValues(details) },
});

const getSimulatedDetails = (
  details: QuotationDetail[],
  simulatedDetails: QuotationDetail[]
): QuotationDetail[] =>
  details.map(
    (detail) =>
      simulatedDetails.find(
        (simulatedDetail) =>
          detail.quotationItemId === simulatedDetail.quotationItemId
      ) || detail
  );

const sortQuotationDetails = (
  quotationDetails: QuotationDetail[]
): QuotationDetail[] =>
  [...quotationDetails].sort((a, b) => a.quotationItemId - b.quotationItemId);
