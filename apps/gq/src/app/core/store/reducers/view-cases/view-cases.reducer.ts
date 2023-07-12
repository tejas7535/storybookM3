import { QuotationStatus } from '@gq/shared/models/quotation/quotation-status.enum';
import { Action, createReducer, on } from '@ngrx/store';

import {
  deselectCase,
  loadCases,
  loadCasesFailure,
  loadCasesSuccess,
  selectCase,
  updateCasesStatusFailure,
  updateCasesStatusSuccess,
  updateCaseStatus,
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
    archived: {
      quotations: [],
      count: undefined,
    },
    toApprove: {
      quotations: [],
      count: undefined,
    },
    inApproval: {
      quotations: [],
      count: undefined,
    },
    approved: {
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
            response.statusTypeOfListedQuotation === QuotationStatus.ACTIVE
              ? response.quotations
              : state.quotations.active.quotations,
        },
        archived: {
          count: response.archivedCount,
          quotations:
            response.statusTypeOfListedQuotation === QuotationStatus.ARCHIVED
              ? response.quotations
              : state.quotations.archived.quotations,
        },
      },
      quotationsLoading: false,
    })
  ),
  on(
    updateCaseStatus,
    (state: ViewCasesState): ViewCasesState => ({
      ...state,
      deleteLoading: true,
    })
  ),
  on(
    updateCasesStatusSuccess,
    (state: ViewCasesState, { gqIds }): ViewCasesState => ({
      ...state,
      deleteLoading: false,
      selectedCases: [
        ...state.selectedCases.filter((id) => !gqIds.includes(id)),
      ],
    })
  ),
  on(
    updateCasesStatusFailure,
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
      selectedCases: [...new Set([...state.selectedCases, gqId])],
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
