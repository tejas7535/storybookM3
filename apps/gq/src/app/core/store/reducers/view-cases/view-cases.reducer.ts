import { Action, createReducer, on } from '@ngrx/store';

import { QuotationStatus } from '../../../../shared/models/quotation/quotation-status.enum';
import {
  deleteCase,
  deleteCasesFailure,
  deleteCasesSuccess,
  deselectCase,
  loadCases,
  loadCasesFailure,
  loadCasesSuccess,
  selectCase,
} from '../../actions';
import { ViewCasesStateQuotations } from './models/view-case-state-quotations.interface';

export interface ViewCasesState {
  quotationsLoading: boolean;
  errorMessage: string;
  quotations: ViewCasesStateQuotations;
  deleteLoading: boolean;
  selectedCases: number[];
}

export const initialState: ViewCasesState = {
  quotationsLoading: false,
  errorMessage: undefined,
  quotations: {
    displayStatus: QuotationStatus.ACTIVE,
    active: {
      quotations: [],
      count: undefined,
    },
    inactive: {
      quotations: [],
      count: undefined,
    },
  },
  deleteLoading: false,
  selectedCases: [],
};

export const viewCasesReducer = createReducer(
  initialState,
  on(
    loadCases,
    (state: ViewCasesState, { status }): ViewCasesState => ({
      ...state,
      quotations: {
        ...state.quotations,
        displayStatus: status,
      },
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
    (state: ViewCasesState, { response }): ViewCasesState => ({
      ...state,
      quotations: {
        ...state.quotations,
        active: {
          count: response.activeCount,
          quotations:
            response.statusTypeOfListedQuotation ===
            QuotationStatus[QuotationStatus.ACTIVE]
              ? response.quotations
              : state.quotations.active.quotations,
        },
        inactive: {
          count: response.inactiveCount,
          quotations:
            response.statusTypeOfListedQuotation ===
            QuotationStatus[QuotationStatus.INACTIVE]
              ? response.quotations
              : state.quotations.inactive.quotations,
        },
      },
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
  ),
  on(
    selectCase,
    (state: ViewCasesState, { gqId }): ViewCasesState => ({
      ...state,
      selectedCases: [...state.selectedCases, gqId],
    })
  ),
  on(
    deselectCase,
    (state: ViewCasesState, { gqId }): ViewCasesState => ({
      ...state,
      selectedCases: [...state.selectedCases.filter((id) => id !== gqId)],
    })
  )
);

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function reducer(state: ViewCasesState, action: Action): ViewCasesState {
  return viewCasesReducer(state, action);
}
