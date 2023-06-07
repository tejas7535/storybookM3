import { QuotationStatus } from '@gq/shared/models/quotation/quotation-status.enum';
import { createFeature, createReducer, on } from '@ngrx/store';

import { OverviewCasesStateQuotations } from './models/overview-cases-state-quotations.model';
import { OverviewCasesActions } from './overview-cases.actions';

export interface OverviewCasesState {
  quotationsLoading: boolean;
  errorMessage: string;
  quotations: OverviewCasesStateQuotations;
  deleteLoading: boolean;
  selectedCases: number[];
}

export const initialState: OverviewCasesState = {
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
    toBeApproved: {
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
export const overviewCasesFeature = createFeature({
  name: 'overviewCases',
  reducer: createReducer(
    initialState,
    on(
      OverviewCasesActions.loadCases,
      (state: OverviewCasesState, { status }): OverviewCasesState => ({
        ...state,
        quotations: {
          ...state.quotations,
          displayStatus: status,
        },
        quotationsLoading: true,
      })
    ),
    on(
      OverviewCasesActions.loadCasesFailure,
      (state: OverviewCasesState, { errorMessage }): OverviewCasesState => ({
        ...state,
        errorMessage,
        quotationsLoading: false,
      })
    ),
    on(
      OverviewCasesActions.loadCasesSuccess,
      (state: OverviewCasesState, { response }): OverviewCasesState => ({
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
      OverviewCasesActions.updateCasesStatus,
      (state: OverviewCasesState): OverviewCasesState => ({
        ...state,
        deleteLoading: true,
      })
    ),
    on(
      OverviewCasesActions.updateCasesStatusSuccess,
      (state: OverviewCasesState, { gqIds }): OverviewCasesState => ({
        ...state,
        deleteLoading: false,
        selectedCases: [
          ...state.selectedCases.filter((id) => !gqIds.includes(id)),
        ],
      })
    ),
    on(
      OverviewCasesActions.updateCasesStatusFailure,
      (state: OverviewCasesState, { errorMessage }): OverviewCasesState => ({
        ...state,
        errorMessage,
        deleteLoading: false,
      })
    ),
    on(
      OverviewCasesActions.selectCase,
      (state: OverviewCasesState, { gqId }): OverviewCasesState => ({
        ...state,
        selectedCases: [...new Set([...state.selectedCases, gqId])],
      })
    ),
    on(
      OverviewCasesActions.deselectCase,
      (state: OverviewCasesState, { gqId }): OverviewCasesState => ({
        ...state,
        selectedCases: [...state.selectedCases.filter((id) => id !== gqId)],
      })
    )
  ),
});
