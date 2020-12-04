import { Action, createReducer, on } from '@ngrx/store';

import {
  addQuotationDetailToOffer,
  loadCustomer,
  loadCustomerFailure,
  loadCustomerSuccess,
  loadQuotation,
  loadQuotationFailure,
  loadQuotationSuccess,
  removeQuotationDetailFromOffer,
  selectQuotation,
} from '../../actions';
import {
  Customer,
  Quotation,
  QuotationIdentifier,
  QuotationInfoEnum,
} from '../../models';

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
  },
};

export const processCaseReducer = createReducer(
  initialState,
  on(selectQuotation, (state: ProcessCaseState, { quotationIdentifier }) => ({
    ...state,
    quotationIdentifier: {
      ...state.quotationIdentifier,
      customerNumber: quotationIdentifier.customerNumber,
      quotationNumber: quotationIdentifier.quotationNumber,
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
    },
  })),
  on(loadQuotationSuccess, (state: ProcessCaseState, { item }) => ({
    ...state,
    quotationIdentifier: {
      ...state.quotationIdentifier,
      customerNumber: item.customer.id,
    },
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
              quotationDetailIDs.includes(quotationDetail.gqPositionId)
                ? {
                    ...quotationDetail,
                    info: QuotationInfoEnum.AddedToOffer,
                  }
                : quotationDetail
            ),
          ],
        },
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
              quotationDetailIDs.includes(quotationDetail.gqPositionId)
                ? {
                    ...quotationDetail,
                    info: QuotationInfoEnum.None,
                  }
                : quotationDetail
            ),
          ],
        },
      },
    })
  )
);

// tslint:disable-next-line: only-arrow-functions
export function reducer(
  state: ProcessCaseState,
  action: Action
): ProcessCaseState {
  return processCaseReducer(state, action);
}
