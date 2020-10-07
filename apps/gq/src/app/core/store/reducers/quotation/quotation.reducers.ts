import { Action, createReducer, on } from '@ngrx/store';
import {
  customerDetailsRequest,
  customerDetailsFailure,
  customerDetailsSuccess,
  quotationDetailsRequest,
  quotationDetailsFailure,
  quotationDetailsSuccess,
} from '../../actions';
import { CustomerDetails, QuotationDetails } from '../../models';

export interface QuotationState {
  customer: {
    customerDetailsLoading: boolean;
    item: CustomerDetails;
  };
  quotation: {
    quotationDetailsLoading: boolean;
    items: QuotationDetails[];
  };
}

export const initialState: QuotationState = {
  customer: {
    customerDetailsLoading: false,
    item: undefined,
  },
  quotation: {
    quotationDetailsLoading: false,
    items: [],
  },
};

export const quotationReducer = createReducer(
  initialState,
  on(customerDetailsRequest, (state: QuotationState, { customerNumber }) => ({
    ...state,
    customer: {
      ...state.customer,
      customerDetailsLoading: !!customerNumber,
    },
  })),
  on(customerDetailsSuccess, (state: QuotationState, { customerDetails }) => ({
    ...state,
    customer: {
      ...state.customer,
      customerDetailsLoading: false,
      item: customerDetails,
    },
  })),
  on(customerDetailsFailure, (state: QuotationState) => ({
    ...state,
    customer: {
      ...state.customer,
      customerDetailsLoading: false,
    },
  })),
  on(quotationDetailsRequest, (state: QuotationState, { quotationNumber }) => ({
    ...state,
    quotation: {
      ...state.quotation,
      quotationDetailsLoading: !!quotationNumber,
    },
  })),
  on(
    quotationDetailsSuccess,
    (state: QuotationState, { quotationDetails }) => ({
      ...state,
      quotation: {
        ...state.quotation,
        quotationDetailsLoading: false,
        items: quotationDetails,
      },
    })
  ),
  on(quotationDetailsFailure, (state: QuotationState) => ({
    ...state,
    quotation: {
      ...state.quotation,
      quotationDetailsLoading: false,
    },
  }))
);

// tslint:disable-next-line: only-arrow-functions
export function reducer(state: QuotationState, action: Action): QuotationState {
  return quotationReducer(state, action);
}
