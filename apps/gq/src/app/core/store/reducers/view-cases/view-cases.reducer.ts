import { Action, createReducer, on } from '@ngrx/store';

import { ViewQuotation } from '../../../../case-view/models/view-quotation.model';
import {
  deleteCase,
  deleteCasesFailure,
  deleteCasesSuccess,
  loadCases,
  loadCasesFailure,
  loadCasesSuccess,
} from '../../actions';

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
  on(
    loadCases,
    (state: ViewCasesState): ViewCasesState => ({
      ...state,
      quotationsLoading: true,
    })
  ),
  on(
    loadCasesFailure,
    (state: ViewCasesState, { errorMessage }): ViewCasesState => ({
      ...state,
      errorMessage,
      quotationsLoading: false,
    })
  ),
  on(
    loadCasesSuccess,
    (state: ViewCasesState, { quotations }): ViewCasesState => ({
      ...state,
      quotations,
      quotationsLoading: false,
    })
  ),
  on(
    deleteCase,
    (state: ViewCasesState): ViewCasesState => ({
      ...state,
      deleteLoading: true,
    })
  ),
  on(
    deleteCasesSuccess,
    (state: ViewCasesState): ViewCasesState => ({
      ...state,
      deleteLoading: false,
      quotationsLoading: true,
    })
  ),
  on(
    deleteCasesFailure,
    (state: ViewCasesState, { errorMessage }): ViewCasesState => ({
      ...state,
      errorMessage,
      deleteLoading: false,
    })
  )
);

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function reducer(state: ViewCasesState, action: Action): ViewCasesState {
  return viewCasesReducer(state, action);
}
