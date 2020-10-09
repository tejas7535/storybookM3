import { Action, createReducer, on } from '@ngrx/store';

import {
  autocomplete,
  autocompleteCustomerSuccess,
  autocompleteFailure,
  autocompleteQuotationSuccess,
} from '../../actions';
import { CustomerItem, IdValue } from '../../models';

export interface CaseState {
  createCase: {
    autocompleteLoading: string;
    quotation: {
      options: IdValue[];
    };
    customer: {
      options: IdValue[];
      items: CustomerItem[];
    };
  };
}
export const initialState: CaseState = {
  createCase: {
    autocompleteLoading: undefined,
    quotation: {
      options: [],
    },
    customer: {
      options: [],
      items: [],
    },
  },
};

export const createCaseReducer = createReducer(
  initialState,
  on(autocomplete, (state: CaseState, { autocompleteSearch }) => ({
    ...state,
    createCase: {
      ...state.createCase,
      autocompleteLoading: autocompleteSearch.filter,
    },
  })),
  on(autocompleteFailure, (state: CaseState) => ({
    ...state,
    createCase: {
      ...state.createCase,
      autocompleteLoading: undefined,
    },
  })),
  on(autocompleteQuotationSuccess, (state: CaseState, { options }) => ({
    ...state,
    createCase: {
      ...state.createCase,
      quotation: {
        options: mergeOptions(state.createCase.quotation.options, options),
      },
    },
  })),
  on(autocompleteCustomerSuccess, (state: CaseState, { options }) => ({
    ...state,
    createCase: {
      ...state.createCase,
      customer: {
        ...state.createCase.customer,
        options: mergeOptions(state.createCase.customer.options, options),
      },
    },
  }))
);

const mergeOptions = (
  stateOptions: IdValue[],
  options: IdValue[]
): IdValue[] => {
  const mergedOptions: IdValue[] = [];
  const itemOptions = [...options];

  [...stateOptions].forEach((oldOption) => {
    const idxInNewOptions = itemOptions.findIndex(
      (newOpt) => newOpt.id === oldOption.id
    );

    // only consider selected options in old options
    if (idxInNewOptions === -1 && oldOption.selected) {
      // keep old option if it has been selected but is not part of received options
      mergedOptions.push(oldOption);
    } else if (idxInNewOptions > -1 && oldOption.selected) {
      // update received options with selected info
      itemOptions[idxInNewOptions] = {
        ...itemOptions[idxInNewOptions],
        selected: true,
      };
    }
  });

  return [...mergedOptions, ...itemOptions];
};

// tslint:disable-next-line: only-arrow-functions
export function reducer(state: CaseState, action: Action): CaseState {
  return createCaseReducer(state, action);
}
