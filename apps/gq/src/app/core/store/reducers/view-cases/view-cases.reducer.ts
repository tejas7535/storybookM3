import { Action, createReducer, on } from '@ngrx/store';

import {
  deleteCase,
  deleteCasesFailure,
  deleteCasesSuccess,
  loadCases,
  loadCasesFailure,
  loadCasesSuccess,
} from '../../actions';
import { ViewQuotation } from '../../models';

export interface ViewCasesState {
  quotationsLoading: boolean;
  errorMessage: string;
  quotations: ViewQuotation[];
  deleteLoading: boolean;
}

export const initialState: ViewCasesState = {
  quotationsLoading: false,
  errorMessage: undefined,
  quotations: undefined,
  deleteLoading: false,
};

export const viewCasesReducer = createReducer(
  initialState,
  on(loadCases, (state: ViewCasesState) => ({
    ...state,
    quotationsLoading: true,
  })),
  on(loadCasesFailure, (state: ViewCasesState, { errorMessage }) => ({
    ...state,
    errorMessage,
    quotationsLoading: false,
  })),
  on(loadCasesSuccess, (state: ViewCasesState, { quotations }) => ({
    ...state,
    quotations,
    quotationsLoading: false,
  })),
  on(deleteCase, (state: ViewCasesState) => ({
    ...state,
    deleteLoading: true,
  })),
  on(deleteCasesSuccess, (state: ViewCasesState) => ({
    ...state,
    deleteLoading: false,
    quotationsLoading: true,
  })),
  on(deleteCasesFailure, (state: ViewCasesState, { errorMessage }) => ({
    ...state,
    errorMessage,
    deleteLoading: false,
  }))
);

// tslint:disable-next-line: only-arrow-functions
export function reducer(state: ViewCasesState, action: Action): ViewCasesState {
  return viewCasesReducer(state, action);
}
